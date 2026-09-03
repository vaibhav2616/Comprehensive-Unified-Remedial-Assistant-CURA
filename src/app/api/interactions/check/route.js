import { NextResponse } from 'next/server';
import { evaluateInteractions } from '@/lib/clinicalEngine';

export async function POST(request) {
    try {
        const body = await request.json();
        const { medications = [], targetDomain = null } = body;

        const conflicts = evaluateInteractions(medications, targetDomain);

        // Also query FastAPI microservice if available
        let aiConflicts = [];
        try {
            const medNames = medications.map(m => (typeof m === 'string' ? m : m.name)).filter(Boolean);
            if (medNames.length > 0) {
                const fastApiRes = await fetch(`${process.env.FASTAPI_URL || 'http://localhost:8000'}/analyze/interactions`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ medications: medNames }),
                    signal: AbortSignal.timeout(2500),
                });
                if (fastApiRes.ok) {
                    const aiData = await fastApiRes.json();
                    aiConflicts = aiData.interactions || [];
                }
            }
        } catch {
            // FastAPI optional fallback
        }

        const merged = [...conflicts];
        for (const ac of aiConflicts) {
            const exists = merged.some(c =>
                (c.medication?.toLowerCase().includes(ac.drug1.toLowerCase()) || c.matchedWith?.toLowerCase().includes(ac.drug2.toLowerCase()))
            );
            if (!exists) {
                merged.push({
                    id: `ai-${ac.drug1}-${ac.drug2}`,
                    medication: ac.drug1,
                    conflictSubstance: ac.drug2,
                    severity: ac.severity,
                    description: ac.description,
                    recommendation: ac.recommendation,
                });
            }
        }

        return NextResponse.json({
            success: true,
            hasConflicts: merged.length > 0,
            conflicts: merged,
            checkedMedications: medications.length,
            targetDomain,
        });
    } catch (err) {
        console.error('[interactions/check]', err);
        return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }
}
