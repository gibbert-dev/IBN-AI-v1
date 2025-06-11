"""
Example API client for testing the deployed model
"""

import requests
import json
from typing import List, Dict, Any


class ModelAPIClient:
    """Client for interacting with the model API"""
    
    def __init__(self, base_url: str = "http://localhost:8000"):
        self.base_url = base_url.rstrip('/')
    
    def health_check(self) -> Dict[str, Any]:
        """Check API health"""
        response = requests.get(f"{self.base_url}/health")
        response.raise_for_status()
        return response.json()
    
    def predict_single(self, text: str, return_probabilities: bool = False) -> Dict[str, Any]:
        """Make a single prediction"""
        payload = {
            "text": text,
            "return_probabilities": return_probabilities
        }
        
        response = requests.post(f"{self.base_url}/predict", json=payload)
        response.raise_for_status()
        return response.json()
    
    def predict_batch(self, texts: List[str], 
                     return_probabilities: bool = False,
                     batch_size: int = 32) -> Dict[str, Any]:
        """Make batch predictions"""
        payload = {
            "texts": texts,
            "return_probabilities": return_probabilities,
            "batch_size": batch_size
        }
        
        response = requests.post(f"{self.base_url}/predict/batch", json=payload)
        response.raise_for_status()
        return response.json()
    
    def get_model_info(self) -> Dict[str, Any]:
        """Get model information"""
        response = requests.get(f"{self.base_url}/model/info")
        response.raise_for_status()
        return response.json()
    
    def explain_prediction(self, text: str) -> Dict[str, Any]:
        """Get prediction explanation"""
        payload = {"text": text}
        response = requests.post(f"{self.base_url}/predict/explain", json=payload)
        response.raise_for_status()
        return response.json()


def main():
    """Example usage of the API client"""
    print("🌐 API Client Example")
    print("=" * 30)
    
    # Initialize client
    client = ModelAPIClient("http://localhost:8000")
    
    try:
        # Check API health
        print("1. Checking API health...")
        health = client.health_check()
        print(f"   Status: {health['status']}")
        print(f"   Model loaded: {health['model_loaded']}")
        
        if not health['model_loaded']:
            print("❌ No model loaded. Please start the API with a model.")
            return
        
        # Get model info
        print("\n2. Getting model information...")
        model_info = client.get_model_info()
        print(f"   Model type: {model_info['model_type']}")
        print(f"   Number of labels: {model_info['num_labels']}")
        print(f"   Labels: {model_info['labels']}")
        
        # Single prediction
        print("\n3. Making single prediction...")
        text = "This is an amazing product, I love it!"
        result = client.predict_single(text, return_probabilities=True)
        
        print(f"   Text: '{text}'")
        print(f"   Prediction: {result['predicted_label']}")
        print(f"   Confidence: {result['confidence']:.2%}")
        
        if 'probabilities' in result:
            print("   Probabilities:")
            for label, prob in result['probabilities'].items():
                print(f"     {label}: {prob:.2%}")
        
        # Batch prediction
        print("\n4. Making batch predictions...")
        texts = [
            "Great product, highly recommended!",
            "Terrible quality, waste of money.",
            "It's okay, nothing special.",
            "Outstanding service and quality!",
            "Worst purchase I've ever made."
        ]
        
        batch_result = client.predict_batch(texts)
        print(f"   Processed {batch_result['total_processed']} texts:")
        
        for i, prediction in enumerate(batch_result['predictions']):
            print(f"     {i+1}. '{prediction['text'][:30]}...' -> {prediction['predicted_label']} ({prediction['confidence']:.2%})")
        
        # Explanation
        print("\n5. Getting prediction explanation...")
        explanation = client.explain_prediction(text)
        print(f"   Explanation: {explanation['explanation']}")
        print(f"   Number of tokens: {explanation['num_tokens']}")
        
        print("\n✅ API client example completed successfully!")
        
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to API. Make sure the server is running.")
        print("   Start the server with: python main.py api --model-path ./models/your_model")
    
    except requests.exceptions.HTTPError as e:
        print(f"❌ API request failed: {e}")
    
    except Exception as e:
        print(f"❌ Unexpected error: {e}")


if __name__ == "__main__":
    main()