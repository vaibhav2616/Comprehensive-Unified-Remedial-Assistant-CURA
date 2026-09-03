'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { HeartPulse, Mail, Phone, ArrowRight, Loader2, ShieldCheck, Stethoscope, User, Sparkles } from 'lucide-react';
import { ThemeToggle } from '@/context/ThemeContext';

export default function LoginPage() {
    const { sendOtp, verifyOtp } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get('redirect') || null;

    const [step, setStep] = useState('identify'); // identify | otp
    const [role, setRole] = useState('PATIENT');
    const [identifier, setIdentifier] = useState('');
    const [name, setName] = useState('');
    const [otp, setOtp] = useState('');
    const [via, setVia] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [devOtp, setDevOtp] = useState('');

    const handleSendOTP = async (e) => {
        e.preventDefault();
        if (!identifier.trim()) return;
        setError('');
        setLoading(true);
        try {
            const res = await sendOtp({ identifier: identifier.trim(), role, name: name.trim() || undefined });
            if (res.success) {
                setVia(res.via);
                if (res.devOtp) setDevOtp(res.devOtp);
                setStep('otp');
            } else {
                setError(res.error || 'Failed to send OTP. Try again.');
            }
        } catch {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        if (otp.length !== 6) return;
        setError('');
        setLoading(true);
        try {
            const res = await verifyOtp({ identifier: identifier.trim(), otp: otp.trim() });
            if (res.success) {
                const dest = redirectTo || (res.user.role === 'DOCTOR' ? '/dashboard/doctor' : '/dashboard/patient');
                router.push(dest);
            } else {
                setError(res.error || 'Invalid OTP. Please try again.');
            }
        } catch {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-[var(--bg-base)] text-[var(--text-primary)] transition-colors duration-300">
            {/* Left panel - Editorial Brand Dossier */}
            <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-16 relative overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-800 to-purple-900 text-white">
                <div className="absolute inset-0 bg-grid-subtle opacity-15" />
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-12">
                        <div className="p-2.5 bg-white/20 rounded-2xl backdrop-blur-md shadow-sm">
                            <HeartPulse className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-2xl font-extrabold tracking-tight">CURA</span>
                    </div>

                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/15 backdrop-blur-md mb-6">
                        <Sparkles className="w-3.5 h-3.5 text-blue-300" />
                        <span>Unified Medical Operating System</span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-6">
                        Evidence-based safety across <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-emerald-200 to-purple-200">
                            three medical traditions.
                        </span>
                    </h1>
                    <p className="text-blue-100/90 text-base leading-relaxed max-w-md">
                        Bridging Allopathy, Ayurveda &amp; Homeopathy with real-time clinical interaction checks and doctor-verified health telemetry.
                    </p>
                </div>

                <div className="relative z-10 space-y-4 pt-12 border-t border-white/15">
                    {[
                        { icon: ShieldCheck, text: 'HIPAA & Digital Personal Data Protection Compliant' },
                        { icon: Stethoscope, text: 'Board-Certified Multidisciplinary Clinicians' },
                        { icon: ShieldCheck, text: 'Automated Cross-Domain Herb-Drug Safety Matrix' },
                    ].map(({ icon: Icon, text }) => (
                        <div key={text} className="flex items-center gap-3 text-sm text-blue-100/90">
                            <div className="p-1.5 bg-white/15 rounded-xl">
                                <Icon className="h-4 w-4 text-emerald-300" />
                            </div>
                            <span>{text}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right panel - Secure Sign-in Card */}
            <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative">
                <div className="absolute top-6 right-6">
                    <ThemeToggle />
                </div>

                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center gap-2.5 mb-8">
                        <div className="p-2 rounded-xl text-white shadow-sm" style={{ background: 'var(--accent-gradient)' }}>
                            <HeartPulse className="h-5 w-5" />
                        </div>
                        <span className="text-xl font-extrabold text-[var(--text-primary)]">CURA</span>
                    </div>

                    <div className="bg-[var(--surface)] rounded-3xl shadow-2xl p-8 border border-[var(--border)] animate-fade-up">
                        {step === 'identify' ? (
                            <>
                                <h2 className="text-2xl font-extrabold tracking-tight mb-1 text-[var(--text-primary)]">
                                    Sign In to CURA
                                </h2>
                                <p className="text-xs text-[var(--text-secondary)] mb-6">
                                    Passwordless authentication. We&apos;ll send an encrypted one-time security code.
                                </p>

                                {/* Role toggle */}
                                <div className="flex rounded-2xl overflow-hidden border border-[var(--border)] p-1 bg-[var(--surface-2)] mb-6">
                                    {[
                                        { value: 'PATIENT', label: 'Patient Portal', icon: User },
                                        { value: 'DOCTOR', label: 'Doctor Clinic', icon: Stethoscope },
                                    ].map(({ value, label, icon: Icon }) => (
                                        <button
                                            key={value}
                                            onClick={() => setRole(value)}
                                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${role === value
                                                ? 'bg-[var(--surface)] text-[var(--text-primary)] shadow-md'
                                                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                                                }`}
                                        >
                                            <Icon className="h-3.5 w-3.5" />
                                            <span>{label}</span>
                                        </button>
                                    ))}
                                </div>

                                <form onSubmit={handleSendOTP} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                                            Your Name (first time registration)
                                        </label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={e => setName(e.target.value)}
                                            placeholder="Dr. Sameer Patel / Ananya Iyer"
                                            className="w-full px-4 py-3 rounded-xl text-xs sm:text-sm border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:ring-2 focus:ring-blue-500 transition"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                                            Email Address or Phone Number
                                        </label>
                                        <div className="relative">
                                            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
                                                {identifier.includes('@') ? <Mail className="h-4 w-4" /> : <Phone className="h-4 w-4" />}
                                            </div>
                                            <input
                                                type="text"
                                                value={identifier}
                                                onChange={e => setIdentifier(e.target.value)}
                                                placeholder="you@email.com or +91 98765 43210"
                                                className="w-full pl-10 pr-4 py-3 rounded-xl text-xs sm:text-sm border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:ring-2 focus:ring-blue-500 transition"
                                                required
                                            />
                                        </div>
                                    </div>
                                    {error && (
                                        <div className="text-xs px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400">
                                            {error}
                                        </div>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={loading || !identifier.trim()}
                                        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-xs sm:text-sm text-white shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                                        style={{ background: 'var(--accent-gradient)' }}
                                    >
                                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                                            <>Send Verification Code <ArrowRight className="h-4 w-4" /></>
                                        )}
                                    </button>
                                </form>
                            </>
                        ) : (
                            <>
                                <h2 className="text-2xl font-extrabold tracking-tight mb-1 text-[var(--text-primary)]">
                                    Enter Security Code
                                </h2>
                                <p className="text-xs text-[var(--text-secondary)] mb-6">
                                    We sent a 6-digit code to <strong className="text-[var(--text-primary)]">{identifier}</strong>
                                </p>

                                {devOtp && (
                                    <div className="mb-5 px-4 py-3 rounded-2xl text-xs font-mono font-bold bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400">
                                        🧪 Dev Mode OTP: {devOtp}
                                    </div>
                                )}

                                <form onSubmit={handleVerifyOTP} className="space-y-4">
                                    <input
                                        type="text"
                                        value={otp}
                                        onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                        placeholder="000000"
                                        maxLength={6}
                                        className="w-full text-center text-3xl font-extrabold tracking-[0.4em] py-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-blue-500 transition"
                                        autoFocus
                                    />
                                    {error && (
                                        <div className="text-xs px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400">
                                            {error}
                                        </div>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={loading || otp.length !== 6}
                                        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-xs sm:text-sm text-white shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                                        style={{ background: 'var(--accent-gradient)' }}
                                    >
                                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                                            <><ShieldCheck className="h-4 w-4" /> Verify &amp; Sign In</>
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setStep('identify'); setOtp(''); setError(''); }}
                                        className="w-full py-2.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition"
                                    >
                                        ← Change email or phone number
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                    <p className="text-center text-[11px] mt-5 text-[var(--text-muted)]">
                        Protected by CURA Enterprise Clinical Safety. DPDP Act 2023 Compliant.
                    </p>
                </div>
            </div>
        </div>
    );
}
