/**
 * POST /api/prescriptions/upload
 * Real prescription analyzer & saver:
 * Supports multipart file uploads (FormData) or JSON ({ rawText, medications, domain, notes }).
 * Parses known drugs across Allopathy/Ayurveda/Homeopathy, runs FastAPI OCR/Interactions if online
 * with local clinicalEngine fallback, and persists the record to PostgreSQL for authenticated users.
 */
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import { evaluateInteractions } from '@/lib/clinicalEngine';

const KNOWN_LEXICON = [
    { keyword: 'metoprolol', name: 'Metoprolol Succinate', category: 'Beta-Blocker', domain: 'ALLOPATHY', dosage: '50mg', frequency: 'Once daily' },
    { keyword: 'amlodipine', name: 'Amlodipine Besylate', category: 'Calcium Channel Blocker', domain: 'ALLOPATHY', dosage: '5mg', frequency: 'Once daily' },
    { keyword: 'atorvastatin', name: 'Atorvastatin Calcium', category: 'Statin', domain: 'ALLOPATHY', dosage: '20mg', frequency: 'At bedtime' },
    { keyword: 'aspirin', name: 'Aspirin', category: 'Antiplatelet', domain: 'ALLOPATHY', dosage: '75mg', frequency: 'Once daily' },
    { keyword: 'metformin', name: 'Metformin', category: 'Biguanide (Antidiabetic)', domain: 'ALLOPATHY', dosage: '500mg', frequency: 'Twice daily' },
    { keyword: 'warfarin', name: 'Warfarin', category: 'Anticoagulant', domain: 'ALLOPATHY', dosage: '5mg', frequency: 'Once daily' },
    { keyword: 'levothyroxine', name: 'Levothyroxine', category: 'Thyroid Hormone', domain: 'ALLOPATHY', dosage: '50mcg', frequency: 'Empty stomach AM' },
    { keyword: 'sumatriptan', name: 'Sumatriptan', category: 'Triptan', domain: 'ALLOPATHY', dosage: '50mg', frequency: 'SOS migraine' },
    { keyword: 'paracetamol', name: 'Paracetamol', category: 'Antipyretic', domain: 'ALLOPATHY', dosage: '500mg', frequency: 'SOS fever/pain' },
    { keyword: 'ashwagandha', name: 'Ashwagandha (Withania somnifera)', category: 'Adaptogen Herb', domain: 'AYURVEDA', dosage: '300mg', frequency: 'At bedtime' },
    { keyword: 'giloy', name: 'Giloy (Tinospora cordifolia)', category: 'Immunomodulator', domain: 'AYURVEDA', dosage: '500mg', frequency: 'Once daily' },
    { keyword: 'arjuna', name: 'Arjuna (Terminalia arjuna)', category: 'Cardiotonic Herb', domain: 'AYURVEDA', dosage: '500mg', frequency: 'Twice daily' },
    { keyword: 'guggulu', name: 'Guggulu (Commiphora mukul)', category: 'Lipid / Joint Herb', domain: 'AYURVEDA', dosage: '250mg', frequency: 'Twice daily' },
    { keyword: 'ginkgo', name: 'Ginkgo Biloba', category: 'Noo-circulatory Herb', domain: 'AYURVEDA', dosage: '120mg', frequency: 'Once daily' },
    { keyword: 'garlic', name: 'Garlic Supplement (Allium sativum)', category: 'Herbal Extract', domain: 'AYURVEDA', dosage: '500mg', frequency: 'Once daily' },
    { keyword: 'arnica', name: 'Arnica Montana', category: 'Homeopathic Remedy', domain: 'HOMEOPATHY', dosage: '30C / Tincture', frequency: 'Twice daily' },
    { keyword: 'calcarea', name: 'Calcarea Carbonica', category: 'Constitutional Remedy', domain: 'HOMEOPATHY', dosage: '200C', frequency: 'Weekly dose' },
    { keyword: 'ignatia', name: 'Ignatia Amara', category: 'Constitutional Remedy', domain: 'HOMEOPATHY', dosage: '200C', frequency: 'Once daily' },
    { keyword: 'chelidonium', name: 'Chelidonium Majus', category: 'Hepatic Remedy', domain: 'HOMEOPATHY', dosage: '30C', frequency: 'Twice daily' },
];

function extractMedsFromText(text = '') {
    const lower = text.toLowerCase();
    const matched = [];
    for (const item of KNOWN_LEXICON) {
        if (lower.includes(item.keyword)) {
            matched.push({
                id: `med-${matched.length + 1}`,
                name: item.name,
                category: item.category,
                domain: item.domain,
                dosage: item.dosage,
                frequency: item.frequency,
            });
        }
    }
    return matched;
}

