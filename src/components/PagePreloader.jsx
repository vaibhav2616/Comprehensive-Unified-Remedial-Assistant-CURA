'use client';

import { useEffect, useState, useTransition } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { HeartPulse, Activity } from 'lucide-react';

/**
 * Editorial Clinical Preloader & Navigation Progress Bar
 * Provides instant tactile feedback on route transitions and initial page load.
 */
export default function PagePreloader() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [visible, setVisible] = useState(false);
    const [initialLoaded, setInitialLoaded] = useState(false);

    // Initial page load splash
    useEffect(() => {
        const timer = setTimeout(() => {
            setInitialLoaded(true);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    // Route transition watcher
    useEffect(() => {
        setLoading(true);
        setVisible(true);
        setProgress(25);

        const t1 = setTimeout(() => setProgress(65), 100);
        const t2 = setTimeout(() => setProgress(90), 200);
        const t3 = setTimeout(() => {
            setProgress(100);
            setTimeout(() => {
                setLoading(false);
                setTimeout(() => setVisible(false), 200);
            }, 150);
        }, 320);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
        };
    }, [pathname, searchParams]);

    return (
        <>
            {/* ── Top Viewport Progress Bar ──────────────────────────────── */}
            {visible && (
                <div className="fixed top-0 left-0 right-0 z-[100] h-[3px] overflow-hidden pointer-events-none">
                    <div
                        className="h-full bg-gradient-to-r from-blue-600 via-emerald-500 to-purple-600 transition-all duration-300 ease-out shadow-[0_0_12px_rgba(37,99,235,0.8)]"
                        style={{
                            width: `${progress}%`,
                            opacity: loading ? 1 : 0,
                            transition: 'width 250ms cubic-bezier(0.16, 1, 0.3, 1), opacity 200ms ease',
                        }}
                    />
                </div>
            )}

            {/* ── Micro Editorial Floating Preloader Pill (On Route Switch) ── */}
            {loading && (
                <div
                    className="fixed bottom-6 right-6 z-[90] flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-[var(--surface)]/90 backdrop-blur-xl border border-[var(--border)] shadow-2xl pointer-events-none animate-bounce-in"
                    style={{
                        boxShadow: '0 16px 36px -10px rgba(0,0,0,0.2), 0 0 0 1px var(--border)',
                    }}
                >
                    <div className="relative flex items-center justify-center w-7 h-7 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                        <Activity className="w-4 h-4 animate-pulse" />
                        <span className="absolute w-full h-full rounded-xl bg-blue-500/20 animate-ping opacity-40" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold tracking-wider uppercase text-[var(--text-secondary)]">
                                CURA Clinical OS
                            </span>
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        </div>
                        <p className="text-[10px] text-[var(--text-muted)] font-mono">
                            Verifying Cross-Domain Registry...
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}
