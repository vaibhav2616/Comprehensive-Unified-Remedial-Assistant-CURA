'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import {
    X, Compass, Brain, Layers, ShieldAlert, Activity, ClipboardCheck,
    ArrowRight, ArrowLeft, CheckCircle2, Stethoscope
} from 'lucide-react';

const PATIENT_STEPS = [
    {
        title: '1. Unsure How You Feel? Start With the Symptom Survey',
        subtitle: 'Adaptive Disease Discovery',
        icon: Brain,
        color: '#3B82F6',
        bg: 'rgba(59, 130, 246, 0.12)',
        description: 'Feeling confused or overwhelmed by symptoms? Our guided survey asks gentle follow-up questions about how you feel and suggests likely conditions along with urgency guidance.',
        tips: [
            'Choose "Feeling Unsure / Confused" if you cannot pinpoint your symptoms.',
            'Review top matched conditions along with verified patient experiences.',
        ],
        href: '/symptom-checker',
        cta: 'Open Symptom Survey',
    },
    {
        title: '2. Compare & Switch Between Medical Domains',
        subtitle: 'Allopathy · Ayurveda · Homeopathy',
        icon: Layers,
        color: '#10B981',
        bg: 'rgba(16, 185, 129, 0.12)',
        description: 'Inspect real patient success rates, popularity share, average fees, recovery timelines, and verified patient reviews across all three systems before deciding.',
        tips: [
            'Use the Multi-Domain Switcher to switch seamlessly across clinical lenses.',
            'See both consult fees and estimated medicine costs upfront.',
        ],
        href: '/doctors',
        cta: 'Explore Domain Directory',
    },
    {
        title: '3. Check Cross-Domain Prescription Safety',
        subtitle: 'Real-Time Herb & Drug Interaction Guard',
        icon: ShieldAlert,
        color: '#F43F5E',
        bg: 'rgba(244, 63, 94, 0.12)',
        description: 'Upload or type your current medications across Allopathy, Ayurveda, or Homeopathy. CURA flags dangerous combinations (like Metoprolol + Ashwagandha) before you book.',
        tips: [
            'Upload a file or type medication names directly.',
            'Flags automatically warn you before booking conflicting specialists.',
        ],
        href: '/prescription',
        cta: 'Upload / Check Prescription',
    },
    {
        title: '4. Track Health Metrics With Doctor Approval Safety',
        subtitle: 'Clinician-Verified Progress Charts',
        icon: Activity,
        color: '#A855F7',
        bg: 'rgba(168, 85, 247, 0.12)',
        description: 'Log your Blood Sugar, Blood Pressure, Weight, Oxygen, or request factor & medication updates. For clinical safety, entries only change your official dashboard charts AFTER a doctor approves them.',
        tips: [
            'Submitted metrics stay safely in "Pending Doctor Review" until signed off.',
            'Rejected readings show your doctor\'s explanation note.',
        ],
        href: '/dashboard/patient/metrics',
        cta: 'View Health Metrics',
    },
];

const DOCTOR_STEPS = [
    {
        title: '1. Manage Your Clinical Profile & Availability',
        subtitle: 'Verified Specialist Directory',
        icon: Stethoscope,
        color: '#10B981',
        bg: 'rgba(16, 185, 129, 0.12)',
        description: 'Keep your qualifications, medical domain(s), hospital, fees, and specializations up to date so patients find you through the domain matcher.',
        tips: ['Update consultation fees & estimated medicine costs anytime.', 'Verification badges build immediate patient trust.'],
        href: '/dashboard/doctor/setup',
        cta: 'Edit Doctor Profile',
    },
    {
        title: '2. Review Pending Patient Metrics, Factors & Medications',
        subtitle: 'Doctor Approval Gate',
        icon: ClipboardCheck,
        color: '#3B82F6',
        bg: 'rgba(59, 130, 246, 0.12)',
        description: 'Every patient vital reading, clinical factor update, or cross-domain prescription sits in your approval queue until you approve or decline it with clinical notes.',
        tips: ['Approve valid vitals to publish them to patient trend charts.', 'Audit flagged herb-drug interactions before approving regimens.'],
        href: '/dashboard/doctor/approvals',
        cta: 'Open Approvals Queue',
    },
    {
        title: '3. Track Practice Analytics & Personal Health',
        subtitle: 'Dual-Role Support',
        icon: Activity,
        color: '#A855F7',
        bg: 'rgba(168, 85, 247, 0.12)',
        description: 'View appointment analytics, patient recovery metrics, and access your own Personal Health (Patient View) whenever you consult another specialist for your own care.',
        tips: ['Doctors have a personal patient portal for their own health needs.', 'Self-approvals are strictly blocked for medical integrity.'],
        href: '/dashboard/doctor',
        cta: 'Go to Doctor Dashboard',
    },
];

