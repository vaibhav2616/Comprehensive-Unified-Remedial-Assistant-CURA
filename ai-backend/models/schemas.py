from pydantic import BaseModel, Field
from typing import Optional, List
from enum import Enum


class DomainEnum(str, Enum):
    allopathy = "allopathy"
    ayurveda = "ayurveda"
    homeopathy = "homeopathy"


class SeverityEnum(str, Enum):
    high = "HIGH"
    moderate = "MODERATE"
    low = "LOW"
    none = "NONE"


class MedicationInput(BaseModel):
    name: str = Field(..., example="Metformin 500mg")
    domain: DomainEnum = Field(..., example="allopathy")
    dosage: Optional[str] = Field(None, example="500mg")
    frequency: Optional[str] = Field(None, example="Twice daily")


class OCRRequest(BaseModel):
    image_base64: Optional[str] = Field(None, description="Base64-encoded prescription image")
    text_fallback: Optional[str] = Field(None, description="Manually entered text if image not available")
    patient_id: str
    consent: bool = Field(..., description="Patient must consent to data processing")


class OCRResponse(BaseModel):
    extraction_id: str
    extracted_medications: List[MedicationInput]
    confidence_score: float
    raw_text: str
    warnings: List[str]


class AnalyzeRequest(BaseModel):
    patient_id: str
    current_symptoms: List[str]
    medical_history: Optional[List[str]] = []
    current_medications: Optional[List[MedicationInput]] = []
    prakriti_type: Optional[str] = Field(None, description="Ayurvedic body constitution")
    age: Optional[int] = None
    gender: Optional[str] = None


class PrescriptionDraft(BaseModel):
    domain: DomainEnum
    prescription: str
    rationale: str
    confidence_score: float
    evidence_level: str = Field(..., description="strong|moderate|anecdotal")
    references: List[str]


class AnalyzeResponse(BaseModel):
    draft_id: str
    patient_id: str
    symptoms_matched: List[str]
    drafts: List[PrescriptionDraft]
    comparative_note: str


class ConflictRequest(BaseModel):
    patient_id: str
    medications: List[MedicationInput]


class ConflictEntry(BaseModel):
    severity: SeverityEnum
    drugs_involved: List[str]
    mechanism: str = Field(..., description="Pharmacokinetic or pharmacodynamic pathway")
    clinical_description: str
    recommendation: str
    evidence_level: str
    reference: Optional[str] = None


class ConflictResponse(BaseModel):
    is_safe: bool
    consensus_score: float
    conflict_count: int
    conflicts: List[ConflictEntry]
    safe_combinations: List[str]


class ModerationRequest(BaseModel):
    post_text: str
    author_role: Optional[str] = Field("patient", description="patient|doctor|verified_practitioner")


class ModerationResponse(BaseModel):
    status: str = Field(..., description="safe|flagged|needs_review")
    label: str
    confidence: float
    reason: str
    who_guideline_violated: Optional[str] = None


class FeedbackRequest(BaseModel):
    draft_id: str
    doctor_id: str
    decision: str = Field(..., description="accept|edit|reject")
    overrides: Optional[dict] = Field(None, description="What was changed if decision=edit")
    rejection_reason: Optional[str] = None
    override_rationale: Optional[str] = None

# commit-touch: 2026-08-21 14:20:00

# commit-touch: vaibhav2616 2026-08-21 14:20:00

# commit-touch: vaibhav2616 2026-08-21 14:20:00

# commit-touch: vaibhav2616 2026-08-21 14:20:00
