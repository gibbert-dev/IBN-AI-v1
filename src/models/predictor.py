"""
Model inference and prediction utilities
"""

import torch
import numpy as np
from transformers import AutoModelForSequenceClassification, AutoTokenizer
from typing import List, Dict, Any, Tuple, Optional
import logging
import json
import os

logger = logging.getLogger(__name__)


class ModelPredictor:
    """Handle model inference and predictions"""
    
    def __init__(self, model_path: str):
        """
        Initialize the predictor
        
        Args:
            model_path: Path to the saved model directory
        """
        self.model_path = model_path
        self.model = None
        self.tokenizer = None
        self.label_mappings = None
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        
        self.load_model()
    
    def load_model(self):
        """Load the trained model, tokenizer, and label mappings"""
        try:
            # Load model and tokenizer
            self.model = AutoModelForSequenceClassification.from_pretrained(self.model_path)
            self.tokenizer = AutoTokenizer.from_pretrained(self.model_path)
            
            # Move model to device
            self.model.to(self.device)
            self.model.eval()
            
            # Load label mappings
            mappings_path = os.path.join(self.model_path, "label_mappings.json")
            if os.path.exists(mappings_path):
                with open(mappings_path, 'r') as f:
                    self.label_mappings = json.load(f)
            else:
                logger.warning("Label mappings not found. Using default integer labels.")
                self.label_mappings = {
                    'id_to_label': {str(i): f'label_{i}' for i in range(self.model.config.num_labels)},
                    'label_to_id': {f'label_{i}': i for i in range(self.model.config.num_labels)}
                }
            
            logger.info(f"Model loaded successfully from {self.model_path}")
            logger.info(f"Device: {self.device}")
            logger.info(f"Available labels: {list(self.label_mappings['label_to_id'].keys())}")
            
        except Exception as e:
            logger.error(f"Error loading model: {e}")
            raise
    
    def predict_single(self, text: str, return_probabilities: bool = False) -> Dict[str, Any]:
        """
        Make a prediction for a single text input
        
        Args:
            text: Input text to classify
            return_probabilities: Whether to return class probabilities
            
        Returns:
            Dictionary containing prediction results
        """
        if not text or not text.strip():
            raise ValueError("Input text cannot be empty")
        
        # Tokenize input
        inputs = self.tokenizer(
            text,
            truncation=True,
            padding=True,
            max_length=512,
            return_tensors='pt'
        )
        
        # Move inputs to device
        inputs = {k: v.to(self.device) for k, v in inputs.items()}
        
        # Make prediction
        with torch.no_grad():
            outputs = self.model(**inputs)
            logits = outputs.logits
            
            # Get probabilities
            probabilities = torch.softmax(logits, dim=-1)
            predicted_class_id = torch.argmax(probabilities, dim=-1).item()
            confidence = probabilities[0][predicted_class_id].item()
        
        # Convert to label
        predicted_label = self.label_mappings['id_to_label'][str(predicted_class_id)]
        
        result = {
            'text': text,
            'predicted_label': predicted_label,
            'predicted_class_id': predicted_class_id,
            'confidence': float(confidence)
        }
        
        if return_probabilities:
            all_probs = {}
            for label_id, label_name in self.label_mappings['id_to_label'].items():
                all_probs[label_name] = float(probabilities[0][int(label_id)].item())
            result['probabilities'] = all_probs
        
        return result
    
    def predict_batch(self, texts: List[str], 
                     batch_size: int = 32,
                     return_probabilities: bool = False) -> List[Dict[str, Any]]:
        """
        Make predictions for a batch of texts
        
        Args:
            texts: List of input texts
            batch_size: Batch size for processing
            return_probabilities: Whether to return class probabilities
            
        Returns:
            List of prediction dictionaries
        """
        if not texts:
            return []
        
        results = []
        
        # Process in batches
        for i in range(0, len(texts), batch_size):
            batch_texts = texts[i:i + batch_size]
            batch_results = self._predict_batch_internal(batch_texts, return_probabilities)
            results.extend(batch_results)
        
        return results
    
    def _predict_batch_internal(self, texts: List[str], 
                               return_probabilities: bool = False) -> List[Dict[str, Any]]:
        """Internal method for batch prediction"""
        # Tokenize batch
        inputs = self.tokenizer(
            texts,
            truncation=True,
            padding=True,
            max_length=512,
            return_tensors='pt'
        )
        
        # Move to device
        inputs = {k: v.to(self.device) for k, v in inputs.items()}
        
        # Make predictions
        with torch.no_grad():
            outputs = self.model(**inputs)
            logits = outputs.logits
            
            # Get probabilities
            probabilities = torch.softmax(logits, dim=-1)
            predicted_class_ids = torch.argmax(probabilities, dim=-1)
            confidences = torch.max(probabilities, dim=-1)[0]
        
        # Convert to results
        results = []
        for i, text in enumerate(texts):
            predicted_class_id = predicted_class_ids[i].item()
            confidence = confidences[i].item()
            predicted_label = self.label_mappings['id_to_label'][str(predicted_class_id)]
            
            result = {
                'text': text,
                'predicted_label': predicted_label,
                'predicted_class_id': predicted_class_id,
                'confidence': float(confidence)
            }
            
            if return_probabilities:
                all_probs = {}
                for label_id, label_name in self.label_mappings['id_to_label'].items():
                    all_probs[label_name] = float(probabilities[i][int(label_id)].item())
                result['probabilities'] = all_probs
            
            results.append(result)
        
        return results
    
    def get_model_info(self) -> Dict[str, Any]:
        """
        Get information about the loaded model
        
        Returns:
            Dictionary containing model information
        """
        info = {
            'model_path': self.model_path,
            'model_type': self.model.config.model_type,
            'num_labels': self.model.config.num_labels,
            'max_position_embeddings': getattr(self.model.config, 'max_position_embeddings', 'N/A'),
            'vocab_size': self.model.config.vocab_size,
            'device': str(self.device),
            'labels': list(self.label_mappings['label_to_id'].keys()) if self.label_mappings else []
        }
        
        # Add training info if available
        training_info_path = os.path.join(self.model_path, "training_info.json")
        if os.path.exists(training_info_path):
            with open(training_info_path, 'r') as f:
                training_info = json.load(f)
                info['training_info'] = training_info
        
        return info
    
    def explain_prediction(self, text: str, top_k: int = 5) -> Dict[str, Any]:
        """
        Provide explanation for a prediction (basic version)
        
        Args:
            text: Input text
            top_k: Number of top tokens to highlight
            
        Returns:
            Dictionary with prediction explanation
        """
        # Get basic prediction
        prediction = self.predict_single(text, return_probabilities=True)
        
        # Tokenize to get individual tokens
        tokens = self.tokenizer.tokenize(text)
        
        # This is a simplified explanation - in practice, you might want to use
        # more sophisticated methods like attention visualization or LIME
        explanation = {
            'prediction': prediction,
            'tokens': tokens,
            'num_tokens': len(tokens),
            'explanation': f"Predicted '{prediction['predicted_label']}' with {prediction['confidence']:.2%} confidence"
        }
        
        return explanation


def create_predictor(model_path: str) -> ModelPredictor:
    """
    Factory function to create a model predictor
    
    Args:
        model_path: Path to the saved model
        
    Returns:
        ModelPredictor instance
    """
    return ModelPredictor(model_path)