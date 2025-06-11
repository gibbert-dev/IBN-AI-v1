"""
Main entry point for the AI Model Finetuning Application
"""

import argparse
import logging
import sys
import os

# Add src to path
sys.path.append(os.path.join(os.path.dirname(__file__), 'src'))

from src.models.trainer import ModelTrainer
from src.models.predictor import ModelPredictor
from src.api.app import run_api
from src.data.loader import create_sample_dataset
from src.utils.config import config

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


def train_model(args):
    """Train a model with the given arguments"""
    logger.info("Starting model training...")
    
    # Create trainer
    trainer = ModelTrainer(
        model_name=args.model_name,
        num_labels=args.num_labels,
        output_dir=args.output_dir
    )
    
    # Train model
    result = trainer.train(
        train_file=args.train_file,
        val_file=args.val_file,
        test_file=args.test_file,
        num_epochs=args.epochs,
        batch_size=args.batch_size,
        learning_rate=args.learning_rate,
        max_length=args.max_length
    )
    
    logger.info("Training completed successfully!")
    logger.info(f"Model saved to: {result['model_path']}")


def predict_text(args):
    """Make predictions with a trained model"""
    logger.info("Loading model for prediction...")
    
    # Load predictor
    predictor = ModelPredictor(args.model_path)
    
    if args.text:
        # Single prediction
        result = predictor.predict_single(args.text, return_probabilities=args.probabilities)
        print(f"Text: {result['text']}")
        print(f"Predicted Label: {result['predicted_label']}")
        print(f"Confidence: {result['confidence']:.4f}")
        
        if args.probabilities and 'probabilities' in result:
            print("Class Probabilities:")
            for label, prob in result['probabilities'].items():
                print(f"  {label}: {prob:.4f}")
    
    elif args.input_file:
        # Batch prediction
        with open(args.input_file, 'r') as f:
            texts = [line.strip() for line in f if line.strip()]
        
        results = predictor.predict_batch(texts, return_probabilities=args.probabilities)
        
        # Save results
        output_file = args.output_file or "predictions.txt"
        with open(output_file, 'w') as f:
            for result in results:
                f.write(f"{result['text']}\t{result['predicted_label']}\t{result['confidence']:.4f}\n")
        
        print(f"Predictions saved to: {output_file}")


def start_api(args):
    """Start the API server"""
    logger.info("Starting API server...")
    
    # Update config if provided
    if args.model_path:
        config.api.model_path = args.model_path
    if args.host:
        config.api.host = args.host
    if args.port:
        config.api.port = args.port
    
    run_api(args.host, args.port, args.debug)


def create_sample_data(args):
    """Create sample dataset"""
    logger.info("Creating sample dataset...")
    
    create_sample_dataset(
        output_path=args.output_path,
        format=args.format,
        num_samples=args.num_samples
    )
    
    logger.info(f"Sample dataset created: {args.output_path}")


def start_ui(args):
    """Start the Streamlit UI"""
    logger.info("Starting Streamlit UI...")
    
    import subprocess
    import sys
    
    cmd = [sys.executable, "-m", "streamlit", "run", "src/ui/streamlit_app.py"]
    if args.port:
        cmd.extend(["--server.port", str(args.port)])
    
    subprocess.run(cmd)


def main():
    """Main function with argument parsing"""
    parser = argparse.ArgumentParser(description="AI Model Finetuning Application")
    subparsers = parser.add_subparsers(dest='command', help='Available commands')
    
    # Train command
    train_parser = subparsers.add_parser('train', help='Train a model')
    train_parser.add_argument('--model-name', default='bert-base-uncased', help='Pre-trained model name')
    train_parser.add_argument('--train-file', required=True, help='Training data file')
    train_parser.add_argument('--val-file', help='Validation data file')
    train_parser.add_argument('--test-file', help='Test data file')
    train_parser.add_argument('--num-labels', type=int, default=2, help='Number of labels')
    train_parser.add_argument('--output-dir', default='./models/finetuned_model', help='Output directory')
    train_parser.add_argument('--epochs', type=int, default=3, help='Number of epochs')
    train_parser.add_argument('--batch-size', type=int, default=16, help='Batch size')
    train_parser.add_argument('--learning-rate', type=float, default=2e-5, help='Learning rate')
    train_parser.add_argument('--max-length', type=int, default=512, help='Max sequence length')
    
    # Predict command
    predict_parser = subparsers.add_parser('predict', help='Make predictions')
    predict_parser.add_argument('--model-path', required=True, help='Path to trained model')
    predict_parser.add_argument('--text', help='Text to classify')
    predict_parser.add_argument('--input-file', help='File with texts to classify')
    predict_parser.add_argument('--output-file', help='Output file for predictions')
    predict_parser.add_argument('--probabilities', action='store_true', help='Return probabilities')
    
    # API command
    api_parser = subparsers.add_parser('api', help='Start API server')
    api_parser.add_argument('--model-path', help='Path to trained model')
    api_parser.add_argument('--host', default='0.0.0.0', help='Host to bind to')
    api_parser.add_argument('--port', type=int, default=8000, help='Port to bind to')
    api_parser.add_argument('--debug', action='store_true', help='Enable debug mode')
    
    # Sample data command
    sample_parser = subparsers.add_parser('sample', help='Create sample dataset')
    sample_parser.add_argument('--output-path', required=True, help='Output file path')
    sample_parser.add_argument('--format', choices=['csv', 'json'], default='csv', help='Output format')
    sample_parser.add_argument('--num-samples', type=int, default=1000, help='Number of samples')
    
    # UI command
    ui_parser = subparsers.add_parser('ui', help='Start Streamlit UI')
    ui_parser.add_argument('--port', type=int, default=8501, help='Port for Streamlit')
    
    args = parser.parse_args()
    
    if args.command == 'train':
        train_model(args)
    elif args.command == 'predict':
        predict_text(args)
    elif args.command == 'api':
        start_api(args)
    elif args.command == 'sample':
        create_sample_data(args)
    elif args.command == 'ui':
        start_ui(args)
    else:
        parser.print_help()


if __name__ == "__main__":
    main()