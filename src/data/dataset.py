"""
Custom dataset classes for PyTorch training
"""

import torch
from torch.utils.data import Dataset
from transformers import AutoTokenizer
from typing import List, Dict, Any, Optional
import pandas as pd
import logging

logger = logging.getLogger(__name__)


class TextClassificationDataset(Dataset):
    """Custom dataset for text classification tasks"""
    
    def __init__(self, 
                 texts: List[str], 
                 labels: List[int], 
                 tokenizer: AutoTokenizer,
                 max_length: int = 512):
        """
        Initialize the dataset
        
        Args:
            texts: List of input texts
            labels: List of corresponding labels (as integers)
            tokenizer: Hugging Face tokenizer
            max_length: Maximum sequence length
        """
        self.texts = texts
        self.labels = labels
        self.tokenizer = tokenizer
        self.max_length = max_length
        
        if len(texts) != len(labels):
            raise ValueError("Number of texts and labels must match")
        
        logger.info(f"Created dataset with {len(self.texts)} samples")
    
    def __len__(self) -> int:
        return len(self.texts)
    
    def __getitem__(self, idx: int) -> Dict[str, torch.Tensor]:
        """
        Get a single item from the dataset
        
        Args:
            idx: Index of the item
            
        Returns:
            Dictionary containing input_ids, attention_mask, and labels
        """
        text = str(self.texts[idx])
        label = self.labels[idx]
        
        # Tokenize the text
        encoding = self.tokenizer(
            text,
            truncation=True,
            padding='max_length',
            max_length=self.max_length,
            return_tensors='pt'
        )
        
        return {
            'input_ids': encoding['input_ids'].flatten(),
            'attention_mask': encoding['attention_mask'].flatten(),
            'labels': torch.tensor(label, dtype=torch.long)
        }
    
    @classmethod
    def from_dataframe(cls, 
                      df: pd.DataFrame, 
                      tokenizer: AutoTokenizer,
                      text_column: str = 'text',
                      label_column: str = 'label',
                      label_to_id: Dict[str, int] = None,
                      max_length: int = 512):
        """
        Create dataset from pandas DataFrame
        
        Args:
            df: DataFrame containing text and labels
            tokenizer: Hugging Face tokenizer
            text_column: Name of the text column
            label_column: Name of the label column
            label_to_id: Mapping from label strings to integers
            max_length: Maximum sequence length
            
        Returns:
            TextClassificationDataset instance
        """
        texts = df[text_column].tolist()
        
        if label_to_id:
            labels = [label_to_id[label] for label in df[label_column]]
        else:
            # Assume labels are already integers
            labels = df[label_column].tolist()
        
        return cls(texts, labels, tokenizer, max_length)


class DataCollator:
    """Custom data collator for batching"""
    
    def __init__(self, tokenizer: AutoTokenizer, padding: bool = True):
        self.tokenizer = tokenizer
        self.padding = padding
    
    def __call__(self, features: List[Dict[str, torch.Tensor]]) -> Dict[str, torch.Tensor]:
        """
        Collate a batch of features
        
        Args:
            features: List of feature dictionaries
            
        Returns:
            Batched features
        """
        batch = {}
        
        # Stack all tensors
        for key in features[0].keys():
            batch[key] = torch.stack([f[key] for f in features])
        
        return batch


def create_data_loaders(train_dataset: TextClassificationDataset,
                       val_dataset: TextClassificationDataset,
                       test_dataset: Optional[TextClassificationDataset] = None,
                       batch_size: int = 16,
                       num_workers: int = 0) -> Dict[str, torch.utils.data.DataLoader]:
    """
    Create data loaders for training, validation, and testing
    
    Args:
        train_dataset: Training dataset
        val_dataset: Validation dataset
        test_dataset: Test dataset (optional)
        batch_size: Batch size for data loaders
        num_workers: Number of worker processes
        
    Returns:
        Dictionary containing data loaders
    """
    from torch.utils.data import DataLoader
    
    data_loaders = {
        'train': DataLoader(
            train_dataset,
            batch_size=batch_size,
            shuffle=True,
            num_workers=num_workers,
            pin_memory=torch.cuda.is_available()
        ),
        'val': DataLoader(
            val_dataset,
            batch_size=batch_size,
            shuffle=False,
            num_workers=num_workers,
            pin_memory=torch.cuda.is_available()
        )
    }
    
    if test_dataset:
        data_loaders['test'] = DataLoader(
            test_dataset,
            batch_size=batch_size,
            shuffle=False,
            num_workers=num_workers,
            pin_memory=torch.cuda.is_available()
        )
    
    logger.info(f"Created data loaders with batch size {batch_size}")
    return data_loaders