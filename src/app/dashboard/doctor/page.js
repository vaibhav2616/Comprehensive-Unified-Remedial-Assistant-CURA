'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import {
    Calendar, Users, Star, FileText, Clock, CheckCircle2,
    AlertCircle, Activity, TrendingUp, MessageCircle,
    LogOut, Stethoscope, ChevronRight, User, IndianRupee, HeartPulse
} from 'lucide-react';
import Link from 'next/link';

export default function DoctorDashboard() {
    const { user, loading, signOut, isDoctor } = useAuth();
    const router = useRouter();

    const [appointments, setAppointments] = useState([]);
    const [prescriptions, setPrescriptions] = useState([]);
    const [loadingData, setLoadingData] = useState(true);

    useEffect(() => {
        if (!loading && !user) router.push('/login?redirect=/dashboard/doctor');
        if (!loading && user && !isDoctor) router.push('/dashboard/patient');
    }, [user, loading, isDoctor, router]);

    useEffect(() => {
        if (!user) return;
        async function fetchData() {
            setLoadingData(true);
            try {
                const [apptRes, rxRes] = await Promise.all([
                    fetch('/api/appointments'),
                    fetch('/api/prescriptions'),
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

    const doctor = user.doctorProfile;
    const todayAppts = appointments.filter(a => {
        const slot = new Date(a.slot);
        const today = new Date();
        return slot.toDateString() === today.toDateString() && a.status !== 'CANCELLED';
    });
    const pendingAppts = appointments.filter(a => a.status === 'PENDING').length;
    const flaggedRx = prescriptions.filter(p => p.flagged).length;

    return (
        <div className="min-h-screen" style={{ background: 'var(--bg-base)' }}>
            {/* Header */}
            <div className="sticky top-16 z-40 py-6 px-4" style={{ background: 'var(--bg-base)', borderBottom: '1px solid var(--border)' }}>
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-0.5">
                            <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                                Dr. {user.name?.split(' ')[0]}'s Dashboard
                            </h1>
                            {doctor?.isVerified && (
                                <span className="px-2 py-0.5 text-xs font-semibold rounded-full flex items-center gap-1" style={{ background: 'var(--success-pale)', color: 'var(--success)' }}>
                                    <CheckCircle2 className="h-3 w-3" /> Verified
                                </span>
                            )}
                        </div>
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                            {doctor?.specialization?.join(', ') || 'Set up your profile'} · {doctor?.city || ''}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        {!doctor && (
                            <Link href="/dashboard/doctor/setup" className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white" style={{ background: 'var(--accent-gradient)' }}>
                                Complete Profile
                            </Link>
                        )}
                        <button onClick={signOut} className="p-2.5 rounded-xl hover:bg-[var(--surface-2)]" style={{ color: 'var(--text-muted)' }}>
                            <LogOut className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Profile warning */}
                {!doctor && (
                    <div className="mb-6 flex items-center gap-3 px-5 py-4 rounded-xl" style={{ background: 'var(--warning-pale)', border: '1px solid var(--warning-border)' }}>
                        <AlertCircle className="h-5 w-5 flex-shrink-0" style={{ color: 'var(--warning)' }} />
                        <div className="flex-1">
                            <span className="font-semibold" style={{ color: 'var(--warning)' }}>Complete your doctor profile</span>
                            <span className="text-sm ml-2" style={{ color: 'var(--text-secondary)' }}>Patients can't find you until your profile is set up</span>
                        </div>
                        <Link href="/dashboard/doctor/setup" className="text-sm font-medium" style={{ color: 'var(--warning)' }}>Set up →</Link>
                    </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: "Today's Appointments", value: todayAppts.length, icon: Calendar, color: 'var(--primary)', bg: 'var(--primary-pale)' },
                        { label: 'Pending Review', value: pendingAppts, icon: Clock, color: 'var(--warning)', bg: 'var(--warning-pale)' },
                        { label: 'Flagged Rx', value: flaggedRx, icon: AlertCircle, color: 'var(--danger)', bg: 'var(--danger-pale)' },
                        { label: 'Rating', value: doctor?.avgRating ? `${doctor.avgRating.toFixed(1)}★` : 'N/A', icon: Star, color: '#F59E0B', bg: '#FFFBEB' },
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
                    {/* Today's appointments */}
                    <div className="bg-white rounded-2xl p-6" style={{ border: '1px solid var(--border)' }}>
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Today's Schedule</h2>
                            <span className="text-xs px-3 py-1 rounded-full font-medium" style={{ background: 'var(--primary-pale)', color: 'var(--primary)' }}>
                                {todayAppts.length} appointments
                            </span>
                        </div>
                        {loadingData ? <Skeleton lines={3} /> : todayAppts.length > 0 ? (
                            <div className="space-y-3">
                                {todayAppts.map(appt => (
                                    <div key={appt.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--surface-2)' }}>
                                        <div className="p-2 rounded-lg" style={{ background: 'var(--primary-pale)' }}>
                                            <User className="h-4 w-4" style={{ color: 'var(--primary)' }} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{appt.patient?.name}</div>
                                            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                                                {new Date(appt.slot).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} · {appt.type}
                                            </div>
                                        </div>
                                        <span className="text-xs px-2 py-0.5 rounded-full" style={{
                                            background: appt.status === 'CONFIRMED' ? 'var(--success-pale)' : 'var(--warning-pale)',
                                            color: appt.status === 'CONFIRMED' ? 'var(--success)' : 'var(--warning)',
                                        }}>{appt.status}</span>
                                    </div>
                                ))}
                            </div>
                        ) : <EmptyState icon={Calendar} text="No appointments scheduled today" cta="View all appointments" href="/dashboard/doctor/appointments" />}
                    </div>

                    {/* Prescriptions to review */}
                    <div className="bg-white rounded-2xl p-6" style={{ border: '1px solid var(--border)' }}>
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Prescriptions to Review</h2>
                            <Link href="/prescription" className="text-sm font-medium flex items-center gap-1" style={{ color: 'var(--primary)' }}>
                                All <ChevronRight className="h-3.5 w-3.5" />
                            </Link>
                        </div>
                        {loadingData ? <Skeleton lines={3} /> : prescriptions.length > 0 ? (
                            <div className="space-y-3">
                                {prescriptions.slice(0, 4).map(rx => (
                                    <div key={rx.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--surface-2)] transition-colors cursor-pointer">
                                        <div className="p-2 rounded-lg" style={{ background: rx.flagged ? 'var(--danger-pale)' : 'var(--success-pale)' }}>
                                            {rx.flagged ? <AlertCircle className="h-4 w-4" style={{ color: 'var(--danger)' }} /> : <FileText className="h-4 w-4" style={{ color: 'var(--success)' }} />}
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{rx.patient?.name || 'Patient'}</div>
                                            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{new Date(rx.createdAt).toLocaleDateString('en-IN')} · {rx.medications?.length} med(s)</div>
                                        </div>
                                        <span className="text-xs px-2 py-0.5 rounded-full" style={{
                                            background: rx.flagged ? 'var(--danger-pale)' : 'var(--success-pale)',
                                            color: rx.flagged ? 'var(--danger)' : 'var(--success)',
                                        }}>{rx.status}</span>
                                    </div>
                                ))}
                            </div>
                        ) : <EmptyState icon={FileText} text="No prescriptions to review" cta="Community forum" href="/community" />}
                    </div>
                </div>

                {/* Analytics teaser */}
                <div className="mt-6 bg-white rounded-2xl p-6" style={{ border: '1px solid var(--border)', background: 'linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%)' }}>
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>📊 Your Practice Analytics</h3>
                            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                {doctor?.totalReviews || 0} reviews · {doctor?.successRate || 0}% success rate · ₹{doctor?.consultFee || 0} consult fee
                            </p>
                        </div>
                        <Link href="/dashboard/doctor/analytics" className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white" style={{ background: 'var(--accent-gradient)' }}>
                            <TrendingUp className="h-4 w-4" /> View Analytics
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Shared sub-components
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
                <div className="inline-flex p-4 rounded-2xl mb-4" style={{ background: 'var(--success-pale)' }}>
                    <HeartPulse className="h-8 w-8 animate-pulse" style={{ color: 'var(--success)' }} />
                </div>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Loading your dashboard…</p>
            </div>
        </div>
    );
}
