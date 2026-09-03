'use client';

import { useState, useEffect } from 'react';
import { useApp, DOMAIN_THEMES } from '@/context/AppContext';
import { Users, Pill, Leaf, Droplets, Star, TrendingUp, IndianRupee, Clock, MessageSquareQuote, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const ICONS = {
    ALL: Users,
    ALLOPATHY: Pill,
    AYURVEDA: Leaf,
    HOMEOPATHY: Droplets,
};

/**
 * Professional Multi-Domain Switching UI.
 * Works both as a compact global segmented switcher (`compact`) and an interactive
 * full comparison deck backed by `/api/domains/stats` (`showInsights`).
 */
export default function DomainSwitcher({
    includeAll = true,
    value = null,
    onChange = null,
    showInsights = false,
    compact = false,
}) {
    const { activeDomain, setActiveDomain } = useApp();
    const current = value !== null ? value : activeDomain;
    const handleSelect = onChange || setActiveDomain;

    const [statsMap, setStatsMap] = useState({});
    const [loadingStats, setLoadingStats] = useState(false);

    useEffect(() => {
        if (!showInsights) return;
        let cancelled = false;
        async function loadStats() {
            setLoadingStats(true);
            try {
                const res = await fetch('/api/domains/stats');
                const data = await res.json();
                if (!cancelled && data.success && Array.isArray(data.domains)) {
                    const map = {};
                    data.domains.forEach(d => { map[d.key] = d; });
                    setStatsMap(map);
                }
            } catch {
                // ignore
            } finally {
                if (!cancelled) setLoadingStats(false);
            }
        }
        loadStats();
        return () => { cancelled = true; };
    }, [showInsights]);

    const keys = includeAll
        ? ['ALL', 'ALLOPATHY', 'AYURVEDA', 'HOMEOPATHY']
        : ['ALLOPATHY', 'AYURVEDA', 'HOMEOPATHY'];

    const selectedStats = current !== 'ALL' ? statsMap[current] : null;

    return (
        <div className="w-full">
            {/* Switcher Bar */}
            <div className={`inline-flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm ${compact ? '' : 'w-full sm:w-auto justify-center'}`}>
                {keys.map((key) => {
                    const theme = DOMAIN_THEMES[key];
                    const Icon = ICONS[key];
                    const isActive = current === key;
                    return (
                        <button
                            key={key}
                            type="button"
                            onClick={() => handleSelect(key)}
                            className={`flex items-center gap-2 rounded-xl font-semibold transition-all duration-200 cursor-pointer ${compact ? 'px-3 py-1.5 text-xs' : 'px-4 py-2.5 text-sm'}`}
                            style={{
                                background: isActive ? theme.color : 'transparent',
                                color: isActive ? '#ffffff' : 'var(--text-secondary)',
                                boxShadow: isActive ? `0 4px 14px ${theme.color}40` : 'none',
                            }}
                        >
                            <Icon className={compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
                            <span>{compact ? theme.shortLabel : theme.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Live Domain Comparison & Experience Drawer */}
            {showInsights && (
                <div className="mt-5">
                    {current === 'ALL' ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {['ALLOPATHY', 'AYURVEDA', 'HOMEOPATHY'].map(domKey => {
                                const d = statsMap[domKey];
                                const theme = DOMAIN_THEMES[domKey];
                                const Icon = ICONS[domKey];
                                return (
                                    <div
                                        key={domKey}
                                        onClick={() => handleSelect(domKey)}
                                        className="bg-[var(--surface)] rounded-2xl border p-5 cursor-pointer transition-all hover:shadow-lg hover:-translate-y-0.5"
                                        style={{ borderColor: theme.border, borderTopWidth: '4px', borderTopColor: theme.color }}
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold" style={{ background: theme.bg, color: theme.badgeText }}>
                                                <Icon className="w-3.5 h-3.5" /> {theme.label}
                                            </span>
                                            {d && (
                                                <span className="text-xs font-bold text-amber-500 flex items-center gap-1">
                                                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {d.avgRating} ({d.totalReviews})
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-[var(--text-muted)] mb-4 leading-relaxed">{theme.tagline}</p>

                                        {loadingStats || !d ? (
                                            <div className="h-20 bg-[var(--surface-2)] rounded-xl animate-pulse" />
                                        ) : (
                                            <div className="grid grid-cols-2 gap-2 text-xs">
                                                <div className="bg-[var(--surface-2)] rounded-xl p-2.5 border border-[var(--border)]">
                                                    <span className="text-[var(--text-muted)] block text-[11px]">Success Rate</span>
                                                    <span className="font-bold text-[var(--text-primary)] text-sm">{d.successRate}%</span>
                                                </div>
                                                <div className="bg-[var(--surface-2)] rounded-xl p-2.5 border border-[var(--border)]">
                                                    <span className="text-[var(--text-muted)] block text-[11px]">Popularity</span>
                                                    <span className="font-bold text-[var(--text-primary)] text-sm">{d.popularityPct}% chose</span>
                                                </div>
                                                <div className="bg-[var(--surface-2)] rounded-xl p-2.5 border border-[var(--border)]">
                                                    <span className="text-[var(--text-muted)] block text-[11px]">Avg Consult Fee</span>
                                                    <span className="font-bold text-[var(--text-primary)] text-sm">₹{d.avgConsultFee}</span>
                                                </div>
                                                <div className="bg-[var(--surface-2)] rounded-xl p-2.5 border border-[var(--border)]">
                                                    <span className="text-[var(--text-muted)] block text-[11px]">Recovery Time</span>
                                                    <span className="font-bold text-[var(--text-primary)]">{d.recoveryTimeline}</span>
                                                </div>
                                            </div>
                                        )}

                                        <div className="mt-4 pt-3 border-t border-[var(--border)] flex items-center justify-between text-xs font-semibold" style={{ color: theme.color }}>
                                            <span>Switch & inspect patient reviews</span>
                                            <ArrowRight className="w-3.5 h-3.5" />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : selectedStats ? (
                        <div
                            className="bg-[var(--surface)] rounded-2xl border p-6 shadow-sm"
                            style={{ borderColor: selectedStats.border, borderLeftWidth: '5px', borderLeftColor: selectedStats.color }}
                        >
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-[var(--border)]">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: selectedStats.bg, color: selectedStats.color }}>
                                            Active Domain: {selectedStats.name}
                                        </span>
                                        <span className="text-xs text-[var(--text-muted)]">{selectedStats.doctorCount} verified specialists</span>
                                    </div>
                                    <p className="text-sm text-[var(--text-secondary)]">{selectedStats.philosophy}</p>
                                </div>
                                <Link
                                    href={`/doctors?domain=${selectedStats.key}`}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white whitespace-nowrap shadow-sm hover:opacity-95 transition"
                                    style={{ background: selectedStats.color }}
                                >
                                    Explore {selectedStats.name} Doctors <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>

                            {/* KPI strip */}
                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 my-5">
                                {[
                                    { icon: TrendingUp, label: 'Success Rate', val: `${selectedStats.successRate}%` },
                                    { icon: Users, label: 'Patient Popularity', val: `${selectedStats.popularityPct}%` },
                                    { icon: Star, label: 'Avg Rating', val: `${selectedStats.avgRating} ★ (${selectedStats.totalReviews})` },
                                    { icon: IndianRupee, label: 'Consult + Meds Est.', val: `₹${selectedStats.avgConsultFee} + ₹${selectedStats.avgMedicineCost}` },
                                    { icon: Clock, label: 'Typical Recovery', val: selectedStats.recoveryTimeline },
                                ].map(({ icon: MIcon, label, val }) => (
                                    <div key={label} className="bg-[var(--surface-2)] rounded-xl p-3 border border-[var(--border)]">
                                        <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] mb-1">
                                            <MIcon className="w-3.5 h-3.5" style={{ color: selectedStats.color }} />
                                            <span>{label}</span>
                                        </div>
                                        <p className="text-sm font-bold text-[var(--text-primary)]">{val}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Real Patient Experiences */}
                            {selectedStats.patientReviews?.length > 0 && (
                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-3 flex items-center gap-1.5">
                                        <MessageSquareQuote className="w-4 h-4" style={{ color: selectedStats.color }} />
                                        Recent Verified Patient Experiences ({selectedStats.recommendPct}% would recommend)
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {selectedStats.patientReviews.slice(0, 2).map(rev => (
                                            <div key={rev.id} className="p-3.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-xs">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="font-bold text-[var(--text-primary)]">{rev.title || rev.disease || 'Verified Patient'}</span>
                                                    <span className="text-amber-500 font-bold">{'★'.repeat(rev.rating)}</span>
                                                </div>
                                                <p className="text-[var(--text-secondary)] leading-relaxed mb-2">&ldquo;{rev.body}&rdquo;</p>
                                                <div className="text-[var(--text-muted)] flex flex-wrap gap-2 text-[11px]">
                                                    <span>— {rev.author}</span>
                                                    {rev.doctorName && <span>· {rev.doctorName}</span>}
                                                    {rev.recoveryDays && <span>· Recovered in {rev.recoveryDays}d</span>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    );
}
