'use client';
import { useState, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import {
    Upload, FileText, Loader2, CheckCircle, Pill, AlertTriangle,
    ScanLine, Sparkles, ArrowRight, Trash2
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
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[var(--sky-pale)] border border-[var(--sky-light)] rounded-full text-sm text-[var(--med-blue)] mb-4">
                        <ScanLine className="w-4 h-4" />
                        Clinical Prescription Analysis
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
                        Upload Your Prescription
                    </h1>
                    <p className="text-[var(--gray-600)] max-w-xl mx-auto">
                        Our system securely extracts your medications and checks for dangerous cross-domain interactions before you book any appointment.
                    </p>
                </div>

                {/* Upload State Machine */}
                {uploadState === 'idle' && !activePrescription && (
                    <div
                        className={`relative rounded-2xl border-2 border-dashed p-12 text-center transition-all cursor-pointer
              ${dragActive ? 'border-blue-500 bg-blue-50 scale-[1.01]' : 'border-slate-300 bg-white hover:border-blue-400 hover:bg-blue-50/50'}`}
                        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                        onDragLeave={() => setDragActive(false)}
                        onDrop={(e) => { e.preventDefault(); setDragActive(false); handleUpload(); }}
                        onClick={handleUpload}
                    >
                        <input ref={fileRef} type="file" className="hidden" accept="image/*,.pdf" />
                        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-[var(--sky-pale)] border border-[var(--sky-light)] flex items-center justify-center">
                            <Upload className="w-10 h-10 text-[var(--med-blue)]" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Drop your prescription here</h3>
                        <p className="text-sm text-slate-400 mb-4">Supports images (JPG, PNG) and PDF files</p>
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--med-blue)] text-white rounded-md text-sm font-medium hover:bg-[var(--med-blue-2)] transition-colors">
                            <FileText className="w-4 h-4" />
                            Browse Files
                        </div>
                        <p className="text-xs text-slate-400 mt-4">🔒 Your prescription data is encrypted and never stored permanently</p>
                    </div>
                )}

                {/* Uploading State */}
                {uploadState === 'uploading' && (
                    <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-lg animate-fade-up">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-blue-100 flex items-center justify-center animate-pulse">
                            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Uploading Prescription...</h3>
                        <p className="text-sm text-slate-400">Securely transferring your document</p>
                        <div className="w-64 h-2 bg-slate-100 rounded-full mx-auto mt-6 overflow-hidden">
                            <div className="h-full bg-[var(--med-blue)] rounded-full animate-shimmer" style={{ width: '60%' }} />
                        </div>
                    </div>
                )}

                {/* Extracting State */}
                {uploadState === 'extracting' && (
                    <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-lg animate-fade-up">
                        <div className="relative w-20 h-20 mx-auto mb-6 rounded-2xl bg-[var(--sky-pale)] flex items-center justify-center">
                            <FileText className="w-10 h-10 text-[var(--med-blue)]" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Clinical Extraction in Progress</h3>
                        <p className="text-sm text-slate-400 mb-4">Identifying medications, dosages, and frequencies securely.</p>

                        {/* Simulated scan lines */}
                        <div className="max-w-sm mx-auto bg-slate-50 border border-slate-200 rounded-xl p-4 relative overflow-hidden">
                            <div className="absolute left-0 right-0 h-0.5 bg-[var(--med-blue)]/60 animate-scan-line" />
                            <div className="space-y-2 text-left">
                                <div className="h-3 bg-slate-200 rounded w-3/4 animate-pulse" />
                                <div className="h-3 bg-slate-200 rounded w-1/2 animate-pulse" style={{ animationDelay: '0.2s' }} />
                                <div className="h-3 bg-slate-200 rounded w-2/3 animate-pulse" style={{ animationDelay: '0.4s' }} />
                                <div className="h-3 bg-slate-200 rounded w-1/3 animate-pulse" style={{ animationDelay: '0.6s' }} />
                            </div>
                        </div>
                    </div>
                )}

                {/* Done — Show Extracted Medications */}
                {uploadState === 'done' && activePrescription && (
                    <div className="animate-fade-up">
                        {/* Success header */}
                        <div className="rounded-2xl bg-[var(--sky-pale)] border border-[var(--sky-light)] p-6 mb-6 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-[var(--hc-green)] flex items-center justify-center flex-shrink-0">
                                <CheckCircle className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-slate-800">Prescription Analyzed Successfully</h3>
                                <p className="text-sm text-slate-500">
                                    Prescribed by {activePrescription.prescribedBy} on {activePrescription.issueDate} for {activePrescription.patientName}
                                </p>
                            </div>
                            <button
                                onClick={clearPrescription}
                                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg border border-red-200 transition-colors"
                            >
                                <Trash2 className="w-3 h-3" /> Clear
                            </button>
                        </div>

                        {/* Medications List */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                                <Pill className="w-5 h-5 text-blue-600" />
                                <h3 className="font-bold text-slate-800">Active Medications ({activePrescription.medications.length})</h3>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {activePrescription.medications.map((med, i) => (
                                    <div key={med.id} className="px-6 py-4 flex items-center gap-4 hover:bg-slate-50 transition-colors animate-slide-right" style={{ animationDelay: `${i * 100}ms` }}>
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                                            style={{ background: DOMAIN_COLORS[med.domain]?.light }}
                                        >
                                            <Pill className="w-5 h-5" style={{ color: DOMAIN_COLORS[med.domain]?.bg }} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold text-slate-800">{med.name}</p>
                                            <p className="text-sm text-slate-400">{med.category}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-slate-700">{med.dosage}</p>
                                            <p className="text-xs text-slate-400">{med.frequency}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Interaction Warning hint */}
                        <div className="mt-6 rounded-2xl bg-amber-50 border border-amber-200 p-5 flex items-start gap-4">
                            <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <h4 className="font-semibold text-amber-800 mb-1">Cross-Domain Interaction Protection Active</h4>
                                <p className="text-sm text-amber-700 leading-relaxed">
                                    Your medications have been loaded into CURA's safety engine. When you browse the doctor directory, we'll automatically flag any cross-domain interactions before you book.
                                </p>
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="mt-8 text-center">
                            <Link
                                href="/doctors"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--med-blue)] text-white rounded-md font-semibold shadow-sm hover:bg-[var(--med-blue-2)] transition-all"
                            >
                                Find a Doctor <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// commit-touch: 2026-08-12 09:10:00

// commit-touch: 2026-08-12 11:35:00

// commit-touch: shubhamsoni1234 2026-08-12 09:10:00

// commit-touch: shubhamsoni1234 2026-08-12 11:35:00

// commit-touch: shubhamsoni1234 2026-08-12 09:10:00

// commit-touch: shubhamsoni1234 2026-08-12 11:35:00

// commit-touch: shubhamsoni1234 2026-08-12 09:10:00
