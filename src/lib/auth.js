/**
 * Shared server-side session lookup for CURA API routes.
 * Avoids duplicating cookie & session verification logic across routes.
 */
import { cookies } from 'next/headers';
import { prisma } from './prisma';

export async function getSessionUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get('cura_session')?.value;
    if (!token) return null;

    const session = await prisma.session.findUnique({
        where: { token },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    role: true,
                    image: true,
                    doctorProfile: true,
                    patientProfile: true,
                },
            },
        },
    });

    if (!session || session.expires < new Date()) {
        if (session) {
            await prisma.session.deleteMany({ where: { token } });
        }
        return null;
    }

    return session.user;
}

/**
 * Ensures the authenticated user has a Patient profile record so they can
 * record personal health metrics or factor change requests (even if role === 'DOCTOR').
 */
export async function ensurePatientProfile(userId) {
    return prisma.patient.upsert({
        where: { userId },
        update: {},
        create: { userId },
    });
}
