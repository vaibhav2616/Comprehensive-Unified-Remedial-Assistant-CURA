from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import json
import os

router = APIRouter(prefix="/analyze", tags=["analysis"])

DATA_FILE = os.path.join(os.path.dirname(__file__), "..", "data", "interactions.json")

class InteractionRequest(BaseModel):
    medications: List[str]

class InteractionFlag(BaseModel):
    drug1: str
    drug2: str
    severity: str
    description: str
    recommendation: str

class InteractionResponse(BaseModel):
    interactions: List[InteractionFlag]

def load_interactions():
    if not os.path.exists(DATA_FILE):
        return []
    with open(DATA_FILE, "r") as f:
        return json.load(f)

@router.post("/interactions", response_model=InteractionResponse)
async def check_interactions(req: InteractionRequest):
    """
    Scans a list of medications against the CURA empirical knowledge base.
    """
    db = load_interactions()
    flags = []
    
    meds = [m.lower() for m in req.medications]
    
    for entry in db:
        d1 = entry["drug1"].lower()
        d2 = entry["drug2"].lower()
        
        # Check if both drugs of this interaction pair exist in the requested medications
        if any(d1 in m for m in meds) and any(d2 in m for m in meds):
            flags.append(InteractionFlag(
                drug1=entry["drug1"],
                drug2=entry["drug2"],
                severity=entry["severity"],
                description=entry["description"],
                recommendation=entry["recommendation"]
            ))
            
    return InteractionResponse(interactions=flags)
