/**
 * PATCH /api/clinical-changes/[id]/approve
 * Doctor approves/rejects a patient factor or medication change request.
 * Only applies the change to the Patient dashboard/profile UPON DOCTOR APPROVAL.
 */
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function PATCH(request, { params }) {
    try {
        const user = await getSessionUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        if (user.role !== 'DOCTOR') return NextResponse.json({ error: 'Forbidden: Doctors only' }, { status: 403 });

        const { id } = await params;
        const { approved, reviewNote } = await request.json();
        if (typeof approved !== 'boolean') {
            return NextResponse.json({ error: 'approved (boolean) is required' }, { status: 400 });
        }

        const changeReq = await prisma.clinicalChangeRequest.findUnique({
            where: { id },
            include: { patient: true },
        });
        if (!changeReq) return NextResponse.json({ error: 'Change request not found' }, { status: 404 });

        if (changeReq.patient?.userId === user.id) {
            return NextResponse.json({ error: 'Self-approval of personal clinical changes is prohibited.' }, { status: 403 });
        }

        const updated = await prisma.clinicalChangeRequest.update({
            where: { id },
            data: {
                status: approved ? 'APPROVED' : 'REJECTED',
                reviewedBy: user.id,
                reviewedAt: new Date(),
                reviewNote: reviewNote?.trim() || (approved ? 'Approved by physician' : 'Declined by physician'),
            },
        });

        // Apply approved changes onto official Patient record
        if (approved && changeReq.category === 'FACTOR') {
            const val = changeReq.requestedValue;
            const updateData = {};
            if (changeReq.field === 'weight') {
                const n = parseFloat(val);
                if (!Number.isNaN(n)) updateData.weight = n;
            } else if (changeReq.field === 'height') {
                const n = parseFloat(val);
                if (!Number.isNaN(n)) updateData.height = n;
            } else if (changeReq.field === 'bloodGroup') {
                updateData.bloodGroup = val;
            } else if (changeReq.field === 'allergies') {
                updateData.allergies = val.split(',').map(s => s.trim()).filter(Boolean);
            } else if (changeReq.field === 'conditions') {
                updateData.conditions = val.split(',').map(s => s.trim()).filter(Boolean);
            }

            if (Object.keys(updateData).length > 0) {
                await prisma.patient.update({
                    where: { id: changeReq.patientId },
                    data: updateData,
                });
            }
        }

        // If approved MEDICATION change, also record an official APPROVED Prescription note
        if (approved && changeReq.category === 'MEDICATION') {
            await prisma.prescription.create({
                data: {
                    patientId: changeReq.patient.userId,
                    doctorId: user.id,
                    domain: changeReq.domain || 'ALLOPATHY',
                    status: 'APPROVED',
                    flagged: false,
                    rawText: `Doctor-approved medication change: ${changeReq.requestedValue}`,
                    medications: [
                        {
                            name: changeReq.requestedValue,
                            dosage: 'As directed',
                            frequency: 'Approved update',
                            domain: changeReq.domain || 'ALLOPATHY',
                            category: 'Doctor-Approved Change',
                        },
                    ],
                    notes: reviewNote?.trim() || changeReq.reason || 'Approved via Clinical Review Queue',
                },
            });
        }

        return NextResponse.json({ success: true, data: updated });
    } catch (err) {
        console.error('[PATCH /api/clinical-changes/[id]/approve]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
