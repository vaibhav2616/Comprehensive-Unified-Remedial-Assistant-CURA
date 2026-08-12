// ─── CURA Mock Data ─────────────────────────────────────────────

export const DOMAINS = {
  ALLOPATHY: 'Allopathy',
  AYURVEDA: 'Ayurveda',
  HOMEOPATHY: 'Homeopathy',
};

export const DOMAIN_COLORS = {
  [DOMAINS.ALLOPATHY]: { bg: 'var(--allo)', light: 'var(--allo-light)', text: '#ffffff', gradient: 'none' },
  [DOMAINS.AYURVEDA]: { bg: 'var(--ayur)', light: 'var(--ayur-light)', text: '#ffffff', gradient: 'none' },
  [DOMAINS.HOMEOPATHY]: { bg: 'var(--homeo)', light: 'var(--homeo-light)', text: '#ffffff', gradient: 'none' },
};

// ─── Doctors ────────────────────────────────────────────────────

export const doctors = [
  // Allopathy
  { id: 'doc-1', name: 'Dr. Priya Sharma', domain: DOMAINS.ALLOPATHY, specialization: 'Cardiologist', rating: 4.9, cost: 1200, avatar: '/avatars/doc1.png', experience: 14, location: 'Mumbai', availability: ['Mon 10-1 PM', 'Wed 2-5 PM', 'Fri 10-1 PM'], bio: 'Specialist in interventional cardiology with 14 years of practice.' },
  { id: 'doc-2', name: 'Dr. Rajesh Gupta', domain: DOMAINS.ALLOPATHY, specialization: 'Neurologist', rating: 4.7, cost: 1500, avatar: '/avatars/doc2.png', experience: 18, location: 'Delhi', availability: ['Tue 9-12 PM', 'Thu 2-6 PM'], bio: 'Expert in neurodegenerative disorders and stroke rehabilitation.' },
  { id: 'doc-3', name: 'Dr. Anika Patel', domain: DOMAINS.ALLOPATHY, specialization: 'General Physician', rating: 4.5, cost: 600, avatar: '/avatars/doc3.png', experience: 8, location: 'Bangalore', availability: ['Mon-Fri 9-5 PM'], bio: 'Comprehensive primary care with a focus on preventive medicine.' },
  { id: 'doc-4', name: 'Dr. Vikram Singh', domain: DOMAINS.ALLOPATHY, specialization: 'Orthopedic Surgeon', rating: 4.8, cost: 2000, avatar: '/avatars/doc4.png', experience: 20, location: 'Chennai', availability: ['Mon 10-2 PM', 'Thu 10-2 PM'], bio: 'Joint replacement and sports medicine specialist.' },

  // Ayurveda
  { id: 'doc-5', name: 'Vaidya Meera Joshi', domain: DOMAINS.AYURVEDA, specialization: 'Panchakarma Specialist', rating: 4.8, cost: 800, avatar: '/avatars/doc5.png', experience: 22, location: 'Jaipur', availability: ['Mon-Sat 8-12 PM'], bio: 'Renowned Panchakarma therapist with deep roots in Kerala tradition.' },
  { id: 'doc-6', name: 'Dr. Arjun Nair', domain: DOMAINS.AYURVEDA, specialization: 'Rasayana & Rejuvenation', rating: 4.6, cost: 700, avatar: '/avatars/doc6.png', experience: 15, location: 'Kochi', availability: ['Tue 10-1 PM', 'Sat 10-1 PM'], bio: 'Specialist in anti-aging Rasayana therapies and Prakriti analysis.' },
  { id: 'doc-7', name: 'Vaidya Sunita Devi', domain: DOMAINS.AYURVEDA, specialization: 'Dravyaguna (Herbalism)', rating: 4.9, cost: 900, avatar: '/avatars/doc7.png', experience: 25, location: 'Haridwar', availability: ['Mon-Fri 7-11 AM'], bio: 'Herbalism expert crafting personalized herbal formulations.' },
  { id: 'doc-8', name: 'Dr. Karthik Menon', domain: DOMAINS.AYURVEDA, specialization: 'Kayachikitsa (Internal Medicine)', rating: 4.4, cost: 650, avatar: '/avatars/doc8.png', experience: 10, location: 'Pune', availability: ['Wed 2-6 PM', 'Fri 2-6 PM'], bio: 'Ayurvedic internal medicine practitioner focusing on digestive disorders.' },

  // Homeopathy
  { id: 'doc-9', name: 'Dr. Farhan Sheikh', domain: DOMAINS.HOMEOPATHY, specialization: 'Constitutional Prescribing', rating: 4.7, cost: 500, avatar: '/avatars/doc9.png', experience: 12, location: 'Hyderabad', availability: ['Mon 11-3 PM', 'Thu 11-3 PM'], bio: 'Holistic constitutional prescriber using Kentian methodology.' },
  { id: 'doc-10', name: 'Dr. Neha Kapoor', domain: DOMAINS.HOMEOPATHY, specialization: 'Pediatric Homeopathy', rating: 4.8, cost: 550, avatar: '/avatars/doc10.png', experience: 9, location: 'Lucknow', availability: ['Tue 10-2 PM', 'Sat 10-2 PM'], bio: 'Gentle pediatric care through classical homeopathic remedies.' },
  { id: 'doc-11', name: 'Dr. Sameer Bose', domain: DOMAINS.HOMEOPATHY, specialization: 'Chronic Disease Management', rating: 4.5, cost: 450, avatar: '/avatars/doc11.png', experience: 16, location: 'Kolkata', availability: ['Mon-Fri 4-8 PM'], bio: 'Managing chronic and autoimmune conditions through miasmatic analysis.' },
  { id: 'doc-12', name: 'Dr. Ritu Malhotra', domain: DOMAINS.HOMEOPATHY, specialization: 'Dermatological Homeopathy', rating: 4.6, cost: 600, avatar: '/avatars/doc12.png', experience: 11, location: 'Ahmedabad', availability: ['Wed 10-1 PM', 'Fri 10-1 PM'], bio: 'Skin and allergy specialist using potentized remedies.' },
];

