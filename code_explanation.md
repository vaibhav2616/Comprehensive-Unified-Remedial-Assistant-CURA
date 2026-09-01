# CURA System Architecture & Code Explanation

CURA operates on a decoupled microservices architecture, separating the user-facing web platform from the heavy machine learning and NLP workloads. This ensures scalability, security, and the ability to update AI models without bringing down the core application.

---

## 1. System Overview

- **Frontend / Client:** Next.js (App Router), React, Tailwind CSS
- **Primary Backend (BFF):** Node.js / Next.js Serverless API Routes
- **AI/ML Engine:** Python FastAPI microservice
- **State Management:** React Context API (`AppContext.jsx`)

---

## 2. The Communication Flow (Node.js ↔ Python FastAPI)

The core challenge of CURA was connecting the Node.js frontend securely to the Python AI engine. This is handled by **`src/lib/apiService.js`**.

### The Request Lifecycle:
1. **User Action:** A doctor uploads a prescription image on the Next.js frontend (`/prescription`).
2. **API Client Router:** The frontend calls `curaAI.extractPrescription()` in `apiService.js`.
3. **Network Request:** Based on environment variables, the request is routed from the Node.js environment to the FastAPI server running on port `8000`.
4. **Python Processing:** FastAPI (`routers/ocr.py`) receives the Base64 image, runs Tesseract OCR, parses entities (NER), and compares against the `interactions_db.py`.
5. **Response:** Python returns a structured Pydantic JSON model back to Node.js, which React renders in the UI as the Interaction Blocker Modal.

### Why this design?
By keeping Python strictly for AI, we can independently deploy Next.js (e.g., to Vercel) and the FastAPI service (e.g., to an AWS EC2 instance with GPU support for ClinicalBERT).

---

## 3. Directory Structure Breakdown

### 👨‍💻 `src/` (Next.js & Node Backend)
*Authored primarily by: @sameerpatel01 (Node) & @shubhamsoni1234 (UI)*

- **`app/api/v1/`**: The Node.js serverless routes. Handles auth, sessions, and patient record retrieval.
- **`app/`**: Next.js App Router pages (Dashboard, Doctors, Community).
- **`components/`**: Reusable React UI (Navbar, TrustBadges).
- **`context/`**: Global state (Patient vs Doctor role switching).
- **`data/`**: Mock databases for MVP state via JSON.

### 🤖 `ai-backend/` (FastAPI & ML)
*Authored primarily by: @vaibhav2616 (AI/ML) & @tusharsingh1206 (Research Data)*

- **`main.py`**: The FastAPI application entry point.
- **`routers/`**:
  - `interactions.py`: The cross-domain conflict engine.
  - `analyze.py`: Symptoms -> multi-system draft generation.
  - `ocr.py`: Translates raw text/images into medical entities.
  - `moderation.py`: Discovers WHO-violating misinformation.
  - `training.py`: Captures doctor feedback loop.
- **`data/interactions_db.py`**: The clinical rules connecting Allo/Ayur/Homeo pathways.
- **`training/`**: ML preprocessing scripts to turn doctor feedback into `.jsonl` fine-tuning datasets.

---

## 4. The Data Flywheel (Training Loop)

CURA's competitive advantage is its data moat. 

When a doctor receives an AI draft, they can **Accept**, **Edit**, or **Reject** it. 
This action triggers a webhook from `src/app/dashboard/doctor/page.js` to FastAPI's `/api/ai/train/feedback`. 
The `preprocess.py` script then formats this into Reinforcement Learning from Human Feedback (RLHF) pairs, allowing us to continuously train our future LLMs on proprietary clinical truth.

<!-- commit-touch: sameerpatel01 2026-09-01 10:30:00 -->

<!-- commit-touch: sameerpatel01 2026-09-01 10:30:00 -->

<!-- commit-touch: sameerpatel01 2026-09-01 10:30:00 -->
