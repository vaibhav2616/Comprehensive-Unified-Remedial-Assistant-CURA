import { HeartPulse, ShieldCheck, FileCheck, Stethoscope } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-[var(--surface)] text-[var(--text-secondary)] border-t border-[var(--border)] mt-auto pt-16 pb-10 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="flex items-center space-x-2.5 mb-4 group">
                            <div className="p-1.5 rounded-xl shadow-sm transition-transform group-hover:scale-105" style={{ background: 'var(--accent-gradient)' }}>
                                <HeartPulse className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-xl font-extrabold tracking-tight text-[var(--text-primary)]">CURA</span>
                        </Link>
                        <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                            Comprehensive Unified Remedial Assistant.
                            Bridging modern Western medicine and traditional clinical systems with automated cross-domain safety.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-bold text-xs uppercase tracking-wider text-[var(--text-primary)] mb-4">Patient Services</h3>
                        <ul className="space-y-2.5 text-xs text-[var(--text-muted)]">
                            <li><Link href="/doctors" className="hover:text-[var(--primary)] transition">Find a Verified Doctor</Link></li>
                            <li><Link href="/symptom-checker" className="hover:text-[var(--primary)] transition">Adaptive Symptom Survey</Link></li>
                            <li><Link href="/prescription" className="hover:text-[var(--primary)] transition">Analyze Prescription</Link></li>
                            <li><Link href="/dashboard/patient" className="hover:text-[var(--primary)] transition">Patient Health Portal</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold text-xs uppercase tracking-wider text-[var(--text-primary)] mb-4">Clinician Services</h3>
                        <ul className="space-y-2.5 text-xs text-[var(--text-muted)]">
                            <li><Link href="/dashboard/doctor" className="hover:text-[var(--primary)] transition">Doctor Clinic Portal</Link></li>
                            <li><Link href="/dashboard/doctor/approvals" className="hover:text-[var(--primary)] transition">Clinical Approvals Queue</Link></li>
                            <li><Link href="/community" className="hover:text-[var(--primary)] transition">Practitioner Discussions</Link></li>
                            <li><a href="#" className="hover:text-[var(--primary)] transition">Cross-Domain Guidelines</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold text-xs uppercase tracking-wider text-[var(--text-primary)] mb-4">Clinical Safety Standard</h3>
                        <div className="space-y-3">
                            <div className="flex items-center space-x-2.5 text-xs text-[var(--text-secondary)]">
                                <ShieldCheck className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                                <span>HIPAA Compliant Data Architecture</span>
                            </div>
                            <div className="flex items-center space-x-2.5 text-xs text-[var(--text-secondary)]">
                                <Stethoscope className="h-4 w-4 text-blue-500 flex-shrink-0" />
                                <span>Board-Certified Multidisciplinary Doctors</span>
                            </div>
                            <div className="flex items-center space-x-2.5 text-xs text-[var(--text-secondary)]">
                                <FileCheck className="h-4 w-4 text-purple-500 flex-shrink-0" />
                                <span>Automated Herb-Drug Interaction Matrix</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-[var(--border)] flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-[var(--text-muted)]">
                        © 2026 CURA Healthcare OS. All rights reserved. Intended for clinical decision support.
                    </p>
                    <div className="flex items-center space-x-3 text-xs">
                        <span className="flex items-center gap-1.5 text-[var(--text-muted)]">
                            <span className="w-2 h-2 rounded-full bg-blue-500"></span> Allopathy
                        </span>
                        <span className="flex items-center gap-1.5 text-[var(--text-muted)]">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Ayurveda
                        </span>
                        <span className="flex items-center gap-1.5 text-[var(--text-muted)]">
                            <span className="w-2 h-2 rounded-full bg-purple-500"></span> Homeopathy
                        </span>
                    </div>
                </div>

            </div>
        </footer>
    );
}
