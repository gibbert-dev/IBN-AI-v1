"""
Model training logic using Hugging Face Transformers
"""

import os
import json
import torch
import numpy as np
from transformers import (
    AutoTokenizer, AutoModelForSequenceClassification,
    TrainingArguments, Trainer, EarlyStoppingCallback
)
from transformers.trainer_utils import EvalPrediction
from sklearn.metrics import accuracy_score, precision_recall_fscore_support
from typing import Dict, List, Optional, Tuple, Any
import logging
from datetime import datetime

from ..data.loader import DataLoader
from ..data.dataset import TextClassificationDataset, create_data_loaders
from ..utils.config import config
from ..utils.metrics import MetricsCalculator

logger = logging.getLogger(__name__)


class ModelTrainer:
    """Handle model training and evaluation"""
    
    def __init__(self, 
                 model_name: str = "bert-base-uncased",
                 num_labels: int = 2,
                 output_dir: str = "./models/finetuned_model"):
        """
        Initialize the trainer
        
        Args:
            model_name: Name of the pre-trained model
            num_labels: Number of classification labels
            output_dir: Directory to save the trained model
        """
        self.model_name = model_name
        self.num_labels = num_labels
        self.output_dir = output_dir
        self.tokenizer = None
        self.model = None
        self.data_loader = DataLoader()
        self.metrics_calculator = None
        self.training_history = []
        
        # Create output directory
        os.makedirs(output_dir, exist_ok=True)
        
        logger.info(f"Initialized trainer for {model_name} with {num_labels} labels")
    
    def load_model_and_tokenizer(self):
        """Load the pre-trained model and tokenizer"""
        try:
            self.tokenizer = AutoTokenizer.from_pretrained(self.model_name)
            self.model = AutoModelForSequenceClassification.from_pretrained(
                self.model_name,
                num_labels=self.num_labels
            )
            
            # Add padding token if it doesn't exist
            if self.tokenizer.pad_token is None:
                self.tokenizer.pad_token = self.tokenizer.eos_token
                self.model.config.pad_token_id = self.tokenizer.eos_token_id
            
            logger.info(f"Loaded model and tokenizer: {self.model_name}")
            
        except Exception as e:
            logger.error(f"Error loading model: {e}")
            raise
    
    def prepare_datasets(self, 
                        train_file: str,
                        val_file: Optional[str] = None,
                        test_file: Optional[str] = None,
                        max_length: int = 512) -> Dict[str, TextClassificationDataset]:
        """
        Prepare datasets for training
        
        Args:
            train_file: Path to training data file
            val_file: Path to validation data file (optional)
            test_file: Path to test data file (optional)
            max_length: Maximum sequence length
            
        Returns:
            Dictionary containing datasets
        """
        # Load training data
        train_df = self.data_loader.load_data(train_file)
        
        # If validation/test files not provided, split the training data
        if val_file is None or test_file is None:
            train_df, val_df, test_df = self.data_loader.split_data(
                train_df,
                train_ratio=config.training.train_split,
                val_ratio=config.training.val_split,
                test_ratio=config.training.test_split,
                random_state=config.training.seed
            )
        else:
            val_df = self.data_loader.load_data(val_file) if val_file else None
            test_df = self.data_loader.load_data(test_file) if test_file else None
        
        # Update metrics calculator with label names
        label_names = list(self.data_loader.label_to_id.keys())
        self.metrics_calculator = MetricsCalculator(label_names)
        
        # Create datasets
        datasets = {}
        
        datasets['train'] = TextClassificationDataset.from_dataframe(
            train_df, self.tokenizer, 
            label_to_id=self.data_loader.label_to_id,
            max_length=max_length
        )
        
        if val_df is not None:
            datasets['val'] = TextClassificationDataset.from_dataframe(
                val_df, self.tokenizer,
                label_to_id=self.data_loader.label_to_id,
                max_length=max_length
            )
        
        if test_df is not None:
            datasets['test'] = TextClassificationDataset.from_dataframe(
                test_df, self.tokenizer,
                label_to_id=self.data_loader.label_to_id,
                max_length=max_length
            )
        
        # Save label mappings
        mappings_path = os.path.join(self.output_dir, "label_mappings.json")
        self.data_loader.save_label_mappings(mappings_path)
        
        return datasets
    
    def compute_metrics(self, eval_pred: EvalPrediction) -> Dict[str, float]:
        """
        Compute metrics for evaluation
        
        Args:
            eval_pred: Evaluation predictions
            
        Returns:
            Dictionary of metrics
        """
        predictions, labels = eval_pred
        predictions = np.argmax(predictions, axis=1)
        
        # Calculate metrics
        accuracy = accuracy_score(labels, predictions)
        precision, recall, f1, _ = precision_recall_fscore_support(
            labels, predictions, average='weighted'
        )
        
        return {
            'accuracy': accuracy,
            'f1': f1,
            'precision': precision,
            'recall': recall
        }
    
    def train(self,
              train_file: str,
              val_file: Optional[str] = None,
              test_file: Optional[str] = None,
              num_epochs: int = 3,
              batch_size: int = 16,
              learning_rate: float = 2e-5,
              weight_decay: float = 0.01,
              warmup_steps: int = 500,
              max_length: int = 512,
              save_steps: int = 500,
              eval_steps: int = 500,
              logging_steps: int = 100) -> Dict[str, Any]:
        """
        Train the model
        
        Args:
            train_file: Path to training data
            val_file: Path to validation data (optional)
            test_file: Path to test data (optional)
            num_epochs: Number of training epochs
            batch_size: Training batch size
            learning_rate: Learning rate
            weight_decay: Weight decay for regularization
            warmup_steps: Number of warmup steps
            max_length: Maximum sequence length
            save_steps: Steps between model saves
            eval_steps: Steps between evaluations
            logging_steps: Steps between logging
            
        Returns:
            Training results dictionary
        """
        logger.info("Starting model training...")
        
        # Load model and tokenizer
        if self.model is None or self.tokenizer is None:
            self.load_model_and_tokenizer()
        
        # Prepare datasets
        datasets = self.prepare_datasets(train_file, val_file, test_file, max_length)
        
        # Set up training arguments
        training_args = TrainingArguments(
            output_dir=self.output_dir,
            num_train_epochs=num_epochs,
            per_device_train_batch_size=batch_size,
            per_device_eval_batch_size=batch_size,
            learning_rate=learning_rate,
            weight_decay=weight_decay,
            warmup_steps=warmup_steps,
            logging_dir=os.path.join(self.output_dir, 'logs'),
            logging_steps=logging_steps,
            evaluation_strategy="steps" if 'val' in datasets else "no",
            eval_steps=eval_steps if 'val' in datasets else None,
            save_steps=save_steps,
            save_total_limit=3,
            load_best_model_at_end=True if 'val' in datasets else False,
            metric_for_best_model="f1" if 'val' in datasets else None,
            greater_is_better=True,
            seed=config.training.seed,
            dataloader_pin_memory=torch.cuda.is_available(),
            report_to=None  # Disable wandb/tensorboard logging
        )
        
        # Initialize trainer
        trainer = Trainer(
            model=self.model,
            args=training_args,
            train_dataset=datasets['train'],
            eval_dataset=datasets.get('val'),
            compute_metrics=self.compute_metrics,
            callbacks=[EarlyStoppingCallback(early_stopping_patience=3)] if 'val' in datasets else None
        )
        
        # Train the model
        train_result = trainer.train()
        
        # Save the final model
        trainer.save_model()
        self.tokenizer.save_pretrained(self.output_dir)
        
        # Evaluate on test set if available
        test_results = {}
        if 'test' in datasets:
            test_results = trainer.evaluate(datasets['test'])
            logger.info(f"Test results: {test_results}")
        
        # Save training history
        self._save_training_info(train_result, test_results)
        
        logger.info("Training completed successfully!")
        
        return {
            'train_result': train_result,
            'test_results': test_results,
            'model_path': self.output_dir
        }
    
    def _save_training_info(self, train_result, test_results):
        """Save training information and results"""
        training_info = {
            'model_name': self.model_name,
            'num_labels': self.num_labels,
            'training_time': str(datetime.now()),
            'train_result': {
                'train_loss': float(train_result.training_loss),
                'train_runtime': float(train_result.training_loss),
                'train_samples_per_second': float(train_result.training_loss),
            },
            'test_results': test_results,
            'label_mappings': {
                'label_to_id': self.data_loader.label_to_id,
                'id_to_label': self.data_loader.id_to_label
            }
        }
        
        info_path = os.path.join(self.output_dir, "training_info.json")
        with open(info_path, 'w') as f:
            json.dump(training_info, f, indent=2)
        
        logger.info(f"Training info saved to {info_path}")
    
    def evaluate_model(self, test_file: str) -> Dict[str, Any]:
        """
        Evaluate the trained model on a test dataset
        
        Args:
            test_file: Path to test data file
            
        Returns:
            Evaluation results
        """
        if self.model is None or self.tokenizer is None:
            raise ValueError("Model not loaded. Please train or load a model first.")
        
        # Load test data
        test_df = self.data_loader.load_data(test_file)
        test_dataset = TextClassificationDataset.from_dataframe(
            test_df, self.tokenizer,
            label_to_id=self.data_loader.label_to_id
        )
        
        # Create trainer for evaluation
        trainer = Trainer(
            model=self.model,
            compute_metrics=self.compute_metrics
        )
        
        # Evaluate
        results = trainer.evaluate(test_dataset)
        
        # Generate detailed metrics
        predictions = trainer.predict(test_dataset)
        y_pred = np.argmax(predictions.predictions, axis=1)
        y_true = predictions.label_ids
        
        detailed_metrics = self.metrics_calculator.calculate_metrics(y_true, y_pred)
        
        return {
            'basic_metrics': results,
            'detailed_metrics': detailed_metrics
        }


def load_trained_model(model_path: str) -> Tuple[AutoModelForSequenceClassification, AutoTokenizer, Dict]:
    """
    Load a trained model from disk
    
    Args:
        model_path: Path to the saved model
        
    Returns:
        Tuple of (model, tokenizer, label_mappings)
    """
    try:
        # Load model and tokenizer
        model = AutoModelForSequenceClassification.from_pretrained(model_path)
        tokenizer = AutoTokenizer.from_pretrained(model_path)
        
        # Load label mappings
        mappings_path = os.path.join(model_path, "label_mappings.json")
        with open(mappings_path, 'r') as f:
            label_mappings = json.load(f)
        
        logger.info(f"Loaded trained model from {model_path}")
        return model, tokenizer, label_mappings
        
    except Exception as e:
        logger.error(f"Error loading model: {e}")
        raise