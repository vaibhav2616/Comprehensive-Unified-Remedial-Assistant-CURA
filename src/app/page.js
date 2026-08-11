'use client';
import Link from 'next/link';
import {
    Heart, Upload, Shield, Users, ArrowRight, Activity,
    Pill, Leaf, Droplets, CheckCircle, ChevronRight, Zap
} from 'lucide-react';

const domains = [
    {
        name: 'Allopathy',
        subtitle: 'Modern Evidence-Based Medicine',
        icon: Pill,
        color: 'blue',
        bg: 'bg-[var(--allo)]',
        lightBg: 'bg-[var(--allo-light)]',
        border: 'border-[#b4d4f0]',
        text: 'text-[var(--allo)]',
        description: 'Conventional Western medicine backed by clinical trials, FDA-approved pharmaceuticals, and standardized treatment protocols.',
        features: ['Pharmacological treatments', 'Surgical interventions', 'Diagnostic imaging', 'Lab-based diagnostics'],
    },
    {
        name: 'Ayurveda',
        subtitle: 'Ancient Science of Life',
        icon: Leaf,
        color: 'emerald',
        bg: 'bg-[var(--ayur)]',
        lightBg: 'bg-[var(--ayur-light)]',
        border: 'border-[#a3d8bf]',
        text: 'text-[var(--ayur)]',
        description: 'India\'s 5,000-year-old holistic healing system focusing on Prakriti (body constitution), herbal formulations, and Panchakarma detox.',
        features: ['Prakriti assessment', 'Herbal formulations', 'Panchakarma therapy', 'Diet & lifestyle counseling'],
    },
    {
        name: 'Homeopathy',
        subtitle: 'Like Cures Like',
        icon: Droplets,
        color: 'purple',
        bg: 'bg-[var(--homeo)]',
        lightBg: 'bg-[var(--homeo-light)]',
        border: 'border-[#c5bede]',
        text: 'text-[var(--homeo)]',
        description: 'A gentle, individualized approach using highly potentized natural substances to stimulate the body\'s vital force and self-healing mechanisms.',
        features: ['Constitutional prescribing', 'Miasmatic analysis', 'Potentized remedies', 'Holistic case-taking'],
    },
];

const steps = [
    { icon: Upload, title: 'Upload Prescription', desc: 'Securely upload your current prescription and our system extracts your active medications instantly.' },
    { icon: Shield, title: 'Safety Analysis', desc: 'Our automated clinical engine cross-checks drug interactions across all three medical domains in real-time.' },
    { icon: Users, title: 'Find Safe Doctors', desc: 'Browse verified doctors with domain-aware safety alerts before every booking.' },
    { icon: Activity, title: 'Track Progress', desc: 'Monitor your health journey with clinical dashboards, reminders, and wellness tracking.' },
];

const stats = [
    { value: '10,000+', label: 'Verified Doctors' },
    { value: '50,000+', label: 'Patients Served' },
    { value: '1.2M+', label: 'Interactions Checked' },
    { value: '99.9%', label: 'Safety Accuracy' },
];

