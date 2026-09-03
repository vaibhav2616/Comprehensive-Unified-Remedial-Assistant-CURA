/**
 * OTP Service — sends 6-digit OTP via Email (SMTP) or SMS (Twilio)
 * Falls back cleanly to dev-mode logging when placeholder credentials are present.
 */

import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { prisma } from './prisma';

function isPlaceholder(val, markers = []) {
    if (!val) return true;
    const trimmed = val.trim();
    if (!trimmed) return true;
    return markers.some(m => trimmed.includes(m));
}

function generateOTP() {
    return String(crypto.randomInt(100000, 999999));
}

function otpExpiry(minutes = 10) {
    const d = new Date();
    d.setMinutes(d.getMinutes() + minutes);
    return d;
}

export async function createOtpToken(identifier) {
    await prisma.otpToken.updateMany({
        where: { identifier, used: false },
        data: { used: true },
    });

    const token = generateOTP();
    const expires = otpExpiry(10);

    await prisma.otpToken.create({
        data: { identifier, token, expires },
    });

    return token;
}

export async function verifyOtpToken(identifier, token) {
    const record = await prisma.otpToken.findFirst({
        where: {
            identifier,
            token,
            used: false,
            expires: { gte: new Date() },
        },
    });

    if (!record) return { success: false, error: 'Invalid or expired OTP' };

    await prisma.otpToken.update({
        where: { id: record.id },
        data: { used: true },
    });

    return { success: true };
}

export async function sendEmailOTP(email, otp) {
    const smtpUnconfigured =
        isPlaceholder(process.env.SMTP_USER, ['your-email@gmail.com', 'example.com']) ||
        isPlaceholder(process.env.SMTP_PASS, ['your-app-password']);

    if (smtpUnconfigured) {
        console.log(`\n🔐 [DEV EMAIL OTP] for ${email}: ${otp}\n`);
        return { success: true, devFallback: true };
    }

    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT || 587),
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.SMTP_FROM || 'CURA Health <noreply@cura.health>',
            to: email,
            subject: 'Your CURA verification code',
            html: `
              <div style="font-family:Inter,sans-serif;max-width:480px;margin:0 auto;padding:32px;">
                <div style="background:linear-gradient(135deg,#2563EB,#7C3AED);border-radius:16px;padding:32px;text-align:center;margin-bottom:24px;">
                  <h1 style="color:#fff;margin:0;font-size:28px;">CURA</h1>
                  <p style="color:rgba(255,255,255,0.8);margin:8px 0 0;">Comprehensive Unified Remedial Assistant</p>
                </div>
                <h2 style="color:#0F172A;font-size:20px;">Your verification code</h2>
                <p style="color:#475569;">Enter this code on CURA to complete your sign-in. It expires in <strong>10 minutes</strong>.</p>
                <div style="background:#EFF6FF;border:2px solid #BFDBFE;border-radius:12px;padding:24px;text-align:center;margin:24px 0;">
                  <span style="font-size:40px;font-weight:800;letter-spacing:12px;color:#2563EB;">${otp}</span>
                </div>
                <p style="color:#94A3B8;font-size:12px;text-align:center;">CURA Health · DPDP 2023 Compliant</p>
              </div>
            `,
        });

        return { success: true };
    } catch (err) {
        if (process.env.NODE_ENV !== 'production') {
            console.warn('[OTP Email fallback]', err.message, 'OTP:', otp);
            return { success: true, devFallback: true };
        }
        return { success: false, error: err.message };
    }
}

export async function sendSmsOTP(phone, otp) {
    const twilioUnconfigured =
        isPlaceholder(process.env.TWILIO_ACCOUNT_SID, ['ACxxxxxxxx', 'your_']) ||
        isPlaceholder(process.env.TWILIO_AUTH_TOKEN, ['your_twilio']) ||
        isPlaceholder(process.env.TWILIO_PHONE_NUMBER, ['+1xxxxxxxxxx']);

    if (twilioUnconfigured) {
        console.log(`\n🔐 [DEV SMS OTP] for ${phone}: ${otp}\n`);
        return { success: true, devFallback: true };
    }

    try {
        let twilio;
        try {
            twilio = (await import('twilio')).default;
        } catch {
            console.log(`\n🔐 [DEV SMS OTP] for ${phone}: ${otp} (twilio not installed)\n`);
            return { success: true, devFallback: true };
        }
        const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        await client.messages.create({
            body: `Your CURA verification code is: ${otp}. Valid for 10 minutes.`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phone,
        });
        return { success: true };
    } catch (err) {
        if (process.env.NODE_ENV !== 'production') {
            console.warn('[OTP SMS fallback]', err.message, 'OTP:', otp);
            return { success: true, devFallback: true };
        }
        return { success: false, error: err.message };
    }
}
