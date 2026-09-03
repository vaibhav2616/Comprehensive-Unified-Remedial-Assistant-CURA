/**
 * POST /api/auth/verify-otp
 * Body: { identifier: string, otp: string }
 */
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyOtpToken } from '@/lib/otp';
import { ensurePatientProfile } from '@/lib/auth';
import { z } from 'zod';
import crypto from 'crypto';

const schema = z.object({
    identifier: z.string().min(3),
    otp: z.string().length(6),
});

export async function POST(req) {
    try {
        const body = await req.json();
        const parsed = schema.parse(body);
        const raw = parsed.identifier.trim();
        const isEmail = raw.includes('@');
        const identifier = isEmail ? raw.toLowerCase() : raw.replace(/[\s-]/g, '');

        const result = await verifyOtpToken(identifier, parsed.otp);
        if (!result.success) {
            return NextResponse.json({ error: result.error }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: isEmail ? { email: identifier } : { phone: identifier },
            include: {
                doctorProfile: true,
                patientProfile: true,
            },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Ensure patient profile exists for every user (both patients and doctors managing their own health)
        const patientProfile = user.patientProfile || await ensurePatientProfile(user.id);

        await prisma.user.update({
            where: { id: user.id },
            data: isEmail ? { emailVerified: new Date() } : { phoneVerified: new Date() },
        });

        const sessionToken = crypto.randomBytes(32).toString('hex');
        const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

        await prisma.session.create({
            data: {
                userId: user.id,
                token: sessionToken,
                expires,
            },
        });

        const response = NextResponse.json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                image: user.image,
                doctorProfile: user.doctorProfile,
                patientProfile,
                hasProfile: user.role === 'DOCTOR' ? !!user.doctorProfile : !!patientProfile,
            },
        });

        response.cookies.set('cura_session', sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            expires,
            path: '/',
        });

        return response;
    } catch (err) {
        if (err.name === 'ZodError') {
            return NextResponse.json({ error: err.errors[0].message }, { status: 400 });
        }
        console.error('[verify-otp]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
