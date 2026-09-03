/**
 * GET   /api/prescriptions — list prescriptions for current user (?mode=patient|doctor, ?status, ?page)
 * POST  /api/prescriptions — create new prescription with cross-domain safety check
 * PATCH /api/prescriptions — doctor approves, flags, or updates medication entries (STRICT DOCTOR RBAC, no self-approval)
 */
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import { evaluateInteractions } from '@/lib/clinicalEngine';

export async function GET(req) {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const mode = searchParams.get('mode');
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = 20;

    if (mode === 'doctor' && user.role !== 'DOCTOR') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const asDoctor = user.role === 'DOCTOR' && mode !== 'patient';
    const where = asDoctor
        ? { OR: [{ doctorId: user.id }, { status: { in: ['PENDING', 'FLAGGED', 'ANALYZED'] }, patientId: { not: user.id } }] }
        : { patientId: user.id };

    if (status) where.status = status;

    const [prescriptions, total] = await Promise.all([
        prisma.prescription.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * limit,
            take: limit,
            include: {
                patient: { select: { id: true, name: true, email: true, phone: true } },
                doctor: { select: { id: true, name: true } },
            },
        }),
        prisma.prescription.count({ where }),
    ]);

    return NextResponse.json({
        success: true,
        prescriptions,
        pagination: { total, page, totalPages: Math.ceil(total / limit) },
    });
}

export async function POST(req) {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const body = await req.json();
        const { medications, rawText, imageUrl, domain, notes, doctorId } = body;

        if (!medications || !Array.isArray(medications) || medications.length === 0) {
            return NextResponse.json({ error: 'At least one medication is required' }, { status: 400 });
        }

        let flags = evaluateInteractions(medications);

        try {
            const medNames = medications.map(m => (typeof m === 'string' ? m : m.name)).filter(Boolean);
            const fastApiRes = await fetch(`${process.env.FASTAPI_URL || 'http://localhost:8000'}/analyze/interactions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ medications: medNames }),
                signal: AbortSignal.timeout(2500),
            });
            if (fastApiRes.ok) {
                const aiResult = await fastApiRes.json();
                for (const ac of (aiResult.interactions || [])) {
                    if (!flags.some(f => f.medication?.toLowerCase().includes(ac.drug1.toLowerCase()))) {
                        flags.push({
                            medication: ac.drug1,
                            conflictSubstance: ac.drug2,
                            severity: ac.severity,
                            description: ac.description,
                            recommendation: ac.recommendation,
                        });
                    }
                }
            }
        } catch {
            // clinicalEngine fallback already ran
        }

        const hasHighOrMod = flags.some(f => f.severity === 'HIGH' || f.severity === 'MODERATE');

        const prescription = await prisma.prescription.create({
            data: {
                patientId: user.role === 'DOCTOR' && body.patientId ? body.patientId : user.id,
                doctorId: doctorId || null,
                medications,
                rawText: rawText || null,
                imageUrl: imageUrl || null,
                domain: ['ALLOPATHY', 'AYURVEDA', 'HOMEOPATHY'].includes(domain) ? domain : 'ALLOPATHY',
                notes: notes || null,
                status: hasHighOrMod ? 'FLAGGED' : 'PENDING',
                flagged: hasHighOrMod,
                flags: flags.length > 0 ? flags : null,
            },
        });

        return NextResponse.json({ success: true, prescription, interactions: flags }, { status: 201 });
    } catch (err) {
        console.error('[prescriptions POST]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PATCH(req) {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'DOCTOR') return NextResponse.json({ error: 'Forbidden: Only doctors can approve/modify prescriptions' }, { status: 403 });

    try {
        const { id, approved, medications, notes } = await req.json();
        if (!id || typeof approved !== 'boolean') {
            return NextResponse.json({ error: 'id and approved (boolean) are required' }, { status: 400 });
        }

        const rx = await prisma.prescription.findUnique({ where: { id } });
        if (!rx) return NextResponse.json({ error: 'Prescription not found' }, { status: 404 });
        if (rx.patientId === user.id) {
            return NextResponse.json({ error: 'Doctors cannot self-approve their own patient prescriptions.' }, { status: 403 });
        }

        const nextMeds = Array.isArray(medications) && medications.length > 0 ? medications : rx.medications;
        const recheckedFlags = evaluateInteractions(nextMeds);

        const updated = await prisma.prescription.update({
            where: { id },
            data: {
                doctorId: user.id,
                medications: nextMeds,
                status: approved ? 'APPROVED' : 'FLAGGED',
                flagged: !approved || recheckedFlags.some(f => f.severity === 'HIGH'),
                flags: recheckedFlags.length > 0 ? recheckedFlags : rx.flags,
                notes: notes !== undefined ? notes : rx.notes,
            },
        });

        return NextResponse.json({ success: true, prescription: updated });
    } catch (err) {
        console.error('[prescriptions PATCH]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
