"""
Multi-System Analysis Router
=============================
Endpoint: POST /api/ai/multi-system-draft

Generates side-by-side treatment drafts for:
  - Allopathy: Evidence-based pharmacological options
  - Ayurveda: Constitutional + symptomatic formulations  
  - Homeopathy: Totality of symptoms + constitutional prescribing

Research Basis:
  - Allopathy: UpToDate / WHO Essential Medicines guidelines
  - Ayurveda: Charaka Samhita, Ashtanga Hridayam, published clinical trials
  - Homeopathy: Kent's Repertory, Clarke's Materia Medica, modern clinical outcome studies

Architecture:
  Current: Rule-based symptom-to-prescription mapping
  Future: Fine-tuned medical LLM (MedPaLM 2, ClinicalT5, or custom GPT) 
          trained on CURA doctor-approved prescription corpus
"""

import uuid
from fastapi import APIRouter
from models.schemas import AnalyzeRequest, AnalyzeResponse, PrescriptionDraft

router = APIRouter()

# ─── Symptom-to-prescription mapping (stub knowledge base) ────────────────
# Future: Replace with LLM inference + retrieval-augmented generation (RAG)
# Model: ClinicalBERT or MedPaLM 2 fine-tuned on CURA approved corpus
SYMPTOM_KNOWLEDGE = {
    "fever": {
        "allopathy": {
            "prescription": "Paracetamol 500mg SOS (max 4g/day). NSAIDs to be avoided in dengue-endemic areas.",
            "rationale": "First-line antipyretic per WHO guidelines. Safe across age groups except severe hepatic disease.",
            "confidence": 0.96,
            "evidence_level": "strong",
            "references": ["WHO EML 2023", "Cochrane Rev: Acetaminophen for Fever"]
        },
        "ayurveda": {
            "prescription": "Sudarshan Vati 2 tabs BD + Giloy Satva 1g BD with honey for 5 days (Jvaranashak protocol).",
            "rationale": "Addresses Pitta-Kapha imbalance causing Jvara. Giloy (Guduchi) is the primary Ayurvedic antipyretic with published immunomodulatory data.",
            "confidence": 0.85,
            "evidence_level": "moderate",
            "references": ["Charaka Samhita Chikitsa 3", "J Ethnopharmacol. 2012"]
        },
        "homeopathy": {
            "prescription": "Belladonna 30C or Aconite 30C stat (symptom-based selection). Ferrum Phos 6X every 2 hours for gradual onset.",
            "rationale": "Belladonna: Sudden onset, flushed face, throbbing. Aconite: After cold/fright exposure. Ferrum Phos: Gradual onset, initial stages.",
            "confidence": 0.80,
            "evidence_level": "anecdotal",
            "references": ["Kent's Repertory - Fever Chapter", "Clarke's Materia Medica: Belladonna"]
        }
    },
    "cough": {
        "allopathy": {
            "prescription": "Productive cough: Ambroxol 30mg TDS. Dry cough: Dextromethorphan 15mg SOS. Rule out TB/COVID.",
            "rationale": "Mucolytics for productive cough to facilitate expectoration. Antitussives only for non-productive cough.",
            "confidence": 0.90,
            "evidence_level": "strong",
            "references": ["British Thoracic Society Guidelines", "NICE CG191"]
        },
        "ayurveda": {
            "prescription": "Sitopaladi Churna 1g with honey TDS + Vasa Avaleha (Adhatoda vasica syrup) 10ml BD.",
            "rationale": "Vasa (Adhatoda) has bronchodilator alkaloids (vasicine). Sitopaladi is classical Kasa-Shwasa formulation.",
            "confidence": 0.83,
            "evidence_level": "moderate",
            "references": ["Bharata Bhaishajya Ratnakara", "J Ethnopharmacol. 2008;115(2)"]
        },
        "homeopathy": {
            "prescription": "Bryonia 30C (dry, painful cough, worse with movement). Spongia Tosta 30C (barking/croupy cough).",
            "rationale": "Totality matching: Bryonia for pleuritic type, Spongia for laryngeal/tracheobronchial involvement.",
            "confidence": 0.75,
            "evidence_level": "anecdotal",
            "references": ["Kent's Repertory: Cough", "Boericke's Materia Medica"]
        }
    },
    "hypertension": {
        "allopathy": {
            "prescription": "Stage 1 (130-140/80-90): Amlodipine 5mg OD + lifestyle. Stage 2: Add ACE inhibitor (Ramipril 5mg). Monitor renal function.",
            "rationale": "JNC 8 / ACC/AHA 2017 Guidelines. CCB preferred in South Asian population (higher sodium-sensitive hypertension).",
            "confidence": 0.95,
            "evidence_level": "strong",
            "references": ["ACC/AHA 2017 HTN Guidelines", "JNC 8 JAMA 2014"]
        },
        "ayurveda": {
            "prescription": "Sarpagandha Ghan Vati 1 tab BD (AVOID if on allopathic antihypertensives) + Brahmi Vati 1 tab OD + Yoga (Shavasana).",
            "rationale": "CRITICAL: Sarpagandha contains Reserpine. CONTRAINDICATED with allopathic antihypertensives. Safe only as standalone Ayurvedic monotherapy.",
            "confidence": 0.70,
            "evidence_level": "moderate",
            "references": ["AYU Journal 2011", "INTERACTION FLAG: HDI-007 applies"]
        },
        "homeopathy": {
            "prescription": "Rauwolfia Q 10 drops in water TDS (mild-moderate). Crataegus Q 10 drops BD for cardiac support.",
            "rationale": "Constitutional prescribing preferred. Rauwolfia mother tincture has plant alkaloid action. Best used with monitoring.",
            "confidence": 0.72,
            "evidence_level": "anecdotal",
            "references": ["Homeopathic Materia Medica: Rauwolfia", "Clinical Outcomes Study 2019"]
        }
    },
    "anxiety": {
        "allopathy": {
            "prescription": "SSRI (Sertraline 50mg OD) first line for GAD. Clonazepam 0.5mg SOS for acute episodes. CBT referral concurrent.",
            "rationale": "NICE-based guidelines for Generalized Anxiety Disorder. SSRIs preferred over long-term benzodiazepines.",
            "confidence": 0.92,
            "evidence_level": "strong",
            "references": ["NICE CG113", "Cochrane: SSRIs for GAD 2018"]
        },
        "ayurveda": {
            "prescription": "Ashwagandha 600mg OD + Brahmi (Bacopa monnieri) 300mg BD + Shirodhara therapy (Panchakarma). Avoid Tagara if on Clonazepam (HDI-014).",
            "rationale": "Ashwagandha reduces cortisol by 30% in published RCT. Brahmi modulates acetylcholine. Validated for stress and anxiety.",
            "confidence": 0.86,
            "evidence_level": "moderate",
            "references": ["Med J India 2019 (Ashwagandha RCT)", "Phytomedicine 2001;8(2)"]
        },
        "homeopathy": {
            "prescription": "Argentum Nitricum 30C (anticipatory anxiety, diarrhea). Ignatia Amara 30C (grief-triggered anxiety). Lycopodium 30C (performance anxiety).",
            "rationale": "Constitutional individualization paramount. Detailed case-taking required for remedy selection.",
            "confidence": 0.74,
            "evidence_level": "anecdotal",
            "references": ["Kent Repertory: Mind/Anxiety", "Clinical case series 2020"]
        }
    },
    "diabetes": {
        "allopathy": {
            "prescription": "Type 2 DM: Metformin 500mg BD titrating to 2g/day. Add GLP-1 agonist (Semaglutide) if HbA1c >8% after 3 months.",
            "rationale": "ADA/EASD 2024 consensus. Metformin remains first-line. Cardiorenal outcomes favor GLP-1 agonists.",
            "confidence": 0.96,
            "evidence_level": "strong",
            "references": ["ADA Standards of Care 2024", "EASD Consensus 2022"]
        },
        "ayurveda": {
            "prescription": "Vijayasar tumbler (water soaked overnight) + Gurmar (Gymnema sylvestre) 400mg BD. CAUTION with concurrent Metformin (HDI-009, HDI-010).",
            "rationale": "Gurmar (Sugar destroyer) blocks intestinal glucose absorption and promotes β-cell regeneration in published trials.",
            "confidence": 0.80,
            "evidence_level": "moderate",
            "references": ["J Ethnopharmacol 2010", "Phytother Res 2004;18(7)"]
        },
        "homeopathy": {
            "prescription": "Syzygium Jambolanum Q 10 drops TDS (reduces blood sugar). Uranium Nitricum 30C (frequent urination, wasting). Under strict medical monitoring only.",
            "rationale": "Homeopathic management of DM is adjunctive only. Strict blood glucose monitoring mandatory.",
            "confidence": 0.62,
            "evidence_level": "anecdotal",
            "references": ["Homeopathic Pharmacopoeia of India"]
        }
    }
}


