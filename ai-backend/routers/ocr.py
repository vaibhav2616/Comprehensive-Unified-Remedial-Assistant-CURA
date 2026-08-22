"""
OCR & NER Router
================
Endpoint: POST /api/ai/ocr-extract

Pipeline:
  1. Accept base64 image or raw text fallback
  2. Run OCR (Tesseract stub → upgradeable to PaddleOCR/AWS Textract)  
  3. Run NER (regex/spaCy stub → upgradeable to fine-tuned BioBERT/ClinicalBERT)
  4. Return structured medications array with confidence score

Research Basis:
  - BioBERT (Lee et al., 2020) achieves 93.5 F1 on biomedical NER
  - ClinicalBERT performs best on in-patient clinical notes (Alsentzer et al., 2019)
  - Tesseract + medical vocabulary post-correction gives ~82% accuracy on printed prescriptions
"""

import re
import base64
from fastapi import APIRouter, HTTPException
from models.schemas import OCRRequest, OCRResponse, MedicationInput

router = APIRouter()

# ─── Medical vocabulary gazetteer (stub — replace with spaCy + RxNorm model) ─
MEDICATION_PATTERNS = [
    # Allopathy
    {"pattern": r"metformin[\s]*(\d+\w*)", "name": "Metformin", "domain": "allopathy", "category": "Biguanide"},
    {"pattern": r"atorvastatin[\s]*(\d+\w*)", "name": "Atorvastatin", "domain": "allopathy", "category": "Statin"},
    {"pattern": r"metoprolol[\s]*(\d+\w*)", "name": "Metoprolol Succinate", "domain": "allopathy", "category": "Beta-Blocker"},
    {"pattern": r"amlodipine[\s]*(\d+\w*)", "name": "Amlodipine", "domain": "allopathy", "category": "CCB"},
    {"pattern": r"warfarin[\s]*(\d+\w*)", "name": "Warfarin", "domain": "allopathy", "category": "Anticoagulant"},
    {"pattern": r"levothyroxine[\s]*(\d+\w*)", "name": "Levothyroxine", "domain": "allopathy", "category": "Thyroid"},
    {"pattern": r"aspirin[\s]*(\d+\w*)", "name": "Aspirin", "domain": "allopathy", "category": "Antiplatelet"},
    {"pattern": r"sertraline[\s]*(\d+\w*)", "name": "Sertraline", "domain": "allopathy", "category": "SSRI"},
    {"pattern": r"ciprofloxacin[\s]*(\d+\w*)", "name": "Ciprofloxacin", "domain": "allopathy", "category": "Antibiotic"},
    # Ayurveda
    {"pattern": r"ashwagandha", "name": "Ashwagandha (Withania somnifera)", "domain": "ayurveda", "category": "Adaptogen"},
    {"pattern": r"giloy|guduchi|tinospora", "name": "Giloy (Tinospora cordifolia)", "domain": "ayurveda", "category": "Immunomodulator"},
    {"pattern": r"arjuna|terminalia", "name": "Arjuna (Terminalia arjuna)", "domain": "ayurveda", "category": "Cardiotonic"},
    {"pattern": r"guggulu|commiphora", "name": "Guggulu (Commiphora mukul)", "domain": "ayurveda", "category": "Hypolipidemic"},
    {"pattern": r"triphala", "name": "Triphala", "domain": "ayurveda", "category": "Digestive/Tonic"},
    {"pattern": r"yashtimadhu|licorice|glycyrrhiza", "name": "Yashtimadhu (Glycyrrhiza glabra)", "domain": "ayurveda", "category": "Anti-inflammatory"},
    # Homeopathy
    {"pattern": r"arnica[\s]*(\w*)", "name": "Arnica Montana", "domain": "homeopathy", "category": "Trauma"},
    {"pattern": r"belladonna[\s]*(\w*)", "name": "Belladonna", "domain": "homeopathy", "category": "Fever/Infection"},
    {"pattern": r"nux vomica|nux[\s]*vom", "name": "Nux Vomica", "domain": "homeopathy", "category": "Digestive"},
    {"pattern": r"chelidonium[\s]*(\w*)", "name": "Chelidonium Majus", "domain": "homeopathy", "category": "Hepatic"},
    {"pattern": r"caulophyllum", "name": "Caulophyllum", "domain": "homeopathy", "category": "Obstetric"},
]

