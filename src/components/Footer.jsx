import { HeartPulse, ShieldCheck, FileCheck, Stethoscope } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-white border-t border-[var(--gray-200)] mt-auto pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">

                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="flex items-center space-x-2 mb-4">
                            <div className="bg-[var(--med-blue)] p-1.5 rounded-lg">
                                <HeartPulse className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-[var(--navy)]">CURA</span>
                        </Link>
                        <p className="text-sm text-[var(--gray-500)] leading-relaxed">
                            Comprehensive Unified Remedial Assistant.
                            Bridging modern medicine and traditional healing with clinical safety.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold text-[var(--navy)] mb-4">Patient Services</h3>
                        <ul className="space-y-3 text-sm text-[var(--gray-500)]">
                            <li><Link href="/doctors" className="hover:text-[var(--med-blue)]">Find a Doctor</Link></li>
                            <li><Link href="/prescription" className="hover:text-[var(--med-blue)]">Analyze Prescription</Link></li>
                            <li><Link href="/dashboard/patient" className="hover:text-[var(--med-blue)]">Patient Portal</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-[var(--navy)] mb-4">Provider Services</h3>
                        <ul className="space-y-3 text-sm text-[var(--gray-500)]">
                            <li><Link href="/dashboard/doctor" className="hover:text-[var(--med-blue)]">Doctor Portal</Link></li>
                            <li><a href="#" className="hover:text-[var(--med-blue)]">Clinical Guidelines</a></li>
                            <li><a href="#" className="hover:text-[var(--med-blue)]">Join Network</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-[var(--navy)] mb-4">Medical Safety</h3>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3 text-sm text-[var(--gray-600)]">
                                <ShieldCheck className="h-4 w-4 text-[var(--hc-green)]" />
                                <span>HIPAA Compliant</span>
                            </div>
                            <div className="flex items-center space-x-3 text-sm text-[var(--gray-600)]">
                                <Stethoscope className="h-4 w-4 text-[var(--med-blue)]" />
                                <span>Verified Providers</span>
                            </div>
                            <div className="flex items-center space-x-3 text-sm text-[var(--gray-600)]">
                                <FileCheck className="h-4 w-4 text-[var(--navy-light)]" />
                                <span>Clinical Interaction Checks</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-[var(--gray-100)] flex flex-col md:flex-row justify-between items-center">
                    <p className="text-sm text-[var(--gray-400)]">
                        © 2026 CURA Healthcare. All rights reserved. Not intended for emergency care.
                    </p>
                    <div className="flex space-x-2 mt-4 md:mt-0">
                        <span className="w-3 h-3 rounded-full bg-[var(--allo)]"></span>
                        <span className="w-3 h-3 rounded-full bg-[var(--ayur)]"></span>
                        <span className="w-3 h-3 rounded-full bg-[var(--homeo)]"></span>
                    </div>
                </div>

            </div>
        </footer>
    );
}

// commit-touch: 2026-08-10 18:30:00

// commit-touch: shubhamsoni1234 2026-08-10 18:30:00

// commit-touch: shubhamsoni1234 2026-08-10 18:30:00

// commit-touch: shubhamsoni1234 2026-08-10 18:30:00
