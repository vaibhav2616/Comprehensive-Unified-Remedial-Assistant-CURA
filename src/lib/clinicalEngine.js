/**
 * Shared Clinical Intelligence Engine for CURA
 * Centralizes cross-domain drug/herb interaction rules & symptom assessment weights
 * to avoid duplication between frontend and API routes.
 */

export const CLINICAL_INTERACTIONS = [
    {
        id: 'int-1',
        medication: 'Metoprolol',
        medicationDomain: 'ALLOPATHY',
        conflictDomain: 'AYURVEDA',
        conflictSubstance: 'Ashwagandha (Withania somnifera)',
        severity: 'HIGH',
        description: 'Beta-blockers combined with concentrated Ashwagandha may potentiate hypotensive and sedative effects, risking symptomatic bradycardia or low blood pressure.',
        recommendation: 'Monitor resting heart rate and BP closely; avoid initiating Ashwagandha without cardiologist approval.',
    },
    {
        id: 'int-2',
        medication: 'Metoprolol',
        medicationDomain: 'ALLOPATHY',
        conflictDomain: 'AYURVEDA',
        conflictSubstance: 'Arjuna (Terminalia arjuna)',
        severity: 'MODERATE',
        description: 'Arjuna bark contains cardioactive compounds that may amplify beta-blocker bradycardia.',
        recommendation: 'Requires periodic ECG and pulse monitoring before co-administration.',
    },
    {
        id: 'int-3',
        medication: 'Amlodipine',
        medicationDomain: 'ALLOPATHY',
        conflictDomain: 'AYURVEDA',
        conflictSubstance: 'Sarpagandha (Rauwolfia serpentina)',
        severity: 'HIGH',
        description: 'Rauwolfia alkaloids alongside calcium channel blockers can trigger precipitous hypotension and central nervous system depression.',
        recommendation: 'Contraindicated without specialist titration.',
    },
    {
        id: 'int-4',
        medication: 'Metformin',
        medicationDomain: 'ALLOPATHY',
        conflictDomain: 'AYURVEDA',
        conflictSubstance: 'Ashwagandha / Giloy / Gudmar',
        severity: 'MODERATE',
        description: 'Hypoglycemic herbs like Ashwagandha, Giloy, and Gymnema (Gudmar) can additively lower blood sugar alongside Metformin, increasing hypoglycemia risk.',
        recommendation: 'Track fasting and post-prandial glucose; doctor may adjust Metformin dosage.',
    },
    {
        id: 'int-5',
        medication: 'Aspirin',
        medicationDomain: 'ALLOPATHY',
        conflictDomain: 'AYURVEDA',
        conflictSubstance: 'Ginkgo Biloba / Guggulu / Garlic Extract',
        severity: 'HIGH',
        description: 'Concurrent antiplatelet herbs with Aspirin significantly elevate gastrointestinal and systemic bleeding risk.',
        recommendation: 'Avoid concurrent high-dose herbal extracts; pause at least 7 days before procedures.',
    },
    {
        id: 'int-6',
        medication: 'Aspirin',
        medicationDomain: 'ALLOPATHY',
        conflictDomain: 'HOMEOPATHY',
        conflictSubstance: 'Arnica Montana (Mother Tincture)',
        severity: 'MODERATE',
        description: 'Non-potentized Arnica tinctures carry anti-coagulant properties that compound Aspirin bleeding risk.',
        recommendation: 'Prefer ultra-diluted potencies only under doctor sign-off.',
    },
    {
        id: 'int-7',
        medication: 'Warfarin',
        medicationDomain: 'ALLOPATHY',
        conflictDomain: 'AYURVEDA',
        conflictSubstance: 'Garlic / Turmeric Concentrate / Ginkgo',
        severity: 'HIGH',
        description: 'Potentizes anticoagulant activity and disrupts INR stability, carrying severe hemorrhage risk.',
        recommendation: 'Strictly contraindicated unless monitored with weekly INR.',
    },
    {
        id: 'int-8',
        medication: 'Atorvastatin',
        medicationDomain: 'ALLOPATHY',
        conflictDomain: 'HOMEOPATHY',
        conflictSubstance: 'Chelidonium Majus',
        severity: 'LOW',
        description: 'Chelidonium targets hepatic metabolism and may mildly affect statin clearance.',
        recommendation: 'Check baseline LFTs if taken long term.',
    },
    {
        id: 'int-9',
        medication: 'Levothyroxine',
        medicationDomain: 'ALLOPATHY',
        conflictDomain: 'HOMEOPATHY',
        conflictSubstance: 'Calcarea Carbonica / Ashwagandha',
        severity: 'MODERATE',
        description: 'Ashwagandha may stimulate endogenous T4/T3 conversion, while some minerals impair Levothyroxine absorption.',
        recommendation: 'Maintain a strict 4-hour spacing and monitor TSH levels after 6 weeks.',
    },
    {
        id: 'int-10',
        medication: 'Sumatriptan',
        medicationDomain: 'ALLOPATHY',
        conflictDomain: 'AYURVEDA',
        conflictSubstance: 'Brahmi / St. John’s Wort',
        severity: 'MODERATE',
        description: 'Serotonergic herbal compounds taken alongside triptans may heighten migraine aura reactivity.',
        recommendation: 'Consult your neurologist before combining preventive herbs with acute triptans.',
    },
];

