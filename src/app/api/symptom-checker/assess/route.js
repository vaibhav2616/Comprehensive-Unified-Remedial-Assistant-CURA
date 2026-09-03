/**
 * POST /api/symptom-checker/assess
 * Adaptive Clinical Triage & Multi-Domain Outcome Comparator backed by live PostgreSQL data.
 */
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const CONDITIONS_KB = [
    {
        id: 'migraine',
        disease: 'Migraine / Tension Headache',
        category: 'Neurological & Head Pain',
        description: 'Recurrent throbbing or tightening headache often linked to sensory triggers, screen strain, stress, or sleep imbalance.',
        keywords: ['headache', 'throbbing', 'light sensitivity', 'nausea', 'dizziness', 'screen', 'stress', 'neck stiffness'],
        bodyAreas: ['head_mind', 'unsure'],
        urgency: 'ROUTINE',
        guidance: 'Stay hydrated in a quiet dimly lit room, track trigger foods, and consult a specialist if headaches recur weekly.',
        redFlags: ['Sudden thunderclap pain', 'Weakness/numbness on one side', 'High fever with stiff neck'],
        domainNotes: {
            ALLOPATHY: 'Rapid relief within 2 hours using targeted triptans or preventive CGRP/beta-blocker protocols.',
            AYURVEDA: 'Focuses on balancing aggravated Vata-Pitta doshas using Shirodhara, Brahmi & trigger elimination.',
            HOMEOPATHY: 'Constitutional prescribing targeting recurrence frequency with minimal chemical side-effects.',
        },
        domainModifiers: { ALLOPATHY: { successBonus: 3 }, AYURVEDA: { successBonus: 1 }, HOMEOPATHY: { successBonus: -2 } },
    },
    {
        id: 'viral_fever',
        disease: 'Viral Fever / Upper Respiratory Infection',
        category: 'Infectious & Fever',
        description: 'Systemic immune response marked by elevated body temperature, fatigue, body aches, cough, or throat discomfort.',
        keywords: ['fever', 'chills', 'fatigue', 'cough', 'sore throat', 'body ache', 'weakness', 'headache'],
        bodyAreas: ['chest_breathing', 'general_fatigue', 'unsure'],
        urgency: 'MODERATE',
        guidance: 'Monitor temperature every 6 hours, maintain oral fluids/electrolytes, and seek prompt physician check if fever exceeds 102°F.',
        redFlags: ['Difficulty breathing', 'Fever above 103°F for 3+ days', 'Confusion or severe dehydration'],
        domainNotes: {
            ALLOPATHY: 'Antipyretics, targeted diagnostics (CBC), and secondary bacterial rule-out within days.',
            AYURVEDA: 'Herbal immunity rasayanas (Tulsi, Guduchi, Sitopaladi) to soothe airway inflammation.',
            HOMEOPATHY: 'Gentle acute remedies (Belladonna / Bryonia) matched to symptom onset pattern.',
        },
        domainModifiers: { ALLOPATHY: { successBonus: 5 }, AYURVEDA: { successBonus: -2 }, HOMEOPATHY: { successBonus: -4 } },
    },
    {
        id: 'ibs',
        disease: 'Irritable Bowel Syndrome (IBS) / Acid Reflux',
        category: 'Digestive & Gut Health',
        description: 'Functional digestive discomfort involving bloating, cramping, acidity, nausea, or irregular bowel habits.',
        keywords: ['stomach ache', 'bloating', 'acidity', 'nausea', 'constipation', 'loose stools', 'loss of appetite', 'cramp'],
        bodyAreas: ['stomach_gut', 'unsure'],
        urgency: 'ROUTINE',
        guidance: 'Keep a meal-symptom log, avoid spicy/late-night meals, and consider a structured gut-healing protocol.',
        redFlags: ['Unexplained weight loss', 'Blood in stool', 'Persistent severe vomiting'],
        domainNotes: {
            ALLOPATHY: 'Antispasmodics, PPI/prokinetic symptom relief, and food intolerance screening.',
            AYURVEDA: 'Strong long-term outcomes via Agni restoration, Triphala formulations, and structured dietary plans.',
            HOMEOPATHY: 'Individualized digestive remedies addressing stress-gut axis triggers.',
        },
        domainModifiers: { ALLOPATHY: { successBonus: -4 }, AYURVEDA: { successBonus: 6 }, HOMEOPATHY: { successBonus: 0 } },
    },
    {
        id: 'bronchitis',
        disease: 'Allergic Bronchitis / Respiratory Congestion',
        category: 'Chest & Airway',
        description: 'Airway hypersensitivity or inflammation producing cough, wheezing, chest tightness, or exertional breathlessness.',
        keywords: ['cough', 'shortness of breath', 'wheezing', 'chest tightness', 'phlegm', 'dust', 'fatigue'],
        bodyAreas: ['chest_breathing'],
        urgency: 'MODERATE',
        guidance: 'Avoid dust/smoke triggers and have a doctor auscultate your chest — do not ignore shortness of breath.',
        redFlags: ['Bluish lips', 'Severe shortness of breath at rest', 'Chest pain radiating to arm/jaw'],
        domainNotes: {
            ALLOPATHY: 'Bronchodilators, spirometry diagnostics, and anti-inflammatory inhalers when required.',
            AYURVEDA: 'Expectorant decoctions, Vasaka/Tulsi formulations, and Nasya respiratory cleansing.',
            HOMEOPATHY: 'Constitutional allergy desensitization reducing seasonal flare-up recurrence.',
        },
        domainModifiers: { ALLOPATHY: { successBonus: 4 }, AYURVEDA: { successBonus: 1 }, HOMEOPATHY: { successBonus: -2 } },
    },
    {
        id: 'arthritis',
        disease: 'Musculoskeletal Strain / Early Arthritis',
        category: 'Joints & Mobility',
        description: 'Localized stiffness, swelling, or aching across joints or lower back worsened by inactivity or repetitive strain.',
        keywords: ['joint pain', 'back pain', 'stiffness', 'swelling', 'muscle ache', 'fatigue'],
        bodyAreas: ['joints_body', 'unsure'],
        urgency: 'ROUTINE',
        guidance: 'Gentle range-of-motion stretching, warm compresses, and inflammatory marker bloodwork if morning stiffness lasts >30 min.',
        redFlags: ['Hot swollen red single joint with fever', 'Sudden inability to bear weight'],
        domainNotes: {
            ALLOPATHY: 'Orthopedic evaluation, targeted anti-inflammatories, vitamin D/calcium correction & physiotherapy.',
            AYURVEDA: 'Highly rated for chronic Vata joint stiffness with Shallaki, Ashwagandha & Abhyanga therapies.',
            HOMEOPATHY: 'Long-term stiffness modulation without NSAID gastric irritation.',
        },
        domainModifiers: { ALLOPATHY: { successBonus: 0 }, AYURVEDA: { successBonus: 5 }, HOMEOPATHY: { successBonus: -1 } },
    },
    {
        id: 'anxiety_sleep',
        disease: 'Stress Overload / Anxiety & Sleep Disturbance',
        category: 'Mind, Mood & Energy',
        description: 'Overwhelmed nervous system causing poor sleep, brain fog, palpitations, dizziness, restlessness, or unrefreshing fatigue.',
        keywords: ['insomnia', 'fatigue', 'dizziness', 'heart racing', 'overwhelmed', 'confused', 'restless', 'headache'],
        bodyAreas: ['head_mind', 'general_fatigue', 'unsure'],
        urgency: 'ROUTINE',
        guidance: 'You are not alone — confusing physical fatigue and restlessness often signal stress overload. Guided clinician support helps clarity.',
        redFlags: ['Fainting spells', 'Chest pressure with sweating', 'Thoughts of self-harm'],
        domainNotes: {
            ALLOPATHY: 'Cognitive behavioral guidance, sleep hygiene protocols & targeted thyroid/anemia screening.',
            AYURVEDA: 'Adaptogenic herbs (Brahmi, Jatamansi), circadian routine alignment, and Shirodhara calming.',
            HOMEOPATHY: 'Gentle nervous-system constitution remedies widely chosen for sleep and emotional sensitivity.',
        },
        domainModifiers: { ALLOPATHY: { successBonus: -1 }, AYURVEDA: { successBonus: 4 }, HOMEOPATHY: { successBonus: 3 } },
    },
    {
        id: 'skin_allergy',
        disease: 'Allergic Dermatitis / Urticaria',
        category: 'Skin & Allergy',
        description: 'Itchy skin rash, redness, hives, or flare-ups triggered by weather, foods, cosmetics, or immune sensitivity.',
        keywords: ['rash', 'itching', 'redness', 'hives', 'skin', 'allergy'],
        bodyAreas: ['skin_allergy'],
        urgency: 'ROUTINE',
        guidance: 'Avoid new soaps/fragrances, keep skin cool & moisturized, and track food or contact triggers.',
        redFlags: ['Swelling of lips/tongue', 'Difficulty swallowing/breathing (seek urgent care)'],
        domainNotes: {
            ALLOPATHY: 'Rapid antihistamines, patch allergy testing & targeted topical stabilization.',
            AYURVEDA: 'Blood-purifying herbs (Neem, Manjistha) and Pitta-cooling dietary adjustments.',
            HOMEOPATHY: 'Popular non-steroidal long-term eczema/urticaria management.',
        },
        domainModifiers: { ALLOPATHY: { successBonus: 2 }, AYURVEDA: { successBonus: 1 }, HOMEOPATHY: { successBonus: 3 } },
    },
];

