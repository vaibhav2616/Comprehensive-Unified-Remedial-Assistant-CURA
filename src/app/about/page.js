'use client';
import Link from 'next/link';
import TrustBadges from '@/components/TrustBadges';

const PILLARS = [
    {
        number: '01',
        title: 'The Patient Safety Problem',
        description: 'In India alone, over 400 million people simultaneously use Allopathy, Ayurveda, and Homeopathy. Zero platforms exist to protect them from cross-domain drug interactions. CURA fills this critical clinical gap.',
        stat: '400M+',
        statLabel: 'patients using multiple systems concurrently'
    },
    {
        number: '02',
        title: 'Our Solution',
        description: 'CURA is the world\'s first cross-domain medical safety operating system. Our clinical AI generates side-by-side treatment plans from all three domains while actively blocking dangerous drug-herb interactions — always with a licensed doctor in the loop.',
        stat: '30+',
        statLabel: 'NIH/PubMed-backed interaction rules in v1'
    },
    {
        number: '03',
        title: 'The Data Moat',
        description: 'Every doctor decision creates training data. Accept, edit, or reject — we capture the clinical reasoning. Over time, we build a proprietary medical AI corpus no competitor can replicate without our network of doctors.',
        stat: '∞',
        statLabel: 'Proprietary training data from every consultation'
    }
];

const TEAM_PRINCIPLES = [
    { icon: '🔬', title: 'Research-First', desc: 'Every interaction rule traces back to a PubMed citation or systematic review.' },
    { icon: '👨‍⚕️', title: 'Doctor-in-the-Loop', desc: 'AI generates. Doctors decide. We never replace clinical judgment.' },
    { icon: '🛡️', title: 'Safety Before Growth', desc: 'We will never ship a feature that compromises patient safety for engagement metrics.' },
    { icon: '🌍', title: 'Built for Bharat', desc: 'Designed for India\'s unique pluralistic medical culture — and ready to scale globally.' },
];