@router.post("/multi-system-draft", response_model=AnalyzeResponse)
async def multi_system_draft(request: AnalyzeRequest):
    """
    **Multi-System AI Draft Generation** (CURA Core Module)
    
    Given patient symptoms and history, generates clinically referenced treatment drafts 
    simultaneously from all three medical domains. Each draft includes:
    - Prescription recommendation
    - Clinical rationale
    - Evidence level + literature references
    - Confidence score
    
    **Doctor Review Required:** All drafts must be reviewed and approved by a licensed practitioner.
    This system generates suggestions, not prescriptions.
    
    **Future upgrade:** Replace with MedPaLM 2 / ClinicalT5 fine-tuned on CURA-approved corpus.
    """
    symptoms_matched = []
    all_drafts = []
    
    for symptom in request.current_symptoms:
        symptom_lower = symptom.lower()
        matched_key = None
        for key in SYMPTOM_KNOWLEDGE:
            if key in symptom_lower or symptom_lower in key:
                matched_key = key
                break
        
        if matched_key and matched_key not in symptoms_matched:
            symptoms_matched.append(matched_key)
            data = SYMPTOM_KNOWLEDGE[matched_key]
            
            for domain_key, domain_data in data.items():
                all_drafts.append(PrescriptionDraft(
                    domain=domain_key,
                    prescription=domain_data["prescription"],
                    rationale=domain_data["rationale"],
                    confidence_score=domain_data["confidence"],
                    evidence_level=domain_data["evidence_level"],
                    references=domain_data["references"]
                ))
    
    if not symptoms_matched:
        symptoms_matched = ["general-assessment"]
        all_drafts.append(PrescriptionDraft(
            domain="allopathy",
            prescription="Comprehensive assessment recommended. No specific medication suggested without examination.",
            rationale="Insufficient symptom data for automated suggestion. Clinical evaluation required.",
            confidence_score=0.3,
            evidence_level="strong",
            references=["Clinical Assessment Guidelines"]
        ))
    
    comparative_note = (
        f"CURA generated {len(all_drafts)} draft(s) across {len(set(d.domain for d in all_drafts))} medical domain(s). "
        "All drafts require mandatory review and approval by a licensed practitioner. "
        "Cross-domain interaction check recommended before any combination therapy."
    )
    
    return AnalyzeResponse(
        draft_id=f"drf_{uuid.uuid4().hex[:10]}",
        patient_id=request.patient_id,
        symptoms_matched=symptoms_matched,
        drafts=all_drafts,
        comparative_note=comparative_note
    )

# commit-touch: 2026-08-22 11:50:00

# commit-touch: vaibhav2616 2026-08-22 11:50:00

# commit-touch: vaibhav2616 2026-08-22 11:50:00

# commit-touch: vaibhav2616 2026-08-22 11:50:00
