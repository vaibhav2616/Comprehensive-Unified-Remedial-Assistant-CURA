'use client';
import { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { doctors, drugInteractions, DOMAINS, DOMAIN_COLORS } from '@/data/mockData';
import InteractionModal from '@/components/InteractionModal';
import BookingModal from '@/components/BookingModal';
import {
    Star, MapPin, Clock, IndianRupee, Filter, Search, Stethoscope,
    Pill, Leaf, Droplets, Users
} from 'lucide-react';

const domainTabs = [
    { key: 'all', label: 'All Domains', icon: Users, color: 'text-slate-600', bg: 'bg-slate-100', activeBg: 'bg-slate-800', activeText: 'text-white' },
    { key: DOMAINS.ALLOPATHY, label: 'Allopathy', icon: Pill, color: 'text-blue-600', bg: 'bg-blue-50', activeBg: 'bg-blue-600', activeText: 'text-white' },
    { key: DOMAINS.AYURVEDA, label: 'Ayurveda', icon: Leaf, color: 'text-emerald-600', bg: 'bg-emerald-50', activeBg: 'bg-emerald-600', activeText: 'text-white' },
    { key: DOMAINS.HOMEOPATHY, label: 'Homeopathy', icon: Droplets, color: 'text-purple-600', bg: 'bg-purple-50', activeBg: 'bg-purple-600', activeText: 'text-white' },
];

export default function DoctorsPage() {
    const { activePrescription } = useApp();
    const [activeFilter, setActiveFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [interactionData, setInteractionData] = useState(null);
    const [bookingDoctor, setBookingDoctor] = useState(null);

    const filteredDoctors = useMemo(() => {
        let result = doctors;
        if (activeFilter !== 'all') result = result.filter(d => d.domain === activeFilter);
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter(d => d.name.toLowerCase().includes(q) || d.specialization.toLowerCase().includes(q) || d.location.toLowerCase().includes(q));
        }
        return result;
    }, [activeFilter, searchQuery]);

    const handleDoctorClick = (doctor) => {
        if (activePrescription) {
            // Check interactions
            const prescriptionDomain = activePrescription.domain;
            if (doctor.domain !== prescriptionDomain) {
                const conflicts = drugInteractions.filter(
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
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
                        <Stethoscope className="w-8 h-8 inline-block mr-2 text-blue-600" />
                        Doctor Directory
                    </h1>
                    <p className="text-slate-500 max-w-xl mx-auto">
                        Find verified specialists across all three medical domains.
                        {activePrescription && (
                            <span className="text-emerald-600 font-medium"> 🛡 Safety engine active — interactions will be auto-checked.</span>
                        )}
                    </p>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
                    {/* Domain Tabs */}
                    <div className="flex items-center gap-2 flex-wrap justify-center">
                        {domainTabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeFilter === tab.key;
                            return (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveFilter(tab.key)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all
                    ${isActive ? `${tab.activeBg} ${tab.activeText} shadow-md` : `${tab.bg} ${tab.color} hover:opacity-80`}`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* Search */}
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by name, specialization, city..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                        />
                    </div>
                </div>

                {/* Active Prescription Indicator */}
                {activePrescription && (
                    <div className="mb-6 rounded-xl bg-gradient-to-r from-blue-50 to-emerald-50 border border-blue-200 p-4 flex items-center gap-3">
                        <Pill className="w-5 h-5 text-blue-600 flex-shrink-0" />
                        <span className="text-sm text-slate-700">
                            <strong>{activePrescription.medications.length} active medications</strong> loaded from {activePrescription.prescribedBy}'s prescription. Cross-domain interactions will be checked automatically.
                        </span>
                    </div>
                )}

                {/* Doctor Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 stagger-children">
                    {filteredDoctors.map((doctor) => (
                        <DoctorCard key={doctor.id} doctor={doctor} onClick={() => handleDoctorClick(doctor)} />
                    ))}
                </div>

                {filteredDoctors.length === 0 && (
                    <div className="text-center py-16">
                        <Filter className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-slate-400">No doctors match your criteria</h3>
                        <p className="text-sm text-slate-400 mt-1">Try adjusting your filters or search query</p>
                    </div>
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
    const domainColor = DOMAIN_COLORS[doctor.domain];
    const badgeClass = doctor.domain === DOMAINS.ALLOPATHY ? 'badge-allopathy' : doctor.domain === DOMAINS.AYURVEDA ? 'badge-ayurveda' : 'badge-homeopathy';

    return (
        <div
            onClick={onClick}
            className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer animate-fade-up"
        >
            {/* Top accent */}
            <div className="h-1.5" style={{ background: domainColor.bg }} />

            <div className="p-5">
                {/* Avatar + Info */}
                <div className="flex items-start gap-3 mb-4">
                    <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold text-white flex-shrink-0 shadow-md"
                        style={{ background: `linear-gradient(135deg, ${domainColor.bg}, ${domainColor.bg}dd)` }}
                    >
                        {doctor.name.split(' ').slice(-1)[0][0]}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-800 text-sm truncate group-hover:text-blue-700 transition-colors">{doctor.name}</h3>
                        <p className="text-xs text-slate-400 truncate">{doctor.specialization}</p>
                        <span className={`inline-flex mt-1.5 px-2 py-0.5 rounded-md text-xs font-semibold ${badgeClass}`}>
                            {doctor.domain}
                        </span>
                    </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${i < Math.floor(doctor.rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`}
                        />
                    ))}
                    <span className="text-xs font-semibold text-slate-600 ml-1">{doctor.rating}</span>
                </div>

                {/* Meta */}
                <div className="space-y-1.5 text-xs text-slate-500">
                    <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" /> {doctor.location}
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" /> {doctor.experience} years exp.
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-slate-800 font-bold">
                        <IndianRupee className="w-4 h-4" />
                        {doctor.cost}
                    </div>
                    <span className="text-xs font-medium text-blue-600 group-hover:text-blue-700">
                        Book Now →
                    </span>
                </div>
            </div>
        </div>
    );
}

// commit-touch: 2026-08-13 10:30:00

// commit-touch: 2026-08-13 14:00:00

// commit-touch: shubhamsoni1234 2026-08-13 10:30:00

// commit-touch: shubhamsoni1234 2026-08-13 14:00:00

// commit-touch: shubhamsoni1234 2026-08-13 10:30:00

// commit-touch: shubhamsoni1234 2026-08-13 14:00:00

// commit-touch: shubhamsoni1234 2026-08-13 10:30:00
