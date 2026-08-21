# CURA AI Backend

Python FastAPI microservice powering the CURA clinical AI engine.

## Quick Start

```bash
cd ai-backend
python -m venv venv

# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Visit **http://localhost:8000/docs** for auto-generated interactive API docs.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/ai/ocr-extract` | Extract medications from prescription image/text |
| POST | `/api/ai/multi-system-draft` | Generate Allo/Ayur/Homeo treatment drafts |
| POST | `/api/ai/conflict-check` | Cross-domain drug safety check |
| GET | `/api/ai/drug-search?query=` | Search interaction knowledge base |
| POST | `/api/ai/community-moderate` | Moderate health community posts |
| POST | `/api/ai/train/feedback` | Submit doctor feedback (training data) |
| GET | `/api/ai/train/dataset-schema` | Get dataset format for model training |

## Architecture

```
ai-backend/
├── main.py               # FastAPI app + CORS + router registration
├── requirements.txt
├── Dockerfile
├── models/
│   └── schemas.py        # Pydantic request/response models
├── routers/
│   ├── ocr.py            # OCR + NER → structured medications
│   ├── analyze.py        # Multi-system prescription drafting
│   ├── interactions.py   # Cross-domain safety engine
│   ├── moderation.py     # Community post moderation
│   └── training.py       # Doctor feedback + dataset schema
├── data/
│   ├── interactions_db.py  # 30+ research-backed interaction rules
│   └── training_feedback.jsonl  # Doctor feedback log (grows over time)
└── training/
    ├── dataset_schema.json
    └── preprocess.py
```

## Upgrading AI Models

When datasets are provided, replace stubs with:

1. **OCR/NER**: Fine-tune `ClinicalBERT` or `BioBERT` on prescription NER dataset
2. **Interaction Safety**: Train `XGBoost` classifier on CURA interaction pairs
3. **Multi-System Drafting**: Fine-tune `MedPaLM 2` or `ClinicalT5` on approved prescriptions
4. **Community Moderation**: Fine-tune `BERT` on labeled medical misinformation corpus

## Research Foundation

- Drug-herb interactions: NIH PMID 12728112, Frontiers in Pharmacology 2021
- NER: BioBERT (Lee et al., 2020), ClinicalBERT (Alsentzer et al., 2019)
- Community Moderation: WHO Global Advisory on Health Misinformation

<!-- commit-touch: 2026-08-21 17:00:00 -->

<!-- commit-touch: 2026-08-27 16:30:00 -->

<!-- commit-touch: 2026-09-01 12:00:00 -->

<!-- commit-touch: vaibhav2616 2026-08-21 17:00:00 -->

<!-- commit-touch: vaibhav2616 2026-08-27 16:30:00 -->

<!-- commit-touch: vaibhav2616 2026-09-01 12:00:00 -->

<!-- commit-touch: vaibhav2616 2026-08-21 17:00:00 -->

<!-- commit-touch: vaibhav2616 2026-08-27 16:30:00 -->

<!-- commit-touch: vaibhav2616 2026-09-01 12:00:00 -->

<!-- commit-touch: vaibhav2616 2026-08-21 17:00:00 -->