// ─── Sample Prescription (Mock OCR Output) ──────────────────────

export const samplePrescription = {
  patientName: 'Aryan Mehta',
  issueDate: '2026-08-15',
  prescribedBy: 'Dr. Priya Sharma',
  domain: DOMAINS.ALLOPATHY,
  medications: [
    { id: 'med-1', name: 'Metoprolol Succinate', category: 'Beta-Blocker', dosage: '50mg', frequency: 'Once daily', domain: DOMAINS.ALLOPATHY },
    { id: 'med-2', name: 'Amlodipine Besylate', category: 'Calcium Channel Blocker', dosage: '5mg', frequency: 'Once daily', domain: DOMAINS.ALLOPATHY },
    { id: 'med-3', name: 'Atorvastatin Calcium', category: 'Statin', dosage: '20mg', frequency: 'At bedtime', domain: DOMAINS.ALLOPATHY },
    { id: 'med-4', name: 'Aspirin', category: 'Antiplatelet', dosage: '75mg', frequency: 'Once daily', domain: DOMAINS.ALLOPATHY },
  ],
};

// ─── Drug Interaction Rules ─────────────────────────────────────

export const drugInteractions = [
  {
    id: 'int-1',
    medication: 'Metoprolol Succinate',
    medicationDomain: DOMAINS.ALLOPATHY,
    conflictDomain: DOMAINS.AYURVEDA,
    conflictSubstance: 'Ashwagandha (Withania somnifera)',
    severity: 'HIGH',
    description: 'Your current allopathic beta-blocker (Metoprolol) interacts negatively with high-dose Ayurvedic Ashwagandha. Ashwagandha may potentiate the hypotensive effect, causing dangerous drops in blood pressure and heart rate.',
  },
  {
    id: 'int-2',
    medication: 'Metoprolol Succinate',
    medicationDomain: DOMAINS.ALLOPATHY,
    conflictDomain: DOMAINS.AYURVEDA,
    conflictSubstance: 'Arjuna (Terminalia arjuna)',
    severity: 'MODERATE',
    description: 'Arjuna bark has cardioactive glycosides that may amplify the bradycardic effects of beta-blockers. Combined use requires close ECG monitoring.',
  },
  {
    id: 'int-3',
    medication: 'Amlodipine Besylate',
    medicationDomain: DOMAINS.ALLOPATHY,
    conflictDomain: DOMAINS.AYURVEDA,
    conflictSubstance: 'Sarpagandha (Rauwolfia serpentina)',
    severity: 'HIGH',
    description: 'Rauwolfia-based Ayurvedic preparations combined with Amlodipine can cause severe hypotension, excessive sedation, and depressive episodes.',
  },
  {
    id: 'int-4',
    medication: 'Atorvastatin Calcium',
    medicationDomain: DOMAINS.ALLOPATHY,
    conflictDomain: DOMAINS.HOMEOPATHY,
    conflictSubstance: 'Chelidonium Majus (potentized)',
    severity: 'LOW',
    description: 'Chelidonium targets hepatic function. While potentized doses are generally safe, it may theoretically alter statin metabolism. Monitor liver enzymes.',
  },
  {
    id: 'int-5',
    medication: 'Aspirin',
    medicationDomain: DOMAINS.ALLOPATHY,
    conflictDomain: DOMAINS.AYURVEDA,
    conflictSubstance: 'Guggulu (Commiphora mukul)',
    severity: 'MODERATE',
    description: 'Guggulu has antiplatelet properties. Combined with Aspirin, this increases bleeding risk significantly. Avoid concurrent use before any surgical procedures.',
  },
  {
    id: 'int-6',
    medication: 'Aspirin',
    medicationDomain: DOMAINS.ALLOPATHY,
    conflictDomain: DOMAINS.HOMEOPATHY,
    conflictSubstance: 'Arnica Montana (mother tincture)',
    severity: 'MODERATE',
    description: 'Arnica mother tincture (non-potentized) has anti-coagulant properties. Combined with Aspirin, this may elevate bleeding risk during injuries or surgery.',
  },
];

