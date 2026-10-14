import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import {
  DEMO_USERS,
  INITIAL_ATTENDANCE,
  INITIAL_MARKS,
  PREVIOUS_SEMESTER_RESULTS,
  WEEKLY_TIMETABLE,
  EXAM_SCHEDULE,
  INITIAL_ASSIGNMENTS,
  INITIAL_NOTICES,
  INITIAL_LEAVES,
  INITIAL_FEES,
  INITIAL_CAMPUS_ROOMS,
  INITIAL_STUDY_PLAN
} from './src/data/mockData.ts';
import { User, Assignment, Notice, LeaveApplication, FeeRecord, CampusRoom } from './src/types/index.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// In-Memory Database State (initialized with seed data)
const db = {
  users: { ...DEMO_USERS },
  attendance: [...INITIAL_ATTENDANCE],
  marks: [...INITIAL_MARKS],
  results: [...PREVIOUS_SEMESTER_RESULTS],
  timetable: [...WEEKLY_TIMETABLE],
  exams: [...EXAM_SCHEDULE],
  assignments: [...INITIAL_ASSIGNMENTS],
  notices: [...INITIAL_NOTICES],
  leaves: [...INITIAL_LEAVES],
  fees: { ...INITIAL_FEES },
  rooms: [...INITIAL_CAMPUS_ROOMS],
  studyPlan: [...INITIAL_STUDY_PLAN]
};

// Initialize Gemini Client
let geminiClient: GoogleGenAI | null = null;
try {
  if (process.env.GEMINI_API_KEY) {
    geminiClient = new GoogleGenAI();
  }
} catch (e) {
  console.warn('Gemini AI initialization skipped, using resilient fallback mode', e);
}

function withTimeout<T>(promise: Promise<T>, timeoutMs = 3500): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error('AI generation timed out')), timeoutMs))
  ]);
}

// ----------------------------------------------------
// AUTH & USER ROUTES
// ----------------------------------------------------
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, role, isDemo } = req.body;
  if (isDemo && role && db.users[role]) {
    return res.json({ success: true, user: db.users[role] });
  }

  // Find user by email or fallback to matched role
  const foundUser = Object.values(db.users).find(
    (u) => u.email.toLowerCase() === (email || '').toLowerCase()
  );

  if (foundUser) {
    return res.json({ success: true, user: foundUser });
  }

  // Create temporary user if registering/signing in with custom email
  if (email && role) {
    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
      email,
      role: role as any,
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      department: 'Computer Science & Engineering',
      rollNumber: role === 'student' ? `CS2026${Math.floor(100 + Math.random() * 900)}` : undefined,
      semester: role === 'student' ? 5 : undefined
    };
    db.users[newUser.id] = newUser;
    return res.json({ success: true, user: newUser });
  }

  res.status(401).json({ success: false, message: 'Invalid credentials. Select a demo account or sign up.' });
});

app.get('/api/users/demo', (_req: Request, res: Response) => {
  res.json({ success: true, users: db.users });
});

// ----------------------------------------------------
// ATTENDANCE ROUTES
// ----------------------------------------------------
app.get('/api/attendance', (_req: Request, res: Response) => {
  res.json({ success: true, attendance: db.attendance });
});

app.post('/api/attendance/mark', (req: Request, res: Response) => {
  const { subjectCode, date, studentStatusList } = req.body;
  // studentStatusList: array of { studentId, status: 'present'|'absent' }
  const subject = db.attendance.find((s) => s.subjectCode === subjectCode);
  if (subject) {
    const status = studentStatusList?.[0]?.status || 'present';
    subject.totalClasses += 1;
    if (status === 'present') {
      subject.attendedClasses += 1;
    }
    subject.percentage = parseFloat(((subject.attendedClasses / subject.totalClasses) * 100).toFixed(1));
    subject.history.unshift({
      date: date || new Date().toISOString().split('T')[0],
      status: status,
      topicCovered: req.body.topicCovered || 'Regular Class Session'
    });
    return res.json({ success: true, updatedSubject: subject, attendance: db.attendance });
  }
  res.status(404).json({ success: false, message: 'Subject not found' });
});

// ----------------------------------------------------
// MARKS & RESULTS ROUTES
// ----------------------------------------------------
app.get('/api/marks', (_req: Request, res: Response) => {
  res.json({
    success: true,
    marks: db.marks,
    results: db.results,
    currentCgpa: 8.74,
    currentSgpa: 8.85
  });
});

