/**
 * CURA API Service
 * ================
 * Centralized API client that routes requests:
 *  - AI operations → Python FastAPI (port 8000)
 *  - Auth/Data operations → Next.js API routes (same origin)
 *
 * Toggle between mock data and live backend via environment variable:
 *   NEXT_PUBLIC_USE_MOCK_AI=true → Uses mock data (development)
 *   NEXT_PUBLIC_AI_BACKEND_URL=http://localhost:8000 → FastAPI backend
 */

const AI_BASE = process.env.NEXT_PUBLIC_AI_BACKEND_URL || 'http://localhost:8000';
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_AI === 'true';

async function aiPost(path, body) {
    if (USE_MOCK) {
        console.warn(`[CURA] Mock mode enabled. Skipping real API call to ${path}`);
        return { success: true, mock: true };
    }
    const res = await fetch(`${AI_BASE}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'AI service error');
    }
    return res.json();
}

async function aiGet(path) {
    const res = await fetch(`${AI_BASE}${path}`);
    if (!res.ok) throw new Error('AI service error');
    return res.json();
}

// ─── Exported API Methods ──────────────────────────────────────────────────

export const curaAI = {
    /**
     * Extract medications from a prescription image or text.
     * @param {string} patientId
     * @param {string} imageBase64 - base64 encoded image
     * @param {string} textFallback - plain text if no image
     */
    extractPrescription: (patientId, imageBase64, textFallback) =>
        aiPost('/api/ai/ocr-extract', {
            patient_id: patientId,
            image_base64: imageBase64,
            text_fallback: textFallback,
            consent: true,
        }),

    /**
     * Generate multi-system treatment drafts for a patient.
     * @param {string} patientId
     * @param {string[]} symptoms
     * @param {object[]} currentMedications
     */
    generateDrafts: (patientId, symptoms, currentMedications = []) =>
        aiPost('/api/ai/multi-system-draft', {
            patient_id: patientId,
            current_symptoms: symptoms,
            current_medications: currentMedications,
        }),

    /**
     * Cross-domain interaction safety check.
     * @param {string} patientId
     * @param {object[]} medications - array of {name, domain, dosage}
     */
    checkConflicts: (patientId, medications) =>
        aiPost('/api/ai/conflict-check', { patient_id: patientId, medications }),

    /**
     * Moderate a community health post.
     * @param {string} postText
     * @param {string} authorRole - patient|doctor|verified_practitioner
     */
    moderatePost: (postText, authorRole = 'patient') =>
        aiPost('/api/ai/community-moderate', { post_text: postText, author_role: authorRole }),

    /**
     * Search the clinical interaction knowledge base.
     * @param {string} query - drug/herb name
     */
    searchDrugs: (query) =>
        aiGet(`/api/ai/drug-search?query=${encodeURIComponent(query)}`),

    /**
     * Submit doctor feedback on an AI draft (training loop).
     * @param {string} doctorId
     * @param {string} draftId
     * @param {'accept'|'edit'|'reject'} decision
     * @param {object} overrides - what the doctor changed
     * @param {string} rejectionReason
     */
    submitFeedback: (doctorId, draftId, decision, overrides, rejectionReason) =>
        aiPost('/api/ai/train/feedback', {
            doctor_id: doctorId,
            draft_id: draftId,
            decision,
            overrides,
            rejection_reason: rejectionReason,
        }),

    /**
     * Get the dataset schema for future training.
     */
    getDatasetSchema: () =>
        aiGet('/api/ai/train/dataset-schema'),
};

// commit-touch: 2026-08-25 15:30:00

// commit-touch: sameerpatel01 2026-08-25 15:30:00

// commit-touch: sameerpatel01 2026-08-25 15:30:00

// commit-touch: sameerpatel01 2026-08-25 15:30:00
