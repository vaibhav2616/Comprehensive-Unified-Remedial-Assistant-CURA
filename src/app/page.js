'use client';
import Link from 'next/link';
import {
    Heart, Upload, Shield, Users, ArrowRight, Activity,
    Pill, Leaf, Droplets, CheckCircle, ChevronRight, Zap, Sparkles, Stethoscope, Compass
} from 'lucide-react';
import DomainSwitcher from '@/components/DomainSwitcher';

const domains = [
    {
        name: 'Allopathy',
        subtitle: 'Modern Evidence-Based Medicine',
        icon: Pill,
        color: '#3B82F6',
        bg: 'var(--allo-light)',
        border: 'var(--allo-border)',
        text: 'text-blue-600 dark:text-blue-400',
        badgeBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
        description: 'Conventional Western medicine backed by clinical trials, FDA-approved pharmaceuticals, and standardized emergency and surgical protocols.',
        features: ['Targeted pharmaceutical therapy', 'Advanced diagnostic imaging', 'Acute critical intervention', 'Standardized laboratory metrics'],
    },
    {
        name: 'Ayurveda',
        subtitle: 'Ancient Science of Life & Vitality',
        icon: Leaf,
        color: '#10B981',
        bg: 'var(--ayur-light)',
        border: 'var(--ayur-border)',
        text: 'text-emerald-600 dark:text-emerald-400',
        badgeBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
        description: 'India\'s 5,000-year-old holistic healing system focusing on Tridosha balance (Vata, Pitta, Kapha), herbal Rasayanas, and Panchakarma root-cause detox.',
        features: ['Prakriti constitution assessment', 'Organically sourced herbal formulations', 'Panchakarma cellular rejuvenation', 'Circadian diet & Dinacharya counseling'],
    },
    {
        name: 'Homeopathy',
        subtitle: 'Like Cures Like (Similia Similibus)',
        icon: Droplets,
        color: '#A855F7',
        bg: 'var(--homeo-light)',
        border: 'var(--homeo-border)',
        text: 'text-purple-600 dark:text-purple-400',
        badgeBg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
        description: 'A gentle, hyper-individualized approach using potentized micro-doses to stimulate the body\'s natural vital force and self-regulating healing mechanisms.',
        features: ['Constitutional totality prescribing', 'Miasmatic chronic disease analysis', 'Zero harsh chemical toxicities', 'Holistic mental-emotional alignment'],
    },
];

const steps = [
    { icon: Upload, title: 'Upload Prescription', desc: 'Securely upload your current prescription. Our multi-domain clinical parser extracts your active medications instantly.' },
    { icon: Shield, title: 'Cross-Domain Safety Check', desc: 'Our automated clinical interaction matrix cross-checks dangerous herb-drug conflicts across all three disciplines in real-time.' },
    { icon: Users, title: 'Find Verified Doctors', desc: 'Browse board-certified specialists with domain-aware safety alerts and transparent fees before booking.' },
    { icon: Activity, title: 'Track Verified Metrics', desc: 'Monitor vitals on clinician-gated trend charts. Readings only appear after your doctor verifies them.' },
];

const stats = [
    { value: '10,000+', label: 'Verified Specialists' },
    { value: '50,000+', label: 'Patients Treated' },
    { value: '1.2M+', label: 'Interactions Analyzed' },
    { value: '99.9%', label: 'Clinical Accuracy Rate' },
];

