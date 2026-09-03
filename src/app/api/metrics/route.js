/**
 * GET  /api/metrics — returns approved, pending, and rejected vital metrics + clinical factor requests + patient profile
 * POST /api/metrics — submits a new vital metric reading (strictly PENDING until doctor approves)
 */
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser, ensurePatientProfile } from '@/lib/auth';

export async function GET(request) {
    try {
        const user = await getSessionUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const patient = user.patientProfile || await ensurePatientProfile(user.id);

        const [metrics, factorRequests, prescriptions, doctors] = await Promise.all([
            prisma.patientMetric.findMany({
                where: { patientId: patient.id },
                orderBy: { recordedAt: 'asc' },
            }),
            prisma.clinicalChangeRequest.findMany({
                where: { patientId: patient.id },
                orderBy: { createdAt: 'desc' },
            }),
            prisma.prescription.findMany({
                where: { patientId: user.id },
                orderBy: { createdAt: 'desc' },
            }),
            prisma.doctor.findMany({
                where: { isAvailable: true },
                include: { user: { select: { id: true, name: true } } },
                take: 20,
            }),
        ]);

        const approved = metrics.filter(m => m.status === 'APPROVED' || m.isApproved);
        const pending = metrics.filter(m => m.status === 'PENDING' && !m.isApproved);
        const rejected = metrics.filter(m => m.status === 'REJECTED');

        // Keep legacy `data` field (respecting `?pending=true` for backward compatibility)
        const { searchParams } = new URL(request.url);
        const showPending = searchParams.get('pending') === 'true';

        return NextResponse.json({
            success: true,
            data: showPending ? metrics : approved,
            approved,
            pending,
            rejected,
            factorRequests,
            prescriptions,
            patientProfile: patient,
            availableDoctors: doctors.map(d => ({ id: d.userId, name: d.user.name, domain: d.domains[0] })),
        });
    } catch (err) {
        console.error('[GET /api/metrics]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const user = await getSessionUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const patient = user.patientProfile || await ensurePatientProfile(user.id);
        const body = await request.json();
        const { type, value, unit, notes, doctorId } = body;

        if (!type || value === undefined || value === '' || !unit) {
            return NextResponse.json({ error: 'type, value, and unit are required' }, { status: 400 });
        }

        const numericValue = parseFloat(value);
        if (Number.isNaN(numericValue)) {
            return NextResponse.json({ error: 'value must be a valid number' }, { status: 400 });
        }

        const metric = await prisma.patientMetric.create({
            data: {
                patientId: patient.id,
                type,
                value: numericValue,
                unit,
                notes: notes?.trim() || null,
                doctorId: doctorId || null,
                status: 'PENDING',
                isApproved: false,
            },
        });

        return NextResponse.json({ success: true, data: metric }, { status: 201 });
    } catch (err) {
        console.error('[POST /api/metrics]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
