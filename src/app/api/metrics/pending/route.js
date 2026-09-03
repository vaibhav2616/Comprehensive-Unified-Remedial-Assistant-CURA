/**
 * GET /api/metrics/pending — Doctor approval queue:
 * Returns pending PatientMetrics, pending ClinicalChangeRequests (factors/medications),
 * and pending/flagged Prescriptions.
 * Strict RBAC: Only DOCTOR role can access, and doctors NEVER see their own patient submissions.
 */
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function GET() {
    try {
        const user = await getSessionUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        if (user.role !== 'DOCTOR') return NextResponse.json({ error: 'Forbidden: Doctors only' }, { status: 403 });

        // Find patients linked to this doctor by appointment or assignment, OR unassigned clinic items
        const appointments = await prisma.appointment.findMany({
            where: { doctorId: user.id },
            select: { patientId: true },
            distinct: ['patientId'],
        });
        const linkedUserIds = appointments.map(a => a.patientId);

        const pendingMetrics = await prisma.patientMetric.findMany({
            where: {
                status: 'PENDING',
                patient: { userId: { not: user.id } },
                ...(linkedUserIds.length > 0
                    ? {
                        OR: [
                            { doctorId: user.id },
                            { doctorId: null },
                            { patient: { userId: { in: linkedUserIds } } },
                        ],
                    }
                    : {}),
            },
            orderBy: { recordedAt: 'desc' },
            include: {
                patient: {
                    include: { user: { select: { id: true, name: true, email: true } } },
                },
            },
        });

        const pendingFactors = await prisma.clinicalChangeRequest.findMany({
            where: {
                status: 'PENDING',
                patient: { userId: { not: user.id } },
            },
            orderBy: { createdAt: 'desc' },
            include: {
                patient: {
                    include: { user: { select: { id: true, name: true, email: true } } },
                },
            },
        });

        const pendingPrescriptions = await prisma.prescription.findMany({
            where: {
                status: { in: ['PENDING', 'FLAGGED', 'ANALYZED'] },
                patientId: { not: user.id },
            },
            orderBy: { createdAt: 'desc' },
            include: {
                patient: { select: { id: true, name: true, email: true } },
            },
        });

        const formattedMetrics = pendingMetrics.map(m => ({
            id: m.id,
            itemKind: 'METRIC',
            type: m.type,
            value: m.value,
            unit: m.unit,
            notes: m.notes,
            recordedAt: m.recordedAt,
            patientName: m.patient?.user?.name || 'Patient',
            patientEmail: m.patient?.user?.email,
            isLinkedPatient: linkedUserIds.includes(m.patient?.userId),
        }));

        const formattedFactors = pendingFactors.map(f => ({
            id: f.id,
            itemKind: 'FACTOR',
            category: f.category,
            field: f.field,
            currentValue: f.currentValue,
            requestedValue: f.requestedValue,
            domain: f.domain,
            reason: f.reason,
            createdAt: f.createdAt,
            patientName: f.patient?.user?.name || 'Patient',
            patientEmail: f.patient?.user?.email,
        }));

        const formattedPrescriptions = pendingPrescriptions.map(rx => ({
            id: rx.id,
            itemKind: 'PRESCRIPTION',
            domain: rx.domain,
            status: rx.status,
            flagged: rx.flagged,
            flags: rx.flags,
            medications: rx.medications,
            notes: rx.notes,
            createdAt: rx.createdAt,
            patientName: rx.patient?.name || 'Patient',
            patientEmail: rx.patient?.email,
        }));

        return NextResponse.json({
            success: true,
            data: formattedMetrics,
            metrics: formattedMetrics,
            factorRequests: formattedFactors,
            prescriptions: formattedPrescriptions,
        });
    } catch (err) {
        console.error('[GET /api/metrics/pending]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