app.post('/api/marks/update', (req: Request, res: Response) => {
  const { subjectCode, test1, test2, assignment, lab } = req.body;
  const markItem = db.marks.find((m) => m.subjectCode === subjectCode);
  if (markItem) {
    if (test1 !== undefined) markItem.test1 = Number(test1);
    if (test2 !== undefined) markItem.test2 = Number(test2);
    if (assignment !== undefined) markItem.assignment = Number(assignment);
    if (lab !== undefined) markItem.lab = Number(lab);
    markItem.totalInternal = markItem.test1 + markItem.test2 + markItem.assignment + markItem.lab;
    return res.json({ success: true, markItem, marks: db.marks });
  }
  res.status(404).json({ success: false, message: 'Subject marks record not found' });
});

// ----------------------------------------------------
// TIMETABLE & EXAMS
// ----------------------------------------------------
app.get('/api/timetable', (_req: Request, res: Response) => {
  res.json({ success: true, timetable: db.timetable });
});

app.get('/api/exams', (_req: Request, res: Response) => {
  res.json({ success: true, exams: db.exams });
});

// ----------------------------------------------------
// ASSIGNMENTS ROUTES
// ----------------------------------------------------
app.get('/api/assignments', (_req: Request, res: Response) => {
  res.json({ success: true, assignments: db.assignments });
});

app.post('/api/assignments/submit', (req: Request, res: Response) => {
  const { assignmentId, submittedText, submittedFile } = req.body;
  const assignment = db.assignments.find((a) => a.id === assignmentId);
  if (assignment) {
    assignment.status = 'submitted';
    assignment.submittedText = submittedText;
    assignment.submittedFile = submittedFile || 'report_final_submission.pdf';
    assignment.submittedAt = new Date().toLocaleString('en-US', { hour12: false });
    return res.json({ success: true, assignment, assignments: db.assignments });
  }
  res.status(404).json({ success: false, message: 'Assignment not found' });
});

app.post('/api/assignments/create', (req: Request, res: Response) => {
  const { subjectCode, subjectName, title, description, dueDate, maxMarks } = req.body;
  const newAssignment: Assignment = {
    id: `asg_${Date.now()}`,
    subjectCode: subjectCode || 'CS501',
    subjectName: subjectName || 'Design & Analysis of Algorithms',
    title,
    description,
    assignedDate: new Date().toISOString().split('T')[0],
    dueDate: dueDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    maxMarks: Number(maxMarks) || 10,
    status: 'pending'
  };
  db.assignments.unshift(newAssignment);
  res.json({ success: true, assignment: newAssignment, assignments: db.assignments });
});

app.post('/api/assignments/grade', (req: Request, res: Response) => {
  const { assignmentId, marksObtained, feedback } = req.body;
  const assignment = db.assignments.find((a) => a.id === assignmentId);
  if (assignment) {
    assignment.status = 'graded';
    assignment.obtainedMarks = Number(marksObtained);
    assignment.feedback = feedback;
    return res.json({ success: true, assignment, assignments: db.assignments });
  }
  res.status(404).json({ success: false, message: 'Assignment not found' });
});

// ----------------------------------------------------
// NOTICES & ANNOUNCEMENTS
// ----------------------------------------------------
app.get('/api/notices', (_req: Request, res: Response) => {
  res.json({ success: true, notices: db.notices });
});

app.post('/api/notices', (req: Request, res: Response) => {
  const { title, content, category, priority, postedBy } = req.body;
  const newNotice: Notice = {
    id: `not_${Date.now()}`,
    title,
    content,
    category: category || 'General',
    postedBy: postedBy || 'Dean of Academic Affairs',
    date: new Date().toISOString().split('T')[0],
    priority: priority || 'normal',
    targetRoles: ['student', 'faculty', 'parent'],
    read: false
  };
  db.notices.unshift(newNotice);
  res.json({ success: true, notice: newNotice, notices: db.notices });
});

app.post('/api/notices/:id/read', (req: Request, res: Response) => {
  const notice = db.notices.find(n => n.id === req.params.id);
  if (notice) {
    notice.read = true;
    return res.json({ success: true, notice });
  }
  res.status(404).json({ success: false, message: 'Notice not found' });
});