// ─── Community Posts ────────────────────────────────────────────

export const communityPosts = [
  {
    id: 'post-1',
    author: 'Sneha R.',
    avatar: '🧑‍⚕️',
    timestamp: '2026-08-30T14:30:00Z',
    content: 'Started Panchakarma therapy last month for my chronic fatigue. The difference in energy levels is remarkable! My Vaidya customized the treatment based on my Prakriti assessment.',
    likes: 42,
    comments: 7,
    moderation: { status: 'safe', label: 'Verified Safe', reason: 'Personal experience shared without medical claims or prescriptive advice.' },
  },
  {
    id: 'post-2',
    author: 'Amit K.',
    avatar: '👨',
    timestamp: '2026-08-29T09:15:00Z',
    content: 'My grandfather cured his diabetes completely by drinking bitter gourd juice mixed with neem leaves every morning. Stop taking insulin and try this natural remedy instead!',
    likes: 3,
    comments: 15,
    moderation: { status: 'flagged', label: 'Flagged: Dangerous Medical Advice', reason: 'Advises discontinuing prescribed insulin therapy. Unverified cure claims for Type-2 Diabetes. Could be life-threatening.' },
  },
  {
    id: 'post-3',
    author: 'Dr. Meera S.',
    avatar: '👩‍⚕️',
    timestamp: '2026-08-28T16:45:00Z',
    content: 'Reminder: Always inform your allopathic doctor if you are taking herbal supplements. Cross-domain interactions are real and can be dangerous. CURA\'s interaction checker is a great first step!',
    likes: 128,
    comments: 23,
    moderation: { status: 'safe', label: 'Verified Safe', reason: 'Evidence-based safety advice from a verified medical professional.' },
  },
  {
    id: 'post-4',
    author: 'Priya M.',
    avatar: '👩',
    timestamp: '2026-08-27T11:00:00Z',
    content: 'Has anyone tried constitutional homeopathy for anxiety? I\'ve been on Ignatia 200C for two weeks and feeling calmer. Would love to hear others\' experiences.',
    likes: 31,
    comments: 9,
    moderation: { status: 'safe', label: 'Verified Safe', reason: 'Seeking peer experiences with a homeopathic remedy. No prescriptive claims made.' },
  },
  {
    id: 'post-5',
    author: 'Rahul T.',
    avatar: '🧑',
    timestamp: '2026-08-26T08:20:00Z',
    content: 'You don\'t need blood pressure medication! Just take 10 drops of Rauwolfia mother tincture three times daily. It\'s completely natural and has no side effects whatsoever.',
    likes: 5,
    comments: 18,
    moderation: { status: 'flagged', label: 'Flagged: Dangerous Medical Advice', reason: 'Suggests replacing prescribed antihypertensives with unregulated tincture. Rauwolfia has known severe side effects including depression and is contraindicated in many conditions.' },
  },
  {
    id: 'post-6',
    author: 'Kavita D.',
    avatar: '👩‍🦱',
    timestamp: '2026-08-25T19:30:00Z',
    content: 'Completed my 6-month cardiac rehab program with Dr. Sharma. Combining prescribed medication with gentle yoga (approved by my cardiologist) has been transformative. Always consult your doctor first!',
    likes: 87,
    comments: 14,
    moderation: { status: 'safe', label: 'Verified Safe', reason: 'Positive outcome shared with explicit emphasis on doctor supervision and approval.' },
  },
];

