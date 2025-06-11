# AI Model Finetuning and Deployment Application

A comprehensive Python application for finetuning pre-trained language models and deploying them as API services.

## Features

- **Data Ingestion**: Support for CSV and JSON datasets
- **Model Finetuning**: Finetune pre-trained models from Hugging Face
- **API Deployment**: Deploy finetuned models as REST APIs
- **Web Interface**: User-friendly interface for training and prediction
- **Evaluation Metrics**: Comprehensive model evaluation with visualizations

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ai-finetuning-app
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

## Project Structure

```
ai-finetuning-app/
├── src/
│   ├── data/
│   │   ├── __init__.py
│   │   ├── loader.py          # Data loading and preprocessing
│   │   └── dataset.py         # Custom dataset classes
│   ├── models/
│   │   ├── __init__.py
│   │   ├── trainer.py         # Model training logic
│   │   └── predictor.py       # Model inference logic
│   ├── api/
│   │   ├── __init__.py
│   │   ├── app.py            # FastAPI application
│   │   └── routes.py         # API routes
│   ├── ui/
│   │   ├── __init__.py
│   │   └── streamlit_app.py  # Streamlit interface
│   └── utils/
│       ├── __init__.py
│       ├── config.py         # Configuration management
│       └── metrics.py        # Evaluation metrics
├── data/                     # Sample datasets
├── models/                   # Saved models directory
├── logs/                     # Training logs
├── requirements.txt
├── README.md
└── main.py                   # Main application entry point
```

## Quick Start

### 1. Prepare Your Dataset

Create a CSV file with `text` and `label` columns:
```csv
text,label
"This movie is amazing!",positive
"I didn't like this film.",negative
```

Or a JSON file:
```json
[
    {"text": "This movie is amazing!", "label": "positive"},
    {"text": "I didn't like this film.", "label": "negative"}
]
```

### 2. Finetune a Model

```python
from src.models.trainer import ModelTrainer

trainer = ModelTrainer(
    model_name="bert-base-uncased",
    num_labels=2,
    output_dir="./models/my_model"
)

trainer.train(
    train_file="data/train.csv",
    num_epochs=3,
    batch_size=16,
    learning_rate=2e-5
)
```

### 3. Start the API Service

```bash
python -m src.api.app
```

### 4. Make Predictions

```bash
curl -X POST "http://localhost:8000/predict" \
     -H "Content-Type: application/json" \
     -d '{"text": "This is a great product!"}'
```

### 5. Use the Web Interface

```bash
streamlit run src/ui/streamlit_app.py
```

## API Endpoints

- `POST /predict`: Make predictions on new text
- `GET /health`: Check API health
- `GET /model/info`: Get model information

## Configuration

Edit `src/utils/config.py` to customize:
- Model parameters
- Training hyperparameters
- API settings
- File paths

## Examples

See the `examples/` directory for complete usage examples and sample datasets.