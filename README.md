# Smart College Assistant – An AI-Powered Digital Campus Companion

> **Hackathon 2026 Presentation Project**  
> A unified, responsive digital campus companion connecting students, faculty, parents, and college administrators.

---

## 🌟 Project Overview

**Smart College Assistant** solves common institutional pain points:
- ❌ Delayed attendance updates and surprise exam condonation shortages
- ❌ Fragmented internal marks visibility and lost feedback
- ❌ Missed college circulars and delayed fee payments
- ❌ Lack of personalized study schedules and guidance for exams
- ❌ Cumbersome paper leave approvals and room finding friction

---

## 👥 Four User Roles & Demo Credentials

Switch roles directly from the top navigation bar or log in with these credentials:

| Role | Name | Credentials / Details | Primary Dashboard & Capabilities |
| :--- | :--- | :--- | :--- |
| **Student** | Aarav Sharma | `aarav.sharma@campus.edu` • Roll: `CS2023041` (Sem 5, CSE) | Real-time attendance, CIA internal marks, exam timetable, assignment submission, AI tools |
| **Faculty** | Prof. Sunita Rao | `sunita.rao@campus.edu` • Senior Associate Professor | Mark class attendance, update internal scores, evaluate assignments, review leave applications |
| **Parent** | Rajesh Sharma | `rajesh.sharma@gmail.com` • Linked to Aarav Sharma | Ward attendance alerts, mid-term grade card, online tuition fee payment & receipts, mentor contact |
| **Admin** | Dr. K. Raman | `dean.academic@campus.edu` • Dean & Registrar | College-wide KPIs, emergency circular broadcaster, room/lab occupancy master controls |

---

## 🚀 Core Features & Modules

### 1. Student Dashboard & Academic Monitoring
- **Real-time Attendance Tracking:** Biometric ledger with 75% minimum threshold line. Highlights subjects with shortage risks (e.g., Machine Learning at 68.4%).
- **Internal Marks (CIA):** Continuous assessment breakdown: Test 1 (20), Test 2 (20), Assignment (10), Lab (10) for 60 marks total.
- **Semester Results & GPA:** Cumulative SGPA and CGPA progression with downloadable official grade cards.
- **Timetable & Exams:** 5-day class schedule with room allocations and countdowns to mid-term exam date sheets with digital hall tickets.
- **Assignments:** Pending, submitted, and evaluated tasks with simulated file uploads and feedback rubrics.

### 2. AI-Powered Innovations (Powered by Gemini 3.8 Flash)
- **AI Attendance Predictor:** Calculates exact classes that can be missed safely or must be attended consecutively using official formulas:
  $$\text{Required Consecutive Classes} = \left\lceil \frac{T \cdot C_{current} - A_{current}}{1 - T} \right\rceil$$
- **CGPA Predictor:** Interactive credit-weighted simulator factoring in course weights and 10-point university grading scales:
  $$\text{SGPA} = \frac{\sum (C_i \times GP_i)}{\sum C_i}$$
- **Smart AI Study Planner:** Synthesizes personalized daily Pomodoro revision schedules based on upcoming exams and weak areas with completion tracking.
- **AI Academic Companion Chatbot:** Context-aware academic assistant answering syllabus questions, course concept explanations (Algorithms, DBMS, ML, OS), and policy inquiries.

### 3. Parent & Faculty Portals
- **Parent Portal:** Live attendance, grade cards, faculty advisor direct contact, and fee payments with instant digital receipts.
- **Faculty Portal:** Classroom attendance register with batch toggles, marks grading, assignment creator, and leave application approval queues.
- **Admin Console:** Campus-wide analytics, department statistics, facility master toggles, and college-wide broadcast circulars.

### 4. Campus Navigation & Services
- **Interactive 2D Campus Map:** Clickable SVG layout of Main Academic Block, Turing AI Hub, Central Library, Raman Science Complex, and Auditorium.
- **Real-time Room Directory:** Search and filter classrooms, laboratories, and seminar halls by availability, floor, and equipment.
- **Online Leave Applications:** Apply for Medical, Hackathon/Academic Duty, or Personal leaves with automated status workflows.
- **Notification Center:** Priority-tagged circulars (Urgent, High, Normal) with read/unread tracking.

---

## 🛠️ Technology Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Canvas Confetti
- **Backend:** Node.js, Express.js (`server.ts`) with integrated Vite middleware
- **AI Engine:** Google Gemini API (`gemini-3.8-flash`) via `@google/genai` TypeScript SDK
- **Data Architecture:** In-memory relational store with full REST API endpoints

---

## 💻 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Configure environment variables in .env
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

# 3. Start full-stack development server
npm run dev
# The server boots at http://localhost:3000

# 4. Run TypeScript checks
npm run lint

# 5. Build for production
npm run build
```
