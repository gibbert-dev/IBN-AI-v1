"""
Configuration management for the AI finetuning application
"""

import os
from dataclasses import dataclass
from typing import Optional, Dict, Any


@dataclass
class TrainingConfig:
    """Configuration for model training"""
    model_name: str = "bert-base-uncased"
    num_epochs: int = 3
    batch_size: int = 16
    learning_rate: float = 2e-5
    weight_decay: float = 0.01
    warmup_steps: int = 500
    max_length: int = 512
    train_split: float = 0.8
    val_split: float = 0.1
    test_split: float = 0.1
    save_steps: int = 500
    eval_steps: int = 500
    logging_steps: int = 100
    seed: int = 42


@dataclass
class APIConfig:
    """Configuration for API service"""
    host: str = "0.0.0.0"
    port: int = 8000
    debug: bool = False
    model_path: str = "./models/finetuned_model"
    max_text_length: int = 512


@dataclass
class DataConfig:
    """Configuration for data processing"""
    data_dir: str = "./data"
    models_dir: str = "./models"
    logs_dir: str = "./logs"
    cache_dir: str = "./cache"
    supported_formats: tuple = ("csv", "json")


class Config:
    """Main configuration class"""
    
    def __init__(self):
        self.training = TrainingConfig()
        self.api = APIConfig()
        self.data = DataConfig()
        
        # Create directories if they don't exist
        self._create_directories()
    
    def _create_directories(self):
        """Create necessary directories"""
        directories = [
            self.data.data_dir,
            self.data.models_dir,
            self.data.logs_dir,
            self.data.cache_dir
        ]
        
        for directory in directories:
            os.makedirs(directory, exist_ok=True)
    
    def update_from_dict(self, config_dict: Dict[str, Any]):
        """Update configuration from dictionary"""
        for section, values in config_dict.items():
            if hasattr(self, section):
                section_config = getattr(self, section)
                for key, value in values.items():
                    if hasattr(section_config, key):
                        setattr(section_config, key, value)
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert configuration to dictionary"""
        return {
            "training": self.training.__dict__,
            "api": self.api.__dict__,
            "data": self.data.__dict__
        }


# Global configuration instance
config = Config()