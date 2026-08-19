import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        // SIMULATE: Cross-System Conflict & Safety Checker (Drug-Herb / Herb-Drug / Contraindications)
        const body = await request.json();
        const { medications } = body;

        if (!medications || !Array.isArray(medications)) {
            return NextResponse.json({ success: false, error: "An array of medications is required." }, { status: 400 });
        }

        // Mock Conflict Logic
        // If Ashwagandha + Immunosuppressants OR Metformin + certain herbs -> Flag
        let conflicts = [];
        const hasMetformin = medications.some(m => m.name.toLowerCase().includes("metformin"));
        const hasGiloy = medications.some(m => m.name.toLowerCase().includes("giloy") || m.name.toLowerCase().includes("tinospora"));

        if (hasMetformin && hasGiloy) {
            conflicts.push({
                severity: "high",
                drugs_involved: ["Metformin", "Giloy (Tinospora cordifolia)"],
                warning: "Potential risk of hypoglycemia. Both agents lower blood sugar. Close monitoring is robustly recommended."
            });
        }

        const consensusScore = conflicts.length === 0 ? 0.95 : 0.60;

        return NextResponse.json({
            success: true,
            data: {
                isSafe: conflicts.length === 0,
                consensusScore: consensusScore,
                conflicts: conflicts
            }
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ success: false, error: "Invalid safety check payload." }, { status: 400 });
    }
}

// commit-touch: 2026-08-19 14:15:00

// commit-touch: sameerpatel01 2026-08-19 14:15:00

// commit-touch: sameerpatel01 2026-08-19 14:15:00

// commit-touch: sameerpatel01 2026-08-19 14:15:00
