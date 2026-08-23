"""
Training & Feedback Loop Router
=================================
Endpoints:
  POST /api/ai/train/feedback        — Capture doctor override for AI training
  GET  /api/ai/train/dataset-schema  — Returns the dataset schema for future training
  POST /api/ai/train/submit-dataset  — (future) Accept labeled dataset batch

This is CURA's proprietary data flywheel:
  Every doctor decision (accept/edit/reject) creates training data.
  This continuous feedback improves our models over time, creating a
  proprietary clinical dataset moat no competitor can easily replicate.

Data collected per interaction:
  - Original symptom input
  - AI-generated draft (all 3 domains)
  - Doctor's final approved prescription
  - Override rationale
  - Patient outcome (future: linked via follow-up)

Storage: Append to JSONL training file (upgrade to PostgreSQL + S3 in production)
"""

import json
import uuid
import os
from datetime import datetime
from fastapi import APIRouter, HTTPException
from models.schemas import FeedbackRequest

router = APIRouter()

FEEDBACK_LOG_PATH = "data/training_feedback.jsonl"


@router.post("/feedback")
async def submit_feedback(request: FeedbackRequest):
    """
    **Submit Doctor Feedback on AI Draft** (Core Training Loop)
    
    Every accept/edit/reject decision is logged as training data.
    This builds CURA's proprietary medical AI corpus over time.
    
    - `accept` → Positive training example
    - `edit` → Preference pair (draft vs. final) for RLHF-style training
    - `reject` → Negative example with reason for contrastive learning
    
    **Data Privacy:** All data is de-identified before training use.
    """
    if request.decision == "reject" and not request.rejection_reason:
        raise HTTPException(
            status_code=400,
            detail="Rejection reason required. This data is critical for improving AI safety."
        )
    
    feedback_entry = {
        "feedback_id": f"fb_{uuid.uuid4().hex[:10]}",
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "draft_id": request.draft_id,
        "doctor_id": request.doctor_id,  # Hashed before storage in production
        "decision": request.decision,
        "overrides": request.overrides,
        "rejection_reason": request.rejection_reason,
        "override_rationale": request.override_rationale,
        "training_label": _map_decision_to_label(request.decision),
        "data_use": "ai_training_corpus_v1"
    }
    
    # Append to JSONL log (upgrade to PostgreSQL + S3 in production)
    os.makedirs("data", exist_ok=True)
    with open(FEEDBACK_LOG_PATH, "a") as f:
        f.write(json.dumps(feedback_entry) + "\n")
    
    return {
        "success": True,
        "feedback_id": feedback_entry["feedback_id"],
        "message": "Feedback logged successfully. This data will improve CURA's clinical AI accuracy.",
        "training_contribution": feedback_entry["training_label"]
    }


@router.get("/dataset-schema")
async def get_dataset_schema():
    """
    **Dataset Schema for Future Training**
    
    Returns the expected format for labeled medical datasets.
    When datasets are provided, preprocess them to this schema
    and submit via the `/api/ai/train/submit-dataset` endpoint.
    
    **Supported dataset types:**
    1. Drug-herb interaction pairs (for interaction classifier)
    2. Prescription NER examples (for OCR/NER model)
    3. Symptom-to-prescription pairs (for multi-system drafting model)
    4. Community post labels (safe/flagged) for moderation classifier
    """
    return {
        "schema_version": "1.0.0",
        "schemas": {
            "interaction_pair": {
                "description": "Drug-herb/remedy interaction pairs for training the safety classifier",
                "fields": {
                    "drug_name": "str — allopathic drug name (use generic)",
                    "drug_class": "str — pharmacological class (e.g., Anticoagulant, SSRI)",
                    "interactant": "str — herb/remedy name + botanical name",
                    "interactant_domain": "enum[ayurveda|homeopathy|allopathy]",
                    "severity": "enum[HIGH|MODERATE|LOW|NONE]",
                    "interaction_type": "enum[pharmacokinetic|pharmacodynamic|constitutional]",
                    "mechanism": "str — molecular/clinical mechanism description",
                    "evidence_level": "enum[strong|moderate|anecdotal]",
                    "pubmed_id": "str (optional) — PMID for primary reference",
                    "source": "str — journal, book, or guideline name"
                },
                "example": {
                    "drug_name": "Warfarin",
                    "drug_class": "Anticoagulant",
                    "interactant": "Garlic (Allium sativum)",
                    "interactant_domain": "ayurveda",
                    "severity": "HIGH",
                    "interaction_type": "pharmacodynamic",
                    "mechanism": "Garlic inhibits platelet aggregation via thiosulfinates, potentiating Warfarin",
                    "evidence_level": "strong",
                    "pubmed_id": "12728112",
                    "source": "Pharmacotherapy 2004"
                }
            },
            "ner_prescription": {
                "description": "Prescription text with entity annotations for NER training (BIO format)",
                "fields": {
                    "text": "str — raw prescription text",
                    "entities": "list[{start, end, label, text}]",
                    "labels": "enum[DRUG_NAME|DOSAGE|FREQUENCY|DOMAIN|CONDITION|ROUTE]"
                },
                "example": {
                    "text": "Metformin 500mg tablet twice daily for diabetes",
                    "entities": [
                        {"start": 0, "end": 9, "label": "DRUG_NAME", "text": "Metformin"},
                        {"start": 10, "end": 15, "label": "DOSAGE", "text": "500mg"},
                        {"start": 23, "end": 34, "label": "FREQUENCY", "text": "twice daily"},
                        {"start": 39, "end": 47, "label": "CONDITION", "text": "diabetes"}
                    ]
                }
            },
            "symptom_draft_pair": {
                "description": "Symptom-input to doctor-approved prescription output pairs",
                "fields": {
                    "symptoms": "list[str]",
                    "patient_context": "{age, gender, prakriti, medical_history}",
                    "approved_drafts": "list[{domain, prescription, rationale, doctor_specialty}]",
                    "doctor_decision": "enum[accepted|modified]",
                    "final_prescription": "str — doctor's final approved text"
                }
            },
            "community_moderation": {
                "description": "Community health posts labeled for misinformation classification",
                "fields": {
                    "text": "str — raw post content",
                    "label": "enum[safe|flagged|needs_review]",
                    "flag_category": "str (if flagged) — type of misinformation",
                    "annotator_role": "enum[clinical_reviewer|doctor|pharmacist]",
                    "confidence": "float 0-1"
                }
            }
        },
        "preprocessing_script": "Run `python training/preprocess.py --schema <schema_name> --input <file.csv>` after adding dataset",
        "notes": "All data must be de-identified per DPDP Act 2023 (India) and GDPR before submission."
    }


def _map_decision_to_label(decision: str) -> str:
    mapping = {
        "accept": "positive_example",
        "edit": "preference_pair_for_rlhf",
        "reject": "negative_example_contrastive"
    }
    return mapping.get(decision, "unlabeled")

# commit-touch: 2026-08-23 15:30:00

# commit-touch: 2026-08-29 11:00:00

# commit-touch: vaibhav2616 2026-08-23 15:30:00

# commit-touch: vaibhav2616 2026-08-29 11:00:00

# commit-touch: vaibhav2616 2026-08-23 15:30:00

# commit-touch: vaibhav2616 2026-08-29 11:00:00

# commit-touch: vaibhav2616 2026-08-23 15:30:00