export async function POST(req) {
    try {
        const body = await req.json();
        const {
            feelingClarity = 'clear', // 'clear' | 'confused'
            bodyArea = 'unsure',
            symptoms = [],
            duration = '1-3 days',
            severity = 'moderate',
            emotionalState = '',
        } = body;

        const lowerTokens = [
            ...symptoms.map(s => s.toLowerCase()),
            ...(emotionalState ? [emotionalState.toLowerCase()] : []),
        ];

        // Score every candidate condition
        const scored = CONDITIONS_KB.map(cond => {
            let score = 0;
            const matchedSymptoms = [];

            for (const kw of cond.keywords) {
                if (lowerTokens.some(t => t.includes(kw) || kw.includes(t))) {
                    score += 22;
                    matchedSymptoms.push(kw);
                }
            }

            if (cond.bodyAreas.includes(bodyArea)) score += 18;
            if (feelingClarity === 'confused' && cond.id === 'anxiety_sleep') score += 10;
            if (duration === 'Chronic (Months)' && ['migraine', 'ibs', 'arthritis', 'anxiety_sleep', 'skin_allergy'].includes(cond.id)) score += 8;
            if (duration === 'Less than 24 hours' && ['viral_fever', 'migraine', 'bronchitis'].includes(cond.id)) score += 8;
            if (severity === 'severe') score += 5;

            return { ...cond, rawScore: score, matchedSymptoms };
        })
            .sort((a, b) => b.rawScore - a.rawScore);

        const topMatches = scored.slice(0, 3).map((m, idx) => {
            const confidence = Math.min(94, Math.max(54, 48 + Math.round(m.rawScore * 0.7) - idx * 8));
            return {
                id: m.id,
                disease: m.disease,
                category: m.category,
                confidence,
                description: m.description,
                matchedSymptoms: m.matchedSymptoms,
                urgency: severity === 'severe' && idx === 0 ? 'PRIORITY' : m.urgency,
                guidance: m.guidance,
                redFlags: m.redFlags,
                domainNotes: m.domainNotes,
                domainModifiers: m.domainModifiers,
            };
        });

        const primary = topMatches[0];

        // Fetch live domain stats & real patient reviews from Postgres
        const [doctors, reviews, appointments] = await Promise.all([
            prisma.doctor.findMany({ where: { isAvailable: true } }),
            prisma.doctorReview.findMany({
                orderBy: { createdAt: 'desc' },
                include: { author: { select: { name: true } }, doctor: { select: { name: true } } },
            }),
            prisma.appointment.findMany({ where: { status: { not: 'CANCELLED' } }, select: { domain: true } }),
        ]);

        const totalRevGlobal = doctors.reduce((s, d) => s + (d.totalReviews || 0), 0) || 1;
        const totalApptsGlobal = appointments.length;

        const domains = ['ALLOPATHY', 'AYURVEDA', 'HOMEOPATHY'].map(domKey => {
            const domDocs = doctors.filter(d => d.domains.includes(domKey));
            const domReviews = reviews.filter(r => r.domain === domKey);
            const matchingSpecialistCount = domDocs.filter(d =>
                d.specialization.some(sp =>
                    primary.category.toLowerCase().includes(sp.toLowerCase()) ||
                    primary.id.includes(sp.toLowerCase()) ||
                    primary.disease.toLowerCase().includes(sp.toLowerCase())
                )
            ).length || domDocs.length;

            const baseSuccess = domDocs.length > 0
                ? Math.round(domDocs.reduce((s, d) => s + (d.successRate || 82), 0) / domDocs.length)
                : 82;
            const mod = primary.domainModifiers?.[domKey]?.successBonus || 0;

            const avgFee = domDocs.length > 0
                ? Math.round(domDocs.reduce((s, d) => s + d.consultFee, 0) / domDocs.length)
                : 600;
            const avgMed = domDocs.length > 0
                ? Math.round(domDocs.reduce((s, d) => s + (d.avgMedicineCost || 400), 0) / domDocs.length)
                : 450;
            const avgRating = domDocs.length > 0
                ? Number((domDocs.reduce((s, d) => s + (d.avgRating || 4.5), 0) / domDocs.length).toFixed(1))
                : 4.5;
            const totalReviews = domDocs.reduce((s, d) => s + (d.totalReviews || 0), 0);
            const domainAppts = appointments.filter(a => a.domain === domKey).length;
            const popularityPct = Math.max(18, Math.round(((totalReviews / totalRevGlobal) * 0.7 + (totalApptsGlobal > 0 ? (domainAppts / totalApptsGlobal) * 0.3 : 0.1)) * 100));
            const avgDays = domDocs.length > 0
                ? Math.round(domDocs.reduce((s, d) => s + (d.avgRecoveryDays || 14), 0) / domDocs.length)
                : 14;

            return {
                key: domKey,
                name: domKey === 'ALLOPATHY' ? 'Allopathy' : domKey === 'AYURVEDA' ? 'Ayurveda' : 'Homeopathy',
                successRate: `${Math.min(97, Math.max(68, baseSuccess + mod))}%`,
                popularityPct: `${popularityPct}%`,
                avgFees: `₹${avgFee}`,
                avgMedicineCost: `₹${avgMed}`,
                rating: avgRating,
                reviewsCount: totalReviews,
                availableDoctors: matchingSpecialistCount,
                recoveryTimeline: avgDays <= 10 ? `${avgDays} days (Acute Relief)` : avgDays <= 35 ? `${Math.round(avgDays / 7)} weeks` : `${Math.round(avgDays / 30)}–${Math.ceil(avgDays / 30) + 1} months`,
                approachNote: primary.domainNotes[domKey],
                patientExperiences: domReviews.slice(0, 3).map(r => ({
                    id: r.id,
                    author: r.author?.name || 'Patient',
                    doctorName: r.doctor?.name || 'Doctor',
                    rating: r.rating,
                    title: r.title,
                    body: r.body,
                    disease: r.disease,
                    recoveryDays: r.recoveryDays,
                })),
                doctorsLink: `/doctors?domain=${domKey}&disease=${encodeURIComponent(primary.id)}`,
            };
        });

        return NextResponse.json({
            success: true,
            assessment: {
                feelingClarity,
                primaryMatch: primary,
                possibleConditions: topMatches,
                domains,
                recommendedAction: severity === 'severe'
                    ? 'Because your discomfort feels severe, consider booking a same-day Allopathy or Primary Care consultation first.'
                    : 'Explore all three medical approaches below — compare real patient reviews, recovery speed, fees, and success rates before choosing your doctor.',
            },
        });
    } catch (err) {
        console.error('[POST /api/symptom-checker/assess]', err);
        return NextResponse.json({ error: 'Failed to analyze symptoms' }, { status: 500 });
    }
}
