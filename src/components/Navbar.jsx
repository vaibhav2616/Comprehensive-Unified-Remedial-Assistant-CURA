'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { HeartPulse, ChevronDown, Menu, X } from 'lucide-react';

export default function Navbar() {
    const { currentUser } = useApp();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileDashboardOpen, setMobileDashboardOpen] = useState(false);

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
        setMobileDashboardOpen(false);
    };

    return (
        <nav className="fixed top-0 w-full glass z-50 border-b border-[var(--gray-200)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">

                    {/* Logo */}
                    <Link href="/" onClick={closeMobileMenu} className="flex items-center space-x-2">
                        <div className="bg-[var(--med-blue)] p-1.5 rounded-lg">
                            <HeartPulse className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-xl font-bold text-[var(--navy)]">CURA</span>
                    </Link>

                    {/* Desktop Nav Links */}
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

                    {/* Desktop User Role & Mobile Hamburger Button */}
                    <div className="flex items-center space-x-3">
                        <div className="hidden sm:inline-flex px-3 py-1 bg-[var(--sky-pale)] text-[var(--med-blue)] border border-[var(--sky-light)] text-sm font-medium rounded-full cursor-default">
                            {currentUser?.role === 'patient' ? 'Patient' : 'Doctor'}
                        </div>

                        {/* Hamburger Button (below md breakpoint) */}
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(prev => !prev)}
                            className="md:hidden p-2 rounded-lg text-[var(--gray-600)] hover:text-[var(--med-blue)] hover:bg-[var(--sky-pale)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--med-blue)]/20"
                            aria-label="Toggle navigation menu"
                            aria-expanded={mobileMenuOpen}
                        >
                            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Slide-down Menu (below md breakpoint) */}
            {mobileMenuOpen && (
                <div className="md:hidden glass border-t border-[var(--gray-200)] shadow-lg animate-fade-in">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-2">
                        <Link
                            href="/prescription"
                            onClick={closeMobileMenu}
                            className="block px-3 py-2.5 rounded-lg text-[var(--gray-700)] hover:text-[var(--med-blue)] hover:bg-[var(--sky-pale)] font-medium transition-colors"
                        >
                            Upload Rx
                        </Link>
                        <Link
                            href="/doctors"
                            onClick={closeMobileMenu}
                            className="block px-3 py-2.5 rounded-lg text-[var(--gray-700)] hover:text-[var(--med-blue)] hover:bg-[var(--sky-pale)] font-medium transition-colors"
                        >
                            Find Doctors
                        </Link>
                        <Link
                            href="/community"
                            onClick={closeMobileMenu}
                            className="block px-3 py-2.5 rounded-lg text-[var(--gray-700)] hover:text-[var(--med-blue)] hover:bg-[var(--sky-pale)] font-medium transition-colors"
                        >
                            Community
                        </Link>
                        <Link
                            href="/about"
                            onClick={closeMobileMenu}
                            className="block px-3 py-2.5 rounded-lg text-[var(--gray-700)] hover:text-[var(--med-blue)] hover:bg-[var(--sky-pale)] font-medium transition-colors"
                        >
                            About
                        </Link>

                        {/* Mobile Dashboard Dropdown */}
                        <div className="pt-1">
                            <button
                                type="button"
                                onClick={() => setMobileDashboardOpen(prev => !prev)}
                                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-[var(--gray-700)] hover:text-[var(--med-blue)] hover:bg-[var(--sky-pale)] font-medium transition-colors"
                            >
                                <span>Dashboard</span>
                                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${mobileDashboardOpen ? 'rotate-180 text-[var(--med-blue)]' : ''}`} />
                            </button>
                            {mobileDashboardOpen && (
                                <div className="pl-4 pr-2 py-1 space-y-1 mt-1 border-l-2 border-[var(--sky-light)] ml-3">
                                    <Link
                                        href="/dashboard/patient"
                                        onClick={closeMobileMenu}
                                        className="block px-3 py-2 rounded-md text-sm text-[var(--gray-600)] hover:text-[var(--med-blue)] hover:bg-[var(--sky-pale)] transition-colors"
                                    >
                                        Patient Portal
                                    </Link>
                                    <Link
                                        href="/dashboard/doctor"
                                        onClick={closeMobileMenu}
                                        className="block px-3 py-2 rounded-md text-sm text-[var(--gray-600)] hover:text-[var(--med-blue)] hover:bg-[var(--sky-pale)] transition-colors"
                                    >
                                        Doctor Portal
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Mobile Role Badge */}
                        <div className="pt-4 mt-2 border-t border-[var(--gray-200)] flex items-center justify-between px-3">
                            <span className="text-xs text-[var(--gray-500)] font-medium">Active Profile</span>
                            <div className="px-3 py-1 bg-[var(--sky-pale)] text-[var(--med-blue)] border border-[var(--sky-light)] text-xs font-semibold rounded-full">
                                {currentUser?.role === 'patient' ? 'Patient' : 'Doctor'}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
