"""
Data loading and preprocessing utilities
"""

import pandas as pd
import json
import os
from typing import List, Dict, Tuple, Optional, Union
from sklearn.model_selection import train_test_split
import logging

logger = logging.getLogger(__name__)


class DataLoader:
    """Handle loading and preprocessing of datasets"""
    
    def __init__(self, text_column: str = "text", label_column: str = "label"):
        self.text_column = text_column
        self.label_column = label_column
        self.label_to_id = {}
        self.id_to_label = {}
    
    def load_data(self, file_path: str) -> pd.DataFrame:
        """
        Load data from CSV or JSON file
        
        Args:
            file_path: Path to the data file
            
        Returns:
            DataFrame with text and label columns
        """
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"Data file not found: {file_path}")
        
        file_extension = os.path.splitext(file_path)[1].lower()
        
        if file_extension == '.csv':
            df = pd.read_csv(file_path)
        elif file_extension == '.json':
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            df = pd.DataFrame(data)
        else:
            raise ValueError(f"Unsupported file format: {file_extension}")
        
        # Validate required columns
        if self.text_column not in df.columns:
            raise ValueError(f"Text column '{self.text_column}' not found in data")
        if self.label_column not in df.columns:
            raise ValueError(f"Label column '{self.label_column}' not found in data")
        
        # Clean data
        df = self._clean_data(df)
        
        # Create label mappings
        self._create_label_mappings(df[self.label_column].unique())
        
        logger.info(f"Loaded {len(df)} samples from {file_path}")
        logger.info(f"Found {len(self.label_to_id)} unique labels: {list(self.label_to_id.keys())}")
        
        return df
    
    def _clean_data(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Clean the dataset by removing null values and duplicates
        
        Args:
            df: Input DataFrame
            
        Returns:
            Cleaned DataFrame
        """
        initial_size = len(df)
        
        # Remove rows with null values in text or label columns
        df = df.dropna(subset=[self.text_column, self.label_column])
        
        # Remove empty strings
        df = df[df[self.text_column].str.strip() != '']
        df = df[df[self.label_column].str.strip() != '']
        
        # Remove duplicates
        df = df.drop_duplicates(subset=[self.text_column, self.label_column])
        
        final_size = len(df)
        removed = initial_size - final_size
        
        if removed > 0:
            logger.info(f"Removed {removed} invalid/duplicate samples during cleaning")
        
        return df.reset_index(drop=True)
    
    def _create_label_mappings(self, labels: List[str]):
        """
        Create mappings between labels and IDs
        
        Args:
            labels: List of unique labels
        """
        unique_labels = sorted(list(set(labels)))
        self.label_to_id = {label: idx for idx, label in enumerate(unique_labels)}
        self.id_to_label = {idx: label for label, idx in self.label_to_id.items()}
    
    def split_data(self, df: pd.DataFrame, 
                   train_ratio: float = 0.8, 
                   val_ratio: float = 0.1, 
                   test_ratio: float = 0.1,
                   random_state: int = 42) -> Tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame]:
        """
        Split data into train, validation, and test sets
        
        Args:
            df: Input DataFrame
            train_ratio: Ratio for training set
            val_ratio: Ratio for validation set
            test_ratio: Ratio for test set
            random_state: Random seed for reproducibility
            
        Returns:
            Tuple of (train_df, val_df, test_df)
        """
        # Validate ratios
        if abs(train_ratio + val_ratio + test_ratio - 1.0) > 1e-6:
            raise ValueError("Train, validation, and test ratios must sum to 1.0")
        
        # First split: separate test set
        train_val_df, test_df = train_test_split(
            df, 
            test_size=test_ratio, 
            random_state=random_state,
            stratify=df[self.label_column]
        )
        
        # Second split: separate train and validation sets
        val_size = val_ratio / (train_ratio + val_ratio)
        train_df, val_df = train_test_split(
            train_val_df,
            test_size=val_size,
            random_state=random_state,
            stratify=train_val_df[self.label_column]
        )
        
        logger.info(f"Data split - Train: {len(train_df)}, Val: {len(val_df)}, Test: {len(test_df)}")
        
        return train_df, val_df, test_df
    
    def encode_labels(self, labels: List[str]) -> List[int]:
        """
        Convert string labels to integer IDs
        
        Args:
            labels: List of string labels
            
        Returns:
            List of integer label IDs
        """
        return [self.label_to_id[label] for label in labels]
    
    def decode_labels(self, label_ids: List[int]) -> List[str]:
        """
        Convert integer IDs back to string labels
        
        Args:
            label_ids: List of integer label IDs
            
        Returns:
            List of string labels
        """
        return [self.id_to_label[label_id] for label_id in label_ids]
    
    def get_label_distribution(self, df: pd.DataFrame) -> Dict[str, int]:
        """
        Get the distribution of labels in the dataset
        
        Args:
            df: Input DataFrame
            
        Returns:
            Dictionary with label counts
        """
        return df[self.label_column].value_counts().to_dict()
    
    def save_label_mappings(self, output_path: str):
        """
        Save label mappings to a JSON file
        
        Args:
            output_path: Path to save the mappings
        """
        mappings = {
            'label_to_id': self.label_to_id,
            'id_to_label': self.id_to_label
        }
        
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(mappings, f, indent=2, ensure_ascii=False)
        
        logger.info(f"Label mappings saved to {output_path}")
    
    def load_label_mappings(self, input_path: str):
        """
        Load label mappings from a JSON file
        
        Args:
            input_path: Path to load the mappings from
        """
        with open(input_path, 'r', encoding='utf-8') as f:
            mappings = json.load(f)
        
        self.label_to_id = mappings['label_to_id']
        # Convert string keys back to integers for id_to_label
        self.id_to_label = {int(k): v for k, v in mappings['id_to_label'].items()}
        
        logger.info(f"Label mappings loaded from {input_path}")


def create_sample_dataset(output_path: str, format: str = 'csv', num_samples: int = 1000):
    """
    Create a sample dataset for testing
    
    Args:
        output_path: Path to save the sample dataset
        format: Output format ('csv' or 'json')
        num_samples: Number of samples to generate
    """
    import random
    
    # Sample texts and labels for sentiment analysis
    positive_texts = [
        "This movie is absolutely amazing!",
        "I love this product, it's fantastic!",
        "Great service and excellent quality.",
        "Wonderful experience, highly recommended!",
        "Outstanding performance and great value.",
        "Perfect! Exactly what I was looking for.",
        "Excellent customer service and fast delivery.",
        "This is the best purchase I've made this year.",
        "Incredible quality and attention to detail.",
        "Absolutely delighted with this product!"
    ]
    
    negative_texts = [
        "This is terrible, I hate it.",
        "Worst product ever, complete waste of money.",
        "Poor quality and bad customer service.",
        "I regret buying this, very disappointed.",
        "Awful experience, would not recommend.",
        "Completely useless and overpriced.",
        "Terrible quality, broke after one day.",
        "Worst customer service I've ever experienced.",
        "This product is a complete disaster.",
        "Absolutely horrible, avoid at all costs!"
    ]
    
    neutral_texts = [
        "It's okay, nothing special.",
        "Average product, does what it's supposed to do.",
        "Not bad, but not great either.",
        "It's fine, meets basic expectations.",
        "Decent quality for the price.",
        "Standard product, nothing remarkable.",
        "It works as expected, no complaints.",
        "Fair quality, reasonable price.",
        "Acceptable performance, could be better.",
        "It's alright, serves its purpose."
    ]
    
    # Generate samples
    data = []
    for _ in range(num_samples):
        label = random.choice(['positive', 'negative', 'neutral'])
        if label == 'positive':
            text = random.choice(positive_texts)
        elif label == 'negative':
            text = random.choice(negative_texts)
        else:
            text = random.choice(neutral_texts)
        
        data.append({'text': text, 'label': label})
    
    # Save data
    if format == 'csv':
        df = pd.DataFrame(data)
        df.to_csv(output_path, index=False)
    elif format == 'json':
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
    
    logger.info(f"Sample dataset with {num_samples} samples saved to {output_path}")