/**
 * GET   /api/community — Fetch clinically moderated community posts from Postgres (?domain=ALLOPATHY|AYURVEDA|HOMEOPATHY)
 * POST  /api/community — Create post (authenticated), runs safety moderation via FastAPI + clinicalEngine
 * PATCH /api/community — Upvote a post
 */
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import { moderateCommunityText } from '@/lib/clinicalEngine';

export async function GET(req) {
    try {
        const user = await getSessionUser();
        const { searchParams } = new URL(req.url);
        const domain = searchParams.get('domain');

        const where = {
            status: { not: 'REMOVED' },
            ...(domain && ['ALLOPATHY', 'AYURVEDA', 'HOMEOPATHY'].includes(domain.toUpperCase()) && { domain: domain.toUpperCase() }),
        };

        // Include APPROVED and FLAGGED (with clinical warning banners), plus PENDING authored by current user
        if (user) {
            where.OR = [
                { status: { in: ['APPROVED', 'FLAGGED'] } },
                { authorId: user.id },
            ];
        } else {
            where.status = { in: ['APPROVED', 'FLAGGED'] };
        }

        const posts = await prisma.communityPost.findMany({
            where,
            orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
            include: {
                author: { select: { id: true, name: true, role: true } },
            },
        });

        return NextResponse.json({ success: true, data: posts });
    } catch (err) {
        console.error('[GET /api/community]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const user = await getSessionUser();
        if (!user) return NextResponse.json({ error: 'Sign in required to post' }, { status: 401 });

        const body = await req.json();
        const { title, content, domain = 'ALLOPATHY', tags = [] } = body;

        if (!content || !content.trim()) {
            return NextResponse.json({ error: 'Post content is required' }, { status: 400 });
        }

        const safeDomain = ['ALLOPATHY', 'AYURVEDA', 'HOMEOPATHY'].includes(domain.toUpperCase())
            ? domain.toUpperCase()
            : 'ALLOPATHY';

        let moderation = moderateCommunityText(title, content);

        // Optional FastAPI moderation check
        try {
            const modRes = await fetch(`${process.env.FASTAPI_URL || 'http://localhost:8000'}/community/moderate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ post_content: `${title || ''} ${content}` }),
                signal: AbortSignal.timeout(2000),
            });
            if (modRes.ok) {
                const aiMod = await modRes.json();
                if (aiMod.is_safe === false) {
                    moderation = {
                        status: 'FLAGGED',
                        modNote: (aiMod.flags || []).join('; ') || 'Flagged by clinical AI moderation.',
                    };
                }
            }
        } catch {
            // fallback already ran
        }

        const post = await prisma.communityPost.create({
            data: {
                authorId: user.id,
                title: title?.trim() || content.trim().slice(0, 64),
                content: content.trim(),
                domain: safeDomain,
                tags: Array.isArray(tags) ? tags : [],
                status: moderation.status,
                modNote: moderation.modNote,
            },
            include: {
                author: { select: { id: true, name: true, role: true } },
            },
        });

        return NextResponse.json({ success: true, data: post }, { status: 201 });
    } catch (err) {
        console.error('[POST /api/community]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PATCH(req) {
    try {
        const user = await getSessionUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { id, action, status, modNote } = await req.json();
        if (!id) return NextResponse.json({ error: 'Post id is required' }, { status: 400 });

        if (action === 'upvote') {
            const updated = await prisma.communityPost.update({
                where: { id },
                data: { upvotes: { increment: 1 } },
            });
            return NextResponse.json({ success: true, data: updated });
        }

        // Strict RBAC: Only DOCTOR role can moderate community posts
        if (status) {
            if (user.role !== 'DOCTOR') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
            const updated = await prisma.communityPost.update({
                where: { id },
                data: { status, ...(modNote !== undefined && { modNote }) },
            });
            return NextResponse.json({ success: true, data: updated });
        }

        return NextResponse.json({ error: 'Unsupported action' }, { status: 400 });
    } catch (err) {
        console.error('[PATCH /api/community]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