// ----------------------------------------------------
// LEAVE APPLICATIONS
// ----------------------------------------------------
app.get('/api/leaves', (_req: Request, res: Response) => {
  res.json({ success: true, leaves: db.leaves });
});

app.post('/api/leaves', (req: Request, res: Response) => {
  const { startDate, endDate, totalDays, type, reason, studentName, rollNumber } = req.body;
  const newLeave: LeaveApplication = {
    id: `lv_${Date.now()}`,
    studentId: 'usr_stu_1',
    studentName: studentName || 'Aarav Sharma',
    rollNumber: rollNumber || 'CS2023041',
    department: 'Computer Science & Engineering',
    startDate,
    endDate,
    totalDays: Number(totalDays) || 1,
    type: type || 'Medical',
    reason,
    status: 'pending',
    appliedAt: new Date().toLocaleString('en-US', { hour12: false })
  };
  db.leaves.unshift(newLeave);
  res.json({ success: true, leave: newLeave, leaves: db.leaves });
});

app.put('/api/leaves/:id', (req: Request, res: Response) => {
  const { status, reviewNotes, reviewedBy } = req.body;
  const leave = db.leaves.find((l) => l.id === req.params.id);
  if (leave) {
    leave.status = status;
    leave.reviewNotes = reviewNotes;
    leave.reviewedBy = reviewedBy || 'Prof. Sunita Rao';
    leave.reviewedAt = new Date().toLocaleString('en-US', { hour12: false });
    return res.json({ success: true, leave, leaves: db.leaves });
  }
  res.status(404).json({ success: false, message: 'Leave application not found' });
});

// ----------------------------------------------------
// FEES
// ----------------------------------------------------
app.get('/api/fees', (_req: Request, res: Response) => {
  res.json({ success: true, fees: db.fees });
});

