/**
 * GET  /api/reviews — list patient reviews (?domain, ?doctorUserId)
 * POST /api/reviews — authenticated user posts a verified review & recalculates Doctor aggregate stats
 */
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const domain = searchParams.get('domain');
        const doctorUserId = searchParams.get('doctorUserId');

        const reviews = await prisma.doctorReview.findMany({
            where: {
                ...(domain && ['ALLOPATHY', 'AYURVEDA', 'HOMEOPATHY'].includes(domain.toUpperCase()) && { domain: domain.toUpperCase() }),
                ...(doctorUserId && { doctorUserId }),
            },
            orderBy: { createdAt: 'desc' },
            take: 30,
            include: {
                author: { select: { name: true } },
                doctor: { select: { name: true } },
            },
        });

        return NextResponse.json({ success: true, reviews });
    } catch (err) {
        console.error('[GET /api/reviews]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const user = await getSessionUser();
        if (!user) return NextResponse.json({ error: 'Sign in required to submit a review' }, { status: 401 });

        const body = await req.json();
        const { doctorUserId, rating, title, body: reviewBody, disease, domain, recoveryDays, totalCost, wouldRecommend = true } = body;

        if (!doctorUserId || !rating || !reviewBody?.trim() || !domain) {
            return NextResponse.json({ error: 'doctorUserId, rating, domain, and body are required' }, { status: 400 });
        }
        if (doctorUserId === user.id) {
            return NextResponse.json({ error: 'You cannot review yourself.' }, { status: 400 });
        }

        const safeDomain = ['ALLOPATHY', 'AYURVEDA', 'HOMEOPATHY'].includes(domain.toUpperCase()) ? domain.toUpperCase() : 'ALLOPATHY';
        const numericRating = Math.min(5, Math.max(1, parseInt(rating, 10)));

        const review = await prisma.doctorReview.upsert({
            where: { authorId_doctorUserId: { authorId: user.id, doctorUserId } },
            update: {
                rating: numericRating,
                title: title?.trim() || null,
                body: reviewBody.trim(),
                disease: disease?.trim() || null,
                domain: safeDomain,
                recoveryDays: recoveryDays ? parseInt(recoveryDays, 10) : null,
                totalCost: totalCost ? parseFloat(totalCost) : null,
                wouldRecommend: Boolean(wouldRecommend),
            },
            create: {
                authorId: user.id,
                doctorUserId,
                rating: numericRating,
                title: title?.trim() || null,
                body: reviewBody.trim(),
                disease: disease?.trim() || null,
                domain: safeDomain,
                recoveryDays: recoveryDays ? parseInt(recoveryDays, 10) : null,
                totalCost: totalCost ? parseFloat(totalCost) : null,
                wouldRecommend: Boolean(wouldRecommend),
            },
        });

        // Recalculate doctor aggregate stats cleanly
        const docReviews = await prisma.doctorReview.findMany({ where: { doctorUserId } });
        const doctorRecord = await prisma.doctor.findUnique({ where: { userId: doctorUserId } });
        if (doctorRecord && docReviews.length > 0) {
            const newAvg = docReviews.reduce((s, r) => s + r.rating, 0) / docReviews.length;
            const recCount = docReviews.filter(r => r.wouldRecommend).length;
            const daysList = docReviews.map(r => r.recoveryDays).filter(Boolean);
            await prisma.doctor.update({
                where: { userId: doctorUserId },
                data: {
                    avgRating: Number(newAvg.toFixed(2)),
                    totalReviews: Math.max(doctorRecord.totalReviews, docReviews.length),
                    successRate: Number(((recCount / docReviews.length) * 100).toFixed(1)),
                    ...(daysList.length > 0 && { avgRecoveryDays: Math.round(daysList.reduce((a, b) => a + b, 0) / daysList.length) }),
                },
            });
        }

        return NextResponse.json({ success: true, review }, { status: 201 });
    } catch (err) {
        console.error('[POST /api/reviews]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
