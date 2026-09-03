/**
 * GET  /api/clinical-changes — Patient lists own factor & medication change requests
 * POST /api/clinical-changes — Patient submits a clinical factor/medication update request (PENDING until doctor approves)
 */
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser, ensurePatientProfile } from '@/lib/auth';

export async function GET() {
    try {
        const user = await getSessionUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const patient = user.patientProfile || await ensurePatientProfile(user.id);
        const requests = await prisma.clinicalChangeRequest.findMany({
            where: { patientId: patient.id },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({ success: true, requests, patientProfile: patient });
    } catch (err) {
        console.error('[GET /api/clinical-changes]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const user = await getSessionUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const patient = user.patientProfile || await ensurePatientProfile(user.id);
        const body = await request.json();
        const { category = 'FACTOR', field, requestedValue, reason, domain } = body;

        if (!field || !requestedValue?.trim()) {
            return NextResponse.json({ error: 'field and requestedValue are required' }, { status: 400 });
        }

        let currentValue = null;
        if (field === 'weight') currentValue = patient.weight ? `${patient.weight} kg` : 'Not set';
        else if (field === 'height') currentValue = patient.height ? `${patient.height} cm` : 'Not set';
        else if (field === 'bloodGroup') currentValue = patient.bloodGroup || 'Not set';
        else if (field === 'allergies') currentValue = (patient.allergies || []).join(', ') || 'None';
        else if (field === 'conditions') currentValue = (patient.conditions || []).join(', ') || 'None';
        else currentValue = body.currentValue || 'Current regimen';

        const created = await prisma.clinicalChangeRequest.create({
            data: {
                patientId: patient.id,
                category: category === 'MEDICATION' ? 'MEDICATION' : 'FACTOR',
                field,
                currentValue,
                requestedValue: requestedValue.trim(),
                domain: ['ALLOPATHY', 'AYURVEDA', 'HOMEOPATHY'].includes(domain) ? domain : null,
                reason: reason?.trim() || null,
                status: 'PENDING',
            },
        });

        return NextResponse.json({ success: true, data: created }, { status: 201 });
    } catch (err) {
        console.error('[POST /api/clinical-changes]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
