"""
Streamlit web interface for the AI finetuning application
"""

import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import requests
import json
import os
import time
from typing import Dict, List, Any
import logging

from ..models.trainer import ModelTrainer
from ..models.predictor import ModelPredictor
from ..data.loader import DataLoader, create_sample_dataset
from ..utils.config import config

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Page configuration
st.set_page_config(
    page_title="AI Model Finetuning App",
    page_icon="🤖",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS
st.markdown("""
<style>
    .main-header {
        font-size: 3rem;
        font-weight: bold;
        color: #1f77b4;
        text-align: center;
        margin-bottom: 2rem;
    }
    .section-header {
        font-size: 1.5rem;
        font-weight: bold;
        color: #2c3e50;
        margin-top: 2rem;
        margin-bottom: 1rem;
    }
    .metric-card {
        background-color: #f8f9fa;
        padding: 1rem;
        border-radius: 0.5rem;
        border-left: 4px solid #1f77b4;
    }
</style>
""", unsafe_allow_html=True)


def main():
    """Main Streamlit application"""
    st.markdown('<h1 class="main-header">🤖 AI Model Finetuning & Deployment</h1>', unsafe_allow_html=True)
    
    # Sidebar navigation
    st.sidebar.title("Navigation")
    page = st.sidebar.selectbox(
        "Choose a page",
        ["Home", "Data Management", "Model Training", "Model Prediction", "API Testing", "Model Analysis"]
    )
    
    # Route to different pages
    if page == "Home":
        show_home_page()
    elif page == "Data Management":
        show_data_management_page()
    elif page == "Model Training":
        show_training_page()
    elif page == "Model Prediction":
        show_prediction_page()
    elif page == "API Testing":
        show_api_testing_page()
    elif page == "Model Analysis":
        show_analysis_page()


def show_home_page():
    """Display the home page"""
    st.markdown('<h2 class="section-header">Welcome to AI Model Finetuning App</h2>', unsafe_allow_html=True)
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("""
        ### 🎯 Features
        - **Data Management**: Upload and preprocess your datasets
        - **Model Training**: Finetune pre-trained models on your data
        - **Model Deployment**: Serve models via REST API
        - **Interactive Prediction**: Test your models in real-time
        - **Model Analysis**: Evaluate and visualize model performance
        """)
    
    with col2:
        st.markdown("""
        ### 🚀 Quick Start
        1. **Prepare Data**: Upload your dataset in CSV or JSON format
        2. **Train Model**: Select a pre-trained model and start training
        3. **Test Predictions**: Use the trained model for inference
        4. **Deploy API**: Serve your model via REST API
        5. **Analyze Results**: Evaluate model performance
        """)
    
    # System status
    st.markdown('<h3 class="section-header">System Status</h3>', unsafe_allow_html=True)
    
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.metric("Available Models", len(get_available_models()))
    
    with col2:
        st.metric("Datasets", len(get_available_datasets()))
    
    with col3:
        api_status = check_api_status()
        st.metric("API Status", "🟢 Online" if api_status else "🔴 Offline")
    
    with col4:
        import torch
        device = "GPU" if torch.cuda.is_available() else "CPU"
        st.metric("Compute Device", device)


def show_data_management_page():
    """Display the data management page"""
    st.markdown('<h2 class="section-header">📊 Data Management</h2>', unsafe_allow_html=True)
    
    tab1, tab2, tab3 = st.tabs(["Upload Data", "Create Sample Data", "View Datasets"])
    
    with tab1:
        st.subheader("Upload Your Dataset")
        
        uploaded_file = st.file_uploader(
            "Choose a file",
            type=['csv', 'json'],
            help="Upload a CSV or JSON file with 'text' and 'label' columns"
        )
        
        if uploaded_file is not None:
            # Save uploaded file
            file_path = os.path.join(config.data.data_dir, uploaded_file.name)
            with open(file_path, "wb") as f:
                f.write(uploaded_file.getbuffer())
            
            st.success(f"File uploaded successfully: {uploaded_file.name}")
            
            # Preview data
            try:
                data_loader = DataLoader()
                df = data_loader.load_data(file_path)
                
                st.subheader("Data Preview")
                st.dataframe(df.head(10))
                
                # Data statistics
                col1, col2, col3 = st.columns(3)
                with col1:
                    st.metric("Total Samples", len(df))
                with col2:
                    st.metric("Unique Labels", df['label'].nunique())
                with col3:
                    st.metric("Avg Text Length", int(df['text'].str.len().mean()))
                
                # Label distribution
                st.subheader("Label Distribution")
                label_counts = df['label'].value_counts()
                fig = px.bar(x=label_counts.index, y=label_counts.values, 
                           title="Distribution of Labels")
                st.plotly_chart(fig, use_container_width=True)
                
            except Exception as e:
                st.error(f"Error loading data: {e}")
    
    with tab2:
        st.subheader("Create Sample Dataset")
        
        col1, col2 = st.columns(2)
        with col1:
            num_samples = st.number_input("Number of samples", min_value=100, max_value=10000, value=1000)
            file_format = st.selectbox("File format", ["csv", "json"])
        
        with col2:
            filename = st.text_input("Filename", value=f"sample_data.{file_format}")
        
        if st.button("Create Sample Dataset"):
            try:
                output_path = os.path.join(config.data.data_dir, filename)
                create_sample_dataset(output_path, file_format, num_samples)
                st.success(f"Sample dataset created: {filename}")
            except Exception as e:
                st.error(f"Error creating sample dataset: {e}")
    
    with tab3:
        st.subheader("Available Datasets")
        datasets = get_available_datasets()
        
        if datasets:
            for dataset in datasets:
                with st.expander(f"📄 {dataset}"):
                    file_path = os.path.join(config.data.data_dir, dataset)
                    try:
                        data_loader = DataLoader()
                        df = data_loader.load_data(file_path)
                        
                        col1, col2, col3 = st.columns(3)
                        with col1:
                            st.metric("Samples", len(df))
                        with col2:
                            st.metric("Labels", df['label'].nunique())
                        with col3:
                            st.metric("File Size", f"{os.path.getsize(file_path) / 1024:.1f} KB")
                        
                        if st.button(f"Preview {dataset}", key=f"preview_{dataset}"):
                            st.dataframe(df.head())
                    
                    except Exception as e:
                        st.error(f"Error loading {dataset}: {e}")
        else:
            st.info("No datasets found. Upload or create a dataset to get started.")


def show_training_page():
    """Display the model training page"""
    st.markdown('<h2 class="section-header">🏋️ Model Training</h2>', unsafe_allow_html=True)
    
    # Training configuration
    with st.expander("Training Configuration", expanded=True):
        col1, col2 = st.columns(2)
        
        with col1:
            model_name = st.selectbox(
                "Pre-trained Model",
                ["bert-base-uncased", "roberta-base", "distilbert-base-uncased", "albert-base-v2"],
                help="Choose a pre-trained model from Hugging Face"
            )
            
            dataset_file = st.selectbox(
                "Training Dataset",
                get_available_datasets(),
                help="Select a dataset for training"
            )
            
            output_dir = st.text_input(
                "Output Directory",
                value="./models/my_finetuned_model",
                help="Directory to save the trained model"
            )
        
        with col2:
            num_epochs = st.number_input("Number of Epochs", min_value=1, max_value=20, value=3)
            batch_size = st.number_input("Batch Size", min_value=1, max_value=64, value=16)
            learning_rate = st.number_input("Learning Rate", min_value=1e-6, max_value=1e-3, value=2e-5, format="%.2e")
            max_length = st.number_input("Max Sequence Length", min_value=64, max_value=512, value=512)
    
    # Training controls
    col1, col2, col3 = st.columns(3)
    
    with col1:
        start_training = st.button("🚀 Start Training", type="primary")
    
    with col2:
        if st.button("📊 Load Training History"):
            show_training_history(output_dir)
    
    with col3:
        if st.button("🗑️ Clear Output Directory"):
            if os.path.exists(output_dir):
                import shutil
                shutil.rmtree(output_dir)
                st.success("Output directory cleared")
    
    # Training execution
    if start_training:
        if not dataset_file:
            st.error("Please select a dataset for training")
            return
        
        dataset_path = os.path.join(config.data.data_dir, dataset_file)
        
        # Initialize trainer
        with st.spinner("Initializing trainer..."):
            try:
                # Load data to determine number of labels
                data_loader = DataLoader()
                df = data_loader.load_data(dataset_path)
                num_labels = df['label'].nunique()
                
                trainer = ModelTrainer(
                    model_name=model_name,
                    num_labels=num_labels,
                    output_dir=output_dir
                )
                
                st.success("Trainer initialized successfully!")
                
            except Exception as e:
                st.error(f"Error initializing trainer: {e}")
                return
        
        # Start training
        progress_bar = st.progress(0)
        status_text = st.empty()
        
        try:
            status_text.text("Starting training...")
            
            # This is a simplified progress simulation
            # In a real implementation, you'd want to use callbacks to update progress
            for i in range(100):
                time.sleep(0.1)  # Simulate training time
                progress_bar.progress(i + 1)
                status_text.text(f"Training... Step {i + 1}/100")
            
            # Actually start training
            result = trainer.train(
                train_file=dataset_path,
                num_epochs=num_epochs,
                batch_size=batch_size,
                learning_rate=learning_rate,
                max_length=max_length
            )
            
            st.success("Training completed successfully!")
            st.json(result)
            
        except Exception as e:
            st.error(f"Training failed: {e}")
            logger.error(f"Training error: {e}")


def show_prediction_page():
    """Display the model prediction page"""
    st.markdown('<h2 class="section-header">🔮 Model Prediction</h2>', unsafe_allow_html=True)
    
    # Model selection
    available_models = get_available_models()
    
    if not available_models:
        st.warning("No trained models found. Please train a model first.")
        return
    
    selected_model = st.selectbox("Select Model", available_models)
    model_path = os.path.join(config.data.models_dir, selected_model)
    
    # Load model
    if st.button("Load Model"):
        try:
            with st.spinner("Loading model..."):
                predictor = ModelPredictor(model_path)
                st.session_state.predictor = predictor
                st.success("Model loaded successfully!")
                
                # Show model info
                info = predictor.get_model_info()
                st.json(info)
                
        except Exception as e:
            st.error(f"Error loading model: {e}")
    
    # Prediction interface
    if 'predictor' in st.session_state:
        st.subheader("Make Predictions")
        
        tab1, tab2 = st.tabs(["Single Prediction", "Batch Prediction"])
        
        with tab1:
            text_input = st.text_area(
                "Enter text to classify:",
                height=100,
                placeholder="Type your text here..."
            )
            
            col1, col2 = st.columns(2)
            with col1:
                return_probs = st.checkbox("Return Probabilities")
            with col2:
                explain = st.checkbox("Explain Prediction")
            
            if st.button("Predict") and text_input:
                try:
                    with st.spinner("Making prediction..."):
                        result = st.session_state.predictor.predict_single(
                            text_input, 
                            return_probabilities=return_probs
                        )
                    
                    # Display results
                    col1, col2 = st.columns(2)
                    with col1:
                        st.metric("Predicted Label", result['predicted_label'])
                    with col2:
                        st.metric("Confidence", f"{result['confidence']:.2%}")
                    
                    if return_probs and 'probabilities' in result:
                        st.subheader("Class Probabilities")
                        prob_df = pd.DataFrame(
                            list(result['probabilities'].items()),
                            columns=['Label', 'Probability']
                        )
                        fig = px.bar(prob_df, x='Label', y='Probability', 
                                   title="Prediction Probabilities")
                        st.plotly_chart(fig, use_container_width=True)
                    
                    if explain:
                        explanation = st.session_state.predictor.explain_prediction(text_input)
                        st.subheader("Prediction Explanation")
                        st.json(explanation)
                
                except Exception as e:
                    st.error(f"Prediction failed: {e}")
        
        with tab2:
            st.subheader("Batch Prediction")
            
            # File upload for batch prediction
            uploaded_file = st.file_uploader(
                "Upload file for batch prediction",
                type=['csv', 'txt'],
                help="Upload a CSV file with 'text' column or a text file with one text per line"
            )
            
            if uploaded_file is not None:
                try:
                    if uploaded_file.name.endswith('.csv'):
                        df = pd.read_csv(uploaded_file)
                        texts = df['text'].tolist()
                    else:
                        texts = uploaded_file.read().decode('utf-8').split('\n')
                        texts = [t.strip() for t in texts if t.strip()]
                    
                    st.info(f"Loaded {len(texts)} texts for prediction")
                    
                    if st.button("Run Batch Prediction"):
                        with st.spinner("Running batch prediction..."):
                            results = st.session_state.predictor.predict_batch(texts)
                        
                        # Display results
                        results_df = pd.DataFrame(results)
                        st.dataframe(results_df)
                        
                        # Download results
                        csv = results_df.to_csv(index=False)
                        st.download_button(
                            "Download Results",
                            csv,
                            "batch_predictions.csv",
                            "text/csv"
                        )
                
                except Exception as e:
                    st.error(f"Error processing file: {e}")


def show_api_testing_page():
    """Display the API testing page"""
    st.markdown('<h2 class="section-header">🌐 API Testing</h2>', unsafe_allow_html=True)
    
    # API configuration
    col1, col2 = st.columns(2)
    with col1:
        api_url = st.text_input("API Base URL", value="http://localhost:8000")
    with col2:
        api_status = check_api_status(api_url)
        st.metric("API Status", "🟢 Online" if api_status else "🔴 Offline")
    
    if not api_status:
        st.warning("API is not accessible. Make sure the API server is running.")
        if st.button("Start API Server"):
            st.info("Starting API server... (This would start the server in a real implementation)")
        return
    
    # API endpoints testing
    tab1, tab2, tab3 = st.tabs(["Health Check", "Single Prediction", "Batch Prediction"])
    
    with tab1:
        if st.button("Check API Health"):
            try:
                response = requests.get(f"{api_url}/health")
                if response.status_code == 200:
                    st.success("API is healthy!")
                    st.json(response.json())
                else:
                    st.error(f"API health check failed: {response.status_code}")
            except Exception as e:
                st.error(f"Error checking API health: {e}")
    
    with tab2:
        st.subheader("Single Prediction API Test")
        
        text_input = st.text_area("Text to classify:", height=100)
        return_probs = st.checkbox("Return probabilities", key="api_probs")
        
        if st.button("Send API Request") and text_input:
            try:
                payload = {
                    "text": text_input,
                    "return_probabilities": return_probs
                }
                
                with st.spinner("Sending request..."):
                    response = requests.post(f"{api_url}/predict", json=payload)
                
                if response.status_code == 200:
                    result = response.json()
                    st.success("Prediction successful!")
                    
                    col1, col2 = st.columns(2)
                    with col1:
                        st.metric("Predicted Label", result['predicted_label'])
                    with col2:
                        st.metric("Confidence", f"{result['confidence']:.2%}")
                    
                    st.json(result)
                else:
                    st.error(f"API request failed: {response.status_code}")
                    st.text(response.text)
            
            except Exception as e:
                st.error(f"Error sending API request: {e}")
    
    with tab3:
        st.subheader("Batch Prediction API Test")
        
        texts_input = st.text_area(
            "Enter texts (one per line):",
            height=150,
            placeholder="Text 1\nText 2\nText 3"
        )
        
        if st.button("Send Batch API Request") and texts_input:
            try:
                texts = [t.strip() for t in texts_input.split('\n') if t.strip()]
                
                payload = {
                    "texts": texts,
                    "return_probabilities": False,
                    "batch_size": 32
                }
                
                with st.spinner("Sending batch request..."):
                    response = requests.post(f"{api_url}/predict/batch", json=payload)
                
                if response.status_code == 200:
                    result = response.json()
                    st.success(f"Batch prediction successful! Processed {result['total_processed']} texts")
                    
                    # Display results in a table
                    predictions_df = pd.DataFrame(result['predictions'])
                    st.dataframe(predictions_df)
                else:
                    st.error(f"Batch API request failed: {response.status_code}")
                    st.text(response.text)
            
            except Exception as e:
                st.error(f"Error sending batch API request: {e}")


def show_analysis_page():
    """Display the model analysis page"""
    st.markdown('<h2 class="section-header">📈 Model Analysis</h2>', unsafe_allow_html=True)
    
    # Model selection
    available_models = get_available_models()
    
    if not available_models:
        st.warning("No trained models found. Please train a model first.")
        return
    
    selected_model = st.selectbox("Select Model for Analysis", available_models)
    model_path = os.path.join(config.data.models_dir, selected_model)
    
    # Load model info
    try:
        predictor = ModelPredictor(model_path)
        model_info = predictor.get_model_info()
        
        # Model information
        st.subheader("Model Information")
        
        col1, col2, col3, col4 = st.columns(4)
        with col1:
            st.metric("Model Type", model_info['model_type'])
        with col2:
            st.metric("Number of Labels", model_info['num_labels'])
        with col3:
            st.metric("Vocab Size", model_info['vocab_size'])
        with col4:
            st.metric("Device", model_info['device'])
        
        # Training information
        if 'training_info' in model_info:
            st.subheader("Training Information")
            training_info = model_info['training_info']
            
            col1, col2 = st.columns(2)
            with col1:
                st.json(training_info.get('train_result', {}))
            with col2:
                st.json(training_info.get('test_results', {}))
        
        # Model evaluation
        st.subheader("Model Evaluation")
        
        # Upload test data for evaluation
        test_file = st.file_uploader(
            "Upload test dataset for evaluation",
            type=['csv', 'json'],
            help="Upload a dataset to evaluate the model"
        )
        
        if test_file is not None:
            # Save and evaluate
            test_path = os.path.join(config.data.data_dir, f"temp_{test_file.name}")
            with open(test_path, "wb") as f:
                f.write(test_file.getbuffer())
            
            if st.button("Evaluate Model"):
                try:
                    with st.spinner("Evaluating model..."):
                        # Load test data
                        data_loader = DataLoader()
                        test_df = data_loader.load_data(test_path)
                        
                        # Make predictions
                        texts = test_df['text'].tolist()
                        true_labels = test_df['label'].tolist()
                        
                        results = predictor.predict_batch(texts)
                        predicted_labels = [r['predicted_label'] for r in results]
                        
                        # Calculate metrics
                        from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
                        
                        accuracy = accuracy_score(true_labels, predicted_labels)
                        report = classification_report(true_labels, predicted_labels, output_dict=True)
                        cm = confusion_matrix(true_labels, predicted_labels)
                        
                        # Display metrics
                        st.metric("Accuracy", f"{accuracy:.2%}")
                        
                        # Classification report
                        st.subheader("Classification Report")
                        report_df = pd.DataFrame(report).transpose()
                        st.dataframe(report_df)
                        
                        # Confusion matrix
                        st.subheader("Confusion Matrix")
                        fig = px.imshow(
                            cm,
                            text_auto=True,
                            aspect="auto",
                            title="Confusion Matrix"
                        )
                        st.plotly_chart(fig, use_container_width=True)
                        
                        # Prediction distribution
                        st.subheader("Prediction Distribution")
                        pred_counts = pd.Series(predicted_labels).value_counts()
                        fig = px.pie(values=pred_counts.values, names=pred_counts.index, 
                                   title="Distribution of Predictions")
                        st.plotly_chart(fig, use_container_width=True)
                
                except Exception as e:
                    st.error(f"Evaluation failed: {e}")
                finally:
                    # Clean up temp file
                    if os.path.exists(test_path):
                        os.remove(test_path)
    
    except Exception as e:
        st.error(f"Error loading model: {e}")


# Helper functions
def get_available_models() -> List[str]:
    """Get list of available trained models"""
    models_dir = config.data.models_dir
    if not os.path.exists(models_dir):
        return []
    
    models = []
    for item in os.listdir(models_dir):
        model_path = os.path.join(models_dir, item)
        if os.path.isdir(model_path):
            # Check if it's a valid model directory
            if os.path.exists(os.path.join(model_path, "config.json")):
                models.append(item)
    
    return models


def get_available_datasets() -> List[str]:
    """Get list of available datasets"""
    data_dir = config.data.data_dir
    if not os.path.exists(data_dir):
        return []
    
    datasets = []
    for file in os.listdir(data_dir):
        if file.endswith(('.csv', '.json')):
            datasets.append(file)
    
    return datasets


def check_api_status(api_url: str = None) -> bool:
    """Check if the API is running"""
    if api_url is None:
        api_url = f"http://localhost:{config.api.port}"
    
    try:
        response = requests.get(f"{api_url}/health", timeout=5)
        return response.status_code == 200
    except:
        return False


def show_training_history(output_dir: str):
    """Show training history if available"""
    history_path = os.path.join(output_dir, "training_info.json")
    
    if os.path.exists(history_path):
        with open(history_path, 'r') as f:
            history = json.load(f)
        
        st.subheader("Training History")
        st.json(history)
    else:
        st.info("No training history found for this model.")


if __name__ == "__main__":
    main()