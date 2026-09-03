'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchUser = useCallback(async () => {
        try {
            const res = await fetch('/api/auth/me');
            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
            } else {
                setUser(null);
            }
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const sendOtp = async ({ identifier, role = 'PATIENT', name }) => {
        const res = await fetch('/api/auth/send-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ identifier, role, name }),
        });
        return res.json();
    };

    const verifyOtp = async ({ identifier, otp }) => {
        const res = await fetch('/api/auth/verify-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ identifier, otp }),
        });
        const data = await res.json();
        if (data.success && data.user) {
            setUser(data.user);
        }
        return data;
    };

    const signOut = async () => {
        await fetch('/api/auth/me', { method: 'POST' }); // POST = signout
        setUser(null);
        router.push('/login');
    };

    const isDoctor = user?.role === 'DOCTOR';
    const isPatient = Boolean(user); // Both patients and doctors can view the patient dashboard

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            isDoctor,
            isPatient,
            sendOtp,
            verifyOtp,
            signOut,
            refetch: fetchUser,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