const ROADMAP = [
    { phase: 'v1 (Now)', label: 'MVP - Rule-based AI + manual doctor review', status: 'live' },
    { phase: 'v2 (Q1)', label: 'ClinicalBERT NER for prescription OCR', status: 'building' },
    { phase: 'v3 (Q2)', label: 'PostgreSQL + real-time patient records', status: 'planned' },
    { phase: 'v4 (Q3)', label: 'Trained interaction ML model (once datasets provided)', status: 'planned' },
    { phase: 'v5 (Q4)', label: 'Telemedicine + Live Consultation', status: 'planned' },
];

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white">

            {/* Hero */}
            <section className="bg-[var(--navy)] text-white py-24 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold mb-6 tracking-widest uppercase"
                        style={{ background: 'rgba(255,255,255,0.12)', color: '#a8d4f5' }}>
                        Our Mission
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                        Bridging Three Medical Traditions.<br />
                        <span style={{ color: '#7ecbf0' }}>Protecting Every Patient.</span>
                    </h1>
                    <p className="text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
                        CURA exists because no one should have to choose between modern medicine,
                        ancient wisdom, and gentle healing — and no one should be harmed by combining them unknowingly.
                    </p>
                </div>
            </section>

            {/* The Three Pillars */}
            <section className="py-20 px-6 bg-gray-50">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl font-bold text-center mb-16" style={{ color: 'var(--navy)' }}>
                        Why CURA Exists
                    </h2>
                    <div className="space-y-12">
                        {PILLARS.map(p => (
                            <div key={p.number} className="flex flex-col md:flex-row gap-8 items-start">
                                <div className="flex-shrink-0">
                                    <span className="text-6xl font-black opacity-10" style={{ color: 'var(--med-blue)' }}>
                                        {p.number}
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--navy)' }}>{p.title}</h3>
                                    <p className="text-gray-600 leading-relaxed mb-4">{p.description}</p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-3xl font-black" style={{ color: 'var(--med-blue)' }}>{p.stat}</span>
                                        <span className="text-sm text-gray-500">{p.statLabel}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Principles */}
            <section className="py-20 px-6">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl font-bold text-center mb-12" style={{ color: 'var(--navy)' }}>
                        Our Operating Principles
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {TEAM_PRINCIPLES.map(p => (
                            <div key={p.title} className="p-6 rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
                                <span className="text-2xl mb-3 block">{p.icon}</span>
                                <h3 className="font-bold text-gray-900 mb-2">{p.title}</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">{p.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Technology Stack */}
            <section className="py-20 px-6 bg-gray-50">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold text-center mb-6" style={{ color: 'var(--navy)' }}>
                        Technology Architecture
                    </h2>
                    <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
                        Built for enterprise scale from day one. Our microservice architecture
                        allows individual AI components to be upgraded as better data and models become available.
                    </p>
                    <div className="bg-[var(--navy)] rounded-2xl p-8 text-white font-mono text-sm">
                        <p className="text-green-400 mb-2">{'// CURA System Architecture'}</p>
                        <div className="space-y-1.5 text-blue-200">
                            <p>Next.js Frontend <span className="text-gray-400">→</span> <span className="text-yellow-300">Clinical UI + Dashboard</span></p>
                            <p>Next.js API Routes <span className="text-gray-400">→</span> <span className="text-yellow-300">Auth + Appointments + User Data</span></p>
                            <p>FastAPI Microservice <span className="text-gray-400">→</span> <span className="text-green-300">OCR + NER + Interaction AI + Moderation</span></p>
                            <p>PostgreSQL <span className="text-gray-400">→</span> <span className="text-blue-300">Patient Records (v3)</span></p>
                            <p>BioBERT / ClinicalBERT <span className="text-gray-400">→</span> <span className="text-purple-300">NER Model (when dataset provided)</span></p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Roadmap */}
            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold text-center mb-12" style={{ color: 'var(--navy)' }}>
                        Product Roadmap
                    </h2>
                    <div className="space-y-4">
                        {ROADMAP.map(r => (
                            <div key={r.phase} className="flex items-center gap-4 p-4 rounded-xl border"
                                style={{
                                    borderColor: r.status === 'live' ? 'var(--hc-green)' : r.status === 'building' ? 'var(--med-blue)' : 'var(--gray-200)',
                                    background: r.status === 'live' ? 'var(--hc-green-lt)' : r.status === 'building' ? 'var(--sky-pale)' : 'white'
                                }}>
                                <span className="text-xs font-bold px-2 py-1 rounded-full flex-shrink-0"
                                    style={{
                                        background: r.status === 'live' ? 'var(--hc-green)' : r.status === 'building' ? 'var(--med-blue)' : 'var(--gray-200)',
                                        color: r.status === 'planned' ? 'var(--gray-600)' : 'white'
                                    }}>
                                    {r.status === 'live' ? '✓ LIVE' : r.status === 'building' ? '⚡ BUILDING' : '○ PLANNED'}
                                </span>
                                <div>
                                    <span className="text-xs font-semibold text-gray-500">{r.phase} — </span>
                                    <span className="text-sm text-gray-800">{r.label}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Trust Section */}
            <section className="py-16 px-6 bg-gray-50">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-xl font-bold text-center mb-8" style={{ color: 'var(--navy)' }}>
                        Compliance & Safety Standards
                    </h2>
                    <TrustBadges />
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 px-6 text-center" style={{ background: 'var(--navy)' }}>
                <div className="max-w-2xl mx-auto">
                    <h2 className="text-2xl font-bold text-white mb-4">Ready to join the clinical revolution?</h2>
                    <p className="text-blue-200 mb-8">Patient safety is not a feature. It is the product.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/prescription"
                            className="px-8 py-3 rounded-lg font-semibold text-white transition-all duration-300 hover:opacity-90"
                            style={{ background: 'var(--hc-green)' }}>
                            Try the Safety Engine
                        </Link>
                        <Link href="/doctors"
                            className="px-8 py-3 rounded-lg font-semibold border border-white/30 text-white hover:bg-white/10 transition-all duration-300">
                            Find a Doctor
                        </Link>
                    </div>
                </div>
            </section>

        </div>
    );
}

// commit-touch: 2026-08-26 10:15:00

// commit-touch: shubhamsoni1234 2026-08-26 10:15:00

// commit-touch: shubhamsoni1234 2026-08-26 10:15:00

// commit-touch: shubhamsoni1234 2026-08-26 10:15:00