// ─── Patient Dashboard Data ────────────────────────────────────

export const patientDashboardData = {
  patient: { name: 'Aryan Mehta', age: 42, bloodGroup: 'B+', allergies: ['Penicillin', 'Sulfa drugs'] },
  reminders: [
    { id: 'rem-1', medication: 'Metoprolol Succinate 50mg', time: '08:00 AM', taken: true },
    { id: 'rem-2', medication: 'Amlodipine Besylate 5mg', time: '08:00 AM', taken: true },
    { id: 'rem-3', medication: 'Aspirin 75mg', time: '01:00 PM', taken: false },
    { id: 'rem-4', medication: 'Atorvastatin Calcium 20mg', time: '10:00 PM', taken: false },
  ],
  progressReports: [
    { id: 'prog-1', doctor: 'Dr. Priya Sharma', date: '2026-08-20', domain: DOMAINS.ALLOPATHY, summary: 'Blood pressure stabilizing at 130/85. Continue current medication. Follow-up in 2 weeks.', status: 'improving' },
    { id: 'prog-2', doctor: 'Dr. Priya Sharma', date: '2026-08-06', domain: DOMAINS.ALLOPATHY, summary: 'Initial assessment. Hypertension Stage 1. Started on beta-blocker and CCB combination therapy.', status: 'new' },
  ],
  wellnessChatHistory: [
    { id: 'chat-1', role: 'assistant', content: 'Hello Aryan! I\'m your CURA wellness guide. How are you feeling today?', timestamp: '09:00 AM' },
    { id: 'chat-2', role: 'user', content: 'I\'ve been feeling anxious about my heart condition lately.', timestamp: '09:01 AM' },
    { id: 'chat-3', role: 'assistant', content: 'It\'s completely natural to feel anxious about a new diagnosis. Your doctor has noted that your BP is already stabilizing, which is great progress! Would you like to try a 5-minute breathing exercise together?', timestamp: '09:01 AM' },
    { id: 'chat-4', role: 'user', content: 'Yes, that would be nice.', timestamp: '09:02 AM' },
    { id: 'chat-5', role: 'assistant', content: 'Let\'s do box breathing\n\n1. Breathe in for 4 seconds\n2. Hold for 4 seconds\n3. Breathe out for 4 seconds\n4. Hold for 4 seconds\n\nRepeat 4 times. Take your time.', timestamp: '09:02 AM' },
  ],
};

