# CURA Production Implementation Plan — Phase 6

## Stack Decisions

| Layer | Technology | Rationale |
|---|---|---|
| Database | **PostgreSQL** + **Prisma ORM** | Relational, type-safe, HIPAA-structured |
| Auth | **NextAuth v5** + OTP | Passwordless, secure, supports phone+email |
| OTP Delivery | **Nodemailer (SMTP)** + **Twilio (SMS)** | Industry standard, env-configurable |
| Session | **JWT tokens** via NextAuth | Stateless, scalable |
| State | **React Context** + server actions | Already in use, extend it |
| Deployment | **Docker Compose** (Frontend + FastAPI + Postgres) | One-command production |

## Phase 6 Implementation Order

### 1. Database Schema (sameerpatel01 → backend-node)
- Users table (id, name, phone, email, role: PATIENT|DOCTOR, verified)
- Doctors table (userId, specialization, domain, rating, location, consultFee)
- Patients table (userId, dob, bloodGroup, allergies)
- Prescriptions table (patientId, doctorId, medications, uploadedAt, status)
- Appointments table (patientId, doctorId, slot, status)
- OtpTokens table (identifier, token, expires)
- CommunityPosts, DoctorReviews, PatientMetrics tables

### 2. Authentication (sameerpatel01 → backend-node)
- `/api/auth/send-otp` — sends 6-digit OTP to email or phone
- `/api/auth/verify-otp` — validates OTP, creates session
- NextAuth config with custom credentials provider
- Middleware: protect all /dashboard/* routes, redirect by role

### 3. Role-Based Dashboard Segregation (shubhamsoni1234 → frontend-ui)
- Patients CANNOT access /dashboard/doctor
- Doctors CANNOT access /dashboard/patient (unless they're also a patient)
- Middleware redirects to correct dashboard on login

### 4. Real API Routes replacing mockData (sameerpatel01 → backend-node)
- /api/doctors → query DB with filters
- /api/prescriptions → upload + save to DB
- /api/appointments → create/update in DB
- /api/community → posts with DB moderation

### 5. Doctor Analytics (tusharsingh1206 → research-ui)
- Doctor profile: rating, review count, recovery rate, avg cost, location
- Disease search: match doctors by specialty + disease tag
- Patient progress: chart data endpoint

### 6. Docker (vaibhav2616 → ai-fastapi)
- docker-compose.yml (postgres + nextjs + fastapi)
- .env.example with all required vars
