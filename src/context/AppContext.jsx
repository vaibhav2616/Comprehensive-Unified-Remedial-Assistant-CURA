'use client';
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';

export const DOMAIN_THEMES = {
    ALL: {
        key: 'ALL',
        label: 'Integrative (All)',
        shortLabel: 'All Systems',
        tagline: 'Cross-Domain Unified View',
        color: '#2563EB',
        bg: '#EFF6FF',
        border: '#BFDBFE',
        badgeText: '#1D4ED8',
    },
    ALLOPATHY: {
        key: 'ALLOPATHY',
        label: 'Allopathy',
        shortLabel: 'Allopathy',
        tagline: 'Modern Evidence-Based Medicine',
        color: '#2563EB',
        bg: '#EFF6FF',
        border: '#BFDBFE',
        badgeText: '#1D4ED8',
    },
    AYURVEDA: {
        key: 'AYURVEDA',
        label: 'Ayurveda',
        shortLabel: 'Ayurveda',
        tagline: 'Holistic Root-Cause Balance',
        color: '#059669',
        bg: '#ECFDF5',
        border: '#A7F3D0',
        badgeText: '#047857',
    },
    HOMEOPATHY: {
        key: 'HOMEOPATHY',
        label: 'Homeopathy',
        shortLabel: 'Homeopathy',
        tagline: 'Gentle Constitutional Care',
        color: '#7C3AED',
        bg: '#F5F3FF',
        border: '#DDD6FE',
        badgeText: '#6D28D9',
    },
};

const AppContext = createContext(null);

export function AppProvider({ children }) {
    const { user } = useAuth();
    const [activeDomain, setActiveDomainState] = useState('ALL');
    const [activePrescription, setActivePrescription] = useState(null);
    const [uploadState, setUploadState] = useState('idle'); // idle | uploading | analyzing | done
    const [tourOpen, setTourOpen] = useState(false);

    // Sync persisted domain preference safely on client
    useEffect(() => {
        try {
            const saved = localStorage.getItem('cura_active_domain');
            if (saved && DOMAIN_THEMES[saved]) {
                setActiveDomainState(saved);
            }
        } catch {
            // ignore storage errors
        }
    }, []);

    const setActiveDomain = useCallback((domain) => {
        const next = DOMAIN_THEMES[domain] ? domain : 'ALL';
        setActiveDomainState(next);
        try {
            localStorage.setItem('cura_active_domain', next);
        } catch {
            // ignore
        }
    }, []);

    // Load active prescription from DB whenever user logs in
    useEffect(() => {
        if (!user) {
            setActivePrescription(null);
            return;
        }
        let cancelled = false;
        async function loadLatestRx() {
            try {
                const res = await fetch('/api/prescriptions?mode=patient&page=1');
                if (!res.ok) return;
                const data = await res.json();
                const list = data.prescriptions || [];
                // Prefer latest APPROVED prescription, fallback to latest analyzed/pending
                const preferred = list.find(r => r.status === 'APPROVED') || list[0] || null;
                if (!cancelled && preferred) {
                    setActivePrescription({
                        id: preferred.id,
                        patientName: user.name,
                        prescribedBy: preferred.doctor?.name || 'CURA Physician / Uploaded Rx',
                        issueDate: new Date(preferred.createdAt).toISOString().split('T')[0],
                        domain: preferred.domain || 'ALLOPATHY',
                        status: preferred.status,
                        medications: preferred.medications || [],
                        conflicts: preferred.flags || [],
                    });
                }
            } catch {
                // ignore
            }
        }
        loadLatestRx();
        return () => { cancelled = true; };
    }, [user]);

    const uploadPrescription = useCallback(async ({ file = null, rawText = '', medications = [], domain = 'ALLOPATHY', notes = '' }) => {
        setUploadState('uploading');
        try {
            let res;
            if (file) {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('rawText', rawText);
                formData.append('domain', domain);
                formData.append('notes', notes);
                if (medications.length > 0) {
                    formData.append('medications', JSON.stringify(medications));
                }
                setUploadState('analyzing');
                res = await fetch('/api/prescriptions/upload', { method: 'POST', body: formData });
            } else {
                setUploadState('analyzing');
                res = await fetch('/api/prescriptions/upload', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ rawText, medications, domain, notes }),
                });
            }

            const payload = await res.json();
            if (!res.ok || !payload.success) {
                setUploadState('idle');
                throw new Error(payload.error || 'Failed to analyze prescription');
            }

            setActivePrescription(payload.data);
            setUploadState('done');
            return payload.data;
        } catch (err) {
            setUploadState('idle');
            throw err;
        }
    }, []);

    const clearPrescription = useCallback(() => {
        setActivePrescription(null);
        setUploadState('idle');
    }, []);

    return (
        <AppContext.Provider value={{
            activeDomain,
            setActiveDomain,
            domainTheme: DOMAIN_THEMES[activeDomain] || DOMAIN_THEMES.ALL,
            activePrescription,
            setActivePrescription,
            uploadPrescription,
            clearPrescription,
            uploadState,
            tourOpen,
            setTourOpen,
        }}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error('useApp must be used within <AppProvider>');
    return ctx;
}
