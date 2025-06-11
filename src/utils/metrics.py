"""
Evaluation metrics and visualization utilities
"""

import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import (
    accuracy_score, precision_recall_fscore_support,
    confusion_matrix, classification_report
)
from typing import List, Dict, Any, Tuple
import pandas as pd


class MetricsCalculator:
    """Calculate and visualize model evaluation metrics"""
    
    def __init__(self, label_names: List[str] = None):
        self.label_names = label_names or []
    
    def calculate_metrics(self, y_true: List[int], y_pred: List[int]) -> Dict[str, Any]:
        """
        Calculate comprehensive metrics for classification
        
        Args:
            y_true: True labels
            y_pred: Predicted labels
            
        Returns:
            Dictionary containing various metrics
        """
        # Basic metrics
        accuracy = accuracy_score(y_true, y_pred)
        precision, recall, f1, support = precision_recall_fscore_support(
            y_true, y_pred, average='weighted'
        )
        
        # Per-class metrics
        precision_per_class, recall_per_class, f1_per_class, _ = precision_recall_fscore_support(
            y_true, y_pred, average=None
        )
        
        # Confusion matrix
        cm = confusion_matrix(y_true, y_pred)
        
        metrics = {
            'accuracy': accuracy,
            'precision': precision,
            'recall': recall,
            'f1_score': f1,
            'precision_per_class': precision_per_class.tolist(),
            'recall_per_class': recall_per_class.tolist(),
            'f1_per_class': f1_per_class.tolist(),
            'confusion_matrix': cm.tolist(),
            'classification_report': classification_report(
                y_true, y_pred, 
                target_names=self.label_names if self.label_names else None,
                output_dict=True
            )
        }
        
        return metrics
    
    def plot_confusion_matrix(self, y_true: List[int], y_pred: List[int], 
                            save_path: str = None) -> plt.Figure:
        """
        Plot confusion matrix
        
        Args:
            y_true: True labels
            y_pred: Predicted labels
            save_path: Path to save the plot
            
        Returns:
            Matplotlib figure
        """
        cm = confusion_matrix(y_true, y_pred)
        
        plt.figure(figsize=(8, 6))
        sns.heatmap(
            cm, 
            annot=True, 
            fmt='d', 
            cmap='Blues',
            xticklabels=self.label_names if self.label_names else range(len(cm)),
            yticklabels=self.label_names if self.label_names else range(len(cm))
        )
        plt.title('Confusion Matrix')
        plt.xlabel('Predicted Label')
        plt.ylabel('True Label')
        
        if save_path:
            plt.savefig(save_path, dpi=300, bbox_inches='tight')
        
        return plt.gcf()
    
    def plot_metrics_comparison(self, metrics_history: List[Dict[str, float]], 
                              save_path: str = None) -> plt.Figure:
        """
        Plot training metrics over time
        
        Args:
            metrics_history: List of metrics dictionaries from each epoch
            save_path: Path to save the plot
            
        Returns:
            Matplotlib figure
        """
        df = pd.DataFrame(metrics_history)
        
        fig, axes = plt.subplots(2, 2, figsize=(12, 8))
        
        # Plot accuracy
        if 'accuracy' in df.columns:
            axes[0, 0].plot(df.index, df['accuracy'], marker='o')
            axes[0, 0].set_title('Accuracy')
            axes[0, 0].set_xlabel('Epoch')
            axes[0, 0].set_ylabel('Accuracy')
            axes[0, 0].grid(True)
        
        # Plot loss
        if 'loss' in df.columns:
            axes[0, 1].plot(df.index, df['loss'], marker='o', color='red')
            axes[0, 1].set_title('Loss')
            axes[0, 1].set_xlabel('Epoch')
            axes[0, 1].set_ylabel('Loss')
            axes[0, 1].grid(True)
        
        # Plot F1 score
        if 'f1_score' in df.columns:
            axes[1, 0].plot(df.index, df['f1_score'], marker='o', color='green')
            axes[1, 0].set_title('F1 Score')
            axes[1, 0].set_xlabel('Epoch')
            axes[1, 0].set_ylabel('F1 Score')
            axes[1, 0].grid(True)
        
        # Plot precision and recall
        if 'precision' in df.columns and 'recall' in df.columns:
            axes[1, 1].plot(df.index, df['precision'], marker='o', label='Precision')
            axes[1, 1].plot(df.index, df['recall'], marker='s', label='Recall')
            axes[1, 1].set_title('Precision & Recall')
            axes[1, 1].set_xlabel('Epoch')
            axes[1, 1].set_ylabel('Score')
            axes[1, 1].legend()
            axes[1, 1].grid(True)
        
        plt.tight_layout()
        
        if save_path:
            plt.savefig(save_path, dpi=300, bbox_inches='tight')
        
        return fig
    
    def generate_report(self, y_true: List[int], y_pred: List[int]) -> str:
        """
        Generate a comprehensive text report
        
        Args:
            y_true: True labels
            y_pred: Predicted labels
            
        Returns:
            Formatted report string
        """
        metrics = self.calculate_metrics(y_true, y_pred)
        
        report = f"""
Model Evaluation Report
=======================

Overall Metrics:
- Accuracy: {metrics['accuracy']:.4f}
- Precision: {metrics['precision']:.4f}
- Recall: {metrics['recall']:.4f}
- F1 Score: {metrics['f1_score']:.4f}

Per-Class Metrics:
"""
        
        if self.label_names:
            for i, label in enumerate(self.label_names):
                if i < len(metrics['precision_per_class']):
                    report += f"""
{label}:
  - Precision: {metrics['precision_per_class'][i]:.4f}
  - Recall: {metrics['recall_per_class'][i]:.4f}
  - F1 Score: {metrics['f1_per_class'][i]:.4f}
"""
        
        report += f"""
Classification Report:
{classification_report(y_true, y_pred, target_names=self.label_names)}
"""
        
        return report


def calculate_confidence_intervals(scores: List[float], confidence: float = 0.95) -> Tuple[float, float]:
    """
    Calculate confidence intervals for a list of scores
    
    Args:
        scores: List of metric scores
        confidence: Confidence level (default: 0.95)
        
    Returns:
        Tuple of (lower_bound, upper_bound)
    """
    scores = np.array(scores)
    mean = np.mean(scores)
    std = np.std(scores)
    n = len(scores)
    
    # Calculate margin of error
    from scipy import stats
    margin_of_error = stats.t.ppf((1 + confidence) / 2, n - 1) * (std / np.sqrt(n))
    
    return mean - margin_of_error, mean + margin_of_error