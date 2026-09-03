'use client';
import Link from 'next/link';
import TrustBadges from '@/components/TrustBadges';
import { Sparkles, Shield, Activity, Users, ArrowRight } from 'lucide-react';

const PILLARS = [
    {
        number: '01',
        title: 'The Pluralistic Health Dilemma',
        description: 'In India alone, over 400 million citizens concurrently use Allopathy, Ayurveda, and Homeopathy. Prior to CURA, zero clinical platforms existed to systematically screen for dangerous cross-domain drug-herb interactions. CURA bridges this vital healthcare gap.',
        stat: '400M+',
        statLabel: 'patients actively navigating multiple medical domains'
    },
    {
        number: '02',
        title: 'The Evidence-Based Solution',
        description: 'CURA is the world\'s first cross-domain medical safety OS. Our clinical engine provides side-by-side comparative outcomes while automatically flagging hazardous combinations — always with a board-certified clinician in the loop.',
        stat: '100%',
        statLabel: 'doctor-verified approval gate for telemetry and prescriptions'
    },
    {
        number: '03',
        title: 'The Clinical Data Moat',
        description: 'Every clinical signoff creates verified real-world evidence. As doctors approve or reject telemetry updates and medications, we build a proprietary multi-disciplinary dataset representing the future of integrative medicine.',
        stat: '3-Way',
        statLabel: 'unified integration of Allopathy, Ayurveda & Homeopathy'
    }
];

const TEAM_PRINCIPLES = [
    { icon: '🔬', title: 'Research-First', desc: 'Every clinical interaction rule is grounded in peer-reviewed pharmacognosy and PubMed medical literature.' },
    { icon: '👨‍⚕️', title: 'Clinician-in-the-Loop', desc: 'AI proposes. Doctors decide. We never replace the professional judgment of a registered practitioner.' },
    { icon: '🛡️', title: 'Safety Before Engagement', desc: 'We never compromise medical integrity, data privacy, or patient well-being for engagement metrics.' },
    { icon: '🌍', title: 'Built for Pluralistic Healing', desc: 'Engineered specifically for pluralistic healthcare cultures and extensible to global integrative medicine.' },
];

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] transition-colors duration-300">

            {/* Hero Section */}
            <section className="relative overflow-hidden py-24 px-6 border-b border-[var(--border)] bg-grid-subtle">
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 mb-6">
                        <Sparkles className="w-3.5 h-3.5" />
                        Our Founding Mission
                    </span>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
                        Bridging Three Medical Traditions.<br />
                        <span className="bg-gradient-to-r from-blue-600 via-emerald-500 to-purple-600 bg-clip-text text-transparent">
                            Protecting Every Patient.
                        </span>
                    </h1>
                    <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
                        CURA exists because no patient should have to choose blindly between modern Western medicine, ancient Ayurvedic wisdom, and gentle Homeopathy — and no one should be endangered by combining them unknowingly.
                    </p>
                </div>
            </section>

            {/* The Three Pillars */}
            <section className="py-20 px-6 border-b border-[var(--border)]">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-2 block">Foundational Thesis</span>
                        <h2 className="text-3xl font-extrabold text-[var(--text-primary)]">Why CURA Exists</h2>
                    </div>
                    <div className="space-y-12">
                        {PILLARS.map(p => (
                            <div key={p.number} className="flex flex-col md:flex-row gap-8 items-start p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-sm card-hover">
                                <div className="flex-shrink-0">
                                    <span className="text-5xl font-black text-blue-600/20 dark:text-blue-400/20">
                                        {p.number}
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold mb-2 text-[var(--text-primary)]">{p.title}</h3>
                                    <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed mb-4">{p.description}</p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400">{p.stat}</span>
                                        <span className="text-xs text-[var(--text-muted)] font-medium">{p.statLabel}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Principles */}
            <section className="py-20 px-6 bg-[var(--surface)] border-b border-[var(--border)]">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-2 block">Clinical Integrity</span>
                        <h2 className="text-3xl font-extrabold text-[var(--text-primary)]">Our Operating Principles</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {TEAM_PRINCIPLES.map(p => (
                            <div key={p.title} className="p-6 rounded-3xl border border-[var(--border)] bg-[var(--surface-2)] shadow-sm card-hover">
                                <span className="text-3xl mb-3 block">{p.icon}</span>
                                <h3 className="font-bold text-sm sm:text-base text-[var(--text-primary)] mb-1">{p.title}</h3>
                                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{p.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-6 text-center relative overflow-hidden bg-slate-950 text-white">
                <div className="max-w-2xl mx-auto relative z-10">
                    <h2 className="text-2xl sm:text-3xl font-extrabold mb-4">Patient safety is not an add-on. It is the product.</h2>
                    <p className="text-xs sm:text-sm text-slate-300 mb-8">Experience clinical cross-domain safety with registered healthcare professionals.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/prescription"
                            className="px-8 py-3.5 rounded-xl font-bold text-xs sm:text-sm text-white shadow-lg transition-all hover:scale-105"
                            style={{ background: 'var(--accent-gradient)' }}
                        >
                            Try the Safety Engine
                        </Link>
                        <Link
                            href="/doctors"
                            className="px-8 py-3.5 rounded-xl font-bold text-xs sm:text-sm border border-white/20 text-white hover:bg-white/10 transition-all hover:scale-105"
                        >
                            Explore Doctor Directory
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