export default function LandingPage() {
    return (
        <div className="overflow-hidden bg-[var(--bg-base)] text-[var(--text-primary)] transition-colors duration-300">
            {/* ─── Hero Section ─────────────────────────────────────── */}
            <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden border-b border-[var(--border)] bg-grid-subtle py-24">
                {/* Ambient Radial Glowing Orbs */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-blue-500/10 via-emerald-500/10 to-purple-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    {/* Live Badge */}
                    <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase bg-[var(--surface)] border border-[var(--border)] shadow-sm mb-8 animate-fade-in">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[var(--text-secondary)]">Clinical Cross-Domain Medical Intelligence OS</span>
                    </div>

                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-8 text-[var(--text-primary)] leading-[1.1] animate-fade-up">
                        Your Health,<br />
                        <span className="bg-gradient-to-r from-blue-600 via-emerald-500 to-purple-600 bg-clip-text text-transparent">
                            Unified &amp; Protected
                        </span>
                    </h1>

                    <p className="text-base sm:text-lg lg:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up">
                        CURA bridges <strong className="text-blue-600 dark:text-blue-400 font-semibold">Allopathy</strong>,{' '}
                        <strong className="text-emerald-600 dark:text-emerald-400 font-semibold">Ayurveda</strong> &amp;{' '}
                        <strong className="text-purple-600 dark:text-purple-400 font-semibold">Homeopathy</strong> — ensuring every prescription, vital metric, and treatment is safe across disciplines.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up">
                        <Link
                            href="/prescription"
                            className="group flex items-center gap-2.5 px-8 py-4 rounded-2xl text-white font-semibold text-sm shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
                            style={{ background: 'var(--accent-gradient)' }}
                        >
                            <Upload className="w-4 h-4" />
                            <span>Upload Prescription &amp; Check Safety</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            href="/symptom-checker"
                            className="flex items-center gap-2 px-7 py-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] text-[var(--text-primary)] font-semibold text-sm hover:bg-[var(--surface-2)] shadow-sm hover:scale-105 transition-all duration-200"
                        >
                            <Sparkles className="w-4 h-4 text-emerald-500" />
                            <span>Take Symptom Survey</span>
                        </Link>
                    </div>

                    {/* Trust Indicators */}
                    <div className="mt-14 pt-8 border-t border-[var(--border)] flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-semibold text-[var(--text-muted)] animate-fade-in">
                        <span className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-emerald-500" /> HIPAA Compliant Encryption
                        </span>
                        <span className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-blue-500" /> Board-Certified Clinicians
                        </span>
                        <span className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-purple-500" /> Automated Herb-Drug Guard
                        </span>
                    </div>
                </div>
            </section>

            {/* ─── Domain Education & Interactive Switcher ───────────── */}
            <section className="py-24 relative border-b border-[var(--border)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-2 block">
                            Integrated Clinical Disciplines
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] mb-4">
                            Three Pillars of Healing
                        </h2>
                        <p className="text-[var(--text-secondary)] max-w-2xl mx-auto text-sm sm:text-base leading-relaxed mb-8">
                            Explore holistic options without compromising safety. Compare live outcome rates, typical recovery timelines, and verified experiences across all three medical traditions.
                        </p>
                        <div className="max-w-3xl mx-auto">
                            <DomainSwitcher includeAll={false} showInsights={true} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger mt-12">
                        {domains.map((domain) => {
                            const Icon = domain.icon;
                            return (
                                <div
                                    key={domain.name}
                                    className="relative group rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-sm card-hover flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="flex items-center justify-between mb-6">
                                            <div
                                                className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm"
                                                style={{ background: domain.bg, color: domain.color }}
                                            >
                                                <Icon className="w-6 h-6" />
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${domain.badgeBg}`}>
                                                Certified Pillar
                                            </span>
                                        </div>

                                        <h3 className="text-xl font-bold text-[var(--text-primary)] mb-1">
                                            {domain.name}
                                        </h3>
                                        <p className="text-xs font-semibold text-[var(--text-muted)] mb-4">
                                            {domain.subtitle}
                                        </p>
                                        <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-6">
                                            {domain.description}
                                        </p>
                                    </div>

                                    <ul className="space-y-2.5 pt-4 border-t border-[var(--border)]">
                                        {domain.features.map((feat) => (
                                            <li key={feat} className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                                                <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                                                <span>{feat}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ─── How It Works ──────────────────────────────────────── */}
            <section className="py-24 relative bg-[var(--surface)] border-b border-[var(--border)]">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-2 block">
                            Platform Protocol
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] mb-3">
                            How CURA Works
                        </h2>
                        <p className="text-[var(--text-secondary)] max-w-xl mx-auto text-sm">
                            Four seamless stages ensuring multi-disciplinary safety and doctor-verified patient care.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger">
                        {steps.map((step, i) => {
                            const Icon = step.icon;
                            return (
                                <div
                                    key={i}
                                    className="relative bg-[var(--surface-2)] rounded-2xl p-6 border border-[var(--border)] shadow-sm card-hover animate-fade-up"
                                >
                                    <div className="w-8 h-8 rounded-xl bg-blue-600 text-white text-xs font-bold flex items-center justify-center mb-4 shadow-sm">
                                        0{i + 1}
                                    </div>
                                    <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400 mb-3" />
                                    <h4 className="text-base font-bold text-[var(--text-primary)] mb-2">
                                        {step.title}
                                    </h4>
                                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                                        {step.desc}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ─── Stats Bar ─────────────────────────────────────────── */}
            <section className="py-20 relative overflow-hidden bg-slate-950 text-white">
                <div className="absolute inset-0 bg-grid-subtle opacity-10" />
                <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
                        {stats.map((stat) => (
                            <div key={stat.label} className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                                <div className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-emerald-400 to-purple-400 mb-1">
                                    {stat.value}
                                </div>
                                <div className="text-slate-400 font-medium text-xs tracking-wide">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── Call to Action ────────────────────────────────────── */}
            <section className="py-24 relative">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-10 sm:p-14 relative shadow-xl overflow-hidden">
                        <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
                        <div className="relative">
                            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-6">
                                <Heart className="w-6 h-6" />
                            </div>
                            <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] mb-4">
                                Experience Unified Healthcare
                            </h2>
                            <p className="text-[var(--text-secondary)] mb-8 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
                                Upload your prescription or explore our adaptive symptom survey to see how Allopathy, Ayurveda, and Homeopathy work together safely.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link
                                    href="/prescription"
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all"
                                    style={{ background: 'var(--accent-gradient)' }}
                                >
                                    <span>Get Started Now</span>
                                    <ChevronRight className="w-4 h-4" />
                                </Link>
                                <Link
                                    href="/doctors"
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-[var(--surface-2)] hover:bg-[var(--surface-hover)] border border-[var(--border)] text-[var(--text-primary)] font-semibold text-sm transition"
                                >
                                    <Users className="w-4 h-4" />
                                    <span>Browse Doctor Directory</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
