/**
 * GET   /api/doctors — list verified/available doctors with filters (?domain, ?city, ?disease, ?search, ?specialty, ?minRating, ?maxFee)
 * POST  /api/doctors — create doctor profile (DOCTOR role only)
 * PATCH /api/doctors — update own doctor profile (DOCTOR role only)
 */
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

const DISEASE_MAP = {
    'heart': ['Cardiologist', 'Cardiac Surgeon'],
    'hypertension': ['Cardiologist', 'Internal Medicine', 'General Physician'],
    'diabetes': ['Endocrinologist', 'Diabetologist', 'General Physician', 'Diabetes', 'Metabolic'],
    'migraine': ['Neurologist', 'Migraine', 'Headache Specialist', 'Panchakarma Specialist', 'Constitutional Prescribing'],
    'headache': ['Neurologist', 'Migraine', 'Headache Specialist', 'General Physician', 'Constitutional Prescribing'],
    'viral': ['General Physician', 'Viral Fever', 'Kayachikitsa', 'Respiratory Homeopathy'],
    'fever': ['General Physician', 'Viral Fever', 'Kayachikitsa', 'Respiratory Homeopathy'],
    'ibs': ['Digestive Health', 'IBS', 'Chronic Disease', 'General Physician', 'Kayachikitsa'],
    'stomach': ['Digestive Health', 'IBS', 'Gastroenterologist', 'Kayachikitsa'],
    'bronchitis': ['Respiratory', 'Pulmonologist', 'Respiratory Homeopathy', 'Kayachikitsa'],
    'respiratory': ['Respiratory', 'Pulmonologist', 'Respiratory Homeopathy', 'Kayachikitsa'],
    'arthritis': ['Arthritis', 'Orthopedic', 'Rheumatologist', 'Rasayana & Immunity', 'Chronic Disease'],
    'joint': ['Arthritis', 'Orthopedic', 'Rasayana & Immunity', 'Chronic Disease'],
    'anxiety': ['Anxiety', 'Stress', 'Insomnia', 'Constitutional Prescribing', 'Rasayana & Immunity'],
    'insomnia': ['Anxiety', 'Insomnia', 'Constitutional Prescribing', 'Neurologist'],
    'skin': ['Dermatologist', 'Skin & Allergy'],
    'general': ['General Physician', 'Internal Medicine'],
};

