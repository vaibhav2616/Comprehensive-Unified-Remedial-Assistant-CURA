FROM python:3.11-slim

WORKDIR /app

# Install system dependencies for Tesseract OCR
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    tesseract-ocr-eng \
    libgl1-mesa-glx \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Download spaCy model
RUN python -m spacy download en_core_web_sm

# Copy application
COPY . .

# Create data directories
RUN mkdir -p data

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]

<!-- commit-touch: 2026-08-25 12:00:00 -->

<!-- commit-touch: vaibhav2616 2026-08-25 12:00:00 -->

<!-- commit-touch: vaibhav2616 2026-08-25 12:00:00 -->

<!-- commit-touch: vaibhav2616 2026-08-25 12:00:00 -->
