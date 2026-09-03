from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
import random

router = APIRouter(prefix="/ocr", tags=["ocr"])

class OCRRequest(BaseModel):
    image_base64: str

class OCRResponse(BaseModel):
    medications_found: List[str]
    confidence_score: float
    raw_text_detected: str

@router.post("/extract", response_model=OCRResponse)
async def extract_prescription(req: OCRRequest):
    """
    STUB: Replaces the frontend mock.
    In phase 8, this will route to Tesseract/Vision models.
    """
    # Simulate a delay for OCR processing
    
    # Randomly select a set of demo medications for the MVP
    demo_prescriptions = [
        ["Aspirin", "Ginkgo Biloba"],
        ["Metformin", "Ashwagandha", "Vitamin B12"],
        ["Paracetamol", "Amoxicillin"],
        ["Warfarin", "Garlic", "Sildenafil"]
    ]
    
    found = random.choice(demo_prescriptions)
    
    return OCRResponse(
        medications_found=found,
        confidence_score=round(random.uniform(0.85, 0.98), 2),
        raw_text_detected=f"Dr. XYZ Signature... Rx: {', '.join(found)} ... Take once daily."
    )
