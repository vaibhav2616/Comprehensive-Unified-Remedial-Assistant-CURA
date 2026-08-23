"""
Community Moderation Router
============================
Endpoint: POST /api/ai/community-moderate

Detects and flags dangerous medical misinformation based on:
- WHO Pharmacovigilance & Infodemiology guidelines
- AYUSH Ministry disclaimers
- Pattern matching for known harmful claim types

Current: Rule-based keyword classification
Future: Fine-tuned medical misinformation classifier
        (BERT trained on MedMisinfoDataset or custom CURA-labeled corpus)
"""

import re
from fastapi import APIRouter
from models.schemas import ModerationRequest, ModerationResponse

router = APIRouter()

# ─── Dangerous claim patterns (WHO Infodemiology Framework) ───────────────
DANGEROUS_PATTERNS = [
    {
        "pattern": r"stop\s+\w+\s+(insulin|medication|medicine|tablet|drug|chemo)",
        "label": "Flagged: Advises stopping prescribed medication",
        "reason": "Advises abrupt discontinuation of prescribed medication without medical supervision. Life-threatening for insulin, cardiac, antiepileptic, and immunosuppressant drugs.",
        "who_guideline": "WHO Guideline: Do not advise stoppage of prescribed medications"
    },
    {
        "pattern": r"(cure|cured|completely cured|permanent cure|100%\s+cure)\s+\w*(diabetes|cancer|hypertension|aids|hiv|tb|asthma)",
        "label": "Flagged: Unverified cure claim",
        "reason": "Claims a permanent or guaranteed cure for a chronic condition without clinical trial evidence. Violates medical advertising standards.",
        "who_guideline": "WHO Global Advisory: Preventing health misinformation"
    },
    {
        "pattern": r"(no side effects|zero side effects|completely safe|100%\s+natural\s+and\s+safe)",
        "label": "Flagged: Absolute safety claim",
        "reason": "All substances, natural or otherwise, carry dosage-dependent risk profiles. Absolute safety claims are medically inaccurate and misleading.",
        "who_guideline": "CDSCO Disclaimer Requirement for Health Supplements"
    },
    {
        "pattern": r"don'?t\s+(need|require)\s+\w*(doctor|physician|specialist|hospital)",
        "label": "Flagged: Discourages medical consultation",
        "reason": "Actively discouraging patients from seeking qualified medical advice for a health condition is against public health guidelines.",
        "who_guideline": "WHO: Seek qualified medical advice for diagnosis"
    },
    {
        "pattern": r"replace\w*\s+\w+\s+(medication|medicine|insulin|chemo|dialysis)\s+with",
        "label": "Flagged: Suggests replacing prescribed treatment",
        "reason": "Recommending replacement of a medically prescribed treatment with an unvalidated alternative without medical consultation is dangerous.",
        "who_guideline": "MCI/NMC Code of Medical Ethics"
    },
    {
        "pattern": r"(rauwolfia|sarpagandha).*(blood pressure|antihypertensive|amlodipine|metoprolol)",
        "label": "Flagged: Dangerous drug-herb combination mentioned",
        "reason": "Rauwolfia and allopathic antihypertensives (HIGH risk HDI-007) combination mentioned without safety warning.",
        "who_guideline": "CURA Interaction Safety Policy"
    }
]

# ─── Safe content signals ───────────────────────────────────────────────────
SAFE_SIGNALS = [
    r"consult\s+(your\s+)?(doctor|physician|specialist|vaidya)",
    r"under\s+(medical\s+)?(supervision|guidance|advice)",
    r"check\s+with\s+your\s+(doctor|physician|practitioner)",
    r"in\s+my\s+(experience|case|opinion)",  # personal accounts
    r"doctor\s+(approved|recommended|prescribed|suggested)"
]

VERIFIED_ROLE_BOOST = ["doctor", "verified_practitioner"]


@router.post("/community-moderate", response_model=ModerationResponse)
async def community_moderate(request: ModerationRequest):
    """
    **Community Post Safety Moderation**
    
    Analyzes community posts for dangerous medical misinformation patterns.
    Based on WHO Infodemiology guidelines and CURA clinical safety policies.
    
    **Current:** Rule-based pattern matching  
    **Future:** BERT-based misinformation classifier trained on labeled CURA community corpus
    
    **Test examples:**
    - "Stop your insulin and use bitter gourd instead!" → FLAGGED
    - "My Panchakarma helped with fatigue, consult your doctor first!" → SAFE
    """
    text = request.post_text
    text_lower = text.lower()
    
    # Check for dangerous patterns
    for dp in DANGEROUS_PATTERNS:
        if re.search(dp["pattern"], text_lower):
            # Verified practitioners get lower confidence (still flagged but noted)
            confidence = 0.94 if request.author_role not in VERIFIED_ROLE_BOOST else 0.75
            return ModerationResponse(
                status="flagged",
                label=dp["label"],
                confidence=confidence,
                reason=dp["reason"],
                who_guideline_violated=dp["who_guideline"]
            )
    
    # Check for safe signals
    safe_signal_count = sum(1 for sp in SAFE_SIGNALS if re.search(sp, text_lower))
    
    if safe_signal_count >= 1 or request.author_role in VERIFIED_ROLE_BOOST:
        return ModerationResponse(
            status="safe",
            label="Verified Safe",
            confidence=0.89 + (0.03 * min(safe_signal_count, 3)),
            reason=f"Content includes {safe_signal_count} safe signal(s) and does not contain dangerous claim patterns.",
            who_guideline_violated=None
        )
    
    # Neutral — no strong signals either way
    return ModerationResponse(
        status="needs_review",
        label="Awaiting Clinical Review",
        confidence=0.60,
        reason="Content does not match known dangerous patterns, but lacks explicit safety signals. Manual review by CURA clinical team recommended.",
        who_guideline_violated=None
    )

# commit-touch: 2026-08-23 11:00:00

# commit-touch: vaibhav2616 2026-08-23 11:00:00

# commit-touch: vaibhav2616 2026-08-23 11:00:00

# commit-touch: vaibhav2616 2026-08-23 11:00:00
