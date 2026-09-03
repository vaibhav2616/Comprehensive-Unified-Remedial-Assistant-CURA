'use client';
import { useState, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import {
    Upload, FileText, Loader2, CheckCircle, Pill, AlertTriangle,
    ScanLine, Sparkles, ArrowRight, Trash2, ShieldCheck
} from 'lucide-react';
import Link from 'next/link';
import { DOMAIN_COLORS } from '@/data/mockData';

export default function PrescriptionPage() {
    const { activePrescription, uploadPrescription, clearPrescription, uploadState } = useApp();
    const [dragActive, setDragActive] = useState(false);
    const fileRef = useRef(null);

    const handleUpload = () => {
        uploadPrescription();
    };

    return (
        <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] py-12 transition-colors duration-300">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-4 animate-fade-in">
                        <ScanLine className="w-3.5 h-3.5" />
                        <span>Clinical Prescription Intelligence</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
                        Upload Your Prescription
                    </h1>
                    <p className="text-[var(--text-secondary)] max-w-xl mx-auto text-sm leading-relaxed">
                        Our multi-domain parsing engine extracts active compounds and checks for dangerous herb-drug interactions across Allopathy, Ayurveda, and Homeopathy.
                    </p>
                </div>

                {/* Upload State Machine */}
                {uploadState === 'idle' && !activePrescription && (
                    <div
                        className={`relative rounded-3xl border-2 border-dashed p-10 sm:p-14 text-center transition-all cursor-pointer bg-[var(--surface)] shadow-lg
              ${dragActive ? 'border-blue-500 bg-blue-500/10 scale-[1.01]' : 'border-[var(--border)] hover:border-blue-500/60 hover:bg-[var(--surface-2)]'}`}
                        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                        onDragLeave={() => setDragActive(false)}
                        onDrop={(e) => { e.preventDefault(); setDragActive(false); handleUpload(); }}
                        onClick={handleUpload}
                    >
                        <input ref={fileRef} type="file" className="hidden" accept="image/*,.pdf" />
                        <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm animate-float">
                            <Upload className="w-9 h-9" />
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-[var(--text-primary)]">
                            Drop your prescription file here
                        </h3>
                        <p className="text-xs sm:text-sm text-[var(--text-muted)] mb-5">
                            Supports scanned clinical documents, images (JPG, PNG), and digital PDFs
                        </p>
                        <div className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md hover:bg-blue-700 transition">
                            <FileText className="w-4 h-4" />
                            <span>Browse Device Files</span>
                        </div>
                        <p className="text-[11px] text-[var(--text-muted)] mt-5 flex items-center justify-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                            <span>End-to-end encrypted under healthcare data compliance guidelines</span>
                        </p>
                    </div>
                )}

                {/* Uploading State */}
                {uploadState === 'uploading' && (
                    <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-12 text-center shadow-xl animate-fade-up">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-blue-500/10 flex items-center justify-center animate-pulse">
                            <Loader2 className="w-10 h-10 text-blue-600 dark:text-blue-400 animate-spin" />
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-[var(--text-primary)]">Uploading Clinical Document...</h3>
                        <p className="text-xs text-[var(--text-muted)]">Securely transferring encrypted data to CURA vault</p>
                        <div className="w-64 h-2 bg-[var(--surface-2)] rounded-full mx-auto mt-6 overflow-hidden">
                            <div className="h-full bg-blue-600 rounded-full animate-pulse" style={{ width: '65%' }} />
                        </div>
                    </div>
                )}

                {/* Extracting State */}
                {uploadState === 'extracting' && (
                    <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-12 text-center shadow-xl animate-fade-up">
                        <div className="relative w-20 h-20 mx-auto mb-6 rounded-3xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                            <FileText className="w-10 h-10 animate-bounce" />
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-[var(--text-primary)]">Clinical OCR &amp; Interaction Parsing</h3>
                        <p className="text-xs text-[var(--text-muted)] mb-6">Cross-referencing active medications with Ayurvedic &amp; Homeopathic matrices.</p>

                        {/* Simulated scan lines */}
                        <div className="max-w-sm mx-auto bg-[var(--surface-2)] border border-[var(--border)] rounded-2xl p-5 relative overflow-hidden">
                            <div className="absolute left-0 right-0 h-0.5 bg-blue-500 animate-scan-line shadow-[0_0_8px_#3B82F6]" />
                            <div className="space-y-2 text-left">
                                <div className="h-3 bg-[var(--border)] rounded w-3/4 animate-pulse" />
                                <div className="h-3 bg-[var(--border)] rounded w-1/2 animate-pulse" style={{ animationDelay: '0.2s' }} />
                                <div className="h-3 bg-[var(--border)] rounded w-2/3 animate-pulse" style={{ animationDelay: '0.4s' }} />
                                <div className="h-3 bg-[var(--border)] rounded w-1/3 animate-pulse" style={{ animationDelay: '0.6s' }} />
                            </div>
                        </div>
                    </div>
                )}

                {/* Done — Show Extracted Medications */}
                {uploadState === 'done' && activePrescription && (
                    <div className="animate-fade-up space-y-6">
                        {/* Success Header */}
                        <div className="rounded-3xl bg-[var(--surface)] border border-emerald-500/30 p-6 shadow-md flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 shadow-sm">
                                <CheckCircle className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
                                    Prescription Analyzed Successfully
                                </h3>
                                <p className="text-xs text-[var(--text-muted)]">
                                    Prescribed by <strong>{activePrescription.prescribedBy}</strong> on {activePrescription.issueDate} for {activePrescription.patientName}
                                </p>
                            </div>
                            <button
                                onClick={clearPrescription}
                                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-500/10 rounded-xl border border-red-500/20 transition-colors"
                            >
                                <Trash2 className="w-3.5 h-3.5" /> Clear
                            </button>
                        </div>

                        {/* Medications List */}
                        <div className="bg-[var(--surface)] rounded-3xl border border-[var(--border)] shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-[var(--border)] flex items-center gap-2">
                                <Pill className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                <h3 className="font-bold text-sm text-[var(--text-primary)]">
                                    Active Medications ({activePrescription.medications.length})
                                </h3>
                            </div>
                            <div className="divide-y divide-[var(--border)]">
                                {activePrescription.medications.map((med, i) => (
                                    <div key={med.id} className="px-6 py-4 flex items-center gap-4 hover:bg-[var(--surface-2)] transition-colors">
                                        <div
                                            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"
                                            style={{ background: DOMAIN_COLORS[med.domain]?.light || 'rgba(59, 130, 246, 0.1)' }}
                                        >
                                            <Pill className="w-4 h-4" style={{ color: DOMAIN_COLORS[med.domain]?.bg || '#3B82F6' }} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-sm text-[var(--text-primary)]">{med.name}</p>
                                            <p className="text-xs text-[var(--text-muted)]">{med.category}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs sm:text-sm font-semibold text-[var(--text-primary)]">{med.dosage}</p>
                                            <p className="text-[11px] text-[var(--text-muted)]">{med.frequency}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Interaction Warning Hint */}
                        <div className="rounded-3xl bg-amber-500/10 border border-amber-500/20 p-5 flex items-start gap-3.5">
                            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                            <div className="flex-1 text-xs">
                                <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-1">
                                    Cross-Domain Interaction Guard Active
                                </h4>
                                <p className="text-amber-700 dark:text-amber-400/90 leading-relaxed">
                                    Your medications have been loaded into CURA&apos;s safety engine. When browsing doctors or booking treatments in Ayurveda or Homeopathy, the system will automatically cross-check for potential drug-herb contraindications.
                                </p>
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="text-center pt-4">
                            <Link
                                href="/doctors"
                                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all"
                                style={{ background: 'var(--accent-gradient)' }}
                            >
                                <span>Find Safe Verified Doctors</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
