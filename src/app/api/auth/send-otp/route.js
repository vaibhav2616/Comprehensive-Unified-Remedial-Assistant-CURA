/**
 * POST /api/auth/send-otp
 * Body: { identifier: string (email or phone), role: "PATIENT"|"DOCTOR", name?: string }
 */
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createOtpToken, sendEmailOTP, sendSmsOTP } from '@/lib/otp';
import { ensurePatientProfile } from '@/lib/auth';
import { z } from 'zod';

const schema = z.object({
    identifier: z.string().min(3),
    role: z.enum(['PATIENT', 'DOCTOR']).default('PATIENT'),
    name: z.string().optional(),
});

const isEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
const isPhone = (s) => /^\+?[1-9]\d{9,14}$/.test(s.replace(/[\s-]/g, ''));

export async function POST(req) {
    try {
        const body = await req.json();
        const parsed = schema.parse(body);
        const identifier = parsed.identifier.trim();
        const normalizedIdentifier = isEmail(identifier) ? identifier.toLowerCase() : identifier.replace(/[\s-]/g, '');

        const via = isEmail(normalizedIdentifier) ? 'email' : isPhone(normalizedIdentifier) ? 'phone' : null;
        if (!via) {
            return NextResponse.json({ error: 'Provide a valid email address or phone number (10+ digits)' }, { status: 400 });
        }

        const whereClause = via === 'email' ? { email: normalizedIdentifier } : { phone: normalizedIdentifier };
        let user = await prisma.user.findUnique({ where: whereClause });
        let roleMismatchWarning = null;

        if (!user) {
            user = await prisma.user.create({
                data: {
                    name: parsed.name?.trim() || (parsed.role === 'DOCTOR' ? 'Doctor User' : 'Patient User'),
                    role: parsed.role,
                    ...(via === 'email' ? { email: normalizedIdentifier } : { phone: normalizedIdentifier }),
                },
            });
            await ensurePatientProfile(user.id);
        } else if (user.role !== parsed.role) {
            roleMismatchWarning = `This account is registered as a ${user.role}. Signing in under your assigned role.`;
        }

        const otp = await createOtpToken(normalizedIdentifier);
        const result = via === 'email'
            ? await sendEmailOTP(normalizedIdentifier, otp)
            : await sendSmsOTP(normalizedIdentifier, otp);

        if (!result.success) {
            return NextResponse.json({ error: 'Failed to send OTP. Try again.' }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            via,
            normalizedIdentifier,
            assignedRole: user.role,
            roleMismatchWarning,
            message: `Verification code sent to your ${via}`,
            ...((process.env.NODE_ENV === 'development' || result.devFallback) && { devOtp: otp }),
        });
    } catch (err) {
        if (err.name === 'ZodError') {
            return NextResponse.json({ error: err.errors[0].message }, { status: 400 });
        }
        console.error('[send-otp]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