function matchSpecializationsByDisease(disease) {
    const lower = disease.toLowerCase();
    for (const [key, specs] of Object.entries(DISEASE_MAP)) {
        if (lower.includes(key)) return specs;
    }
    return [disease];
}

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const specialty = searchParams.get('specialty');
        const domain = searchParams.get('domain');
        const city = searchParams.get('city');
        const disease = searchParams.get('disease') || searchParams.get('condition');
        const search = searchParams.get('search')?.trim();
        const minRating = parseFloat(searchParams.get('minRating') || '0');
        const maxFee = parseFloat(searchParams.get('maxFee') || '999999');
        const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
        const limit = Math.min(48, parseInt(searchParams.get('limit') || '24'));
        const skip = (page - 1) * limit;

        const validDomains = ['ALLOPATHY', 'AYURVEDA', 'HOMEOPATHY'];
        const normalizedDomain = domain ? domain.toUpperCase() : null;

        const where = {
            isAvailable: true,
            consultFee: { lte: maxFee },
            ...(minRating > 0 && { avgRating: { gte: minRating } }),
            ...(normalizedDomain && validDomains.includes(normalizedDomain) && { domains: { has: normalizedDomain } }),
            ...(city && { city: { contains: city, mode: 'insensitive' } }),
            ...(specialty && { specialization: { hasSome: [specialty] } }),
            ...(disease && {
                OR: [
                    { specialization: { hasSome: matchSpecializationsByDisease(disease) } },
                    { bio: { contains: disease, mode: 'insensitive' } },
                ],
            }),
            ...(search && {
                OR: [
                    { user: { name: { contains: search, mode: 'insensitive' } } },
                    { city: { contains: search, mode: 'insensitive' } },
                    { hospital: { contains: search, mode: 'insensitive' } },
                    { bio: { contains: search, mode: 'insensitive' } },
                    { specialization: { hasSome: matchSpecializationsByDisease(search) } },
                ],
            }),
        };

        const [doctors, total] = await Promise.all([
            prisma.doctor.findMany({
                where,
                skip,
                take: limit,
                orderBy: [{ avgRating: 'desc' }, { totalReviews: 'desc' }],
                include: {
                    user: {
                        select: {
                            name: true,
                            email: true,
                            image: true,
                            reviewsReceived: {
                                take: 3,
                                orderBy: { createdAt: 'desc' },
                                include: { author: { select: { name: true } } },
                            },
                        },
                    },
                },
            }),
            prisma.doctor.count({ where }),
        ]);

        const formatted = doctors.map(doc => ({
            id: doc.id,
            userId: doc.userId,
            name: doc.user.name,
            image: doc.user.image,
            specialization: doc.specialization,
            domains: doc.domains,
            domain: doc.domains[0] || 'ALLOPATHY',
            experience: doc.experience,
            qualifications: doc.qualifications,
            hospital: doc.hospital,
            city: doc.city,
            state: doc.state,
            location: `${doc.city}${doc.hospital ? ` · ${doc.hospital}` : ''}`,
            consultFee: doc.consultFee,
            cost: doc.consultFee,
            avgMedicineCost: doc.avgMedicineCost,
            avgRating: doc.avgRating || 0,
            rating: doc.avgRating || 0,
            totalReviews: doc.totalReviews,
            avgRecoveryDays: doc.avgRecoveryDays,
            successRate: doc.successRate || 0,
            isVerified: doc.isVerified,
            bio: doc.bio,
            recentReviews: doc.user.reviewsReceived.map(r => ({
                id: r.id,
                author: r.author.name,
                rating: r.rating,
                title: r.title,
                body: r.body,
                disease: r.disease,
                recoveryDays: r.recoveryDays,
                totalCost: r.totalCost,
            })),
        }));

        return NextResponse.json({
            success: true,
            doctors: formatted,
            data: formatted,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                hasMore: page * limit < total,
            },
        });
    } catch (err) {
        console.error('[api/doctors GET]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const user = await getSessionUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        if (user.role !== 'DOCTOR') return NextResponse.json({ error: 'Only doctors can register a profile' }, { status: 403 });

        const body = await req.json();
        const existing = await prisma.doctor.findUnique({ where: { userId: user.id } });
        if (existing) {
            return NextResponse.json({ error: 'Doctor profile already exists. Use PATCH to update.' }, { status: 409 });
        }

        const doctor = await prisma.doctor.create({
            data: {
                userId: user.id,
                registrationNo: body.registrationNo?.trim() || `CURA-${Date.now().toString().slice(-6)}`,
                specialization: Array.isArray(body.specialization) ? body.specialization : String(body.specialization || '').split(',').map(s => s.trim()).filter(Boolean),
                domains: Array.isArray(body.domains) && body.domains.length > 0 ? body.domains : ['ALLOPATHY'],
                experience: parseInt(body.experience || '1', 10),
                qualifications: Array.isArray(body.qualifications) ? body.qualifications : String(body.qualifications || '').split(',').map(s => s.trim()).filter(Boolean),
                hospital: body.hospital || null,
                city: body.city || 'India',
                state: body.state || 'India',
                consultFee: parseFloat(body.consultFee || '500'),
                avgMedicineCost: body.avgMedicineCost ? parseFloat(body.avgMedicineCost) : null,
                bio: body.bio || null,
                isVerified: true,
                isAvailable: body.isAvailable !== false,
            },
        });

        return NextResponse.json({ success: true, doctor }, { status: 201 });
    } catch (err) {
        console.error('[api/doctors POST]', err);
        return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
    }
}

export async function PATCH(req) {
    try {
        const user = await getSessionUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        if (user.role !== 'DOCTOR') return NextResponse.json({ error: 'Only doctors can update a doctor profile' }, { status: 403 });

        const body = await req.json();
        const existing = await prisma.doctor.findUnique({ where: { userId: user.id } });
        if (!existing) {
            return NextResponse.json({ error: 'Doctor profile not found' }, { status: 404 });
        }

        const doctor = await prisma.doctor.update({
            where: { userId: user.id },
            data: {
                ...(body.specialization && { specialization: Array.isArray(body.specialization) ? body.specialization : String(body.specialization).split(',').map(s => s.trim()).filter(Boolean) }),
                ...(body.domains && { domains: body.domains }),
                ...(body.experience !== undefined && { experience: parseInt(body.experience, 10) }),
                ...(body.qualifications && { qualifications: Array.isArray(body.qualifications) ? body.qualifications : String(body.qualifications).split(',').map(s => s.trim()).filter(Boolean) }),
                ...(body.hospital !== undefined && { hospital: body.hospital }),
                ...(body.city && { city: body.city }),
                ...(body.state && { state: body.state }),
                ...(body.consultFee !== undefined && { consultFee: parseFloat(body.consultFee) }),
                ...(body.avgMedicineCost !== undefined && { avgMedicineCost: body.avgMedicineCost ? parseFloat(body.avgMedicineCost) : null }),
                ...(body.bio !== undefined && { bio: body.bio }),
                ...(body.isAvailable !== undefined && { isAvailable: Boolean(body.isAvailable) }),
            },
        });

        return NextResponse.json({ success: true, doctor });
    } catch (err) {
        console.error('[api/doctors PATCH]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
