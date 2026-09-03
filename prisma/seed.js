const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Seeding CURA PostgreSQL database...');

    // 1. Seed Doctors (3 Allopathy, 3 Ayurveda, 3 Homeopathy)
    const doctorsData = [
        {
            email: 'priya.sharma@cura.health',
            name: 'Dr. Priya Sharma',
            phone: '+919810000001',
            registrationNo: 'MCI-ALLO-48210',
            specialization: ['Cardiologist', 'Internal Medicine', 'Hypertension', 'General Physician'],
            domains: ['ALLOPATHY'],
            experience: 14,
            qualifications: ['MBBS', 'MD (Cardiology)', 'DM'],
            hospital: 'Apollo Heart Institute',
            city: 'Mumbai',
            state: 'Maharashtra',
            consultFee: 1200,
            avgMedicineCost: 950,
            bio: 'Senior interventional cardiologist specializing in hypertension, preventive heart care, and safe integrative medication reconciliation.',
            isVerified: true,
            avgRating: 4.9,
            totalReviews: 142,
            avgRecoveryDays: 14,
            successRate: 93.5,
        },
        {
            email: 'rajesh.gupta@cura.health',
            name: 'Dr. Rajesh Gupta',
            phone: '+919810000002',
            registrationNo: 'MCI-ALLO-31904',
            specialization: ['Neurologist', 'Migraine', 'Headache Specialist'],
            domains: ['ALLOPATHY'],
            experience: 18,
            qualifications: ['MBBS', 'MD (Medicine)', 'DM (Neurology)'],
            hospital: 'Max Super Specialty Centre',
            city: 'Delhi',
            state: 'Delhi',
            consultFee: 1000,
            avgMedicineCost: 700,
            bio: 'Clinical neurologist focused on chronic migraine, tension headaches, sleep architecture, and rapid acute symptom relief.',
            isVerified: true,
            avgRating: 4.7,
            totalReviews: 118,
            avgRecoveryDays: 7,
            successRate: 91.0,
        },
        {
            email: 'anika.patel@cura.health',
            name: 'Dr. Anika Patel',
            phone: '+919810000003',
            registrationNo: 'MCI-ALLO-67421',
            specialization: ['General Physician', 'Respiratory', 'Diabetes', 'Viral Fever'],
            domains: ['ALLOPATHY'],
            experience: 9,
            qualifications: ['MBBS', 'MD (General Medicine)'],
            hospital: 'Manipal Clinics',
            city: 'Bangalore',
            state: 'Karnataka',
            consultFee: 600,
            avgMedicineCost: 480,
            bio: 'Evidence-based primary care physician managing metabolic disorders, bronchitis, seasonal fevers, and acute gut complaints.',
            isVerified: true,
            avgRating: 4.6,
            totalReviews: 94,
            avgRecoveryDays: 6,
            successRate: 92.2,
        },
        {
            email: 'meera.joshi@cura.health',
            name: 'Vaidya Meera Joshi',
            phone: '+919810000004',
            registrationNo: 'AYUSH-AYUR-11209',
            specialization: ['Panchakarma Specialist', 'Migraine', 'Digestive Health', 'IBS'],
            domains: ['AYURVEDA'],
            experience: 22,
            qualifications: ['BAMS', 'MD (Ayurveda - Kayachikitsa)'],
            hospital: 'Kottakkal Integrative Care',
            city: 'Jaipur',
            state: 'Rajasthan',
            consultFee: 700,
            avgMedicineCost: 620,
            bio: 'Renowned Ayurvedic clinician specializing in Dosha balancing, Shirodhara for chronic headaches, and Agni restoration for IBS.',
            isVerified: true,
            avgRating: 4.8,
            totalReviews: 89,
            avgRecoveryDays: 45,
            successRate: 87.5,
        },
        {
            email: 'arjun.nair@cura.health',
            name: 'Dr. Arjun Nair',
            phone: '+919810000005',
            registrationNo: 'AYUSH-AYUR-22914',
            specialization: ['Rasayana & Immunity', 'Arthritis', 'Anxiety', 'Stress'],
            domains: ['AYURVEDA'],
            experience: 15,
            qualifications: ['BAMS', 'PhD (Ayurvedic Rasayana)'],
            hospital: 'Vaidyaratnam Wellness Clinic',
            city: 'Kochi',
            state: 'Kerala',
            consultFee: 650,
            avgMedicineCost: 580,
            bio: 'Specialist in musculoskeletal rejuvenation, adaptogenic stress management, and safe herb-allopathy co-management.',
            isVerified: true,
            avgRating: 4.7,
            totalReviews: 76,
            avgRecoveryDays: 60,
            successRate: 86.0,
        },
        {
            email: 'karthik.menon@cura.health',
            name: 'Dr. Karthik Menon',
            phone: '+919810000006',
            registrationNo: 'AYUSH-AYUR-54118',
            specialization: ['Kayachikitsa', 'Respiratory', 'Viral Fever', 'Metabolic'],
            domains: ['AYURVEDA'],
            experience: 11,
            qualifications: ['BAMS', 'MS (Ayurveda)'],
            hospital: 'Arya Vaidya Polyclinic',
            city: 'Pune',
            state: 'Maharashtra',
            consultFee: 500,
            avgMedicineCost: 420,
            bio: 'Internal medicine specialist using classical herbal decoctions and personalized dietary protocols.',
            isVerified: true,
            avgRating: 4.5,
            totalReviews: 52,
            avgRecoveryDays: 21,
            successRate: 84.0,
        },
        {
            email: 'farhan.sheikh@cura.health',
            name: 'Dr. Farhan Sheikh',
            phone: '+919810000007',
            registrationNo: 'CCH-HOM-88310',
            specialization: ['Constitutional Prescribing', 'Migraine', 'Anxiety', 'Insomnia'],
            domains: ['HOMEOPATHY'],
            experience: 13,
            qualifications: ['BHMS', 'MD (Homeopathy)'],
            hospital: 'Hahnemann Holistic Center',
            city: 'Hyderabad',
            state: 'Telangana',
            consultFee: 450,
            avgMedicineCost: 300,
            bio: 'Classical constitutional homeopath helping patients with recurring migraines, sleep disturbances, and stress hypersensitivity.',
            isVerified: true,
            avgRating: 4.7,
            totalReviews: 68,
            avgRecoveryDays: 75,
            successRate: 81.5,
        },
        {
            email: 'neha.kapoor@cura.health',
            name: 'Dr. Neha Kapoor',
            phone: '+919810000008',
            registrationNo: 'CCH-HOM-77412',
            specialization: ['Respiratory Homeopathy', 'Skin & Allergy', 'Viral Fever'],
            domains: ['HOMEOPATHY'],
            experience: 10,
            qualifications: ['BHMS', 'PGDip (Clinical Homeopathy)'],
            hospital: 'Arogya Homeopathic Clinic',
            city: 'Lucknow',
            state: 'Uttar Pradesh',
            consultFee: 400,
            avgMedicineCost: 260,
            bio: 'Gentle, side-effect-free protocols for allergic bronchitis, chronic skin flare-ups, and pediatric immunity.',
            isVerified: true,
            avgRating: 4.6,
            totalReviews: 57,
            avgRecoveryDays: 35,
            successRate: 79.0,
        },
        {
            email: 'sameer.bose@cura.health',
            name: 'Dr. Sameer Bose',
            phone: '+919810000009',
            registrationNo: 'CCH-HOM-33105',
            specialization: ['Chronic Disease', 'Arthritis', 'IBS', 'Autoimmune'],
            domains: ['HOMEOPATHY'],
            experience: 17,
            qualifications: ['BHMS', 'MD (Organon)'],
            hospital: 'Calcutta Homeo Care',
            city: 'Kolkata',
            state: 'West Bengal',
            consultFee: 500,
            avgMedicineCost: 340,
            bio: 'Experienced chronic care clinician treating autoimmune joint stiffness and chronic gut sensitivity.',
            isVerified: true,
            avgRating: 4.4,
            totalReviews: 45,
            avgRecoveryDays: 90,
            successRate: 78.2,
        },
    ];

    const createdDoctors = [];
    for (const d of doctorsData) {
        const user = await prisma.user.upsert({
            where: { email: d.email },
            update: { name: d.name, role: 'DOCTOR' },
            create: {
                name: d.name,
                email: d.email,
                phone: d.phone,
                role: 'DOCTOR',
                emailVerified: new Date(),
            },
        });

        // Also ensure every doctor has a patient profile for personal health tracking
        await prisma.patient.upsert({
            where: { userId: user.id },
            update: {},
            create: { userId: user.id, bloodGroup: 'O+' },
        });

        const doc = await prisma.doctor.upsert({
            where: { userId: user.id },
            update: {
                specialization: d.specialization,
                domains: d.domains,
                experience: d.experience,
                qualifications: d.qualifications,
                hospital: d.hospital,
                city: d.city,
                state: d.state,
                consultFee: d.consultFee,
                avgMedicineCost: d.avgMedicineCost,
                bio: d.bio,
                isVerified: d.isVerified,
                avgRating: d.avgRating,
                totalReviews: d.totalReviews,
                avgRecoveryDays: d.avgRecoveryDays,
                successRate: d.successRate,
            },
            create: {
                userId: user.id,
                registrationNo: d.registrationNo,
                specialization: d.specialization,
                domains: d.domains,
                experience: d.experience,
                qualifications: d.qualifications,
                hospital: d.hospital,
                city: d.city,
                state: d.state,
                consultFee: d.consultFee,
                avgMedicineCost: d.avgMedicineCost,
                bio: d.bio,
                isVerified: d.isVerified,
                avgRating: d.avgRating,
                totalReviews: d.totalReviews,
                avgRecoveryDays: d.avgRecoveryDays,
                successRate: d.successRate,
            },
        });
        createdDoctors.push({ user, doc });
    }

    // 2. Seed Sample Patients
    const patientsData = [
        {
            email: 'riya.mehra@example.com',
            name: 'Riya Mehra',
            phone: '+919820000001',
            bloodGroup: 'B+',
            height: 164,
            weight: 64.5,
            allergies: ['Penicillin', 'Sulfa Drugs'],
            conditions: ['Mild Migraine', 'Borderline Hypertension'],
        },
        {
            email: 'aryan.mehta@example.com',
            name: 'Aryan Mehta',
            phone: '+919820000002',
            bloodGroup: 'O+',
            height: 175,
            weight: 73.0,
            allergies: ['Ibuprofen'],
            conditions: ['Type 2 Diabetes (Controlled)'],
        },
        {
            email: 'sneha.kulkarni@example.com',
            name: 'Sneha Kulkarni',
            phone: '+919820000003',
            bloodGroup: 'A+',
            height: 160,
            weight: 58.0,
            allergies: [],
            conditions: ['IBS', 'Insomnia'],
        },
    ];

    const createdPatients = [];
    for (const p of patientsData) {
        const user = await prisma.user.upsert({
            where: { email: p.email },
            update: { name: p.name },
            create: {
                name: p.name,
                email: p.email,
                phone: p.phone,
                role: 'PATIENT',
                emailVerified: new Date(),
            },
        });
        const profile = await prisma.patient.upsert({
            where: { userId: user.id },
            update: {
                bloodGroup: p.bloodGroup,
                height: p.height,
                weight: p.weight,
                allergies: p.allergies,
                conditions: p.conditions,
            },
            create: {
                userId: user.id,
                bloodGroup: p.bloodGroup,
                height: p.height,
                weight: p.weight,
                allergies: p.allergies,
                conditions: p.conditions,
            },
        });
        createdPatients.push({ user, profile });
    }

    const riya = createdPatients[0];
    const aryan = createdPatients[1];
    const sneha = createdPatients[2];
    const priyaDoc = createdDoctors[0];
    const rajeshDoc = createdDoctors[1];
    const meeraDoc = createdDoctors[3];
    const farhanDoc = createdDoctors[6];

    // 3. Seed Patient Metrics (Approved history + Pending items for Doctor Approval Queue)
    const existingMetrics = await prisma.patientMetric.count({ where: { patientId: riya.profile.id } });
    if (existingMetrics === 0) {
        const now = Date.now();
        const day = 24 * 60 * 60 * 1000;
        await prisma.patientMetric.createMany({
            data: [
                // Riya approved historical metrics across 4 dates
                { patientId: riya.profile.id, type: 'blood_sugar', value: 102, unit: 'mg/dL', status: 'APPROVED', isApproved: true, reviewedBy: priyaDoc.user.id, reviewedAt: new Date(now - 21 * day), recordedAt: new Date(now - 21 * day), notes: 'Fasting baseline' },
                { patientId: riya.profile.id, type: 'blood_pressure', value: 128, unit: 'mmHg', status: 'APPROVED', isApproved: true, reviewedBy: priyaDoc.user.id, reviewedAt: new Date(now - 21 * day), recordedAt: new Date(now - 21 * day), notes: 'Morning clinic check' },
                { patientId: riya.profile.id, type: 'weight', value: 66.2, unit: 'kg', status: 'APPROVED', isApproved: true, reviewedBy: priyaDoc.user.id, reviewedAt: new Date(now - 21 * day), recordedAt: new Date(now - 21 * day) },
                { patientId: riya.profile.id, type: 'oxygen', value: 98, unit: '%', status: 'APPROVED', isApproved: true, reviewedBy: priyaDoc.user.id, reviewedAt: new Date(now - 21 * day), recordedAt: new Date(now - 21 * day) },

                { patientId: riya.profile.id, type: 'blood_sugar', value: 96, unit: 'mg/dL', status: 'APPROVED', isApproved: true, reviewedBy: priyaDoc.user.id, reviewedAt: new Date(now - 14 * day), recordedAt: new Date(now - 14 * day), notes: 'Improved diet compliance' },
                { patientId: riya.profile.id, type: 'blood_pressure', value: 124, unit: 'mmHg', status: 'APPROVED', isApproved: true, reviewedBy: priyaDoc.user.id, reviewedAt: new Date(now - 14 * day), recordedAt: new Date(now - 14 * day) },
                { patientId: riya.profile.id, type: 'weight', value: 65.4, unit: 'kg', status: 'APPROVED', isApproved: true, reviewedBy: priyaDoc.user.id, reviewedAt: new Date(now - 14 * day), recordedAt: new Date(now - 14 * day) },

                { patientId: riya.profile.id, type: 'blood_sugar', value: 91, unit: 'mg/dL', status: 'APPROVED', isApproved: true, reviewedBy: priyaDoc.user.id, reviewedAt: new Date(now - 7 * day), recordedAt: new Date(now - 7 * day) },
                { patientId: riya.profile.id, type: 'blood_pressure', value: 118, unit: 'mmHg', status: 'APPROVED', isApproved: true, reviewedBy: priyaDoc.user.id, reviewedAt: new Date(now - 7 * day), recordedAt: new Date(now - 7 * day) },
                { patientId: riya.profile.id, type: 'weight', value: 64.5, unit: 'kg', status: 'APPROVED', isApproved: true, reviewedBy: priyaDoc.user.id, reviewedAt: new Date(now - 7 * day), recordedAt: new Date(now - 7 * day) },
                { patientId: riya.profile.id, type: 'oxygen', value: 99, unit: '%', status: 'APPROVED', isApproved: true, reviewedBy: priyaDoc.user.id, reviewedAt: new Date(now - 7 * day), recordedAt: new Date(now - 7 * day) },

                // Pending items awaiting doctor approval (visible in Doctor Approvals queue, hidden from patient approved charts)
                { patientId: riya.profile.id, doctorId: priyaDoc.user.id, type: 'blood_sugar', value: 89, unit: 'mg/dL', status: 'PENDING', isApproved: false, recordedAt: new Date(now - 1 * day), notes: 'Morning fasting home glucometer' },
                { patientId: riya.profile.id, doctorId: priyaDoc.user.id, type: 'blood_pressure', value: 116, unit: 'mmHg', status: 'PENDING', isApproved: false, recordedAt: new Date(now - 1 * day), notes: 'Resting cuff reading' },
                { patientId: aryan.profile.id, doctorId: priyaDoc.user.id, type: 'blood_sugar', value: 132, unit: 'mg/dL', status: 'PENDING', isApproved: false, recordedAt: new Date(now), notes: '2hr post-lunch' },
            ],
        });
    }

    // 4. Seed Pending Clinical Factor / Medication Change Requests
    const existingChanges = await prisma.clinicalChangeRequest.count();
    if (existingChanges === 0) {
        await prisma.clinicalChangeRequest.createMany({
            data: [
                {
                    patientId: riya.profile.id,
                    category: 'FACTOR',
                    field: 'weight',
                    currentValue: '64.5 kg',
                    requestedValue: '63.8 kg',
                    reason: 'Lost weight after 3-week walking & diet regimen',
                    status: 'PENDING',
                },
                {
                    patientId: aryan.profile.id,
                    category: 'MEDICATION',
                    field: 'medication_update',
                    currentValue: 'Metformin 500mg once daily',
                    requestedValue: 'Add Ashwagandha 300mg at night for stress',
                    domain: 'AYURVEDA',
                    reason: 'Experiencing high work stress; checking interaction safety before starting',
                    status: 'PENDING',
                },
            ],
        });
    }

    // 5. Seed Appointments
    const existingAppts = await prisma.appointment.count();
    if (existingAppts === 0) {
        const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
        const today = new Date();
        today.setHours(16, 0, 0, 0);
        await prisma.appointment.createMany({
            data: [
                { patientId: riya.user.id, doctorId: priyaDoc.user.id, slot: today, type: 'follow-up', domain: 'ALLOPATHY', status: 'CONFIRMED', reason: 'Blood pressure & metric review', fee: 1200 },
                { patientId: aryan.user.id, doctorId: priyaDoc.user.id, slot: tomorrow, type: 'consultation', domain: 'ALLOPATHY', status: 'PENDING', reason: 'Diabetes & Ashwagandha safety clearance', fee: 1200 },
                { patientId: sneha.user.id, doctorId: meeraDoc.user.id, slot: tomorrow, type: 'consultation', domain: 'AYURVEDA', status: 'CONFIRMED', reason: 'Panchakarma consultation for IBS', fee: 700 },
            ],
        });
    }

    // 6. Seed Prescriptions (both APPROVED and PENDING review)
    const existingRx = await prisma.prescription.count();
    if (existingRx === 0) {
        await prisma.prescription.createMany({
            data: [
                {
                    patientId: riya.user.id,
                    doctorId: priyaDoc.user.id,
                    domain: 'ALLOPATHY',
                    status: 'APPROVED',
                    flagged: false,
                    rawText: 'Rx Dr. Priya Sharma: Amlodipine 5mg OD, Sumatriptan 50mg SOS',
                    medications: [
                        { name: 'Amlodipine Besylate', dosage: '5mg', frequency: 'Once daily (Morning)', domain: 'ALLOPATHY', category: 'Calcium Channel Blocker' },
                        { name: 'Sumatriptan', dosage: '50mg', frequency: 'SOS for acute migraine', domain: 'ALLOPATHY', category: 'Triptan' },
                    ],
                    notes: 'Approved maintenance regimen. Avoid Rauwolfia/Sarpagandha.',
                },
                {
                    patientId: aryan.user.id,
                    doctorId: priyaDoc.user.id,
                    domain: 'ALLOPATHY',
                    status: 'FLAGGED',
                    flagged: true,
                    rawText: 'Metformin 500mg + Aspirin 75mg + Ashwagandha',
                    medications: [
                        { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', domain: 'ALLOPATHY', category: 'Biguanide' },
                        { name: 'Aspirin', dosage: '75mg', frequency: 'Once daily', domain: 'ALLOPATHY', category: 'Antiplatelet' },
                        { name: 'Ashwagandha', dosage: '300mg', frequency: 'At bedtime', domain: 'AYURVEDA', category: 'Adaptogenic Herb' },
                    ],
                    flags: [
                        {
                            drug1: 'Metformin',
                            drug2: 'Ashwagandha',
                            severity: 'MODERATE',
                            description: 'Ashwagandha may lower blood glucose further when combined with Metformin, increasing hypoglycemia risk.',
                            recommendation: 'Monitor fasting & post-prandial glucose closely; requires doctor sign-off.',
                        },
                    ],
                    notes: 'Patient requested adding Ashwagandha; flagged for physician review.',
                },
            ],
        });
    }

    // 7. Seed Doctor Reviews across all 3 domains (powers Domain Comparison & Patient Experiences)
    const reviewsData = [
        { authorId: riya.user.id, doctorUserId: priyaDoc.user.id, rating: 5, title: 'BP normalized within 3 weeks', body: 'Dr. Priya checked all my herbal supplements too so there were zero interactions. Very reassuring care.', disease: 'Hypertension', domain: 'ALLOPATHY', recoveryDays: 14, totalCost: 2150, wouldRecommend: true },
        { authorId: aryan.user.id, doctorUserId: rajeshDoc.user.id, rating: 5, title: 'Stopped my debilitating migraines fast', body: 'Triptan protocol worked in 2 hours and his preventive plan cut my headache days by 80%.', disease: 'Migraine', domain: 'ALLOPATHY', recoveryDays: 5, totalCost: 1700, wouldRecommend: true },
        { authorId: sneha.user.id, doctorUserId: meeraDoc.user.id, rating: 5, title: 'Gut sensitivity completely calmed down', body: 'Shirodhara and customized gut herbs helped after years of bloating. Very patient explanation of root cause.', disease: 'IBS', domain: 'AYURVEDA', recoveryDays: 42, totalCost: 1320, wouldRecommend: true },
        { authorId: riya.user.id, doctorUserId: meeraDoc.user.id, rating: 4, title: 'Great preventive migraine support', body: 'Herbal regimen reduced stress triggers significantly alongside my approved meds.', disease: 'Migraine', domain: 'AYURVEDA', recoveryDays: 60, totalCost: 1300, wouldRecommend: true },
        { authorId: sneha.user.id, doctorUserId: farhanDoc.user.id, rating: 5, title: 'Gentle relief without stomach upset', body: 'Detailed 45-minute case history. Constitutional remedy helped both my insomnia and tension headaches.', disease: 'Anxiety / Insomnia', domain: 'HOMEOPATHY', recoveryDays: 45, totalCost: 750, wouldRecommend: true },
        { authorId: aryan.user.id, doctorUserId: farhanDoc.user.id, rating: 4, title: 'Affordable and zero side-effects', body: 'Took a few weeks to notice improvement, but steady sleep gains and kind follow-ups.', disease: 'Migraine', domain: 'HOMEOPATHY', recoveryDays: 70, totalCost: 720, wouldRecommend: true },
    ];

    for (const r of reviewsData) {
        await prisma.doctorReview.upsert({
            where: { authorId_doctorUserId: { authorId: r.authorId, doctorUserId: r.doctorUserId } },
            update: { rating: r.rating, title: r.title, body: r.body, disease: r.disease, domain: r.domain, recoveryDays: r.recoveryDays, totalCost: r.totalCost },
            create: r,
        });
    }

    // 8. Seed Community Posts
    const existingPosts = await prisma.communityPost.count();
    if (existingPosts === 0) {
        await prisma.communityPost.createMany({
            data: [
                {
                    authorId: priyaDoc.user.id,
                    title: 'Always Disclose Herbal Supplements Before Surgery or Cardiac Meds',
                    content: 'Even natural remedies like Ginkgo Biloba, Garlic extracts, or Guggulu affect clotting and blood pressure. Use CURA cross-domain safety checks so your care team can keep all three systems aligned safely.',
                    domain: 'ALLOPATHY',
                    tags: ['safety', 'interactions', 'cardiology'],
                    status: 'APPROVED',
                    upvotes: 128,
                    isPinned: true,
                },
                {
                    authorId: sneha.user.id,
                    title: 'My 6-Week Panchakarma & Gut Balance Experience',
                    content: 'After struggling with bloating and stress headaches, Vaidya Meera customized a gentle dietary plan alongside yoga. Consistency made all the difference without harsh side-effects.',
                    domain: 'AYURVEDA',
                    tags: ['ibs', 'panchakarma', 'recovery'],
                    status: 'APPROVED',
                    upvotes: 42,
                },
                {
                    authorId: riya.user.id,
                    title: 'Switching to Gentle Constitutional Remedies for Stress Headaches',
                    content: 'Used CURA symptom checker when I was confused whether my headaches were sinus or migraine. Comparing success rates and reviews helped me combine preventive care safely!',
                    domain: 'HOMEOPATHY',
                    tags: ['migraine', 'constitutional', 'sleep'],
                    status: 'APPROVED',
                    upvotes: 31,
                },
                {
                    authorId: aryan.user.id,
                    title: 'Can herbal juice replace prescribed insulin?',
                    content: 'Someone told me to stop taking insulin and only drink bitter gourd juice every morning to cure diabetes.',
                    domain: 'AYURVEDA',
                    tags: ['diabetes', 'warning'],
                    status: 'FLAGGED',
                    modNote: 'Clinical Safety Alert: Never discontinue prescribed insulin or antihypertensive therapy abruptly without physician supervision. Potential risk of diabetic ketoacidosis or severe hyperglycemia.',
                    upvotes: 3,
                },
            ],
        });
    }

    console.log('CURA seed completed successfully!');
}

main()
    .catch((e) => {
        console.error('Seed error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
