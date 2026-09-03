'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';

const ThemeContext = createContext({
    theme: 'system',
    resolvedTheme: 'light',
    setTheme: () => { },
    toggleTheme: () => { },
});

export function ThemeProvider({ children }) {
    const [theme, setThemeState] = useState('system');
    const [resolvedTheme, setResolvedTheme] = useState('light');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        try {
            const saved = localStorage.getItem('cura_theme') || 'system';
            setThemeState(saved);
            applyTheme(saved);
        } catch {
            applyTheme('system');
        }
    }, []);

    const applyTheme = (t) => {
        const root = document.documentElement;
        let isDark = false;
        if (t === 'dark') {
            isDark = true;
        } else if (t === 'light') {
            isDark = false;
        } else {
            isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        }

        if (isDark) {
            root.classList.add('dark');
            root.style.colorScheme = 'dark';
            setResolvedTheme('dark');
        } else {
            root.classList.remove('dark');
            root.style.colorScheme = 'light';
            setResolvedTheme('light');
        }
    };

    const setTheme = (newTheme) => {
        setThemeState(newTheme);
        try {
            localStorage.setItem('cura_theme', newTheme);
        } catch {
            // ignore
        }
        applyTheme(newTheme);
    };

    const toggleTheme = () => {
        const next = resolvedTheme === 'dark' ? 'light' : 'dark';
        setTheme(next);
    };

    // Listen to OS theme changes if on system
    useEffect(() => {
        if (!window.matchMedia) return;
        const media = window.matchMedia('(prefers-color-scheme: dark)');
        const listener = (e) => {
            const saved = localStorage.getItem('cura_theme') || 'system';
            if (saved === 'system') {
                applyTheme('system');
            }
        };
        media.addEventListener('change', listener);
        return () => media.removeEventListener('change', listener);
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme, mounted }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}

/**
 * Editorial Theme Toggle Button
 * Smooth animated icon switch with tooltip and tactile hover state
 */
export function ThemeToggle({ className = '' }) {
    const { resolvedTheme, toggleTheme, mounted } = useTheme();

    if (!mounted) {
        return (
            <button
                className={`w-9 h-9 rounded-xl border border-[var(--border)] flex items-center justify-center opacity-0 transition-opacity ${className}`}
                aria-label="Toggle theme"
            >
                <Sun className="w-4 h-4 text-amber-500" />
            </button>
        );
    }

    const isDark = resolvedTheme === 'dark';

    return (
        <button
            onClick={toggleTheme}
            className={`relative group w-9 h-9 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-2)] flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm overflow-hidden ${className}`}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
        >
            <div className="relative w-4 h-4 flex items-center justify-center">
                <Sun
                    className={`absolute w-4 h-4 text-amber-500 transition-all duration-500 transform ${isDark
                        ? 'opacity-0 rotate-90 scale-0 pointer-events-none'
                        : 'opacity-100 rotate-0 scale-100'
                        }`}
                />
                <Moon
                    className={`absolute w-4 h-4 text-indigo-400 transition-all duration-500 transform ${isDark
                        ? 'opacity-100 rotate-0 scale-100'
                        : 'opacity-0 -rotate-90 scale-0 pointer-events-none'
                        }`}
                />
            </div>
            {/* Subtle glow effect */}
            <span
                className={`absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isDark ? 'bg-indigo-500/10' : 'bg-amber-500/10'
                    }`}
            />
        </button>
    );
}
