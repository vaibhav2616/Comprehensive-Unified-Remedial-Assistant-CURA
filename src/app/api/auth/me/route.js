/**
 * GET  /api/auth/me — returns current session user
 * POST /api/auth/signout — clears session
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser, ensurePatientProfile } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET() {
    try {
        const user = await getSessionUser();
        if (!user) return NextResponse.json({ user: null }, { status: 401 });
        if (!user.patientProfile) {
            user.patientProfile = await ensurePatientProfile(user.id);
        }
        return NextResponse.json({ user });
    } catch (err) {
        console.error('[auth/me]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('cura_session')?.value;

        if (token) {
            await prisma.session.deleteMany({ where: { token } });
        }

        const response = NextResponse.json({ success: true });
        response.cookies.delete('cura_session');
        return response;
    } catch (err) {
        console.error('[auth/signout]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
