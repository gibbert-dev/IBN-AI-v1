"""
Quick start example for the AI Model Finetuning Application
"""

import os
import sys

# Add src to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'src'))

from src.data.loader import create_sample_dataset, DataLoader
from src.models.trainer import ModelTrainer
from src.models.predictor import ModelPredictor


def main():
    """Quick start example"""
    print("🤖 AI Model Finetuning - Quick Start Example")
    print("=" * 50)
    
    # Step 1: Create sample dataset
    print("\n1. Creating sample dataset...")
    data_path = "./data/sample_sentiment.csv"
    os.makedirs("./data", exist_ok=True)
    
    create_sample_dataset(data_path, format='csv', num_samples=500)
    print(f"✅ Sample dataset created: {data_path}")
    
    # Step 2: Load and inspect data
    print("\n2. Loading and inspecting data...")
    data_loader = DataLoader()
    df = data_loader.load_data(data_path)
    
    print(f"📊 Dataset info:")
    print(f"   - Total samples: {len(df)}")
    print(f"   - Unique labels: {df['label'].nunique()}")
    print(f"   - Labels: {list(df['label'].unique())}")
    print(f"   - Label distribution:\n{df['label'].value_counts()}")
    
    # Step 3: Train model
    print("\n3. Training model...")
    model_output_dir = "./models/quick_start_model"
    
    trainer = ModelTrainer(
        model_name="distilbert-base-uncased",  # Smaller model for quick training
        num_labels=len(df['label'].unique()),
        output_dir=model_output_dir
    )
    
    print("🏋️ Starting training (this may take a few minutes)...")
    result = trainer.train(
        train_file=data_path,
        num_epochs=2,  # Fewer epochs for quick demo
        batch_size=8,  # Smaller batch size
        learning_rate=2e-5
    )
    
    print("✅ Training completed!")
    print(f"📁 Model saved to: {result['model_path']}")
    
    # Step 4: Test predictions
    print("\n4. Testing predictions...")
    predictor = ModelPredictor(model_output_dir)
    
    # Test texts
    test_texts = [
        "This movie is absolutely fantastic!",
        "I hate this product, it's terrible.",
        "It's okay, nothing special.",
        "Amazing quality and great service!",
        "Worst experience ever, avoid at all costs."
    ]
    
    print("🔮 Making predictions:")
    for text in test_texts:
        result = predictor.predict_single(text, return_probabilities=True)
        print(f"   Text: '{text}'")
        print(f"   Prediction: {result['predicted_label']} (confidence: {result['confidence']:.2%})")
        print()
    
    # Step 5: Batch prediction
    print("5. Testing batch prediction...")
    batch_results = predictor.predict_batch(test_texts)
    
    print("📊 Batch prediction results:")
    for i, result in enumerate(batch_results):
        print(f"   {i+1}. {result['predicted_label']} ({result['confidence']:.2%})")
    
    print("\n🎉 Quick start completed successfully!")
    print("\nNext steps:")
    print("- Try the Streamlit UI: python main.py ui")
    print("- Start the API server: python main.py api --model-path ./models/quick_start_model")
    print("- Train with your own data: python main.py train --train-file your_data.csv")


if __name__ == "__main__":
    main()