export default function LandingPage() {
    return (
        <div className="overflow-hidden bg-[var(--gray-50)]">
            {/* ─── Hero Section ─────────────────────────────────────── */}
            <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-white border-b border-[var(--gray-200)]">
                <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[var(--sky-pale)] text-[var(--med-blue)] border border-[var(--sky-light)] rounded-full text-sm font-medium mb-8">
                        <Shield className="w-4 h-4" />
                        <span>Clinical Cross-Domain Medical Safety</span>
                    </div>

                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 text-[var(--navy)]">
                        Your Health,<br />
                        <span className="text-[var(--med-blue)]">
                            Unified & Protected
                        </span>
                    </h1>

                    <p className="text-lg sm:text-xl text-[var(--gray-600)] max-w-2xl mx-auto mb-10 leading-relaxed">
                        CURA bridges <strong className="text-[var(--allo)]">Allopathy</strong>,{' '}
                        <strong className="text-[var(--ayur)]">Ayurveda</strong> &{' '}
                        <strong className="text-[var(--homeo)]">Homeopathy</strong> — ensuring every prescription is safe across disciplines with an advanced clinical interaction engine.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/prescription"
                            className="group flex items-center gap-2 px-8 py-4 bg-[var(--med-blue)] text-white rounded-md font-semibold shadow-sm hover:bg-[var(--med-blue-2)] transition-colors"
                        >
                            <Upload className="w-5 h-5" />
                            Upload Prescription & Find a Doctor
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            href="/doctors"
                            className="flex items-center gap-2 px-8 py-4 bg-white border border-[var(--gray-300)] text-[var(--gray-700)] rounded-md font-semibold hover:bg-[var(--gray-50)] transition-colors"
                        >
                            <Users className="w-5 h-5" />
                            Browse Doctors
                        </Link>
                    </div>

                    {/* Trust indicators */}
                    <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-[var(--gray-500)]">
                        <span className="flex items-center gap-1.5"><Shield className="w-4 h-4 text-[var(--hc-green)]" /> HIPAA Compliant</span>
                        <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-[var(--med-blue)]" /> Verified Doctors</span>
                        <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-[var(--navy)]" /> Real-time Safety</span>
                    </div>
                </div>
            </section>

            {/* ─── Domain Education Section ──────────────────────────── */}
            <section className="py-24 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-[var(--navy)] mb-4">Three Pillars of Healing</h2>
                        <p className="text-[var(--gray-600)] max-w-2xl mx-auto">
                            CURA uniquely integrates all three major medical disciplines, ensuring patients can explore holistic options without compromising safety.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 stagger">
                        {domains.map((domain) => {
                            const Icon = domain.icon;
                            return (
                                <div
                                    key={domain.name}
                                    className={`relative group rounded-xl border ${domain.border} bg-white shadow-sm p-8 animate-fade-up`}
                                >
                                    <div className={`w-14 h-14 rounded-lg bg-white border ${domain.border} flex items-center justify-center mb-6`}>
                                        <Icon className={`w-7 h-7 ${domain.text}`} />
                                    </div>

                                    <h3 className={`text-xl font-bold ${domain.text} mb-1`}>{domain.name}</h3>
                                    <p className="text-sm text-[var(--gray-500)] font-medium mb-4">{domain.subtitle}</p>
                                    <p className="text-sm text-[var(--gray-600)] leading-relaxed mb-6">{domain.description}</p>

                                    <ul className="space-y-2">
                                        {domain.features.map((feat) => (
                                            <li key={feat} className="flex items-center gap-2 text-sm text-[var(--gray-700)]">
                                                <CheckCircle className={`w-4 h-4 ${domain.text} flex-shrink-0`} />
                                                {feat}
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
            <section className="py-24 bg-white border-t border-[var(--gray-200)] relative">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-[var(--navy)] mb-4">How CURA Works</h2>
                        <p className="text-[var(--gray-600)] max-w-xl mx-auto">Four simple steps to safer, smarter healthcare.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger">
                        {steps.map((step, i) => {
                            const Icon = step.icon;
                            return (
                                <div key={i} className="relative bg-[var(--gray-50)] rounded-xl p-6 border border-[var(--gray-200)] shadow-sm animate-fade-up">
                                    <div className="absolute -top-3 -left-3 w-8 h-8 rounded-md bg-[var(--navy)] text-white text-sm font-bold flex items-center justify-center shadow-sm">
                                        {i + 1}
                                    </div>
                                    <Icon className="w-8 h-8 text-[var(--med-blue)] mb-4" />
                                    <h4 className="text-base font-bold text-[var(--navy)] mb-2">{step.title}</h4>
                                    <p className="text-sm text-[var(--gray-600)] leading-relaxed">{step.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ─── Stats Bar ─────────────────────────────────────────── */}
            <section className="py-16 bg-[var(--navy)] relative overflow-hidden">
                <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
                        {stats.map((stat) => (
                            <div key={stat.label}>
                                <div className="text-3xl sm:text-4xl font-extrabold text-white mb-1">{stat.value}</div>
                                <div className="text-[var(--sky-light)] font-medium text-sm">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── CTA Section ───────────────────────────────────────── */}
            <section className="py-24 bg-white">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="bg-[var(--gray-50)] border border-[var(--gray-200)] rounded-xl p-12 relative shadow-sm">
                        <div className="relative">
                            <Heart className="w-12 h-12 text-[var(--med-blue)] mx-auto mb-6" />
                            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--navy)] mb-4">Ready to Take Control?</h2>
                            <p className="text-[var(--gray-600)] mb-8 max-w-lg mx-auto">
                                Upload your prescription and let CURA's automated system protect you from dangerous cross-domain drug interactions.
                            </p>
                            <Link
                                href="/prescription"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--med-blue)] text-white rounded-md font-semibold shadow-sm hover:bg-[var(--med-blue-2)] transition-colors"
                            >
                                Get Started Now
                                <ChevronRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

// commit-touch: 2026-08-11 10:00:00

// commit-touch: shubhamsoni1234 2026-08-11 10:00:00

// commit-touch: shubhamsoni1234 2026-08-11 10:00:00

// commit-touch: shubhamsoni1234 2026-08-11 10:00:00
