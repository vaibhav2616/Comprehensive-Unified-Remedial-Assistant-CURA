"""
CURA AI Microservice - FastAPI Backend
======================================
Research-backed clinical AI engine for cross-domain medical safety.
Based on systematic reviews of herb-drug interactions (NIH, PubMed, Frontiers in Pharmacology).

Architecture:
- OCR extraction using Tesseract (upgradeable to AWS Textract / PaddleOCR)
- NER using spaCy + BioBERT stubs (upgradeable to fine-tuned ClinicalBERT)
- Interaction engine using curated clinical knowledge base
- Community moderation via rule-based + LLM pipeline
- Training feedback loop for continuous model improvement

Author: CURA Engineering Team
Version: 1.0.0
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from routers import ocr, analyze, interactions, moderation, training

app = FastAPI(
    title="CURA AI Engine",
    description="""
    ## CURA Clinical AI Microservice
    
    The world's first cross-domain medical safety AI engine, supporting:
    - **Allopathy**: Evidence-based pharmacological safety
    - **Ayurveda**: Herb-drug interaction detection (CYP450 & pharmacodynamic)  
    - **Homeopathy**: Constitutional & miasmatic prescription drafting
    
    ### Research Foundation
    - Drug-herb interaction rules sourced from NIH/PubMed systematic reviews
    - NER pipeline based on BioBERT / ClinicalBERT architectures
    - Community moderation based on WHO pharmacovigilance guidelines
    """,
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS - allow Next.js frontend (port 3000) and any admin tools
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "https://cura-health.app",  # production
        "https://*.cura-health.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Register routers ─────────────────────────────────────────
app.include_router(ocr.router, prefix="/api/ai", tags=["OCR & NER"])
app.include_router(analyze.router, prefix="/api/ai", tags=["Multi-System Analysis"])
app.include_router(interactions.router, prefix="/api/ai", tags=["Interaction Safety"])
app.include_router(moderation.router, prefix="/api/ai", tags=["Community Moderation"])
app.include_router(training.router, prefix="/api/ai/train", tags=["Training & Feedback"])


@app.get("/", tags=["Health"])
async def root():
    return {
        "service": "CURA AI Engine",
        "version": "1.0.0",
        "status": "operational",
        "endpoints": [
            "POST /api/ai/ocr-extract",
            "POST /api/ai/multi-system-draft",
            "POST /api/ai/conflict-check",
            "POST /api/ai/community-moderate",
            "GET  /api/ai/drug-search",
            "POST /api/ai/train/feedback",
            "GET  /api/ai/train/dataset-schema",
        ]
    }


@app.get("/health", tags=["Health"])  
async def health():
    return {"status": "healthy", "models": {"ocr": "stub", "ner": "stub", "interaction": "rule-based-v1"}}

# commit-touch: 2026-08-21 10:45:00

# commit-touch: vaibhav2616 2026-08-21 10:45:00

# commit-touch: vaibhav2616 2026-08-21 10:45:00

# commit-touch: vaibhav2616 2026-08-21 10:45:00
