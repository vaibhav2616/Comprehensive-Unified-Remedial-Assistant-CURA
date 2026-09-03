import { Suspense } from 'react';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import GuidedTutorialModal from '@/components/GuidedTutorialModal';
import PagePreloader from '@/components/PagePreloader';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata = {
    title: 'CURA — Comprehensive Unified Remedial Assistant',
    description: 'Multi-disciplinary medical platform integrating Allopathy, Ayurveda, and Homeopathy with cross-domain prescription safety verification.',
    keywords: ['healthcare', 'allopathy', 'ayurveda', 'homeopathy', 'prescription safety', 'doctor directory', 'drug interactions'],
    openGraph: {
        title: 'CURA — Comprehensive Unified Remedial Assistant',
        description: 'India\'s first cross-domain medical safety OS — bridging Allopathy, Ayurveda & Homeopathy.',
        type: 'website',
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning className={inter.variable}>
            <head>
                {/* Instant Theme Detection Script (Eliminates FOUC) */}
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                        (function() {
                            try {
                                var saved = localStorage.getItem('cura_theme') || 'system';
                                var isDark = false;
                                if (saved === 'dark') {
                                    isDark = true;
                                } else if (saved === 'light') {
                                    isDark = false;
                                } else {
                                    isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                                }
                                if (isDark) {
                                    document.documentElement.classList.add('dark');
                                    document.documentElement.style.colorScheme = 'dark';
                                } else {
                                    document.documentElement.classList.remove('dark');
                                    document.documentElement.style.colorScheme = 'light';
                                }
                            } catch (e) {}
                        })();
                        `,
                    }}
                />
            </head>
            <body
                suppressHydrationWarning
                className="font-sans antialiased min-h-screen flex flex-col bg-[var(--bg-base)] text-[var(--text-primary)] selection:bg-blue-500/20 selection:text-blue-700 dark:selection:text-blue-300"
            >
                <ThemeProvider>
                    <AuthProvider>
                        <AppProvider>
                            <Suspense fallback={null}>
                                <PagePreloader />
                            </Suspense>
                            <Navbar />
                            <main className="flex-1 pt-16 relative">{children}</main>
                            <Footer />
                            <GuidedTutorialModal />
                        </AppProvider>
                    </AuthProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