app.post('/api/fees/pay', (req: Request, res: Response) => {
  const { amount, method } = req.body;
  const payAmount = Number(amount);
  if (isNaN(payAmount) || payAmount <= 0) {
    return res.status(400).json({ success: false, message: 'Invalid payment amount' });
  }

  db.fees.paidAmount += payAmount;
  db.fees.dueAmount = Math.max(0, db.fees.totalFee - db.fees.paidAmount);
  db.fees.status = db.fees.dueAmount === 0 ? 'Paid' : 'Partial';

  const newTx = {
    id: `tx_${Date.now()}`,
    amount: payAmount,
    date: new Date().toISOString().split('T')[0],
    method: method || 'Instant Payment Gateway (UPI / Card)',
    receiptNumber: `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    status: 'Success' as const
  };

  db.fees.transactions.unshift(newTx);
  res.json({ success: true, fees: db.fees, transaction: newTx });
});

// ----------------------------------------------------
// CAMPUS ROOMS & NAVIGATION
// ----------------------------------------------------
app.get('/api/rooms', (_req: Request, res: Response) => {
  res.json({ success: true, rooms: db.rooms });
});

app.post('/api/rooms/:id/toggle', (req: Request, res: Response) => {
  const room = db.rooms.find((r) => r.id === req.params.id);
  if (room) {
    room.isOccupied = !room.isOccupied;
    if (room.isOccupied) {
      room.currentActivity = req.body.activity || 'Special Lecture Session';
      room.nextFreeTime = '04:30 PM';
    } else {
      room.currentActivity = undefined;
      room.nextFreeTime = 'Available Now';
    }
    return res.json({ success: true, room, rooms: db.rooms });
  }
  res.status(404).json({ success: false, message: 'Room not found' });
});

// ----------------------------------------------------
// AI POWERED FEATURES
// ----------------------------------------------------

// 1. AI Academic Companion Chatbot
app.post('/api/ai/chat', async (req: Request, res: Response) => {
  const { message, history, userRole, studentContext } = req.body;

  const defaultCollegeKnowledge = `
You are the Smart College Assistant – an AI-Powered Digital Campus Companion for Apex Institute of Technology & Science (Hackathon 2026).
Role interacting with you: ${userRole || 'student'}
Student Academic Context:
- Student Name: Aarav Sharma (CS2023041), B.Tech CSE Semester 5
- Current CGPA: 8.74, SGPA: 8.85
- Key Attendance Stats: ML is 68.4% (BELOW 75% MANDATORY THRESHOLD), DSA is 90.5%, DBMS is 82.5%, OS is 91.4%, Web is 79.4%, Cloud Lab is 94.4%.
- Upcoming Exams: Algorithms (Nov 4), DBMS (Nov 7), Machine Learning (Nov 10), OS (Nov 13), Web (Nov 16).
- Campus Features: Turing AI Hub (Floors 1-3), Main Academic Block, Central 24/7 Library, Raman Science Complex.
- College Policies: Minimum 75% attendance needed for exams; condonation granted with medical certificate up to 65%; fee payment deadline Oct 31, 2026.

Guidance:
- Give concise, motivating, highly accurate answers.
- Format with neat bullet points or bold keywords when explaining academic formulas or steps.
- If asked about attendance shortages, suggest exact number of classes to attend and mention leave condonation rules.
- If asked about concepts (Algorithms, ML, DBMS, OS), explain with clear analogies and examples.
- Clearly state answers within the college companion persona.
`;

  if (geminiClient && process.env.GEMINI_API_KEY) {
    try {
      const prompt = `${defaultCollegeKnowledge}\n\nUser Question: ${message}`;
      const response = await withTimeout(geminiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt
      }));

      const text = response.text || "I'm here to support your campus journey. How can I help you today?";
      return res.json({
        success: true,
        reply: text,
        mode: 'gemini-3.8-flash'
      });
    } catch (err: any) {
      console.error('Gemini API call skipped, falling back to rule engine:', err?.message || err);
    }
  }

  // Resilient fallback logic when offline or key not provided
  let reply = '';
  const lowerMsg = (message || '').toLowerCase();

  if (lowerMsg.includes('attendance') || lowerMsg.includes('shortage') || lowerMsg.includes('miss')) {
    reply = `📊 **Attendance Alert & Advice**:
Your current overall attendance is **84.4%**, but your **Machine Learning (CS503)** is at **68.4% (26/38 classes)**, which is below the mandatory 75% threshold!
- To reach **75% in ML**: You must attend the **next 10 consecutive classes** without any absence.
- If you had medical reasons on Oct 11, ensure your leave application is approved to count towards condonation.
- All other subjects (Algorithms: 90.5%, OS: 91.4%) have comfortable buffer margins.`;
  } else if (lowerMsg.includes('exam') || lowerMsg.includes('schedule') || lowerMsg.includes('date')) {
    reply = `🗓️ **Semester Examination Schedule (Nov 2026)**:
1. **Design & Analysis of Algorithms**: Nov 04, 10:00 AM (Hall A, Seat A-42)
2. **Database Management Systems**: Nov 07, 10:00 AM (Hall B, Seat B-19)
3. **Machine Learning & Deep Learning**: Nov 10, 10:00 AM (Auditorium, Seat AUD-88)
4. **Operating Systems & Kernels**: Nov 13, 10:00 AM (Hall A, Seat A-42)
5. **Full-Stack Web Engineering**: Nov 16, 10:00 AM (Turing Lab 1, Seat TC-14)
*Remember to carry your Digital Hall Ticket available on the Timetable & Exams tab.*`;
  } else if (lowerMsg.includes('cgpa') || lowerMsg.includes('gpa') || lowerMsg.includes('grade')) {
    reply = `🎯 **CGPA & Academic Guidance**:
- Your current cumulative GPA is **8.74** across 86 completed credits.
- If you achieve an SGPA of **9.25** this semester (achievable with 'O' in Labs, 'A+' in Algorithms & Web, and 'A' in DBMS/OS), your projected CGPA will rise to **8.84**!
- Check out the **CGPA Predictor** tab on the sidebar to test custom grade combinations.`;
  } else if (lowerMsg.includes('library') || lowerMsg.includes('lab') || lowerMsg.includes('room') || lowerMsg.includes('campus')) {
    reply = `📍 **Campus Facilities & Navigation**:
- **Central Library**: Open 24/7 during exam season with quiet study pods on the ground floor.
- **Turing AI & Computing Hub**: Lab 1 has 40 NVIDIA RTX workstations available after 3:15 PM; Lab 2 is open for student hackathon projects.
- Use our interactive **Campus Map** tab to find real-time classroom and lab availability.`;
  } else {
    reply = `Hello! I am your **Smart College Assistant**. I can help you with:
- 📈 **Attendance Calculations**: How many classes can you miss or need to attend to stay above 75%.
- 📚 **Study Planning & Exam Timetable**: Personalized daily revision plans for your upcoming mid-terms.
- 🎯 **CGPA Forecasting**: What grades you need in each subject to hit your graduation target.
- 🏢 **Campus Navigation**: Locating free study rooms, faculty cabins, and laboratories.

Feel free to ask any specific academic question!`;
  }

  res.json({
    success: true,
    reply,
    mode: 'smart-campus-assistant (offline mode)'
  });
});

// 2. AI Attendance Predictor Endpoint
app.post('/api/ai/predict-attendance', async (req: Request, res: Response) => {
  const { attendedClasses, totalClasses, targetPercentage = 75, plannedAbsences = 0, upcomingClasses = 15 } = req.body;

  const currentAttended = Number(attendedClasses);
  const currentTotal = Number(totalClasses);
  const target = Number(targetPercentage);
  const targetRatio = target / 100;
  const absences = Number(plannedAbsences);
  const future = Number(upcomingClasses);

  const currentPct = parseFloat(((currentAttended / currentTotal) * 100).toFixed(1));

  // Scenario 1: Can student miss any classes and stay >= target?
  // (currentAttended) / (currentTotal + canMiss) >= targetRatio
  // currentAttended >= targetRatio * currentTotal + targetRatio * canMiss
  // canMiss <= (currentAttended - targetRatio * currentTotal) / targetRatio
  let canMissClasses = 0;
  if (currentPct >= target) {
    canMissClasses = Math.floor((currentAttended - targetRatio * currentTotal) / targetRatio);
  }

  // Scenario 2: If current < target, how many consecutive classes must be attended?
  // (currentAttended + mustAttend) / (currentTotal + mustAttend) >= targetRatio
  // currentAttended + mustAttend >= targetRatio * currentTotal + targetRatio * mustAttend
  // mustAttend * (1 - targetRatio) >= targetRatio * currentTotal - currentAttended
  let mustAttendConsecutive = 0;
  if (currentPct < target) {
    mustAttendConsecutive = Math.ceil((targetRatio * currentTotal - currentAttended) / (1 - targetRatio));
  }

  // Scenario 3: Forecast with planned absences and future classes
  // Total classes = currentTotal + future
  // Attended = currentAttended + (future - absences)
  const projectedAttended = Math.max(0, currentAttended + (future - absences));
  const projectedTotal = currentTotal + future;
  const projectedPct = parseFloat(((projectedAttended / projectedTotal) * 100).toFixed(1));

  let aiAdvice = '';
  if (geminiClient && process.env.GEMINI_API_KEY) {
    try {
      const aiPrompt = `As an expert college academic advisor, provide a 2-sentence encouraging, realistic strategy for a student with:
Current attendance: ${currentPct}% (${currentAttended}/${currentTotal} classes).
Target: ${target}%.
Classes they can miss or must attend consecutively: ${currentPct >= target ? `Can afford to miss ${canMissClasses} classes` : `Must attend next ${mustAttendConsecutive} consecutive classes`}.
With ${absences} planned absences over the next ${future} scheduled classes, their forecasted attendance is ${projectedPct}%.`;
      const aiRes = await withTimeout(geminiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: aiPrompt
      }));
      aiAdvice = aiRes.text || '';
    } catch (e) {
      // ignore
    }
  }

  if (!aiAdvice) {
    if (projectedPct >= target) {
      aiAdvice = `Your forecast of ${projectedPct}% satisfies the ${target}% threshold comfortably. Maintain steady presence in core lectures while allowing reasonable flexibility for planned leaves.`;
    } else {
      aiAdvice = `Warning: Missing ${absences} out of the next ${future} classes will pull your attendance down to ${projectedPct}%, which breaches the ${target}% limit. Reduce planned absences immediately.`;
    }
  }

  res.json({
    success: true,
    calculation: {
      currentPct,
      currentAttended,
      currentTotal,
      target,
      canMissClasses: Math.max(0, canMissClasses),
      mustAttendConsecutive: Math.max(0, mustAttendConsecutive),
      projectedAttended,
      projectedTotal,
      projectedPct,
      status: projectedPct >= target ? 'SAFE' : 'SHORTAGE_RISK'
    },
    aiAdvice
  });
});

// 3. AI CGPA Predictor Endpoint
app.post('/api/ai/predict-cgpa', async (req: Request, res: Response) => {
  const { currentCgpa = 8.74, completedCredits = 86, semesterSubjects = [] } = req.body;

  // Grade point mapping
  const gradePoints: Record<string, number> = {
    'O': 10, 'A+': 10, 'A': 9, 'B+': 8, 'B': 7, 'C': 6, 'P': 5, 'F': 0
  };

  let semWeightedSum = 0;
  let semCredits = 0;

  for (const s of semesterSubjects) {
    const credits = Number(s.credits) || 3;
    const gp = gradePoints[s.expectedGrade] !== undefined ? gradePoints[s.expectedGrade] : (Number(s.gradePoint) || 9);
    semWeightedSum += credits * gp;
    semCredits += credits;
  }

  const projectedSgpa = semCredits > 0 ? parseFloat((semWeightedSum / semCredits).toFixed(2)) : 0;
  const totalCreditsCumulative = Number(completedCredits) + semCredits;
  const previousWeighted = Number(currentCgpa) * Number(completedCredits);
  const projectedCgpa = totalCreditsCumulative > 0
    ? parseFloat(((previousWeighted + semWeightedSum) / totalCreditsCumulative).toFixed(2))
    : Number(currentCgpa);

  let recommendation = '';
  if (geminiClient && process.env.GEMINI_API_KEY) {
    try {
      const prompt = `Student has prior CGPA of ${currentCgpa} across ${completedCredits} credits. This semester with ${semCredits} credits, their estimated SGPA is ${projectedSgpa}, projecting a cumulative CGPA of ${projectedCgpa}. Provide a 2-sentence tactical tip on which subjects carry maximum weight and how to secure distinction honors.`;
      const resAI = await withTimeout(geminiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt
      }));
      recommendation = resAI.text || '';
    } catch (e) {
      // ignore
    }
  }

  if (!recommendation) {
    recommendation = `With a projected SGPA of ${projectedSgpa}, your overall CGPA shifts from ${currentCgpa} to ${projectedCgpa}. Focus on the 4-credit courses (Algorithms and Machine Learning) as they contribute 40% of this semester's total grade weight.`;
  }

  res.json({
    success: true,
    calculation: {
      currentCgpa: Number(currentCgpa),
      completedCredits: Number(completedCredits),
      semCredits,
      projectedSgpa,
      totalCreditsCumulative,
      projectedCgpa,
      delta: parseFloat((projectedCgpa - Number(currentCgpa)).toFixed(2))
    },
    recommendation
  });
});

