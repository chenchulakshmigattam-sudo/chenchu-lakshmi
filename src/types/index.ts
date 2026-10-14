export type UserRole = 'student' | 'faculty' | 'parent' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  rollNumber?: string;
  department?: string;
  semester?: number;
  section?: string;
  phone?: string;
  linkedStudentId?: string;
  linkedStudentName?: string;
  designation?: string;
  joinedYear?: string;
}

export interface AttendanceHistory {
  date: string;
  status: 'present' | 'absent' | 'leave';
  topicCovered?: string;
}

export interface SubjectAttendance {
  subjectCode: string;
  subjectName: string;
  credits: number;
  attendedClasses: number;
  totalClasses: number;
  percentage: number;
  facultyName: string;
  room: string;
  history: AttendanceHistory[];
}

export interface InternalMark {
  subjectCode: string;
  subjectName: string;
  credits: number;
  test1: number; // max 20
  test2: number; // max 20
  assignment: number; // max 10
  lab: number; // max 10
  totalInternal: number; // max 60
  expectedEndSem?: number; // max 40
  estimatedGrade?: string;
  gradePoint?: number;
}

export interface SemesterResult {
  semester: number;
  sgpa: number;
  cgpa: number;
  totalCredits: number;
  status: 'PASSED' | 'APPEARED' | 'PENDING';
  subjects: {
    code: string;
    name: string;
    credits: number;
    grade: string;
    gradePoint: number;
  }[];
}

export interface TimetableSlot {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  period: number;
  time: string;
  subjectCode: string;
  subjectName: string;
  room: string;
  faculty: string;
  type: 'lecture' | 'lab' | 'tutorial';
  color?: string;
}

export interface ExamScheduleItem {
  id: string;
  subjectCode: string;
  subjectName: string;
  date: string;
  time: string;
  duration: string;
  room: string;
  hallTicketRequired: boolean;
  syllabus: string;
  seatNumber: string;
}

export interface Assignment {
  id: string;
  subjectCode: string;
  subjectName: string;
  title: string;
  description: string;
  assignedDate: string;
  dueDate: string;
  maxMarks: number;
  status: 'pending' | 'submitted' | 'graded';
  submittedText?: string;
  submittedFile?: string;
  submittedAt?: string;
  obtainedMarks?: number;
  feedback?: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  category: 'Academic' | 'Exam' | 'Attendance' | 'Fees' | 'Event' | 'General';
  postedBy: string;
  date: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  targetRoles: UserRole[];
  read: boolean;
  link?: string;
}

export interface LeaveApplication {
  id: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  department: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  type: 'Medical' | 'Academic' | 'Personal' | 'Duty Leave';
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedAt: string;
  reviewedBy?: string;
  reviewNotes?: string;
  reviewedAt?: string;
}

export interface FeeTransaction {
  id: string;
  amount: number;
  date: string;
  method: string;
  receiptNumber: string;
  status: 'Success' | 'Pending';
}

export interface FeeRecord {
  studentId: string;
  studentName: string;
  rollNumber: string;
  semester: number;
  academicYear: string;
  tuitionFee: number;
  labFee: number;
  libraryFee: number;
  examFee: number;
  totalFee: number;
  paidAmount: number;
  dueAmount: number;
  dueDate: string;
  status: 'Paid' | 'Partial' | 'Unpaid';
  transactions: FeeTransaction[];
}

export interface CampusRoom {
  id: string;
  roomNumber: string;
  name: string;
  building: 'Main Academic Block' | 'Turing AI & Computing Hub' | 'Central Library' | 'Raman Science Complex' | 'Auditorium' | 'Administrative Wing' | 'Sports Arena';
  floor: number;
  type: 'Classroom' | 'Lab' | 'Seminar Hall' | 'Conference Room' | 'Faculty Cabin' | 'Auditorium';
  capacity: number;
  isOccupied: boolean;
  currentActivity?: string;
  currentFaculty?: string;
  nextFreeTime?: string;
  features: string[];
}

export interface StudyPlanSlot {
  time: string;
  subject: string;
  topic: string;
  activity: string;
  durationMins: number;
  difficulty: 'Easy' | 'Medium' | 'Challenging';
  completed: boolean;
}

export interface DayStudyPlan {
  dayName: string;
  date: string;
  focusGoal: string;
  slots: StudyPlanSlot[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai' | 'system';
  text: string;
  timestamp: string;
  category?: 'attendance' | 'exam' | 'timetable' | 'academic' | 'campus';
  quickActions?: string[];
}
