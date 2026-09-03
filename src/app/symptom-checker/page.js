'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Activity, ArrowRight, Brain, CheckCircle2, Stethoscope, AlertTriangle, ArrowLeft, MessageSquareQuote, Sparkles } from 'lucide-react';

// Comprehensive symptom → disease mapping
const SYMPTOM_DISEASE_MAP = [
    {
        disease: 'Chronic Fatigue & General Malaise',
        confidence: '84%',
        description: 'Persistent physical and mental exhaustion, brain fog, and low vital energy that does not improve with standard rest.',
        symptoms: ['Feeling Unsure / Confused', 'General Malaise / Uneasy', 'Brain Fog / Lethargy', 'Fatigue', 'Insomnia'],
        minMatch: 1,
        mustHave: [],
        domains: [
            { name: 'Allopathy', successRate: '83%', avgFees: '₹900', rating: 4.6, reviews: 1420, recoveryTimeline: '2-6 months', description: 'Comprehensive blood panels (thyroid, vitamin D/B12, ferritin) and targeted pharmacological therapy.', sampleReview: 'Comprehensive blood work identified Vitamin D deficiency immediately. Felt energized within a month.', style: { bg: 'rgba(59, 130, 246, 0.12)', color: '#3B82F6', border: 'rgba(59, 130, 246, 0.3)' }, link: '/doctors?domain=ALLOPATHY&condition=fatigue' },
            { name: 'Ayurveda', successRate: '89%', avgFees: '₹650', rating: 4.8, reviews: 1680, recoveryTimeline: '1-3 months', description: 'Restores Ojas (vital energy) through Rasayana herbs (Ashwagandha, Shatavari) and dosha rebalancing.', sampleReview: 'Ashwagandha and Dinacharya routine completely lifted my chronic brain fog and fatigue.', style: { bg: 'rgba(16, 185, 129, 0.12)', color: '#10B981', border: 'rgba(16, 185, 129, 0.3)' }, link: '/doctors?domain=AYURVEDA&condition=fatigue' },
            { name: 'Homeopathy', successRate: '79%', avgFees: '₹400', rating: 4.3, reviews: 750, recoveryTimeline: '3-6 months', description: 'Kali Phos and Gelsemium constitutional prescriptions tailored to nervous exhaustion.', sampleReview: 'Gentle, continuous improvement in daily stamina without any pharmaceutical side-effects.', style: { bg: 'rgba(168, 85, 247, 0.12)', color: '#A855F7', border: 'rgba(168, 85, 247, 0.3)' }, link: '/doctors?domain=HOMEOPATHY&condition=fatigue' },
        ],
    },
    {
        disease: 'Migraine / Tension Headache',
        confidence: '88%',
        description: 'A neurological condition characterized by intense recurring headaches, often with sensitivity to light and sound.',
        symptoms: ['Headache', 'Nausea', 'Dizziness', 'Insomnia'],
        minMatch: 1,
        mustHave: ['Headache'],
        domains: [
            { name: 'Allopathy', successRate: '92%', avgFees: '₹800', rating: 4.8, reviews: 1250, recoveryTimeline: '2-4 hours (Acute)', description: 'Fast-acting triptans and NSAIDs. Best for immediate severe pain management.', sampleReview: 'Prescribed Sumatriptan for migraine attacks; relieved headache in 2 hours flat.', style: { bg: 'rgba(59, 130, 246, 0.12)', color: '#3B82F6', border: 'rgba(59, 130, 246, 0.3)' }, link: '/doctors?domain=ALLOPATHY&condition=migraine' },
            { name: 'Ayurveda', successRate: '86%', avgFees: '₹500', rating: 4.6, reviews: 840, recoveryTimeline: '3-6 months (Root Cause)', description: 'Balances Vata and Pitta doshas. Reduces long-term frequency organically.', sampleReview: 'Shirodhara and herbal nasal drops reduced my frequency from weekly to once a month.', style: { bg: 'rgba(16, 185, 129, 0.12)', color: '#10B981', border: 'rgba(16, 185, 129, 0.3)' }, link: '/doctors?domain=AYURVEDA&condition=migraine' },
            { name: 'Homeopathy', successRate: '78%', avgFees: '₹400', rating: 4.2, reviews: 560, recoveryTimeline: '6-12 months', description: 'Individualized micro-doses. Preferred for zero chemical side-effects.', sampleReview: 'Belladonna micro-dilutions calmed throbbing headaches without any drowsiness.', style: { bg: 'rgba(168, 85, 247, 0.12)', color: '#A855F7', border: 'rgba(168, 85, 247, 0.3)' }, link: '/doctors?domain=HOMEOPATHY&condition=migraine' },
        ],
    },
    {
        disease: 'Influenza / Viral Fever',
        confidence: '85%',
        description: 'A common viral infection causing systemic inflammation with fever, body aches, and respiratory symptoms.',
        symptoms: ['Fever', 'Fatigue', 'Cough', 'Headache', 'Joint Pain'],
        minMatch: 2,
        mustHave: ['Fever'],
        domains: [
            { name: 'Allopathy', successRate: '94%', avgFees: '₹600', rating: 4.7, reviews: 2100, recoveryTimeline: '5-7 days', description: 'Antivirals, antipyretics and supportive therapy for rapid relief.', sampleReview: 'Paracetamol and hydration regimen broke the high fever within 36 hours.', style: { bg: 'rgba(59, 130, 246, 0.12)', color: '#3B82F6', border: 'rgba(59, 130, 246, 0.3)' }, link: '/doctors?domain=ALLOPATHY&condition=viral-fever' },
            { name: 'Ayurveda', successRate: '82%', avgFees: '₹400', rating: 4.4, reviews: 680, recoveryTimeline: '7-10 days', description: 'Herbal decoctions and immunity-boosting Rasayanas to fight the infection.', sampleReview: 'Giloy and Sudarshan Vati helped rebuild my platelet count and energy.', style: { bg: 'rgba(16, 185, 129, 0.12)', color: '#10B981', border: 'rgba(16, 185, 129, 0.3)' }, link: '/doctors?domain=AYURVEDA&condition=viral-fever' },
            { name: 'Homeopathy', successRate: '74%', avgFees: '₹350', rating: 4.0, reviews: 420, recoveryTimeline: '7-14 days', description: 'Individualized constitutional remedies to support immune response.', sampleReview: 'Aconite remedy at first chill kept symptoms mild and manageable.', style: { bg: 'rgba(168, 85, 247, 0.12)', color: '#A855F7', border: 'rgba(168, 85, 247, 0.3)' }, link: '/doctors?domain=HOMEOPATHY&condition=viral-fever' },
        ],
    },
    {
        disease: 'Irritable Bowel Syndrome (IBS)',
        confidence: '82%',
        description: 'A common digestive disorder causing abdominal discomfort, bloating, nausea, and irregular bowel patterns.',
        symptoms: ['Stomach Ache', 'Nausea', 'Fatigue'],
        minMatch: 1,
        mustHave: ['Stomach Ache'],
        domains: [
            { name: 'Allopathy', successRate: '80%', avgFees: '₹900', rating: 4.5, reviews: 980, recoveryTimeline: 'Managed (Chronic)', description: 'Antispasmodics, dietary counselling, and probiotics for symptom control.', sampleReview: 'Targeted probiotics helped soothe gut cramping during work stress.', style: { bg: 'rgba(59, 130, 246, 0.12)', color: '#3B82F6', border: 'rgba(59, 130, 246, 0.3)' }, link: '/doctors?domain=ALLOPATHY&condition=ibs' },
            { name: 'Ayurveda', successRate: '88%', avgFees: '₹600', rating: 4.7, reviews: 1120, recoveryTimeline: '3-6 months', description: 'Triphala, Panchkarma detox, and diet-based Agni correction for long-term relief.', sampleReview: 'Takra and Bilva churna resolved 4 years of chronic morning distress.', style: { bg: 'rgba(16, 185, 129, 0.12)', color: '#10B981', border: 'rgba(16, 185, 129, 0.3)' }, link: '/doctors?domain=AYURVEDA&condition=ibs' },
            { name: 'Homeopathy', successRate: '79%', avgFees: '₹350', rating: 4.3, reviews: 490, recoveryTimeline: '2-4 months', description: 'Nux vomica and other remedies based on individual symptom pattern.', sampleReview: 'Nux Vomica eliminated acid reflux and gastric tension completely.', style: { bg: 'rgba(168, 85, 247, 0.12)', color: '#A855F7', border: 'rgba(168, 85, 247, 0.3)' }, link: '/doctors?domain=HOMEOPATHY&condition=ibs' },
        ],
    },
    {
        disease: 'Arthritis / Musculoskeletal Pain',
        confidence: '81%',
        description: 'Inflammation of joints or muscles causing chronic pain, stiffness, and reduced range of motion.',
        symptoms: ['Joint Pain', 'Fatigue', 'Dizziness'],
        minMatch: 1,
        mustHave: ['Joint Pain'],
        domains: [
            { name: 'Allopathy', successRate: '85%', avgFees: '₹1000', rating: 4.5, reviews: 1680, recoveryTimeline: 'Managed (Chronic)', description: 'NSAIDs, DMARDs, and physiotherapy for pain and inflammation management.', sampleReview: 'Physiotherapy protocol alongside mild anti-inflammatories restored my knee mobility.', style: { bg: 'rgba(59, 130, 246, 0.12)', color: '#3B82F6', border: 'rgba(59, 130, 246, 0.3)' }, link: '/doctors?domain=ALLOPATHY&condition=arthritis' },
            { name: 'Ayurveda', successRate: '87%', avgFees: '₹700', rating: 4.8, reviews: 1340, recoveryTimeline: '3-9 months', description: 'Ashwagandha, Shallaki, and Panchkarma for joint rejuvenation. Highly effective for Vata disorders.', sampleReview: 'Shallaki capsules and warm sesame oil massage relieved morning joint stiffness.', style: { bg: 'rgba(16, 185, 129, 0.12)', color: '#10B981', border: 'rgba(16, 185, 129, 0.3)' }, link: '/doctors?domain=AYURVEDA&condition=arthritis' },
            { name: 'Homeopathy', successRate: '76%', avgFees: '₹450', rating: 4.2, reviews: 620, recoveryTimeline: '4-8 months', description: 'Rhus tox, Arnica, and Calcarea based on constitutional assessment.', sampleReview: 'Rhus Tox pellets helped dramatically with stiffness after cold weather.', style: { bg: 'rgba(168, 85, 247, 0.12)', color: '#A855F7', border: 'rgba(168, 85, 247, 0.3)' }, link: '/doctors?domain=HOMEOPATHY&condition=arthritis' },
        ],
    },
];

