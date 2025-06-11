"""
FastAPI application for serving the finetuned model
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
import logging
import os
import uvicorn
from contextlib import asynccontextmanager

from ..models.predictor import ModelPredictor
from ..utils.config import config

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global predictor instance
predictor: Optional[ModelPredictor] = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage application lifespan"""
    global predictor
    
    # Startup
    try:
        model_path = config.api.model_path
        if os.path.exists(model_path):
            predictor = ModelPredictor(model_path)
            logger.info(f"Model loaded successfully from {model_path}")
        else:
            logger.warning(f"Model path {model_path} does not exist. API will start without a model.")
    except Exception as e:
        logger.error(f"Failed to load model: {e}")
        predictor = None
    
    yield
    
    # Shutdown
    logger.info("Shutting down API")


# Create FastAPI app
app = FastAPI(
    title="AI Model Finetuning API",
    description="API for serving finetuned language models",
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Pydantic models for request/response
class PredictionRequest(BaseModel):
    text: str = Field(..., description="Text to classify", min_length=1, max_length=10000)
    return_probabilities: bool = Field(False, description="Whether to return class probabilities")


class BatchPredictionRequest(BaseModel):
    texts: List[str] = Field(..., description="List of texts to classify", min_items=1, max_items=100)
    return_probabilities: bool = Field(False, description="Whether to return class probabilities")
    batch_size: int = Field(32, description="Batch size for processing", ge=1, le=100)


class PredictionResponse(BaseModel):
    text: str
    predicted_label: str
    predicted_class_id: int
    confidence: float
    probabilities: Optional[Dict[str, float]] = None


class BatchPredictionResponse(BaseModel):
    predictions: List[PredictionResponse]
    total_processed: int


class ModelInfoResponse(BaseModel):
    model_path: str
    model_type: str
    num_labels: int
    labels: List[str]
    device: str
    training_info: Optional[Dict[str, Any]] = None


class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    message: str


# API Routes
@app.get("/", response_model=Dict[str, str])
async def root():
    """Root endpoint"""
    return {
        "message": "AI Model Finetuning API",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    model_loaded = predictor is not None
    status = "healthy" if model_loaded else "unhealthy"
    message = "Model loaded and ready" if model_loaded else "No model loaded"
    
    return HealthResponse(
        status=status,
        model_loaded=model_loaded,
        message=message
    )


@app.post("/predict", response_model=PredictionResponse)
async def predict(request: PredictionRequest):
    """
    Make a prediction for a single text input
    """
    if predictor is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    try:
        result = predictor.predict_single(
            request.text, 
            return_probabilities=request.return_probabilities
        )
        
        return PredictionResponse(**result)
        
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")


@app.post("/predict/batch", response_model=BatchPredictionResponse)
async def predict_batch(request: BatchPredictionRequest):
    """
    Make predictions for multiple text inputs
    """
    if predictor is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    try:
        results = predictor.predict_batch(
            request.texts,
            batch_size=request.batch_size,
            return_probabilities=request.return_probabilities
        )
        
        predictions = [PredictionResponse(**result) for result in results]
        
        return BatchPredictionResponse(
            predictions=predictions,
            total_processed=len(predictions)
        )
        
    except Exception as e:
        logger.error(f"Batch prediction error: {e}")
        raise HTTPException(status_code=500, detail=f"Batch prediction failed: {str(e)}")


@app.get("/model/info", response_model=ModelInfoResponse)
async def get_model_info():
    """
    Get information about the loaded model
    """
    if predictor is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    try:
        info = predictor.get_model_info()
        return ModelInfoResponse(**info)
        
    except Exception as e:
        logger.error(f"Error getting model info: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get model info: {str(e)}")


@app.post("/model/load")
async def load_model(model_path: str, background_tasks: BackgroundTasks):
    """
    Load a model from the specified path
    """
    def load_model_task(path: str):
        global predictor
        try:
            predictor = ModelPredictor(path)
            logger.info(f"Model loaded successfully from {path}")
        except Exception as e:
            logger.error(f"Failed to load model from {path}: {e}")
            predictor = None
    
    if not os.path.exists(model_path):
        raise HTTPException(status_code=404, detail=f"Model path {model_path} does not exist")
    
    background_tasks.add_task(load_model_task, model_path)
    
    return {"message": f"Loading model from {model_path} in background"}


@app.post("/predict/explain")
async def explain_prediction(request: PredictionRequest):
    """
    Get explanation for a prediction
    """
    if predictor is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    try:
        explanation = predictor.explain_prediction(request.text)
        return explanation
        
    except Exception as e:
        logger.error(f"Explanation error: {e}")
        raise HTTPException(status_code=500, detail=f"Explanation failed: {str(e)}")


def run_api(host: str = None, port: int = None, debug: bool = None):
    """
    Run the API server
    
    Args:
        host: Host to bind to
        port: Port to bind to
        debug: Enable debug mode
    """
    host = host or config.api.host
    port = port or config.api.port
    debug = debug or config.api.debug
    
    logger.info(f"Starting API server on {host}:{port}")
    
    uvicorn.run(
        "src.api.app:app",
        host=host,
        port=port,
        reload=debug,
        log_level="info"
    )


if __name__ == "__main__":
    run_api()