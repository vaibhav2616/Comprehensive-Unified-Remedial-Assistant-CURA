"""
CURA Dataset Preprocessing Pipeline
======================================
Run this script when you have a new labeled dataset to ingest.

Usage:
  python training/preprocess.py --schema interaction_pair --input my_data.csv
  python training/preprocess.py --schema ner_prescription --input prescriptions.json
  python training/preprocess.py --schema community_moderation --input posts.csv

Supported input formats: CSV, JSON, JSONL

Output: JSONL files ready for model training
"""

import argparse
import json
import csv
import os
import sys
from pathlib import Path


SUPPORTED_SCHEMAS = {
    "interaction_pair": {
        "required_fields": ["drug_name", "interactant", "severity", "mechanism", "evidence_level"],
        "output_file": "data/processed/interaction_pairs_train.jsonl"
    },
    "ner_prescription": {
        "required_fields": ["text", "entities"],
        "output_file": "data/processed/ner_train.jsonl"
    },
    "symptom_draft_pair": {
        "required_fields": ["symptoms", "approved_drafts", "doctor_decision"],
        "output_file": "data/processed/draft_pairs_train.jsonl"
    },
    "community_moderation": {
        "required_fields": ["text", "label"],
        "output_file": "data/processed/moderation_train.jsonl"
    }
}


def validate_fields(record: dict, required: list, idx: int) -> bool:
    missing = [f for f in required if f not in record or not record[f]]
    if missing:
        print(f"  [SKIP] Row {idx}: Missing required fields: {missing}")
        return False
    return True


def deidentify(record: dict) -> dict:
    """
    Remove any PII fields before adding to training corpus.
    DPDP Act 2023 (India) compliance.
    """
    pii_fields = ["patient_name", "patient_id", "doctor_name", "email", "phone", "address"]
    return {k: v for k, v in record.items() if k not in pii_fields}


def load_input(path: str, schema_name: str) -> list:
    ext = Path(path).suffix.lower()
    records = []
    
    if ext == ".csv":
        with open(path, "r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            records = list(reader)
    elif ext in [".json"]:
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
            records = data if isinstance(data, list) else [data]
    elif ext == ".jsonl":
        with open(path, "r", encoding="utf-8") as f:
            records = [json.loads(line) for line in f if line.strip()]
    else:
        print(f"Unsupported format: {ext}. Use CSV, JSON, or JSONL.")
        sys.exit(1)
    
    return records


def process_dataset(schema_name: str, input_path: str):
    if schema_name not in SUPPORTED_SCHEMAS:
        print(f"Unknown schema: {schema_name}. Options: {list(SUPPORTED_SCHEMAS.keys())}")
        sys.exit(1)
    
    schema = SUPPORTED_SCHEMAS[schema_name]
    records = load_input(input_path, schema_name)
    
    print(f"\n🔬 CURA Training Pipeline")
    print(f"   Schema: {schema_name}")
    print(f"   Input: {input_path} ({len(records)} records)")
    
    os.makedirs("data/processed", exist_ok=True)
    
    processed = 0
    skipped = 0
    
    with open(schema["output_file"], "w", encoding="utf-8") as out:
        for i, record in enumerate(records):
            if not validate_fields(record, schema["required_fields"], i):
                skipped += 1
                continue
            
            clean = deidentify(record)
            clean["schema"] = schema_name
            clean["source_file"] = input_path
            
            out.write(json.dumps(clean) + "\n")
            processed += 1
    
    print(f"\n   ✅ Processed: {processed} records")
    print(f"   ⚠️  Skipped:   {skipped} records (missing required fields)")
    print(f"   📁 Output:    {schema['output_file']}")
    print(f"\n   Next step: Fine-tune model on {schema['output_file']}")
    print(f"   Model guide: See ai-backend/README.md > Upgrading AI Models")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="CURA Dataset Preprocessor")
    parser.add_argument("--schema", required=True, choices=SUPPORTED_SCHEMAS.keys())
    parser.add_argument("--input", required=True, help="Path to input CSV/JSON/JSONL file")
    args = parser.parse_args()
    
    process_dataset(args.schema, args.input)

# commit-touch: 2026-08-25 09:10:00

# commit-touch: 2026-08-29 14:30:00

# commit-touch: vaibhav2616 2026-08-25 09:10:00

# commit-touch: tusharsingh1206 2026-08-29 14:30:00

# commit-touch: vaibhav2616 2026-08-25 09:10:00

# commit-touch: tusharsingh1206 2026-08-29 14:30:00

# commit-touch: vaibhav2616 2026-08-25 09:10:00
