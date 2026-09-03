from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

router = APIRouter(prefix="/community", tags=["moderation"])

class ModerationRequest(BaseModel):
    post_content: str

class ModerationResponse(BaseModel):
    is_safe: bool
    flags: List[str]
    score: float

@router.post("/moderate", response_model=ModerationResponse)
async def moderate_post(req: ModerationRequest):
    """
    STUB: Replaces frontend mock moderation.
    Detects dangerous medical advice in community posts.
    """
    content = req.post_content.lower()
    flags = []
    
    # Very basic keyword based unsafe medical advice detection
    unsafe_keywords = [
        "stop taking", "throw away", "cure cancer", "guaranteed fix",
        "don't listen to doctors", "drink bleach", "miracle clear"
    ]
    
    for kw in unsafe_keywords:
        if kw in content:
            flags.append(f"Unsafe Keyword Detected: {kw}")
            
    is_safe = len(flags) == 0
    score = 0.99 if is_safe else 0.15
    
    return ModerationResponse(
        is_safe=is_safe,
        flags=flags,
        score=score
    )
