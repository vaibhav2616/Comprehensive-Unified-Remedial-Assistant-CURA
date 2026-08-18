'use client';
import { useContext } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { HeartPulse, ChevronDown } from 'lucide-react';

export default function Navbar() {
    const { userRole } = useApp();

    return (
        <nav className="fixed top-0 w-full glass z-50 border-b border-[var(--gray-200)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">

                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="bg-[var(--med-blue)] p-1.5 rounded-lg">
                            <HeartPulse className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-xl font-bold text-[var(--navy)]">CURA</span>
                    </Link>

                    {/* Nav Links */}
                    <div className="hidden md:flex space-x-8">
                        <Link href="/prescription" className="text-[var(--gray-600)] hover:text-[var(--med-blue)] font-medium transition-colors">
                            Upload Rx
                        </Link>
                        <Link href="/doctors" className="text-[var(--gray-600)] hover:text-[var(--med-blue)] font-medium transition-colors">
                            Find Doctors
                        </Link>
                        <Link href="/community" className="text-[var(--gray-600)] hover:text-[var(--med-blue)] font-medium transition-colors">
                            Community
                        </Link>
                        <Link href="/about" className="text-[var(--gray-600)] hover:text-[var(--med-blue)] font-medium transition-colors">
                            About
                        </Link>
                        <div className="relative group">
                            <button className="flex items-center text-[var(--gray-600)] hover:text-[var(--med-blue)] font-medium transition-colors">
                                <span>Dashboard</span>
                                <ChevronDown className="h-4 w-4 ml-1" />
                            </button>
                            <div className="absolute hidden group-hover:block w-48 bg-white shadow-lg border border-[var(--gray-100)] rounded-md mt-2">
                                <Link href="/dashboard/patient" className="block px-4 py-2 hover:bg-[var(--sky-pale)] text-[var(--gray-700)]">
                                    Patient Portal
                                </Link>
                                <Link href="/dashboard/doctor" className="block px-4 py-2 hover:bg-[var(--sky-pale)] text-[var(--gray-700)]">
                                    Doctor Portal
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* User Role & Mobile Menu */}
                    <div className="flex items-center space-x-4">
                        <div className="px-3 py-1 bg-[var(--sky-pale)] text-[var(--med-blue)] border border-[var(--sky-light)] text-sm font-medium rounded-full cursor-default">
                            {userRole === 'patient' ? 'Patient' : 'Doctor'}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}

// commit-touch: 2026-08-10 16:10:00

// commit-touch: 2026-08-18 15:45:00

// commit-touch: 2026-08-20 13:30:00

// commit-touch: 2026-08-26 13:45:00

// commit-touch: shubhamsoni1234 2026-08-10 16:10:00

// commit-touch: tusharsingh1206 2026-08-18 15:45:00

// commit-touch: shubhamsoni1234 2026-08-20 13:30:00

// commit-touch: shubhamsoni1234 2026-08-26 13:45:00

// commit-touch: shubhamsoni1234 2026-08-10 16:10:00

// commit-touch: tusharsingh1206 2026-08-18 15:45:00

// commit-touch: shubhamsoni1234 2026-08-20 13:30:00

// commit-touch: shubhamsoni1234 2026-08-26 13:45:00

// commit-touch: shubhamsoni1234 2026-08-10 16:10:00

// commit-touch: tusharsingh1206 2026-08-18 15:45:00