// 4. Smart Study Planner Generator Endpoint
app.post('/api/ai/planner', async (req: Request, res: Response) => {
  const { dailyHours = 3, focusWeakSubjects = true, targetExamDays = 20 } = req.body;

  let generatedPlan = db.studyPlan;

  if (geminiClient && process.env.GEMINI_API_KEY) {
    try {
      const prompt = `You are an AI study coach for an engineering student taking CS501 (Algorithms), CS502 (DBMS), CS503 (Machine Learning - currently weak area), CS504 (Operating Systems), and CS505 (Full-Stack).
The student has ${dailyHours} hours of free study time each evening, and exams are in ${targetExamDays} days.
Output valid JSON ONLY containing an array of 3 daily study plan objects with the exact schema:
[
  {
    "dayName": "Day 1 (Today)",
    "date": "2026-10-14",
    "focusGoal": "string describing daily goal",
    "slots": [
      {
        "time": "05:30 PM - 06:45 PM",
        "subject": "Machine Learning",
        "topic": "Loss Gradients & Regularization",
        "activity": "Solve derivations and code 1 experiment",
        "durationMins": 75,
        "difficulty": "Challenging",
        "completed": false
      }
    ]
  }
]
Do not output markdown code blocks or text outside the JSON.`;

      const response = await withTimeout(geminiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      }));

      const parsed = JSON.parse(response.text || '[]');
      if (Array.isArray(parsed) && parsed.length > 0) {
        generatedPlan = parsed;
      }
    } catch (e) {
      console.warn('Study planner generation fallback', e);
    }
  }

  res.json({
    success: true,
    studyPlan: generatedPlan
  });
});

// ----------------------------------------------------
// VITE DEV SERVER OR PRODUCTION STATIC SERVE
// ----------------------------------------------------
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Smart College Assistant Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
