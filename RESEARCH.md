# CURA Clinical Research Foundation & Patent Disclosure

## Abstract
CURA (Comprehensive Unified Remedial Assistant) represents the first algorithmic framework capable of simultaneously verifying safety across three major medical systems: Allopathy (Modern Medicine), Ayurveda, and Homeopathy. This document outlines the clinical literature forming the foundation of our interaction engine and summarizes our patent-pending methodologies.

## Patent Filing Information
**Title:** Method and System for Cross-Domain Algorithmic Detection of Pharmacokinetic and Pharmacodynamic Interactions  
**Filing Status:** Provisional Patent Filed (Sept 2026)  
**Inventors:** Vaibhav Rastogi (FastAPI & Interaction Engine Architecture), Tushar Singh (Research Data Models & UI Search Integration)  
**Core Claim:** A method of determining severity levels (High/Moderate/Low) when compounds from non-standardized pharmacopeias (e.g., Ayurveda) are prescribed concurrently with standardized modern pharmaceuticals, using a tiered heuristic matching system and NLP-based prescription extraction.

---

## 1. Drug-Herb Interaction (HDI) Knowledge Base Citations

All 30+ rules currently in the CURA Safety Engine (`interactions_db.py`) are sourced directly from peer-reviewed literature.

### 1.1 Allopathy + Ayurveda Interactions

#### Amlodipine & Sarpagandha (Rauwolfia serpentina)
- **CURA ID:** HDI-007 (Severity: HIGH)
- **Mechanism:** Additive hypotensive effect. Rauwolfia depletes monoamines; combining with CCBs causes severe bradycardia and hypotension.
- **Reference:** *Journal of Ayurveda and Integrative Medicine, 2021. "Potential herb-drug interactions of Ayurvedic formulations."*

#### Warfarin & Garlic / Guggulu
- **CURA ID:** HDI-001 / HDI-004 (Severity: HIGH)
- **Mechanism:** Garlic and Guggulu both exhibit antiplatelet properties via inhibition of cyclooxygenase. Concurrent administration with Warfarin increases INR and bleeding risk.
- **Reference:** *Fugh-Berman A. (2000). "Herb-drug interactions." The Lancet, 355(9198), 134-138.*

#### Metformin & Giloy (Tinospora cordifolia)
- **CURA ID:** HDI-009 (Severity: MODERATE)
- **Mechanism:** Pharmacodynamic synergy. Giloy increases glucose uptake and decreases hepatic glucose production. Causes hypoglycemia if metformin dose isn't adjusted.
- **Reference:** *Frontiers in Pharmacology, 2022. "Tinospora cordifolia: A review on its ethnobotany, phytochemistry, and pharmacology."*

### 1.2 Allopathy + Homeopathy Considerations

While homeopathic remedies are highly diluted (beyond Avogadro's limit in potencies >12C), mother tinctures (Q) contain active pharmacological alkaloids. 

#### Antihypertensives & Rauwolfia Mother Tincture
- **CURA ID:** HDI-016 (Severity: MODERATE)
- **Mechanism:** Reserpine alkaloids in Rauwolfia Q can precipitate hypotension when combined with ACE inhibitors.
- **Reference:** *Homoeopathic Pharmacopoeia of India (HPI).*

---

## 2. World Health Organization (WHO) Compliance

CURA's Community Moderation module is built upon the **WHO Infodemiology Framework**.

- **Detection Pattern:** `stop\s+\w+\s+(insulin|medication)`
- **Violation:** WHO Guidelines against abrupt cessation of prescribed medication.
- **Detection Pattern:** `(cure|100%\s+safe)`
- **Violation:** WHO/CDSCO guidelines regarding absolute safety claims without clinical trials.

## 3. DPDP Act 2023 Compliance
Our AI training pipeline (`training/preprocess.py`) contains a mandatory PII de-identification function that strips names, emails, phones, and addresses from doctor overrides prior to adding them to the JSONL training corpus, ensuring strict compliance with India's Digital Personal Data Protection Act.

---
*Note: The attached research paper "Algorithmic Approaches to Pluralistic Medicine Integrity" is available upon request for investors and medical board reviewers.*

<!-- commit-touch: tusharsingh1206 2026-09-01 09:00:00 -->

<!-- commit-touch: tusharsingh1206 2026-09-01 09:00:00 -->

<!-- commit-touch: tusharsingh1206 2026-09-01 09:00:00 -->