const DEFAULT_RESULT = {
    disease: 'General Health Assessment Needed',
    confidence: '65%',
    description: 'Your symptom pattern is non-specific. A general consultation with a primary physician is recommended for a thorough assessment.',
    domains: SYMPTOM_DISEASE_MAP[0].domains,
};

function diagnose(symptoms, duration) {
    let bestMatch = null;
    let bestScore = -1;

    for (const entry of SYMPTOM_DISEASE_MAP) {
        const hasMusthave = !entry.mustHave || entry.mustHave.every(s => symptoms.includes(s));
        if (!hasMusthave) continue;

        const matchCount = entry.symptoms.filter(s => symptoms.includes(s)).length;
        if (matchCount < entry.minMatch) continue;

        const score = matchCount / entry.symptoms.length;
        if (score > bestScore) {
            bestScore = score;
            bestMatch = entry;
        }
    }

    if (bestMatch) {
        let confidence = parseInt(bestMatch.confidence);
        if (duration === 'Less than 24 hours') confidence = Math.max(confidence - 10, 50);
        if (duration === 'Chronic (Months)') confidence = Math.min(confidence + 5, 97);
        return { ...bestMatch, confidence: `${confidence}%` };
    }

    return DEFAULT_RESULT;
}

const SYMPTOMS = [
    'Feeling Unsure / Confused', 'General Malaise / Uneasy', 'Brain Fog / Lethargy',
    'Headache', 'Fever', 'Nausea', 'Fatigue', 'Joint Pain',
    'Cough', 'Stomach Ache', 'Dizziness', 'Shortness of Breath', 'Insomnia',
    'Chest Pain', 'Back Pain', 'Rash', 'Blurred Vision', 'Loss of Appetite'
];

