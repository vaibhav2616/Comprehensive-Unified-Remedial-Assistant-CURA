'use client';
import { AlertTriangle, ShieldAlert, X, ArrowLeft } from 'lucide-react';

export default function InteractionModal({ interactions, doctorName, onClose, onProceed }) {
    if (!interactions || interactions.length === 0) return null;

    const highSeverity = interactions.filter(i => i.severity === 'HIGH');
    const others = interactions.filter(i => i.severity !== 'HIGH');

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden animate-fade-up">
                {/* Header */}
                <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-5 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                        <ShieldAlert className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-xl font-bold text-white">Cross-Domain Interaction Alert</h2>
                        <p className="text-red-100 text-sm mt-1">
                            Potential conflicts detected between your active medications and <strong>{doctorName}'s</strong> medical domain.
                        </p>
                    </div>
                    <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto max-h-[55vh] space-y-4">
                    {/* High Severity */}
                    {highSeverity.length > 0 && (
                        <div>
                            <h3 className="text-sm font-semibold text-red-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4" /> High Severity Interactions
                            </h3>
                            {highSeverity.map(interaction => (
                                <InteractionCard key={interaction.id} interaction={interaction} />
                            ))}
                        </div>
                    )}

                    {/* Other Severity */}
                    {others.length > 0 && (
                        <div>
                            <h3 className="text-sm font-semibold text-amber-700 uppercase tracking-wider mb-3">
                                ⚠ Additional Warnings
                            </h3>
                            {others.map(interaction => (
                                <InteractionCard key={interaction.id} interaction={interaction} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-slate-200 p-6 bg-slate-50 flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-slate-700 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Go Back Safely
                    </button>
                    <button
                        onClick={onProceed}
                        className="flex-1 px-6 py-3 border-2 border-red-300 text-red-700 rounded-xl font-semibold hover:bg-red-50 transition-colors text-sm"
                    >
                        Proceed at Own Risk (Log Consent)
                    </button>
                </div>
            </div>
        </div>
    );
}

function InteractionCard({ interaction }) {
    const severityClass = interaction.severity === 'HIGH' ? 'severity-high' : interaction.severity === 'MODERATE' ? 'severity-moderate' : 'severity-low';
    return (
        <div className="bg-white border border-slate-200 rounded-xl p-4 mb-3 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
                <span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-bold uppercase ${severityClass}`}>
                    {interaction.severity}
                </span>
                <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="text-sm font-semibold text-slate-800">{interaction.medication}</span>
                        <span className="text-slate-400">↔</span>
                        <span className="text-sm font-semibold text-slate-800">{interaction.conflictSubstance}</span>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">{interaction.description}</p>
                </div>
            </div>
        </div>
    );
}