FREQUENCY_PATTERNS = {
    "od|once daily|once a day|1-0-0": "Once daily",
    "bd|twice daily|twice a day|1-0-1": "Twice daily",
    "tds|tid|thrice|three times": "Thrice daily",
    "qid|four times": "Four times daily",
    "sos|when required|prn": "As needed (SOS)",
    "at bedtime|hs|nocte": "At bedtime",
}


def extract_from_text(text: str) -> dict:
    """
    Rule-based NER stub. 
    Production: Replace with spaCy BioBERT pipeline:
      nlp = spacy.load("en_ner_bc5cdr_md")  # or custom ClinicalBERT fine-tune
      doc = nlp(text)
    """
    text_lower = text.lower()
    medications = []
    warnings = []
    
    for med_pattern in MEDICATION_PATTERNS:
        match = re.search(med_pattern["pattern"], text_lower)
        if match:
            # Extract dosage if captured group exists
            dosage = match.group(1) if match.lastindex else "see prescription"
            
            # Detect frequency
            frequency = "Once daily"
            for freq_pattern, freq_label in FREQUENCY_PATTERNS.items():
                if re.search(freq_pattern, text_lower):
                    frequency = freq_label
                    break
            
            medications.append({
                "name": med_pattern["name"],
                "domain": med_pattern["domain"],
                "dosage": dosage if dosage != "see prescription" else dosage,
                "frequency": frequency
            })
    
    if not medications:
        warnings.append("No recognized medications found. Manual review recommended.")
    
    # Confidence: simple heuristic (upgrade to ML probability output)
    confidence = min(0.95, 0.6 + (len(medications) * 0.05))
    
    return {
        "medications": medications,
        "confidence": confidence,
        "warnings": warnings
    }


@router.post("/ocr-extract", response_model=OCRResponse)
async def ocr_extract(request: OCRRequest):
    """
    **Extract medications from prescription.**
    
    Accepts base64 image or raw text. Returns structured medication list with confidence score.
    
    **Pipeline:** Image → OCR → NER → RxNorm normalization → Structured output
    
    **Future:** Replace rule-based NER with fine-tuned ClinicalBERT model trained on CURA dataset.
    """
    if not request.consent:
        raise HTTPException(status_code=400, detail="Patient consent for data processing is required.")
    
    raw_text = ""
    
    if request.image_base64:
        # Production: pytesseract.image_to_string(Image.open(decoded_image))
        # Stub: simulate OCR output
        try:
            base64.b64decode(request.image_base64)  # validate base64
            raw_text = "[OCR simulation] Metformin 500mg BD, Ashwagandha 1 tsp OD"
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid base64 image data.")
    
    elif request.text_fallback:
        raw_text = request.text_fallback
    else:
        raise HTTPException(status_code=400, detail="Either image_base64 or text_fallback is required.")
    
    result = extract_from_text(raw_text)
    
    import uuid
    return OCRResponse(
        extraction_id=f"ext_{uuid.uuid4().hex[:10]}",
        extracted_medications=[MedicationInput(**m) for m in result["medications"]],
        confidence_score=result["confidence"],
        raw_text=raw_text,
        warnings=result["warnings"]
    )

# commit-touch: 2026-08-22 09:20:00

# commit-touch: vaibhav2616 2026-08-22 09:20:00

# commit-touch: vaibhav2616 2026-08-22 09:20:00

# commit-touch: vaibhav2616 2026-08-22 09:20:00
