import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const body = await request.json();

        // STARTUP V1 ARCHITECTURE: 
        // Step 1: Personal Information & Health History (Patient Path)
        // OR Type-Specific Registration (Professional Path)

        const {
            role, // 'patient', 'doctor', 'manufacturer', 'hospital', 'store'
            personalInfo,
            healthHistory,
            consent,
            credentials // for professionals
        } = body;

        // Validation
        if (!role || !personalInfo?.name || !personalInfo?.email) {
            return NextResponse.json({ success: false, error: "Missing required fields." }, { status: 400 });
        }

        if (role === 'patient' && !consent) {
            return NextResponse.json({ success: false, error: "Medical data consent is required." }, { status: 400 });
        }

        if (role === 'doctor' && !credentials?.licenseNumber) {
            return NextResponse.json({ success: false, error: "Medical license is required for verification." }, { status: 400 });
        }

        // Mock Database Insert
        const userId = `usr_${Date.now()}`;
        const verificationStatus = role === 'patient' ? 'verified' : 'pending_document_review';

        return NextResponse.json({
            success: true,
            data: {
                userId,
                role,
                verificationStatus,
                message: role === 'patient'
                    ? "Patient registration successful. Ready for medical records upload."
                    : "Professional registration submitted. Pending verification by CURA administration.",
            }
        }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ success: false, error: "Invalid request payload." }, { status: 400 });
    }
}

// commit-touch: 2026-08-19 09:45:00

// commit-touch: sameerpatel01 2026-08-19 09:45:00

// commit-touch: sameerpatel01 2026-08-19 09:45:00

// commit-touch: sameerpatel01 2026-08-19 09:45:00
