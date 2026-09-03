/**
 * PATCH /api/metrics/[id]/approve — Doctor approves or rejects a vital metric reading.
 * Body: { approved: boolean, reviewNote?: string }
 */
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function PATCH(request, { params }) {
    try {
        const user = await getSessionUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        if (user.role !== 'DOCTOR') return NextResponse.json({ error: 'Forbidden: Only doctors can approve metrics' }, { status: 403 });

        const { id } = await params;
        const body = await request.json();
        const { approved, reviewNote } = body;

        if (typeof approved !== 'boolean') {
            return NextResponse.json({ error: 'approved (boolean) is required' }, { status: 400 });
        }

        const metric = await prisma.patientMetric.findUnique({
            where: { id },
            include: { patient: true },
        });
        if (!metric) return NextResponse.json({ error: 'Metric not found' }, { status: 404 });

        // Doctors acting as patients cannot self-approve their own clinical readings
        if (metric.patient?.userId === user.id) {
            return NextResponse.json({ error: 'Self-approval of personal metrics is prohibited for clinical safety.' }, { status: 403 });
        }

        const updated = await prisma.patientMetric.update({
            where: { id },
            data: {
                status: approved ? 'APPROVED' : 'REJECTED',
                isApproved: approved,
                reviewedBy: user.id,
                reviewedAt: new Date(),
                reviewNote: reviewNote?.trim() || (approved ? 'Clinically verified by doctor' : 'Rejected — please re-measure'),
            },
        });

        // If approved weight metric, also sync approved patient weight
        if (approved && metric.type === 'weight' && metric.patientId) {
            await prisma.patient.update({
                where: { id: metric.patientId },
                data: { weight: metric.value },
            });
        }

        return NextResponse.json({ success: true, data: updated });
    } catch (err) {
        console.error('[PATCH /api/metrics/[id]/approve]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