/**
 * Evaluate conflicts across medications list and optional target domain.
 */
export function evaluateInteractions(medications = [], targetDomain = null) {
    const normalizedMeds = medications.map(m =>
        typeof m === 'string'
            ? { name: m, domain: 'ALLOPATHY' }
            : { name: m.name || '', domain: (m.domain || 'ALLOPATHY').toUpperCase() }
    );

    const conflicts = [];

    for (const rule of CLINICAL_INTERACTIONS) {
        const medKey = rule.medication.toLowerCase();
        const subParts = rule.conflictSubstance
            .toLowerCase()
            .replace(/\(.*?\)/g, '')
            .split('/')
            .map(s => s.trim())
            .filter(Boolean);

        const matchedPrimary = normalizedMeds.find(m => m.name.toLowerCase().includes(medKey));
        if (!matchedPrimary) continue;

        // Match either an explicit conflicting med in the list OR a consultation targetDomain clash
        const matchedSecondary = normalizedMeds.find(m =>
            subParts.some(part => m.name.toLowerCase().includes(part))
        );

        if (matchedSecondary || (targetDomain && rule.conflictDomain === targetDomain.toUpperCase() && matchedPrimary.domain !== targetDomain.toUpperCase())) {
            conflicts.push({
                ...rule,
                matchedMedication: matchedPrimary.name,
                matchedWith: matchedSecondary ? matchedSecondary.name : rule.conflictSubstance,
            });
        }
    }

    return conflicts;
}

/**
 * Rule-based keyword safety screen fallback for community posts
 */
export function moderateCommunityText(title = '', content = '') {
    const combined = `${title} ${content}`.toLowerCase();
    const dangerPatterns = [
        { pattern: /stop taking.*(insulin|metformin|bp|blood pressure|medication|pills)/i, reason: 'Advises discontinuing prescribed chronic medication without physician oversight.' },
        { pattern: /throw away.*(medicine|pills|insulin|inhaler)/i, reason: 'Encourages discarding prescribed therapy.' },
        { pattern: /(cure|cures|cured)\s+(cancer|diabetes|heart failure)\s+(completely|100%|overnight|guaranteed)/i, reason: 'Contains unverified absolute cure claims.' },
        { pattern: /don'?t listen to doctors|doctors lie/i, reason: 'Discourages licensed medical care.' },
        { pattern: /drink bleach|miracle mineral/i, reason: 'Recommends toxic or harmful substance.' },
        { pattern: /replace.*(prescription|insulin|beta-blocker).*with/i, reason: 'Promotes unverified substitution of critical medication.' },
    ];

    const hits = dangerPatterns.filter(p => p.pattern.test(combined));
    if (hits.length > 0) {
        return {
            status: 'FLAGGED',
            modNote: hits.map(h => h.reason).join(' '),
        };
    }
    return {
        status: 'APPROVED',
        modNote: null,
    };
}
