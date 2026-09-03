'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Activity, Scale, Droplet, HeartPulse, Loader2, Plus, Clock, CheckCircle2, XCircle, ChevronDown, Sparkles } from 'lucide-react';

const METRIC_OPTIONS = [
    { type: 'blood_sugar', label: 'Blood Sugar', unit: 'mg/dL', icon: Droplet, color: '#EF4444', normal: { min: 70, max: 100 } },
    { type: 'weight', label: 'Weight', unit: 'kg', icon: Scale, color: '#10B981', normal: null },
    { type: 'blood_pressure', label: 'Systolic BP', unit: 'mmHg', icon: HeartPulse, color: '#F43F5E', normal: { min: 90, max: 120 } },
    { type: 'oxygen', label: 'Blood Oxygen', unit: '%', icon: Activity, color: '#3B82F6', normal: { min: 95, max: 100 } },
];

function getLatestByType(metrics) {
    const map = {};
    metrics.forEach(m => {
        if (!map[m.type] || new Date(m.recordedAt) > new Date(map[m.type].recordedAt)) {
            map[m.type] = m;
        }
    });
    return map;
}

function buildChartData(metrics) {
    const dateMap = {};
    metrics.forEach(m => {
        const date = new Date(m.recordedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
        if (!dateMap[date]) dateMap[date] = { date };
        dateMap[date][m.type] = m.value;
    });
    return Object.values(dateMap).sort((a, b) => new Date(a.date) - new Date(b.date));
}

export default function PatientMetricsPage() {
    const { user, isPatient } = useAuth();
    const { resolvedTheme } = useTheme();
    const [approvedMetrics, setApprovedMetrics] = useState([]);
    const [pendingMetrics, setPendingMetrics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [toast, setToast] = useState(null);
    const [form, setForm] = useState({ type: 'blood_sugar', value: '', notes: '' });

    const isDark = resolvedTheme === 'dark';

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3500);
    };

    const fetchMetrics = async () => {
        try {
            const [approvedRes, pendingRes] = await Promise.all([
                fetch('/api/metrics'),
                fetch('/api/metrics?pending=true'),
            ]);
            const approvedData = await approvedRes.json();
            const pendingData = await pendingRes.json();
            setApprovedMetrics(approvedData.data || []);
            const allMetrics = pendingData.data || [];
            setPendingMetrics(allMetrics.filter(m => !m.isApproved));
        } catch {
            showToast('Failed to load metrics', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchMetrics();
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.value) return showToast('Please enter a reading value', 'error');
        setSubmitting(true);
        const metricDef = METRIC_OPTIONS.find(m => m.type === form.type);
        try {
            const res = await fetch('/api/metrics', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: form.type, value: form.value, unit: metricDef.unit, notes: form.notes }),
            });
            const data = await res.json();
            if (data.success) {
                showToast('Metric submitted! Awaiting doctor approval.');
                setForm({ type: 'blood_sugar', value: '', notes: '' });
                setShowForm(false);
                fetchMetrics();
            } else {
                showToast(data.error || 'Submission failed', 'error');
            }
        } catch {
            showToast('Network error', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    if (!user || !isPatient) return null;

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-[var(--bg-base)] text-[var(--text-primary)]">
                <Loader2 className="animate-spin text-blue-500 h-10 w-10" />
                <p className="text-xs text-[var(--text-muted)] font-mono">Loading Verified Health Metrics...</p>
            </div>
        );
    }

    const latest = getLatestByType(approvedMetrics);
    const chartData = buildChartData(approvedMetrics);

    return (
        <div className="p-4 sm:p-8 max-w-7xl mx-auto min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] transition-colors duration-300">
            {/* Toast */}
            {toast && (
                <div className={`fixed top-20 right-4 z-50 px-5 py-3 rounded-2xl shadow-xl text-xs sm:text-sm font-semibold flex items-center gap-2.5 transition-all ${toast.type === 'error'
                    ? 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/30'
                    : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                    }`}>
                    {toast.type === 'error' ? <XCircle className="w-4 h-4 flex-shrink-0" /> : <CheckCircle2 className="w-4 h-4 flex-shrink-0" />}
                    <span>{toast.msg}</span>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Clinician Verification Gate</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-3">
                        <Activity className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                        <span>My Health Metrics</span>
                    </h1>
                    <p className="text-[var(--text-secondary)] mt-1 text-xs sm:text-sm">
                        Track clinical progress over time. Only doctor-approved readings populate the official health charts.
                    </p>
                </div>
                <button
                    onClick={() => setShowForm(v => !v)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-blue-700 transition-all shadow-md whitespace-nowrap flex-shrink-0"
                >
                    <Plus className="w-4 h-4" />
                    <span>Log New Reading</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${showForm ? 'rotate-180' : ''}`} />
                </button>
            </div>

            {/* Submit Form */}
            {showForm && (
                <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 sm:p-8 mb-8 shadow-xl animate-fade-in">
                    <h3 className="font-bold text-sm sm:text-base text-[var(--text-primary)] mb-4">
                        Submit Health Reading for Doctor Review
                    </h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">Metric Type</label>
                            <select
                                value={form.type}
                                onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                                className="w-full px-3.5 py-2.5 border border-[var(--border)] rounded-xl text-xs sm:text-sm outline-none bg-[var(--surface-2)] text-[var(--text-primary)] focus:ring-2 focus:ring-blue-500"
                            >
                                {METRIC_OPTIONS.map(m => (
                                    <option key={m.type} value={m.type}>{m.label} ({m.unit})</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">
                                Value ({METRIC_OPTIONS.find(m => m.type === form.type)?.unit})
                            </label>
                            <input
                                type="number"
                                step="0.1"
                                value={form.value}
                                onChange={e => setForm(f => ({ ...f, value: e.target.value }))}
                                placeholder="e.g. 95"
                                className="w-full px-3.5 py-2.5 border border-[var(--border)] rounded-xl text-xs sm:text-sm outline-none bg-[var(--surface-2)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">Notes (optional)</label>
                            <input
                                type="text"
                                value={form.notes}
                                onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                                placeholder="e.g. fasting, post-exercise"
                                className="w-full px-3.5 py-2.5 border border-[var(--border)] rounded-xl text-xs sm:text-sm outline-none bg-[var(--surface-2)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="sm:col-span-3 flex justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="px-5 py-2 border border-[var(--border)] text-[var(--text-secondary)] rounded-xl text-xs font-semibold hover:bg-[var(--surface-2)] transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition disabled:opacity-60 shadow-md"
                            >
                                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                                <span>{submitting ? 'Submitting...' : 'Submit for Clinician Signoff'}</span>
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Pending Approvals Banner and List */}
            {pendingMetrics.length > 0 && (
                <div className="mb-8 space-y-3">
                    <div className="flex items-center gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-800 dark:text-amber-300 text-xs">
                        <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                        <p>
                            <strong>{pendingMetrics.length} reading{pendingMetrics.length > 1 ? 's' : ''}</strong> currently awaiting doctor approval. For clinical accuracy, they will appear on the trend chart only after signoff.
                        </p>
                    </div>
                    <div className="bg-[var(--surface)] border border-amber-500/30 rounded-3xl p-5 shadow-sm">
                        <h4 className="text-[11px] font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-widest mb-3">
                            Awaiting Clinician Verification
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {pendingMetrics.map((pm, idx) => (
                                <div key={pm.id || idx} className="p-3.5 bg-[var(--surface-2)] rounded-2xl border border-[var(--border)] flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-semibold text-[var(--text-secondary)] capitalize">{pm.type.toLowerCase().replace('_', ' ')}</p>
                                        <p className="text-base font-extrabold text-[var(--text-primary)]">
                                            {pm.value} <span className="text-xs font-normal text-[var(--text-muted)]">{pm.unit}</span>
                                        </p>
                                        {pm.notes && <p className="text-[11px] text-[var(--text-muted)] italic truncate max-w-[150px]">{pm.notes}</p>}
                                    </div>
                                    <span className="px-2.5 py-1 bg-amber-500/15 text-amber-700 dark:text-amber-300 text-[10px] font-bold rounded-full border border-amber-500/20">
                                        Pending
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Latest Values Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                {METRIC_OPTIONS.map(({ type, label, unit, icon: Icon, color, normal }) => {
                    const entry = latest[type];
                    const isNormal = entry && normal ? entry.value >= normal.min && entry.value <= normal.max : true;
                    return (
                        <div key={type} className="bg-[var(--surface)] p-5 rounded-3xl shadow-sm border border-[var(--border)] card-hover flex flex-col justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="p-2 rounded-xl" style={{ background: `${color}18` }}>
                                        <Icon className="h-4 w-4" style={{ color }} />
                                    </div>
                                    <h3 className="font-bold text-xs text-[var(--text-secondary)] uppercase tracking-wider">{label}</h3>
                                </div>
                                {entry ? (
                                    <>
                                        <p className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]">
                                            {entry.value} <span className="text-xs font-medium text-[var(--text-muted)]">{unit}</span>
                                        </p>
                                        {normal && (
                                            <span className={`text-[11px] font-bold mt-1 inline-block ${isNormal ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
                                                {isNormal ? '✓ Normal Range' : '⚠ Outside Normal'}
                                            </span>
                                        )}
                                    </>
                                ) : (
                                    <p className="text-[var(--text-muted)] text-xs mt-1">No approved data yet</p>
                                )}
                            </div>
                            {entry && (
                                <p className="text-[10px] text-[var(--text-muted)] mt-3 pt-2 border-t border-[var(--border)] font-mono">
                                    Verified on {new Date(entry.recordedAt).toLocaleDateString('en-IN')}
                                </p>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Chart */}
            <div className="bg-[var(--surface)] p-6 md:p-10 rounded-3xl shadow-sm border border-[var(--border)]">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg sm:text-xl font-extrabold text-[var(--text-primary)]">
                            Historical Vital Trends
                        </h3>
                        <p className="text-xs text-[var(--text-muted)] mt-0.5">
                            Real-time telemetry plotted exclusively from doctor-approved readings.
                        </p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        Live Sync
                    </span>
                </div>

                {chartData.length > 0 ? (
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'} />
                                <XAxis dataKey="date" stroke={isDark ? '#64748B' : '#94A3B8'} tick={{ fontSize: 11 }} />
                                <YAxis stroke={isDark ? '#64748B' : '#94A3B8'} tick={{ fontSize: 11 }} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: isDark ? '#121720' : '#FFFFFF',
                                        borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0',
                                        color: isDark ? '#F0F4F8' : '#0F172A',
                                        borderRadius: '16px',
                                        boxShadow: '0 12px 30px rgba(0,0,0,0.25)',
                                        fontSize: 12,
                                    }}
                                />
                                <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                                {METRIC_OPTIONS.map(m => (
                                    <Line
                                        key={m.type}
                                        type="monotone"
                                        dataKey={m.type}
                                        name={`${m.label} (${m.unit})`}
                                        stroke={m.color}
                                        strokeWidth={2.5}
                                        dot={{ r: 4, strokeWidth: 2, fill: isDark ? '#121720' : '#FFFFFF' }}
                                        activeDot={{ r: 6 }}
                                        connectNulls
                                    />
                                ))}
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div className="h-80 flex flex-col items-center justify-center text-[var(--text-muted)]">
                        <Activity className="w-12 h-12 mb-3 opacity-25" />
                        <p className="font-semibold text-sm text-[var(--text-secondary)]">No approved metrics recorded yet</p>
                        <p className="text-xs text-[var(--text-muted)] mt-1">Log a reading using the button above and ask your doctor to approve it.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