export default function SymptomCheckerPage() {
    const [step, setStep] = useState(1);
    const [selectedSymptoms, setSelectedSymptoms] = useState([]);
    const [duration, setDuration] = useState('1-3 days');
    const [severity, setSeverity] = useState('moderate');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const toggleSymptom = (s) => {
        setSelectedSymptoms(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
    };

    const handleAnalyze = () => {
        setLoading(true);
        setTimeout(() => {
            const diagnosis = diagnose(selectedSymptoms, duration);
            setResult(diagnosis);
            setLoading(false);
            setStep(4);
        }, 1000);
    };

    const reset = () => {
        setStep(1);
        setSelectedSymptoms([]);
        setDuration('1-3 days');
        setSeverity('moderate');
        setResult(null);
    };

    return (
        <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] py-12 transition-colors duration-300">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-4 animate-fade-in">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Adaptive Multi-Domain Triage</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
                        Symptom Assessor
                    </h1>
                    <p className="text-[var(--text-secondary)] max-w-xl mx-auto text-sm leading-relaxed">
                        Unsure or overwhelmed by how you feel? Select your symptoms and compare real patient outcomes across Allopathy, Ayurveda, and Homeopathy.
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    {[1, 2, 3].map(s => (
                        <div key={s} className="flex items-center gap-2">
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300 ${step > s
                                    ? 'bg-blue-600 border-blue-600 text-white'
                                    : step === s
                                        ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-[var(--surface)] shadow-md'
                                        : 'border-[var(--border)] text-[var(--text-muted)] bg-[var(--surface-2)]'
                                    }`}
                            >
                                {step > s ? '✓' : s}
                            </div>
                            {s < 3 && (
                                <div
                                    className={`w-16 sm:w-24 h-0.5 transition-colors duration-300 ${step > s ? 'bg-blue-600' : 'bg-[var(--border)]'
                                        }`}
                                />
                            )}
                        </div>
                    ))}
                </div>

                {/* Main Card */}
                <div className="bg-[var(--surface)] text-[var(--text-primary)] rounded-3xl border border-[var(--border)] p-6 md:p-10 shadow-xl transition-all">

                    {/* Step 1: Symptoms */}
                    {step === 1 && (
                        <div className="space-y-8 animate-fade-in">
                            <div>
                                <h2 className="text-xl font-bold mb-1">Step 1: What are you experiencing?</h2>
                                <p className="text-[var(--text-secondary)] mb-6 text-xs sm:text-sm">
                                    Select any feelings that apply. If you feel confused or unsure, select the top guidance chips.
                                </p>
                                <div className="flex flex-wrap gap-2.5">
                                    {SYMPTOMS.map(s => {
                                        const isSelected = selectedSymptoms.includes(s);
                                        const isUnsureChip = s.includes('Unsure') || s.includes('Malaise') || s.includes('Brain Fog');
                                        return (
                                            <button
                                                key={s}
                                                onClick={() => toggleSymptom(s)}
                                                className={`px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${isSelected
                                                    ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-105'
                                                    : isUnsureChip
                                                        ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-300/40 hover:bg-amber-500/20'
                                                        : 'bg-[var(--surface-2)] text-[var(--text-secondary)] border-[var(--border)] hover:border-blue-400 hover:text-[var(--text-primary)]'
                                                    }`}
                                            >
                                                {isSelected && '✓ '}{s}
                                            </button>
                                        );
                                    })}
                                </div>
                                {selectedSymptoms.length > 0 && (
                                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-4 font-semibold">
                                        {selectedSymptoms.length} symptom{selectedSymptoms.length > 1 ? 's' : ''} selected
                                    </p>
                                )}
                            </div>
                            <div className="flex justify-end pt-6 border-t border-[var(--border)]">
                                <button
                                    onClick={() => setStep(2)}
                                    disabled={selectedSymptoms.length === 0}
                                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold text-sm disabled:opacity-40 transition-all hover:bg-blue-700 shadow-sm"
                                >
                                    <span>Next Step</span> <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Duration */}
                    {step === 2 && (
                        <div className="space-y-8 animate-fade-in">
                            <div>
                                <button
                                    onClick={() => setStep(1)}
                                    className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)] mb-6 transition"
                                >
                                    <ArrowLeft className="w-4 h-4" /> Back to Symptoms
                                </button>
                                <h2 className="text-xl font-bold mb-1">Step 2: How long have you felt this way?</h2>
                                <p className="text-[var(--text-secondary)] mb-6 text-xs sm:text-sm">
                                    Duration informs whether your condition is acute (urgent) or constitutional (chronic).
                                </p>
                                <div className="space-y-3 max-w-md">
                                    {['Less than 24 hours', '1-3 days', 'A week', 'More than a week', 'Chronic (Months)'].map(d => (
                                        <button
                                            key={d}
                                            onClick={() => setDuration(d)}
                                            className={`w-full text-left px-5 py-3.5 rounded-xl border text-sm font-medium transition-all ${duration === d
                                                ? 'bg-blue-500/10 border-blue-500 text-blue-600 dark:text-blue-400 font-bold'
                                                : 'bg-[var(--surface-2)] border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]'
                                                }`}
                                        >
                                            {d}
                                            {duration === d && <CheckCircle2 className="w-4 h-4 inline float-right text-blue-600 dark:text-blue-400" />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex justify-end pt-6 border-t border-[var(--border)]">
                                <button
                                    onClick={() => setStep(3)}
                                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition shadow-sm"
                                >
                                    <span>Next Step</span> <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Severity */}
                    {step === 3 && (
                        <div className="space-y-8 animate-fade-in">
                            <div>
                                <button
                                    onClick={() => setStep(2)}
                                    className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)] mb-6 transition"
                                >
                                    <ArrowLeft className="w-4 h-4" /> Back to Duration
                                </button>
                                <h2 className="text-xl font-bold mb-1">Step 3: How severe are your symptoms?</h2>
                                <p className="text-[var(--text-secondary)] mb-6 text-xs sm:text-sm">
                                    Rate your overall discomfort level right now.
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {[
                                        { key: 'mild', label: 'Mild', desc: 'Noticeable but daily routine is mostly unaffected.', emoji: '🟡' },
                                        { key: 'moderate', label: 'Moderate', desc: 'Noticeable discomfort affecting work or sleep.', emoji: '🟠' },
                                        { key: 'severe', label: 'Severe', desc: 'Intense distress requiring immediate medical attention.', emoji: '🔴' },
                                    ].map(sv => (
                                        <button
                                            key={sv.key}
                                            onClick={() => setSeverity(sv.key)}
                                            className={`text-left p-5 rounded-2xl border-2 transition-all ${severity === sv.key
                                                ? 'border-blue-500 bg-blue-500/10'
                                                : 'border-[var(--border)] bg-[var(--surface-2)] hover:border-slate-400'
                                                }`}
                                        >
                                            <div className="text-2xl mb-2">{sv.emoji}</div>
                                            <p className="font-bold text-sm text-[var(--text-primary)]">{sv.label}</p>
                                            <p className="text-xs text-[var(--text-muted)] mt-1">{sv.desc}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex justify-end pt-6 border-t border-[var(--border)]">
                                <button
                                    onClick={handleAnalyze}
                                    disabled={loading}
                                    className="flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white rounded-xl font-semibold text-sm hover:bg-emerald-700 transition shadow-sm"
                                >
                                    {loading ? <Activity className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
                                    <span>{loading ? 'Analyzing Clinical Dossier...' : 'Analyze Symptoms'}</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Results */}
                    {step === 4 && result && (
                        <div className="space-y-8 animate-fade-in">
                            <div className="bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-emerald-500/10 border border-blue-500/20 rounded-3xl p-6 sm:p-8 text-center">
                                <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-full text-[11px] font-extrabold uppercase tracking-widest mb-3">
                                    Likely Diagnosis ({result.confidence} Match)
                                </span>
                                <h3 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] mb-3">
                                    {result.disease}
                                </h3>
                                <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed mb-4">
                                    {result.description}
                                </p>
                                <div className="flex flex-wrap justify-center gap-2">
                                    {selectedSymptoms.map(s => (
                                        <span key={s} className="px-3 py-1 bg-[var(--surface)] text-[var(--text-primary)] rounded-full text-xs border border-[var(--border)] font-medium shadow-sm">
                                            {s}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold mb-1">Compare Medical Approaches</h3>
                                <p className="text-[var(--text-muted)] mb-6 text-xs sm:text-sm">
                                    Historical patient outcomes for your condition. Choose the domain that fits your treatment philosophy.
                                </p>
                                <div className="space-y-4">
                                    {result.domains.map((domain) => (
                                        <div
                                            key={domain.name}
                                            className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] hover:shadow-lg transition-all p-5 sm:p-6"
                                            style={{ borderLeftWidth: '5px', borderLeftColor: domain.style.color }}
                                        >
                                            <div className="flex flex-col sm:flex-row gap-5 sm:items-center">
                                                <div className="sm:w-1/4">
                                                    <span
                                                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-2"
                                                        style={{ background: domain.style.bg, color: domain.style.color, border: `1px solid ${domain.style.border}` }}
                                                    >
                                                        <Stethoscope className="w-3 h-3" /> {domain.name}
                                                    </span>
                                                    <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                                                        {domain.description}
                                                    </p>
                                                </div>

                                                <div className="sm:w-2/4 grid grid-cols-2 gap-2.5">
                                                    {[
                                                        { label: 'Success Rate', value: domain.successRate },
                                                        { label: 'Avg Fees', value: domain.avgFees },
                                                        { label: 'Patient Rating', value: `★ ${domain.rating} (${domain.reviews})` },
                                                        { label: 'Recovery Timeline', value: domain.recoveryTimeline },
                                                    ].map(stat => (
                                                        <div key={stat.label} className="bg-[var(--surface-2)] rounded-xl p-2.5 border border-[var(--border)]">
                                                            <p className="text-[10px] text-[var(--text-muted)] font-semibold uppercase tracking-wider mb-0.5">{stat.label}</p>
                                                            <p className="text-xs font-bold text-[var(--text-primary)]">{stat.value}</p>
                                                        </div>
                                                    ))}
                                                    {domain.sampleReview && (
                                                        <div className="col-span-2 pt-2 border-t border-[var(--border)] flex items-start gap-2">
                                                            <MessageSquareQuote className="w-3.5 h-3.5 text-blue-500 mt-0.5 flex-shrink-0" />
                                                            <p className="text-xs text-[var(--text-secondary)] italic">
                                                                &ldquo;{domain.sampleReview}&rdquo;
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="sm:w-1/4 sm:flex sm:flex-col sm:items-end sm:justify-center sm:border-l sm:border-[var(--border)] sm:pl-5">
                                                    <Link
                                                        href={domain.link}
                                                        className="w-full inline-flex justify-center items-center gap-2 px-5 py-3 rounded-xl font-semibold text-xs sm:text-sm transition hover:opacity-90 shadow-sm"
                                                        style={{ background: domain.style.color, color: '#ffffff' }}
                                                    >
                                                        <Stethoscope className="w-4 h-4" /> Book {domain.name}
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs">
                                <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-600 dark:text-amber-400" />
                                <p>This AI assessment is for clinical decision support only and does not replace professional emergency care. Please consult a registered medical practitioner.</p>
                            </div>

                            <div className="text-center">
                                <button
                                    onClick={reset}
                                    className="px-6 py-2.5 border border-[var(--border)] bg-[var(--surface-2)] hover:bg-[var(--surface-hover)] text-[var(--text-secondary)] rounded-xl text-xs font-semibold transition"
                                >
                                    ↩ Start Another Assessment
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
