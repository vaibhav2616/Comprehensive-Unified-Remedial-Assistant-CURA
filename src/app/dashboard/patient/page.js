'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import {
    Calendar, Pill, Activity, User, Clock, CheckCircle2,
    AlertCircle, HeartPulse, TrendingUp, Star, ChevronRight,
    Plus, FileText, LogOut, Stethoscope
} from 'lucide-react';
import Link from 'next/link';

export default function PatientDashboard() {
    const { user, loading, signOut, isPatient } = useAuth();
    const router = useRouter();

    const [appointments, setAppointments] = useState([]);
    const [prescriptions, setPrescriptions] = useState([]);
    const [loadingData, setLoadingData] = useState(true);

    useEffect(() => {
        if (!loading && !user) router.push('/login?redirect=/dashboard/patient');
        if (!loading && user && !isPatient) router.push('/dashboard/doctor');
    }, [user, loading, isPatient, router]);

    useEffect(() => {
        if (!user) return;
        async function fetchData() {
            setLoadingData(true);
            try {
                const [apptRes, rxRes] = await Promise.all([
                    fetch('/api/appointments?upcoming=true'),
                    fetch('/api/prescriptions?page=1'),
                ]);
                if (apptRes.ok) {
                    const d = await apptRes.json();
                    setAppointments(d.appointments || []);
                }
                if (rxRes.ok) {
                    const d = await rxRes.json();
                    setPrescriptions(d.prescriptions || []);
                }
            } finally {
                setLoadingData(false);
            }
        }
        fetchData();
    }, [user]);

    if (loading) return <LoadingScreen />;
    if (!user) return null;

    const upcomingAppt = appointments.filter(a => a.status !== 'CANCELLED')[0];
    const flaggedRx = prescriptions.filter(p => p.flagged).length;

    return (
        <div className="min-h-screen" style={{ background: 'var(--bg-base)' }}>
            {/* Header */}
            <div className="sticky top-16 z-40 py-6 px-4" style={{ background: 'var(--bg-base)', borderBottom: '1px solid var(--border)' }}>
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                            Good {getTimeOfDay()}, {user.name?.split(' ')[0]}! 👋
                        </h1>
                        <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                            Your health dashboard — all your care in one place
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href="/prescription" className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90" style={{ background: 'var(--accent-gradient)' }}>
                            <Plus className="h-4 w-4" /> Upload Prescription
                        </Link>
                        <button onClick={signOut} className="p-2.5 rounded-xl transition-colors hover:bg-[var(--surface-2)]" style={{ color: 'var(--text-muted)' }}>
                            <LogOut className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Alert: flagged prescriptions */}
                {flaggedRx > 0 && (
                    <div className="mb-6 flex items-center gap-3 px-5 py-4 rounded-xl" style={{ background: 'var(--danger-pale)', border: '1px solid var(--danger-border)' }}>
                        <AlertCircle className="h-5 w-5 flex-shrink-0" style={{ color: 'var(--danger)' }} />
                        <div className="flex-1">
                            <span className="font-semibold" style={{ color: 'var(--danger)' }}>
                                {flaggedRx} prescription{flaggedRx > 1 ? 's' : ''} flagged for dangerous drug interactions
                            </span>
                            <span className="text-sm ml-2" style={{ color: '#94A3B8' }}>Review immediately</span>
                        </div>
                        <Link href="/prescription" className="text-sm font-medium" style={{ color: 'var(--danger)' }}>View →</Link>
                    </div>
                )}

                {/* Stats Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: 'Appointments', value: appointments.length, icon: Calendar, color: 'var(--primary)', bg: 'var(--primary-pale)' },
                        { label: 'Prescriptions', value: prescriptions.length, icon: Pill, color: 'var(--success)', bg: 'var(--success-pale)' },
                        { label: 'Flagged Rx', value: flaggedRx, icon: AlertCircle, color: 'var(--danger)', bg: 'var(--danger-pale)' },
                        { label: 'Health Score', value: flaggedRx === 0 ? '92/100' : '74/100', icon: Activity, color: 'var(--accent)', bg: 'var(--accent-pale)' },
                    ].map(({ label, value, icon: Icon, color, bg }) => (
                        <div key={label} className="bg-white rounded-2xl p-5 card-hover" style={{ border: '1px solid var(--border)' }}>
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{label}</span>
                                <div className="p-2 rounded-lg" style={{ background: bg }}>
                                    <Icon className="h-4 w-4" style={{ color }} />
                                </div>
                            </div>
                            <div className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                                {loadingData ? '—' : value}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Upcoming Appointment */}
                    <div className="bg-white rounded-2xl p-6" style={{ border: '1px solid var(--border)' }}>
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Next Appointment</h2>
                            <Link href="/doctors" className="text-sm flex items-center gap-1 font-medium" style={{ color: 'var(--primary)' }}>
                                Book new <ChevronRight className="h-3.5 w-3.5" />
                            </Link>
                        </div>
                        {loadingData ? (
                            <Skeleton lines={3} />
                        ) : upcomingAppt ? (
                            <AppointmentCard appt={upcomingAppt} />
                        ) : (
                            <EmptyState icon={Calendar} text="No upcoming appointments" cta="Find Doctors" href="/doctors" />
                        )}
                    </div>

                    {/* Recent Prescriptions */}
                    <div className="bg-white rounded-2xl p-6" style={{ border: '1px solid var(--border)' }}>
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Recent Prescriptions</h2>
                            <Link href="/prescription" className="text-sm flex items-center gap-1 font-medium" style={{ color: 'var(--primary)' }}>
                                Upload <Plus className="h-3.5 w-3.5" />
                            </Link>
                        </div>
                        {loadingData ? (
                            <Skeleton lines={3} />
                        ) : prescriptions.length > 0 ? (
                            <div className="space-y-3">
                                {prescriptions.slice(0, 4).map(rx => (
                                    <PrescriptionRow key={rx.id} rx={rx} />
                                ))}
                            </div>
                        ) : (
                            <EmptyState icon={FileText} text="No prescriptions yet" cta="Upload your first" href="/prescription" />
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                        { label: 'Find Specialist', href: '/doctors', icon: Stethoscope, color: 'var(--primary)' },
                        { label: 'Upload Rx', href: '/prescription', icon: FileText, color: 'var(--success)' },
                        { label: 'Community', href: '/community', icon: HeartPulse, color: 'var(--accent)' },
                        { label: 'Health Metrics', href: '/dashboard/patient/metrics', icon: TrendingUp, color: 'var(--warning)' },
                    ].map(({ label, href, icon: Icon, color }) => (
                        <Link key={label} href={href} className="bg-white rounded-2xl p-4 flex flex-col items-center gap-2 text-center card-hover" style={{ border: '1px solid var(--border)' }}>
                            <div className="p-3 rounded-xl" style={{ background: `${color}15` }}>
                                <Icon className="h-5 w-5" style={{ color }} />
                            </div>
                            <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{label}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

// Helpers
function getTimeOfDay() {
    const h = new Date().getHours();
    if (h < 12) return 'morning';
    if (h < 17) return 'afternoon';
    return 'evening';
}

function AppointmentCard({ appt }) {
    const slot = new Date(appt.slot);
    const domainColors = {
        ALLOPATHY: { color: 'var(--primary)', bg: 'var(--primary-pale)' },
        AYURVEDA: { color: 'var(--success)', bg: 'var(--success-pale)' },
        HOMEOPATHY: { color: 'var(--homeo)', bg: 'var(--homeo-pale)' },
    };
    const c = domainColors[appt.domain] || domainColors.ALLOPATHY;
    return (
        <div className="p-4 rounded-xl" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
            <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg" style={{ background: c.bg }}>
                    <Stethoscope className="h-4 w-4" style={{ color: c.color }} />
                </div>
                <div>
                    <div className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Dr. {appt.doctor?.name}</div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{appt.doctor?.doctorProfile?.specialization?.[0]}</div>
                </div>
                <span className="ml-auto px-2.5 py-1 rounded-full text-xs font-medium" style={{ background: c.bg, color: c.color }}>{appt.domain}</span>
            </div>
            <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <Clock className="h-3.5 w-3.5" />
                {slot.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })} at {slot.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
            </div>
            {appt.reason && <div className="mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>{appt.reason}</div>}
        </div>
    );
}

function PrescriptionRow({ rx }) {
    return (
        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--surface-2)] transition-colors cursor-pointer">
            <div className="p-2 rounded-lg" style={{ background: rx.flagged ? 'var(--danger-pale)' : 'var(--success-pale)' }}>
                {rx.flagged
                    ? <AlertCircle className="h-4 w-4" style={{ color: 'var(--danger)' }} />
                    : <CheckCircle2 className="h-4 w-4" style={{ color: 'var(--success)' }} />
                }
            </div>
            <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                    {rx.domain || 'General'} Prescription
                </div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {new Date(rx.createdAt).toLocaleDateString('en-IN')} · {rx.medications?.length || 0} medication{rx.medications?.length !== 1 ? 's' : ''}
                </div>
            </div>
            <span className="text-xs px-2 py-1 rounded-full font-medium" style={{
                background: rx.flagged ? 'var(--danger-pale)' : 'var(--success-pale)',
                color: rx.flagged ? 'var(--danger)' : 'var(--success)',
            }}>{rx.status}</span>
        </div>
    );
}

function EmptyState({ icon: Icon, text, cta, href }) {
    return (
        <div className="text-center py-8">
            <div className="inline-flex p-3 rounded-xl mb-3" style={{ background: 'var(--surface-2)' }}>
                <Icon className="h-6 w-6" style={{ color: 'var(--text-muted)' }} />
            </div>
            <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>{text}</p>
            <Link href={href} className="text-sm font-medium" style={{ color: 'var(--primary)' }}>{cta} →</Link>
        </div>
    );
}

function Skeleton({ lines = 3 }) {
    return (
        <div className="space-y-3 animate-pulse">
            {Array.from({ length: lines }).map((_, i) => (
                <div key={i} className="h-12 rounded-xl" style={{ background: 'var(--surface-2)' }} />
            ))}
        </div>
    );
}

function LoadingScreen() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="inline-flex p-4 rounded-2xl mb-4" style={{ background: 'var(--primary-pale)' }}>
                    <HeartPulse className="h-8 w-8 animate-pulse" style={{ color: 'var(--primary)' }} />
                </div>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Loading your dashboard…</p>
            </div>
        </div>
    );
}
