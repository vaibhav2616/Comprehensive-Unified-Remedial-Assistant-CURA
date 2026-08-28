"""
Interaction Safety Router
==========================
Endpoint: POST /api/ai/conflict-check
Endpoint: GET  /api/ai/drug-search?query=

Cross-domain safety engine based on:
- Systematic review of herb-drug interactions (NIH/PubMed, Frontiers in Pharmacology)
- WHO Pharmacovigilance Guidelines for Traditional Medicine
- AYUSH Ministry interaction advisories

Severity Scale (matched to clinical practice):
  HIGH     = Contraindicated / requires immediate intervention
  MODERATE = Use with monitoring / dose adjustment recommended  
  LOW      = Monitor, clinical significance uncertain
  NONE     = No significant interaction
"""

import uuid
from fastapi import APIRouter, Query
from models.schemas import ConflictRequest, ConflictResponse, ConflictEntry
from data.interactions_db import search_interactions, get_consensus_score, INTERACTIONS_DB

router = APIRouter()


@router.post("/conflict-check", response_model=ConflictResponse)
async def conflict_check(request: ConflictRequest):
    """
    **Cross-Domain Drug Interaction Check** (Safety Engine Core)
    
    The most important endpoint in CURA. Checks any combination of allopathic drugs,
    Ayurvedic herbs, and Homeopathic remedies against our curated clinical KB.
    
    **Knowledge Base:** 30+ interactions from NIH, PubMed, Cochrane, WHO  
    **Future:** Upgrade to ML classifier (XGBoost + BioBERT embeddings) trained on CURA dataset
    
    **Test example:**
    ```json
    {
      "patient_id": "pat_123",
      "medications": [
        {"name": "Warfarin", "domain": "allopathy"},
        {"name": "Guggulu", "domain": "ayurveda"}
      ]
    }
    ```
    """
    meds_as_dict = [m.model_dump() for m in request.medications]
    conflicts_raw = search_interactions(meds_as_dict)
    
    # Build structured conflict entries
    conflicts = []
    for c in conflicts_raw:
        conflicts.append(ConflictEntry(
            severity=c["severity"],
            drugs_involved=[c["allopathic_drug"], c["interactant"]],
            mechanism=c["mechanism"],
            clinical_description=c["clinical_description"],
            recommendation=c["recommendation"],
            evidence_level=c["evidence_level"],
            reference=c.get("reference")
        ))
    
    # Find safe combinations
    safe_meds = []
    all_med_names = [m["name"] for m in meds_as_dict]
    conflict_drugs = {d for c in conflicts for d in c.drugs_involved}
    safe_meds = [m for m in all_med_names if m not in conflict_drugs]
    
    return ConflictResponse(
        is_safe=len(conflicts) == 0,
        consensus_score=get_consensus_score(conflicts_raw),
        conflict_count=len(conflicts),
        conflicts=conflicts,
        safe_combinations=safe_meds
    )


@router.get("/drug-search")
async def drug_search(query: str = Query(..., description="Search any drug, herb, or remedy name")):
    """
    **Clinical Knowledge Base Search**
    
    Search CURA's interaction database for any substance. Returns all known interactions.
    Useful for doctors building prescriptions to check in advance.
    """
    query_lower = query.lower()
    results = []
    
    for interaction in INTERACTIONS_DB:
        drug_match = query_lower in interaction["allopathic_drug"].lower()
        interactant_match = query_lower in interaction["interactant"].lower()
        
        if drug_match or interactant_match:
            results.append({
                "id": interaction["id"],
                "drug": interaction["allopathic_drug"],
                "interactant": interaction["interactant"],
                "severity": interaction["severity"],
                "summary": interaction["clinical_description"][:120] + "...",
                "evidence_level": interaction["evidence_level"]
            })
    
    return {
        "query": query,
        "total": len(results),
        "results": results
    }

# commit-touch: 2026-08-22 17:10:00

# commit-touch: 2026-08-28 14:00:00

# commit-touch: vaibhav2616 2026-08-22 17:10:00

# commit-touch: vaibhav2616 2026-08-28 14:00:00

# commit-touch: vaibhav2616 2026-08-22 17:10:00

# commit-touch: vaibhav2616 2026-08-28 14:00:00

# commit-touch: vaibhav2616 2026-08-22 17:10:00

# commit-touch: vaibhav2616 2026-08-28 14:00:00