export default function GuidedTutorialModal() {
    const { tourOpen, setTourOpen } = useApp();
    const { isDoctor } = useAuth();
    const router = useRouter();
    const [stepIdx, setStepIdx] = useState(0);

    if (!tourOpen) return null;

    const steps = isDoctor ? DOCTOR_STEPS : PATIENT_STEPS;
    const step = steps[stepIdx] || steps[0];
    const Icon = step.icon;

    const goToStepPage = (href) => {
        setTourOpen(false);
        router.push(href);
    };

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity" onClick={() => setTourOpen(false)} />

            <div className="relative bg-[var(--surface)] text-[var(--text-primary)] rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden border border-[var(--border)] animate-fade-up">
                {/* Header */}
                <div className="px-6 py-5 border-b border-[var(--border)] flex items-center justify-between" style={{ background: step.bg }}>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm" style={{ background: step.color }}>
                            <Compass className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: step.color }}>
                                Interactive CURA Guide · Step {stepIdx + 1} of {steps.length}
                            </p>
                            <h2 className="text-base font-bold text-[var(--text-primary)]">{step.subtitle}</h2>
                        </div>
                    </div>
                    <button
                        onClick={() => setTourOpen(false)}
                        className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Progress Dots */}
                <div className="px-6 pt-4 flex items-center gap-2">
                    {steps.map((s, idx) => (
                        <button
                            key={s.title}
                            onClick={() => setStepIdx(idx)}
                            className="h-2 rounded-full transition-all flex-1"
                            style={{ background: idx <= stepIdx ? step.color : 'var(--border)' }}
                        />
                    ))}
                </div>

                {/* Content */}
                <div className="p-6 space-y-5">
                    <div className="flex items-start gap-4">
                        <div className="p-3 rounded-2xl flex-shrink-0" style={{ background: step.bg, color: step.color }}>
                            <Icon className="w-7 h-7" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">{step.title}</h3>
                            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{step.description}</p>
                        </div>
                    </div>

                    <div className="bg-[var(--surface-2)] rounded-2xl p-4 border border-[var(--border)] space-y-2.5">
                        {step.tips.map(tip => (
                            <div key={tip} className="flex items-start gap-2.5 text-sm text-[var(--text-secondary)]">
                                <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: step.color }} />
                                <span>{tip}</span>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={() => goToStepPage(step.href)}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white shadow-sm hover:opacity-95 transition"
                        style={{ background: step.color }}
                    >
                        {step.cta} <ArrowRight className="w-4 h-4" />
                    </button>
                </div>

                {/* Footer Nav */}
                <div className="px-6 py-4 bg-[var(--surface-2)] border-t border-[var(--border)] flex items-center justify-between">
                    <button
                        onClick={() => setStepIdx(i => Math.max(0, i - 1))}
                        disabled={stepIdx === 0}
                        className="flex items-center gap-1.5 text-sm font-medium text-[var(--text-secondary)] disabled:opacity-30 hover:text-[var(--text-primary)]"
                    >
                        <ArrowLeft className="w-4 h-4" /> Previous
                    </button>
                    {stepIdx < steps.length - 1 ? (
                        <button
                            onClick={() => setStepIdx(i => Math.min(steps.length - 1, i + 1))}
                            className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:opacity-80"
                        >
                            Next Tip <ArrowRight className="w-4 h-4" />
                        </button>
                    ) : (
                        <button
                            onClick={() => setTourOpen(false)}
                            className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:opacity-80"
                        >
                            Finish Tutorial ✓
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