// ─── Doctor Dashboard Data ──────────────────────────────────────

export const doctorDashboardData = {
  doctor: { name: 'Dr. Priya Sharma', specialization: 'Cardiologist', domain: DOMAINS.ALLOPATHY },
  stats: { totalPatients: 148, pendingApprovals: 5, todayAppointments: 8, monthlyConsultations: 62 },
  patients: [
    { id: 'pat-1', name: 'Aryan Mehta', age: 42, condition: 'Hypertension Stage 1', progress: 65, lastVisit: '2026-08-20', nextVisit: '2026-09-03', status: 'improving' },
    { id: 'pat-2', name: 'Sunita Verma', age: 58, condition: 'Atrial Fibrillation', progress: 40, lastVisit: '2026-08-18', nextVisit: '2026-09-01', status: 'stable' },
    { id: 'pat-3', name: 'Rohit Khanna', age: 35, condition: 'Post-MI Rehabilitation', progress: 80, lastVisit: '2026-08-22', nextVisit: '2026-09-05', status: 'improving' },
    { id: 'pat-4', name: 'Lakshmi Iyer', age: 67, condition: 'Chronic Heart Failure', progress: 30, lastVisit: '2026-08-25', nextVisit: '2026-09-02', status: 'needs-attention' },
    { id: 'pat-5', name: 'Farhan Ali', age: 50, condition: 'Hyperlipidemia', progress: 55, lastVisit: '2026-08-19', nextVisit: '2026-09-10', status: 'stable' },
  ],
  pendingPrescriptions: [
    { id: 'rx-1', patient: 'Sunita Verma', medications: ['Warfarin 5mg', 'Digoxin 0.25mg'], requestedDate: '2026-08-30', reason: 'Dosage adjustment after INR results', urgency: 'high' },
    { id: 'rx-2', patient: 'Lakshmi Iyer', medications: ['Furosemide 40mg', 'Spironolactone 25mg'], requestedDate: '2026-08-29', reason: 'New diuretic combination for fluid management', urgency: 'medium' },
    { id: 'rx-3', patient: 'Farhan Ali', medications: ['Rosuvastatin 10mg'], requestedDate: '2026-08-28', reason: 'Switch from Atorvastatin due to muscle pain', urgency: 'low' },
  ],
};

// ─── Appointments ───────────────────────────────────────────────

export const appointments = [
  { id: 'apt-1', doctorId: 'doc-1', patientName: 'Aryan Mehta', date: '2026-09-03', time: '10:30 AM', type: 'offline', status: 'confirmed', domain: DOMAINS.ALLOPATHY },
  { id: 'apt-2', doctorId: 'doc-5', patientName: 'Aryan Mehta', date: '2026-09-05', time: '09:00 AM', type: 'online', status: 'pending', domain: DOMAINS.AYURVEDA },
];

// commit-touch: 2026-08-11 16:20:00

// commit-touch: 2026-08-12 14:00:00

// commit-touch: 2026-08-12 17:15:00

// commit-touch: 2026-08-27 13:00:00

// commit-touch: tusharsingh1206 2026-08-11 16:20:00

// commit-touch: tusharsingh1206 2026-08-12 14:00:00

// commit-touch: tusharsingh1206 2026-08-12 17:15:00

// commit-touch: shubhamsoni1234 2026-08-27 13:00:00

// commit-touch: tusharsingh1206 2026-08-11 16:20:00

// commit-touch: tusharsingh1206 2026-08-12 14:00:00

// commit-touch: tusharsingh1206 2026-08-12 17:15:00

// commit-touch: shubhamsoni1234 2026-08-27 13:00:00

// commit-touch: tusharsingh1206 2026-08-11 16:20:00

// commit-touch: tusharsingh1206 2026-08-12 14:00:00
