'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { HeartPulse, ChevronDown, Menu, X, LogIn, UserPlus } from 'lucide-react';

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

                    {/* Desktop Auth & User Actions */}
                    <div className="flex items-center space-x-3">
                        {/* Role Indicator Badge */}
                        {currentUser && (
                            <div className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1 bg-[var(--sky-pale)] text-[var(--med-blue)] border border-[var(--sky-light)] text-sm font-medium rounded-full cursor-default">
                                <span className="w-2 h-2 rounded-full bg-[var(--hc-green)]"></span>
                                <span>{currentUser?.role === 'patient' ? 'Patient' : 'Doctor'}</span>
                            </div>
                        )}

                        {/* Login & Sign Up buttons */}
                        <div className="hidden sm:flex items-center space-x-2">
                            <Link
                                href="/login"
                                className="px-3.5 py-1.5 text-sm font-medium text-slate-700 hover:text-[var(--med-blue)] hover:bg-[var(--sky-pale)] rounded-lg transition-colors flex items-center gap-1.5"
                            >
                                <LogIn className="w-4 h-4" />
                                <span>Login</span>
                            </Link>
                            <Link
                                href="/register"
                                className="px-3.5 py-1.5 text-sm font-medium bg-[var(--med-blue)] hover:bg-[var(--med-blue-2)] text-white rounded-lg transition-colors shadow-sm flex items-center gap-1.5"
                            >
                                <UserPlus className="w-4 h-4" />
                                <span>Sign Up</span>
                            </Link>
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

                        {/* Mobile Auth Actions (Login / Sign Up) */}
                        <div className="pt-3 border-t border-[var(--gray-200)] flex gap-2">
                            <Link
                                href="/login"
                                onClick={closeMobileMenu}
                                className="flex-1 text-center py-2 px-3 text-sm font-medium border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5"
                            >
                                <LogIn className="w-3.5 h-3.5" />
                                <span>Login</span>
                            </Link>
                            <Link
                                href="/register"
                                onClick={closeMobileMenu}
                                className="flex-1 text-center py-2 px-3 text-sm font-medium bg-[var(--med-blue)] hover:bg-[var(--med-blue-2)] text-white rounded-lg transition-colors shadow-sm flex items-center justify-center gap-1.5"
                            >
                                <UserPlus className="w-3.5 h-3.5" />
                                <span>Sign Up</span>
                            </Link>
                        </div>

                        {/* Mobile Role Badge */}
                        <div className="pt-2 flex items-center justify-between px-1">
                            <span className="text-xs text-[var(--gray-500)] font-medium">Active: {currentUser?.name || 'Guest'}</span>
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
