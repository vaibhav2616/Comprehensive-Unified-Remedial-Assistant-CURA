import { Inter } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata = {
    title: 'CURA — Comprehensive Unified Remedial Assistant',
    description: 'Multi-disciplinary medical platform integrating Allopathy, Ayurveda, and Homeopathy with cross-domain prescription safety verification.',
    keywords: ['healthcare', 'allopathy', 'ayurveda', 'homeopathy', 'prescription safety', 'doctor directory', 'drug interactions'],
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" className={inter.variable}>
            <body className="font-sans antialiased bg-[var(--gray-50)] text-[var(--gray-900)] min-h-screen flex flex-col">
                <AppProvider>
                    <Navbar />
                    <main className="flex-1 pt-16">{children}</main>
                    <Footer />
                </AppProvider>
            </body>
        </html>
    );
}

// commit-touch: 2026-08-09 14:30:00

// commit-touch: sameerpatel01 2026-08-09 14:30:00

// commit-touch: sameerpatel01 2026-08-09 14:30:00

// commit-touch: sameerpatel01 2026-08-09 14:30:00
