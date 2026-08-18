'use client';
import {
    Users, Clock, CheckCircle, AlertCircle, TrendingUp,
    Calendar, ClipboardList, Activity, ChevronRight,
    FileText, Stethoscope, BarChart3
} from 'lucide-react';
import { doctorDashboardData, DOMAIN_COLORS } from '@/data/mockData';

export default function DoctorDashboard() {
    const { doctor, stats, patients, pendingPrescriptions } = doctorDashboardData;

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-2">
                            <Stethoscope className="w-7 h-7 text-blue-600" />
                            {doctor.name}
                        </h1>
                        <p className="text-slate-500 text-sm mt-1">{doctor.specialization} · {doctor.domain}</p>
                    </div>
                    <span className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-sm font-semibold border border-blue-200">
                        {new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <StatCard icon={Users} label="Total Patients" value={stats.totalPatients} accent="blue" />
                    <StatCard icon={ClipboardList} label="Pending Approvals" value={stats.pendingApprovals} accent="amber" />
                    <StatCard icon={Calendar} label="Today's Appointments" value={stats.todayAppointments} accent="emerald" />
                    <StatCard icon={BarChart3} label="Monthly Consults" value={stats.monthlyConsultations} accent="purple" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Patient List */}
                    <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                <Activity className="w-5 h-5 text-blue-600" />
                                Patient Progress Tracker
                            </h3>
                            <span className="text-xs text-slate-400">{patients.length} active</span>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {patients.map(patient => (
                                <div key={patient.id} className="px-6 py-4 hover:bg-slate-50 transition-colors flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                        {patient.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <p className="font-semibold text-slate-800 text-sm truncate">{patient.name}</p>
                                            <span className="text-xs text-slate-400">· {patient.age}y</span>
                                            <StatusBadge status={patient.status} />
                                        </div>
                                        <p className="text-xs text-slate-400 mb-2">{patient.condition}</p>
                                        {/* Progress Bar */}
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all ${patient.status === 'improving' ? 'bg-emerald-500' :
                                                            patient.status === 'needs-attention' ? 'bg-red-500' : 'bg-blue-500'
                                                        }`}
                                                    style={{ width: `${patient.progress}%` }}
                                                />
                                            </div>
                                            <span className="text-xs font-semibold text-slate-600">{patient.progress}%</span>
                                        </div>
                                    </div>
                                    <div className="text-right hidden sm:block">
                                        <p className="text-xs text-slate-400">Next visit</p>
                                        <p className="text-xs font-medium text-slate-600">{patient.nextVisit}</p>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-slate-300" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Pending Prescription Approvals */}
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-amber-500" />
                                Pending Approvals
                            </h3>
                            <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 text-xs font-bold flex items-center justify-center">
                                {pendingPrescriptions.length}
                            </span>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {pendingPrescriptions.map(rx => (
                                <div key={rx.id} className="px-6 py-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="font-semibold text-slate-800 text-sm">{rx.patient}</p>
                                        <UrgencyBadge urgency={rx.urgency} />
                                    </div>
                                    <p className="text-xs text-slate-500 mb-2">{rx.reason}</p>
                                    <div className="flex flex-wrap gap-1.5 mb-3">
                                        {rx.medications.map((med, i) => (
                                            <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md text-xs font-medium border border-blue-200">
                                                {med}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="flex-1 px-3 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1">
                                            <CheckCircle className="w-3 h-3" /> Approve
                                        </button>
                                        <button className="flex-1 px-3 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors">
                                            Review
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon: Icon, label, value, accent }) {
    const gradients = {
        blue: 'from-blue-500 to-blue-600',
        amber: 'from-amber-500 to-amber-600',
        emerald: 'from-emerald-500 to-emerald-600',
        purple: 'from-purple-500 to-purple-600',
    };
    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradients[accent]} flex items-center justify-center mb-3 shadow-md`}>
                <Icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{label}</p>
        </div>
    );
}

function StatusBadge({ status }) {
    const styles = {
        improving: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        stable: 'bg-blue-50 text-blue-700 border-blue-200',
        'needs-attention': 'bg-red-50 text-red-700 border-red-200',
    };
    const icons = {
        improving: TrendingUp,
        stable: Activity,
        'needs-attention': AlertCircle,
    };
    const Icon = icons[status] || Activity;
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold border ${styles[status] || styles.stable}`}>
            <Icon className="w-3 h-3" />
            {status.replace('-', ' ')}
        </span>
    );
}

function UrgencyBadge({ urgency }) {
    const styles = {
        high: 'bg-red-50 text-red-700 border-red-200',
        medium: 'bg-amber-50 text-amber-700 border-amber-200',
        low: 'bg-blue-50 text-blue-700 border-blue-200',
    };
    return (
        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border ${styles[urgency]}`}>
            {urgency}
        </span>
    );
}

// commit-touch: 2026-08-18 09:30:00

// commit-touch: 2026-08-18 12:10:00

// commit-touch: shubhamsoni1234 2026-08-18 09:30:00

// commit-touch: shubhamsoni1234 2026-08-18 12:10:00

// commit-touch: shubhamsoni1234 2026-08-18 09:30:00

// commit-touch: shubhamsoni1234 2026-08-18 12:10:00

// commit-touch: shubhamsoni1234 2026-08-18 09:30:00
