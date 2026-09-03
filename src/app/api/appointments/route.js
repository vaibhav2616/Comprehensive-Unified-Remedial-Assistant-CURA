/**
 * GET   /api/appointments — list appointments (?mode=patient|doctor, ?status, ?upcoming)
 * POST  /api/appointments — create appointment (any authenticated user booking a doctor, cannot book self)
 * PATCH /api/appointments — update status (Patients can only CANCEL own; Doctors can CONFIRM/COMPLETE/CANCEL their patient appointments)
 */
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import { z } from 'zod';

export async function GET(req) {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const upcoming = searchParams.get('upcoming') === 'true';
    const mode = searchParams.get('mode'); // optional 'patient' when doctor views their personal patient dashboard

    // Strict RBAC: Patients can never query doctor clinic appointments
    if (mode === 'doctor' && user.role !== 'DOCTOR') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const asDoctor = user.role === 'DOCTOR' && mode !== 'patient';
    const whereClause = asDoctor ? { doctorId: user.id } : { patientId: user.id };

    if (status) whereClause.status = status;
    if (upcoming) whereClause.slot = { gte: new Date() };

    const appointments = await prisma.appointment.findMany({
        where: whereClause,
        orderBy: { slot: 'asc' },
        include: {
            patient: { select: { id: true, name: true, email: true, phone: true, image: true } },
            doctor: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                    doctorProfile: {
                        select: { specialization: true, hospital: true, city: true, domains: true, consultFee: true },
                    },
                },
            },
        },
    });

    return NextResponse.json({ success: true, appointments });
}

const createSchema = z.object({
    doctorId: z.string(),
    slot: z.string().datetime(),
    domain: z.enum(['ALLOPATHY', 'AYURVEDA', 'HOMEOPATHY']),
    type: z.string().default('consultation'),
    reason: z.string().optional(),
    fee: z.number().optional(),
});

export async function POST(req) {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const body = createSchema.parse(await req.json());

        if (body.doctorId === user.id) {
            return NextResponse.json({ error: 'You cannot book an appointment with yourself.' }, { status: 400 });
        }

        // Resolve target doctor by User.id or Doctor.id cleanly
        let targetDoctorUser = await prisma.user.findUnique({ where: { id: body.doctorId } });
        if (!targetDoctorUser || targetDoctorUser.role !== 'DOCTOR') {
            const docProfile = await prisma.doctor.findUnique({ where: { id: body.doctorId }, include: { user: true } });
            if (docProfile?.user) {
                targetDoctorUser = docProfile.user;
            }
        }
        if (!targetDoctorUser || targetDoctorUser.role !== 'DOCTOR') {
            return NextResponse.json({ error: 'Selected doctor does not exist.' }, { status: 404 });
        }

        const conflict = await prisma.appointment.findFirst({
            where: {
                doctorId: targetDoctorUser.id,
                slot: new Date(body.slot),
                status: { notIn: ['CANCELLED'] },
            },
        });
        if (conflict) return NextResponse.json({ error: 'This time slot is already booked' }, { status: 409 });

        const appointment = await prisma.appointment.create({
            data: {
                patientId: user.id,
                doctorId: targetDoctorUser.id,
                slot: new Date(body.slot),
                domain: body.domain,
                type: body.type,
                reason: body.reason,
                fee: body.fee,
                status: 'PENDING',
            },
        });

        return NextResponse.json({ success: true, appointment }, { status: 201 });
    } catch (err) {
        if (err.name === 'ZodError') return NextResponse.json({ error: err.errors[0].message }, { status: 400 });
        console.error('[appointments POST]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PATCH(req) {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id, status, notes } = await req.json();
    if (!id || !status) return NextResponse.json({ error: 'id and status are required' }, { status: 400 });

    const appointment = await prisma.appointment.findUnique({ where: { id } });
    if (!appointment) return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });

    const isAssignedDoctor = user.role === 'DOCTOR' && user.id === appointment.doctorId;
    const isBookingPatient = user.id === appointment.patientId;

    if (!isAssignedDoctor && !isBookingPatient) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Strict RBAC: Patients can only cancel their own appointments, never confirm or complete
    if (!isAssignedDoctor && status !== 'CANCELLED') {
        return NextResponse.json({ error: 'Only the attending doctor can confirm or complete appointments.' }, { status: 403 });
    }

    const updated = await prisma.appointment.update({
        where: { id },
        data: { status, ...(notes !== undefined && { notes }) },
    });

    return NextResponse.json({ success: true, appointment: updated });
}
