'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
    Stethoscope, Pill, Leaf, Droplets, Star, MapPin,
    Search, Filter, ShieldAlert, ArrowRight, Loader2, AlertCircle, Clock, IndianRupee, Sparkles, CheckCircle2
} from 'lucide-react';
import BookingModal from '@/components/BookingModal';

export default function DoctorsPage() {
    const { activeDomain, activePrescription } = useApp();
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeFilter, setActiveFilter] = useState(activeDomain || 'ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [bookingDoctor, setBookingDoctor] = useState(null);
    const [interactionData, setInteractionData] = useState(null);

    const domainTabs = [
        { key: 'ALL', label: 'All Disciplines', icon: Stethoscope, activeBg: 'bg-[var(--surface-hover)] border-blue-500', activeText: 'text-[var(--text-primary)]', defaultBg: 'bg-[var(--surface)]', defaultText: 'text-[var(--text-secondary)]' },
        { key: 'ALLOPATHY', label: 'Allopathy', icon: Pill, activeBg: 'bg-blue-600', activeText: 'text-white', defaultBg: 'bg-blue-500/10', defaultText: 'text-blue-600 dark:text-blue-400' },
        { key: 'AYURVEDA', label: 'Ayurveda', icon: Leaf, activeBg: 'bg-emerald-600', activeText: 'text-white', defaultBg: 'bg-emerald-500/10', defaultText: 'text-emerald-600 dark:text-emerald-400' },
        { key: 'HOMEOPATHY', label: 'Homeopathy', icon: Droplets, activeBg: 'bg-purple-600', activeText: 'text-white', defaultBg: 'bg-purple-500/10', defaultText: 'text-purple-600 dark:text-purple-400' },
    ];

    useEffect(() => {
        if (activeDomain && activeDomain !== 'ALL') {
            setActiveFilter(activeDomain);
        }
    }, [activeDomain]);

    useEffect(() => {
        async function fetchDoctors() {
            setLoading(true);
            setError(null);
            try {
                const params = new URLSearchParams();
                if (activeFilter && activeFilter !== 'ALL') params.set('domain', activeFilter);
                if (searchQuery.trim()) params.set('search', searchQuery.trim());

                const res = await fetch(`/api/doctors?${params.toString()}`);
                if (!res.ok) throw new Error('Failed to load doctors');
                const data = await res.json();
                setDoctors(data.doctors || []);
            } catch (err) {
                setError(err.message);
                setDoctors([]);
            } finally {
                setLoading(false);
            }
        }
        const timeout = setTimeout(fetchDoctors, 250);
        return () => clearTimeout(timeout);
    }, [activeFilter, searchQuery]);

    const handleDoctorClick = (doctor) => {
        if (activePrescription && activePrescription.medications?.length > 0) {
            if (activePrescription.interactions && activePrescription.interactions.length > 0) {
                const conflicts = activePrescription.interactions.filter(
                    int => int.conflictDomain === doctor.domain &&
                        activePrescription.medications.some(m => m.name === int.medication)
                );
                if (conflicts.length > 0) {
                    setSelectedDoctor(doctor);
                    setInteractionData(conflicts);
                    return;
                }
            }
        }
        setBookingDoctor(doctor);
    };

    return (
        <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] py-12 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-4 animate-fade-in">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Verified Multidisciplinary Network</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
                        Doctor Directory
                    </h1>
                    <p className="text-[var(--text-secondary)] max-w-xl mx-auto text-sm leading-relaxed">
                        Find verified specialists across Allopathy, Ayurveda, and Homeopathy.
                        {activePrescription && (
                            <span className="text-emerald-600 dark:text-emerald-400 font-semibold block mt-1">
                                🛡 Safety engine active — cross-domain interactions are checked automatically.
                            </span>
                        )}
                    </p>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-2 flex-wrap">
                        {domainTabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeFilter === tab.key;
                            return (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveFilter(tab.key)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${isActive
                                        ? `${tab.activeBg} ${tab.activeText} shadow-md`
                                        : `${tab.defaultBg} ${tab.defaultText} hover:opacity-80 border border-[var(--border)]`
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span>{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>
                    <div className="relative w-full md:w-auto md:min-w-[320px]">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                        <input
                            type="text"
                            placeholder="Search by doctor, specialization, city..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-[var(--border)] rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-[var(--surface)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] transition shadow-sm"
                        />
                    </div>
                </div>

                {/* Error banner */}
                {error && (
                    <div className="mb-6 flex items-center gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-700 dark:text-amber-400 text-xs">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Active Prescription Indicator */}
                {activePrescription && (
                    <div className="mb-6 rounded-2xl bg-gradient-to-r from-blue-500/10 to-emerald-500/10 border border-blue-500/20 p-4 flex items-center gap-3 text-xs">
                        <Pill className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                        <span className="text-[var(--text-secondary)]">
                            <strong className="text-[var(--text-primary)]">{activePrescription.medications.length} active medications</strong> loaded. Clinical herb-drug interactions are guarded.
                        </span>
                    </div>
                )}

                {/* Loading */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-3">
                        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                        <p className="text-xs text-[var(--text-muted)] font-mono">Syncing Doctor Registry...</p>
                    </div>
                ) : (
                    <>
                        {/* Doctor Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 stagger">
                            {doctors.map((doctor) => (
                                <DoctorCard key={doctor.id} doctor={doctor} onClick={() => handleDoctorClick(doctor)} />
                            ))}
                        </div>

                        {doctors.length === 0 && (
                            <div className="text-center py-20 bg-[var(--surface)] rounded-3xl border border-[var(--border)] p-8">
                                <Filter className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-3 opacity-50" />
                                <h3 className="text-base font-bold text-[var(--text-primary)]">No specialists found</h3>
                                <p className="text-xs text-[var(--text-muted)] mt-1">Try resetting your discipline filter or search keyword.</p>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Modals */}
            {interactionData && selectedDoctor && (
                <InteractionModal
                    interactions={interactionData}
                    doctorName={selectedDoctor.name}
                    onClose={() => { setInteractionData(null); setSelectedDoctor(null); }}
                    onProceed={() => { setInteractionData(null); setBookingDoctor(selectedDoctor); setSelectedDoctor(null); }}
                />
            )}
            {bookingDoctor && (
                <BookingModal doctor={bookingDoctor} onClose={() => setBookingDoctor(null)} />
            )}
        </div>
    );
}

function DoctorCard({ doctor, onClick }) {
    const domainColorMap = {
        ALLOPATHY: { bg: '#3B82F6', badgeBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30' },
        AYURVEDA: { bg: '#10B981', badgeBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' },
        HOMEOPATHY: { bg: '#A855F7', badgeBg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30' },
    };
    const domainMeta = domainColorMap[doctor.domain] || { bg: '#64748B', badgeBg: 'bg-slate-500/10 text-slate-400 border-slate-500/20' };
    const displayDomain = doctor.domain || (doctor.domains && doctor.domains[0]) || 'General';

    return (
        <div
            onClick={onClick}
            className="group bg-[var(--surface)] rounded-3xl border border-[var(--border)] overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between"
        >
            {/* Top Domain Accent Line */}
            <div className="h-1.5" style={{ background: domainMeta.bg }} />

            <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                    {/* Avatar + Info */}
                    <div className="flex items-start gap-3.5 mb-4">
                        <div
                            className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-extrabold text-white flex-shrink-0 shadow-md"
                            style={{ background: `linear-gradient(135deg, ${domainMeta.bg}, ${domainMeta.bg}cc)` }}
                        >
                            {(doctor.name || 'D').split(' ').slice(-1)[0][0]}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-sm text-[var(--text-primary)] truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {doctor.name}
                            </h3>
                            <p className="text-xs text-[var(--text-muted)] truncate mt-0.5">
                                {Array.isArray(doctor.specialization) ? doctor.specialization.join(', ') : doctor.specialization}
                            </p>
                            <span className={`inline-flex mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${domainMeta.badgeBg}`}>
                                {displayDomain}
                            </span>
                        </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${i < Math.floor(doctor.rating || doctor.avgRating || 0)
                                    ? 'text-amber-400 fill-amber-400'
                                    : 'text-[var(--border)]'
                                    }`}
                            />
                        ))}
                        <span className="text-xs font-bold text-[var(--text-secondary)] ml-1">
                            {(doctor.rating || doctor.avgRating || 0).toFixed(1)}
                        </span>
                    </div>

                    {/* Meta info */}
                    <div className="space-y-1.5 text-xs text-[var(--text-muted)] mb-4">
                        <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="truncate">{doctor.location || doctor.city || 'India'}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                            <span>{doctor.experience || 5} years experience</span>
                        </div>
                    </div>
                </div>

                {/* Card Footer */}
                <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between">
                    <div className="flex items-center text-sm font-extrabold text-[var(--text-primary)]">
                        <IndianRupee className="w-3.5 h-3.5" />
                        <span>{doctor.cost || doctor.consultFee || '500'}</span>
                    </div>
                    <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                        Book Consult <ArrowRight className="w-3 h-3" />
                    </span>
                </div>
            </div>
        </div>
    );
}

function InteractionModal({ interactions, doctorName, onClose, onProceed }) {
    return (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
            <div className="relative bg-[var(--surface)] text-[var(--text-primary)] rounded-3xl p-6 sm:p-8 max-w-md w-full border border-red-500/30 shadow-2xl animate-fade-up">
                <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center mb-4">
                    <ShieldAlert className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-2">Cross-Domain Interaction Warning</h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
                    You have active medications that may cross-react with treatments offered by <strong>{doctorName}</strong>.
                </p>
                <div className="space-y-2 mb-6 max-h-48 overflow-y-auto">
                    {interactions.map((int, i) => (
                        <div key={i} className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-700 dark:text-red-300">
                            <strong>{int.medication}</strong> conflicts with {int.conflictDomain} herb/drug: {int.reason}
                        </div>
                    ))}
                </div>
                <div className="flex items-center justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 border border-[var(--border)] rounded-xl text-xs font-semibold text-[var(--text-secondary)] hover:bg-[var(--surface-2)]">
                        Cancel
                    </button>
                    <button onClick={onProceed} className="px-5 py-2 bg-red-600 text-white rounded-xl text-xs font-semibold hover:bg-red-700">
                        Proceed Anyway
                    </button>
                </div>
            </div>
        </div>
    );
}
