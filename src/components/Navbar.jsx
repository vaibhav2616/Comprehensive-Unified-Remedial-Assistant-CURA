'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useApp, DOMAIN_THEMES } from '@/context/AppContext';
import { ThemeToggle } from '@/context/ThemeContext';
import { HeartPulse, ChevronDown, User, Stethoscope, Menu, X, Compass, Activity } from 'lucide-react';

export default function Navbar() {
    const { user, isDoctor, signOut } = useAuth();
    const { activeDomain, setTourOpen } = useApp();
    const [dashOpen, setDashOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const activeTheme = DOMAIN_THEMES[activeDomain] || DOMAIN_THEMES.ALL;

    return (
        <nav
            className="fixed top-0 w-full z-50 border-b border-[var(--border)] transition-colors duration-300"
            style={{
                background: 'var(--nav-bg)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
            }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center gap-2">

                    {/* Logo + Active Domain Pill */}
                    <div className="flex items-center gap-3">
                        <Link href="/" className="flex items-center space-x-2.5 group">
                            <div
                                className="p-2 rounded-xl transition-all duration-300 group-hover:scale-105 shadow-sm"
                                style={{ background: 'var(--accent-gradient)' }}
                            >
                                <HeartPulse className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                                CURA
                            </span>
                        </Link>
                        {activeDomain !== 'ALL' && (
                            <Link
                                href="/doctors"
                                className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border transition-all hover:scale-105"
                                style={{
                                    background: activeTheme.bg,
                                    color: activeTheme.badgeText,
                                    borderColor: activeTheme.border,
                                }}
                                title="Active medical domain lens — click to switch"
                            >
                                <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: activeTheme.color }} />
                                {activeTheme.shortLabel}
                            </Link>
                        )}
                    </div>

                    {/* Desktop Nav Links */}
                    <div className="hidden md:flex items-center space-x-1">
                        {[
                            { href: '/symptom-checker', label: 'Symptom Survey' },
                            { href: '/prescription', label: 'Upload Rx' },
                            { href: '/doctors', label: 'Find Doctors' },
                            { href: '/community', label: 'Community' },
                            { href: '/about', label: 'About' },
                        ].map(({ href, label }) => (
                            <Link
                                key={href}
                                href={href}
                                className="px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-[var(--surface-2)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] whitespace-nowrap"
                            >
                                {label}
                            </Link>
                        ))}

                        {/* Dashboard Dropdown (RBAC Enforced: Patients NEVER see Doctor Portal) */}
                        {user && (
                            <div
                                className="relative"
                                onMouseEnter={() => setDashOpen(true)}
                                onMouseLeave={() => setDashOpen(false)}
                            >
                                <button
                                    onClick={() => setDashOpen(v => !v)}
                                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-[var(--surface-2)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                                >
                                    <span>Dashboard</span>
                                    <ChevronDown
                                        className="h-3.5 w-3.5 transition-transform duration-200"
                                        style={{ transform: dashOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                                    />
                                </button>

                                <div className="absolute top-full left-0 w-full h-2" />

                                <div
                                    className="absolute top-[calc(100%+6px)] right-0 w-64 rounded-2xl overflow-hidden transition-all duration-200 origin-top shadow-2xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] p-1.5"
                                    style={{
                                        opacity: dashOpen ? 1 : 0,
                                        transform: dashOpen ? 'scaleY(1)' : 'scaleY(0.9)',
                                        pointerEvents: dashOpen ? 'auto' : 'none',
                                    }}
                                >
                                    {isDoctor && (
                                        <>
                                            <Link
                                                href="/dashboard/doctor"
                                                onClick={() => setDashOpen(false)}
                                                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 hover:bg-[var(--surface-2)]"
                                            >
                                                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                                    <Stethoscope className="h-4 w-4" />
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-xs">Doctor Portal</div>
                                                    <div className="text-[10px] text-[var(--text-muted)]">Clinic, Approvals &amp; Schedule</div>
                                                </div>
                                            </Link>
                                            <Link
                                                href="/dashboard/doctor/approvals"
                                                onClick={() => setDashOpen(false)}
                                                className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 transition mb-1"
                                            >
                                                <Activity className="w-3.5 h-3.5" /> Clinical Approvals Queue →
                                            </Link>
                                            <div className="h-px bg-[var(--border)] my-1" />
                                        </>
                                    )}

                                    <Link
                                        href="/dashboard/patient"
                                        onClick={() => setDashOpen(false)}
                                        className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 hover:bg-[var(--surface-2)]"
                                    >
                                        <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                                            <User className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-xs">{isDoctor ? 'Personal Health (Patient)' : 'Patient Portal'}</div>
                                            <div className="text-[10px] text-[var(--text-muted)]">{isDoctor ? 'Your own treatments & metrics' : 'Appointments, Rx & Metrics'}</div>
                                        </div>
                                    </Link>

                                    <Link
                                        href="/dashboard/patient/metrics"
                                        onClick={() => setDashOpen(false)}
                                        className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 transition mb-1"
                                    >
                                        <Activity className="w-3.5 h-3.5" /> Health Metrics &amp; Trends →
                                    </Link>

                                    <div className="h-px bg-[var(--border)] my-1" />
                                    <button
                                        onClick={() => { setDashOpen(false); signOut(); }}
                                        className="w-full text-left flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-150 hover:bg-red-500/10 text-red-600 dark:text-red-400"
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right actions: ThemeToggle + Guide + User Badge */}
                    <div className="flex items-center gap-2.5">
                        {/* Theme Toggle Button */}
                        <ThemeToggle />

                        {/* Guide Button */}
                        <button
                            onClick={() => setTourOpen(true)}
                            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[var(--surface-2)] hover:bg-[var(--surface-hover)] border border-[var(--border)] text-[var(--text-secondary)] transition cursor-pointer"
                            title="Interactive Guided Tutorial"
                        >
                            <Compass className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                            <span>Guide</span>
                        </button>

                        {user ? (
                            <Link
                                href={isDoctor ? '/dashboard/doctor' : '/dashboard/patient'}
                                className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all hover:scale-105"
                                style={{
                                    background: isDoctor ? 'var(--success-pale)' : 'var(--primary-pale)',
                                    color: isDoctor ? 'var(--success)' : 'var(--primary)',
                                    borderColor: isDoctor ? 'var(--success-border)' : 'var(--primary-border)',
                                }}
                            >
                                {isDoctor ? <Stethoscope className="h-3.5 w-3.5" /> : <User className="h-3.5 w-3.5" />}
                                {isDoctor ? `Dr. ${user.name?.split(' ')[0] || 'Doctor'}` : `${user.name?.split(' ')[0] || 'Patient'}`}
                            </Link>
                        ) : (
                            <Link
                                href="/login"
                                className="hidden md:inline-flex px-5 py-2 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90 shadow-sm"
                                style={{ background: 'var(--accent-gradient)' }}
                            >
                                Sign In
                            </Link>
                        )}

                        {/* Mobile Hamburger */}
                        <button
                            className="md:hidden p-2 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--surface-2)] border border-[var(--border)] transition"
                            onClick={() => setMobileOpen(v => !v)}
                            aria-label="Toggle Menu"
                        >
                            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="md:hidden border-t border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] px-4 py-4 space-y-2 shadow-2xl animate-fade-in">
                    <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
                        <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Navigation</span>
                        <ThemeToggle />
                    </div>
                    {[
                        { href: '/symptom-checker', label: 'Symptom Survey' },
                        { href: '/prescription', label: 'Upload Rx' },
                        { href: '/doctors', label: 'Find Doctors' },
                        { href: '/community', label: 'Community' },
                        { href: '/about', label: 'About' },
                    ].map(({ href, label }) => (
                        <Link
                            key={href}
                            href={href}
                            onClick={() => setMobileOpen(false)}
                            className="block px-4 py-2.5 rounded-xl text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-2)] transition"
                        >
                            {label}
                        </Link>
                    ))}
                    <button
                        onClick={() => { setMobileOpen(false); setTourOpen(true); }}
                        className="w-full text-left flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 transition"
                    >
                        <Compass className="w-4 h-4" /> Guided Tutorial
                    </button>
                    {user ? (
                        <>
                            {isDoctor && (
                                <>
                                    <Link
                                        href="/dashboard/doctor"
                                        onClick={() => setMobileOpen(false)}
                                        className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10"
                                    >
                                        <Stethoscope className="w-4 h-4 inline mr-2" /> Doctor Clinic Portal
                                    </Link>
                                    <Link
                                        href="/dashboard/doctor/approvals"
                                        onClick={() => setMobileOpen(false)}
                                        className="block px-4 py-2 rounded-xl text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10"
                                    >
                                        Pending Clinical Approvals
                                    </Link>
                                </>
                            )}
                            <Link
                                href="/dashboard/patient"
                                onClick={() => setMobileOpen(false)}
                                className="block px-4 py-2.5 rounded-xl text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--surface-2)]"
                            >
                                <User className="w-4 h-4 inline mr-2 text-blue-500" />
                                {isDoctor ? 'Personal Health (Patient View)' : 'Patient Portal'}
                            </Link>
                            <Link
                                href="/dashboard/patient/metrics"
                                onClick={() => setMobileOpen(false)}
                                className="block px-4 py-2.5 rounded-xl text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--surface-2)]"
                            >
                                Health Metrics &amp; Trends
                            </Link>
                            <button
                                onClick={() => { signOut(); setMobileOpen(false); }}
                                className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-500/10"
                            >
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <Link
                            href="/login"
                            onClick={() => setMobileOpen(false)}
                            className="block px-4 py-3 rounded-xl text-sm font-bold text-white text-center shadow-sm"
                            style={{ background: 'var(--accent-gradient)' }}
                        >
                            Sign In
                        </Link>
                    )}
                </div>
            )}
        </nav>
    );
}
