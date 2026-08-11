'use client';
import Link from 'next/link';

const BADGES = [
    { icon: '🛡️', label: 'DPDP 2023 Compliant', sublabel: 'India digital privacy law' },
    { icon: '⚕️', label: 'AYUSH Aligned', sublabel: 'Ministry of AYUSH India' },
    { icon: '🔒', label: 'AES-256 Encrypted', sublabel: 'All records at rest & transit' },
    { icon: '✅', label: 'Doctor-in-the-Loop', sublabel: 'No AI prescription without MD' },
];

export default function TrustBadges({ compact = false }) {
    if (compact) {
        return (
            <div className="flex flex-wrap items-center gap-3 text-xs">
                {BADGES.map(b => (
                    <span key={b.label} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-gray-600 shadow-sm">
                        <span>{b.icon}</span>
                        <span className="font-medium text-gray-700">{b.label}</span>
                    </span>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {BADGES.map(b => (
                <div key={b.label} className="flex flex-col items-center text-center p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                    <span className="text-2xl mb-2">{b.icon}</span>
                    <span className="text-sm font-semibold text-gray-800">{b.label}</span>
                    <span className="text-xs text-gray-500 mt-0.5">{b.sublabel}</span>
                </div>
            ))}
        </div>
    );
}

// commit-touch: 2026-08-11 13:45:00

// commit-touch: shubhamsoni1234 2026-08-11 13:45:00

// commit-touch: shubhamsoni1234 2026-08-11 13:45:00

// commit-touch: shubhamsoni1234 2026-08-11 13:45:00
