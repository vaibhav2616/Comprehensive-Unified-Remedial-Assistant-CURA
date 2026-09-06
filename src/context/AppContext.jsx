'use client';
import { createContext, useContext, useState, useCallback } from 'react';
import { samplePrescription, appointments as defaultAppointments } from '@/data/mockData';

const AppContext = createContext(null);

export function AppProvider({ children }) {
    const [currentUser, setCurrentUser] = useState({ role: 'patient', name: 'Aryan Mehta' });
    const [activePrescription, setActivePrescription] = useState(null);
    const [appointmentsList, setAppointmentsList] = useState(defaultAppointments);
    const [uploadState, setUploadState] = useState('idle'); // idle | uploading | extracting | done

    const uploadPrescription = useCallback(async () => {
        setUploadState('uploading');
        await new Promise(r => setTimeout(r, 1500));
        setUploadState('extracting');
        await new Promise(r => setTimeout(r, 2000));
        setActivePrescription(samplePrescription);
        setUploadState('done');
    }, []);

    const clearPrescription = useCallback(() => {
        setActivePrescription(null);
        setUploadState('idle');
    }, []);

    const bookAppointment = useCallback((appointment) => {
        const newApt = { ...appointment, id: `apt-${Date.now()}`, status: 'pending' };
        setAppointmentsList(prev => [...prev, newApt]);
        return newApt;
    }, []);

    const switchRole = useCallback((role) => {
        setCurrentUser(prev => ({ ...prev, role }));
    }, []);

    return (
        <AppContext.Provider value={{
            currentUser, switchRole,
            activePrescription, uploadPrescription, clearPrescription, uploadState,
            appointments: appointmentsList, bookAppointment,
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

// commit-touch: 2026-08-10 11:40:00

// commit-touch: sameerpatel01 2026-08-10 11:40:00

// commit-touch: sameerpatel01 2026-08-10 11:40:00

// commit-touch: sameerpatel01 2026-08-10 11:40:00
