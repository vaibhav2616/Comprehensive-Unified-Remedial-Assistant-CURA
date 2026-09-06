import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        // Step 7, 8, & 9: Review AI Draft -> Doctor Decision -> Manage Appointments
        const body = await request.json();
        const { doctorId, draftId, decision, overrides, rejectionReason } = body;

        // validation
        if (!doctorId || !draftId || !decision) {
            return NextResponse.json({ success: false, error: "Missing required decision metrics." }, { status: 400 });
        }

        if (decision === "reject" && !rejectionReason) {
            return NextResponse.json({ success: false, error: "Rejection reason must be logged for AI training and compliance." }, { status: 400 });
        }

        // Process Decision
        // In a real DB, update the Draft table and trigger notifications
        let finalPrescriptionStatus = "approved";

        if (decision === "reject") {
            finalPrescriptionStatus = "rejected";
        } else if (decision === "edit") {
            finalPrescriptionStatus = "modified";
        }

        const feedbackLoopData = {
            aiModelImprovement: true,
            capturedEdits: overrides || null,
            reason: rejectionReason || null
        };

        return NextResponse.json({
            success: true,
            message: `Prescription draft ${draftId} successfully ${finalPrescriptionStatus}.`,
            data: {
                feedbackSaved: feedbackLoopData,
                nextStep: "Communicate with Patient via Notification Module"
            }
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ success: false, error: "Invalid doctor decision payload." }, { status: 400 });
    }
}

// commit-touch: 2026-08-20 10:00:00

// commit-touch: sameerpatel01 2026-08-20 10:00:00

// commit-touch: sameerpatel01 2026-08-20 10:00:00

// commit-touch: sameerpatel01 2026-08-20 10:00:00
