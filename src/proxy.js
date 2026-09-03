/**
 * Next.js 16 Route Protection Proxy
 * Strict RBAC:
 * - Unauthenticated users on protected routes -> /login
 * - PATIENT users blocked from /dashboard/doctor/* -> redirected to /dashboard/patient
 * - DOCTOR users can access /dashboard/doctor/* AND /dashboard/patient/* (their personal health view)
 */
import { NextResponse } from 'next/server';

export async function proxy(request) {
    const { pathname } = request.nextUrl;
    const sessionToken = request.cookies.get('cura_session')?.value;

    const publicPaths = ['/', '/login', '/doctors', '/about', '/community', '/symptom-checker', '/api/auth', '/api/doctors', '/api/domains', '/api/symptom-checker'];
    const isPublic = publicPaths.some(p => pathname === p || (p !== '/' && pathname.startsWith(p)));
    if (isPublic) return NextResponse.next();

    let user = null;
    if (sessionToken) {
        try {
            const res = await fetch(`${request.nextUrl.origin}/api/auth/me`, {
                headers: { Cookie: `cura_session=${sessionToken}` },
            });
            if (res.ok) {
                const data = await res.json();
                user = data.user;
            }
        } catch {
            // session lookup failed
        }
    }

    if (!user) {
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        url.searchParams.set('redirect', pathname);
        return NextResponse.redirect(url);
    }

    // Strict RBAC: Patients cannot interact with or visit Doctor Portal
    if (pathname.startsWith('/dashboard/doctor') && user.role !== 'DOCTOR') {
        const url = request.nextUrl.clone();
        url.pathname = '/dashboard/patient';
        return NextResponse.redirect(url);
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', user.id);
    requestHeaders.set('x-user-role', user.role);

    return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/prescription/:path*',
        '/community/new',
    ],
};