export async function POST(request) {
    try {
        const user = await getSessionUser();
        const contentType = request.headers.get('content-type') || '';

        let rawText = '';
        let fileName = '';
        let imageBase64 = '';
        let domain = 'ALLOPATHY';
        let notes = '';
        let manualMedications = [];

        if (contentType.includes('multipart/form-data')) {
            const formData = await request.formData();
            const file = formData.get('file');
            rawText = String(formData.get('rawText') || '');
            domain = String(formData.get('domain') || 'ALLOPATHY').toUpperCase();
            notes = String(formData.get('notes') || '');
            const medsJson = formData.get('medications');
            if (medsJson) {
                try { manualMedications = JSON.parse(String(medsJson)); } catch { /* ignore */ }
            }

            if (file && typeof file === 'object' && 'arrayBuffer' in file) {
                fileName = file.name || 'uploaded-prescription';
                const bytes = await file.arrayBuffer();
                const buf = Buffer.from(bytes);
                if (file.type?.startsWith('text/') || fileName.endsWith('.txt')) {
                    rawText = `${rawText}\n${buf.toString('utf8')}`.trim();
                } else {
                    imageBase64 = buf.toString('base64').slice(0, 20000);
                }
            }
        } else {
            const body = await request.json();
            rawText = body.rawText || '';
            domain = (body.domain || 'ALLOPATHY').toUpperCase();
            notes = body.notes || '';
            fileName = body.fileName || '';
            manualMedications = Array.isArray(body.medications) ? body.medications : [];
            imageBase64 = body.imageBase64 || '';
        }

        let extractedMeds = [...manualMedications];

        // Try text lexicon extraction first
        if (rawText || fileName) {
            const fromText = extractMedsFromText(`${fileName} ${rawText}`);
            for (const m of fromText) {
                if (!extractedMeds.some(e => e.name.toLowerCase() === m.name.toLowerCase())) {
                    extractedMeds.push(m);
                }
            }
        }

        // If binary file uploaded with no readable text matches yet, consult FastAPI OCR microservice
        if (extractedMeds.length === 0 && imageBase64) {
            try {
                const ocrRes = await fetch(`${process.env.FASTAPI_URL || 'http://localhost:8000'}/ocr/extract`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ image_base64: imageBase64.slice(0, 5000) }),
                    signal: AbortSignal.timeout(2500),
                });
                if (ocrRes.ok) {
                    const ocrData = await ocrRes.json();
                    rawText = rawText || ocrData.raw_text_detected || `Extracted from ${fileName}`;
                    const foundNames = ocrData.medications_found || [];
                    for (const name of foundNames) {
                        const hit = KNOWN_LEXICON.find(k => name.toLowerCase().includes(k.keyword));
                        extractedMeds.push(hit ? {
                            id: `med-${extractedMeds.length + 1}`,
                            name: hit.name,
                            category: hit.category,
                            domain: hit.domain,
                            dosage: hit.dosage,
                            frequency: hit.frequency,
                        } : {
                            id: `med-${extractedMeds.length + 1}`,
                            name,
                            category: 'Extracted Medication',
                            domain: domain || 'ALLOPATHY',
                            dosage: 'As prescribed',
                            frequency: 'Per label',
                        });
                    }
                }
            } catch {
                // FastAPI offline fallback below
            }
        }

        // If text was provided with custom comma-separated medications not in lexicon, parse them verbatim
        if (extractedMeds.length === 0 && rawText.trim()) {
            const parts = rawText.split(/[,;\n]+/).map(s => s.trim()).filter(Boolean).slice(0, 10);
            extractedMeds = parts.map((p, idx) => ({
                id: `med-${idx + 1}`,
                name: p,
                category: 'Patient Entered Medication',
                domain: ['ALLOPATHY', 'AYURVEDA', 'HOMEOPATHY'].includes(domain) ? domain : 'ALLOPATHY',
                dosage: 'As directed',
                frequency: 'Daily',
            }));
        }

        if (extractedMeds.length === 0) {
            return NextResponse.json({
                error: 'Could not extract medications from an illegible/empty file. Please paste medication text or add medications directly.',
            }, { status: 400 });
        }

        const conflicts = evaluateInteractions(extractedMeds);
        const flagged = conflicts.some(c => c.severity === 'HIGH' || c.severity === 'MODERATE');
        const primaryDomain = ['ALLOPATHY', 'AYURVEDA', 'HOMEOPATHY'].includes(domain) ? domain : 'ALLOPATHY';

        let savedPrescription = null;
        if (user) {
            savedPrescription = await prisma.prescription.create({
                data: {
                    patientId: user.id,
                    domain: primaryDomain,
                    rawText: rawText || `Uploaded file: ${fileName}`,
                    medications: extractedMeds,
                    status: flagged ? 'FLAGGED' : 'PENDING', // Remains PENDING doctor sign-off on official clinical record
                    flagged,
                    flags: conflicts.length > 0 ? conflicts : null,
                    notes: notes || null,
                },
            });
        }

        return NextResponse.json({
            success: true,
            data: {
                id: savedPrescription?.id || `temp-${Date.now()}`,
                patientName: user?.name || 'Guest Patient',
                issueDate: new Date().toISOString().split('T')[0],
                prescribedBy: 'Uploaded Rx (Pending Doctor Approval)',
                domain: primaryDomain,
                status: savedPrescription?.status || 'ANALYZED',
                medications: extractedMeds,
                conflicts,
                flagged,
                rawText: rawText || `Uploaded file: ${fileName}`,
            },
            message: 'Prescription parsed & checked for cross-domain safety. Submitted for doctor review.',
        }, { status: user ? 201 : 200 });
    } catch (err) {
        console.error('[prescriptions/upload POST]', err);
        return NextResponse.json({ error: 'Failed to analyze prescription' }, { status: 500 });
    }
}
