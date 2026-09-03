'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { CheckCircle, XCircle, FileText, Loader2, ClipboardCheck, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';

export default function DoctorApprovalsPage() {
    const { user, isDoctor } = useAuth();
    const [loading, setLoading] = useState(true);
    const [approvals, setApprovals] = useState([]);
    const [actionLoading, setActionLoading] = useState({});
    const [toast, setToast] = useState(null);
    const [error, setError] = useState(null);

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchPending = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/metrics/pending');
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to fetch');
            setApprovals(data.data || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (user && isDoctor) fetchPending();
    }, [user, isDoctor, fetchPending]);

    const handleAction = async (id, approved) => {
        setActionLoading(prev => ({ ...prev, [id]: true }));
        try {
            const res = await fetch(`/api/metrics/${id}/approve`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ approved }),
            });
            const data = await res.json();
            if (data.success) {
                setApprovals(prev => prev.filter(a => a.id !== id));
                showToast(`Metric ${approved ? 'approved' : 'rejected'} successfully`);
            } else {
                showToast(data.error || 'Action failed', 'error');
            }
        } catch {
            showToast('Network error', 'error');
        } finally {
            setActionLoading(prev => ({ ...prev, [id]: false }));
        }
    };

    if (!user || !isDoctor) return null;

    return (
        <div className="p-4 sm:p-8 max-w-7xl mx-auto min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] transition-colors duration-300">
            {/* Toast */}
            {toast && (
                <div className={`fixed top-20 right-4 z-50 px-5 py-3 rounded-2xl shadow-xl text-xs sm:text-sm font-semibold flex items-center gap-2.5 transition-all ${toast.type === 'error'
                    ? 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/30'
                    : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                    }`}>
                    {toast.type === 'error' ? <XCircle className="w-4 h-4 flex-shrink-0" /> : <CheckCircle className="w-4 h-4 flex-shrink-0" />}
                    <span>{toast.msg}</span>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-3.5">
                    <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-sm">
                        <ClipboardCheck className="h-6 w-6" />
                    </div>
                    <div>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-1">
                            <Sparkles className="w-3 h-3" />
                            <span>Clinical Verification Queue</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Pending Clinical Approvals</h1>
                        <p className="text-[var(--text-secondary)] text-xs sm:text-sm">Review patient-submitted health metrics before they enter verified telemetry charts.</p>
                    </div>
                </div>
                <button
                    onClick={fetchPending}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2.5 border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-2)] text-[var(--text-secondary)] rounded-xl text-xs sm:text-sm font-semibold transition shadow-sm"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                </button>
            </div>

            {error && (
                <div className="mb-6 flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-600 dark:text-red-400 text-xs">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p>{error}. <button onClick={fetchPending} className="underline font-bold ml-1">Retry</button></p>
                </div>
            )}

            {loading ? (
                <div className="flex flex-col items-center justify-center py-24 gap-3">
                    <Loader2 className="animate-spin text-emerald-500 h-8 w-8" />
                    <p className="text-xs text-[var(--text-muted)] font-mono">Loading pending clinical records...</p>
                </div>
            ) : (
                <div className="bg-[var(--surface)] rounded-3xl shadow-sm border border-[var(--border)] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[650px]">
                            <thead>
                                <tr className="bg-[var(--surface-2)] text-[var(--text-muted)] text-[11px] uppercase tracking-wider border-b border-[var(--border)]">
                                    <th className="p-4 font-bold">Submission Date</th>
                                    <th className="p-4 font-bold">Patient Name</th>
                                    <th className="p-4 font-bold">Vital Metric</th>
                                    <th className="p-4 font-bold">Logged Value</th>
                                    <th className="p-4 font-bold">Patient Notes</th>
                                    <th className="p-4 font-bold text-right">Verification Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border)]">
                                {approvals.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="p-16 text-center">
                                            <ClipboardCheck className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-3 opacity-30" />
                                            <p className="text-[var(--text-primary)] font-bold text-base">All Caught Up!</p>
                                            <p className="text-xs text-[var(--text-muted)] mt-1">No pending metric approvals waiting in your clinic queue.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    approvals.map((item) => (
                                        <tr key={item.id} className="hover:bg-[var(--surface-2)] transition-colors">
                                            <td className="p-4 text-xs text-[var(--text-muted)] whitespace-nowrap font-mono">
                                                {new Date(item.recordedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </td>
                                            <td className="p-4 font-bold text-sm text-[var(--text-primary)]">{item.patientName}</td>
                                            <td className="p-4">
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                                                    <FileText className="h-3 w-3" />
                                                    {item.type.replace(/_/g, ' ')}
                                                </span>
                                            </td>
                                            <td className="p-4 font-mono font-bold text-sm text-[var(--text-primary)]">{item.value} {item.unit}</td>
                                            <td className="p-4 text-xs text-[var(--text-secondary)]">{item.notes || '—'}</td>
                                            <td className="p-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleAction(item.id, true)}
                                                        disabled={actionLoading[item.id]}
                                                        className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition disabled:opacity-60 shadow-sm"
                                                    >
                                                        {actionLoading[item.id] ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                                                        <span>Approve</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction(item.id, false)}
                                                        disabled={actionLoading[item.id]}
                                                        className="flex items-center gap-1.5 px-4 py-1.5 bg-[var(--surface-2)] text-[var(--text-secondary)] border border-[var(--border)] rounded-xl text-xs font-semibold hover:bg-red-500/10 hover:text-red-600 hover:border-red-500/30 transition disabled:opacity-60"
                                                    >
                                                        <XCircle className="w-3.5 h-3.5" />
                                                        <span>Reject</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
