import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  SubjectAttendance,
  InternalMark,
  SemesterResult,
  TimetableSlot,
  ExamScheduleItem,
  Assignment,
  Notice,
  LeaveApplication,
  FeeRecord,
  CampusRoom,
  DayStudyPlan
} from '../types';
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
} from '../data/mockData';

interface AppContextType {
  currentUser: User | null;
  activeRole: UserRole;
  activeTab: string;
  theme: 'light' | 'dark';
  attendance: SubjectAttendance[];
  marks: InternalMark[];
  results: SemesterResult[];
  timetable: TimetableSlot[];
  exams: ExamScheduleItem[];
  assignments: Assignment[];
  notices: Notice[];
  leaves: LeaveApplication[];
  fees: FeeRecord;
  rooms: CampusRoom[];
  studyPlan: DayStudyPlan[];
  unreadNoticesCount: number;
  setActiveTab: (tab: string) => void;
  toggleTheme: () => void;
  loginAs: (role: UserRole) => void;
  loginWithEmail: (email: string, role: UserRole) => void;
  logout: () => void;
  markAttendance: (subjectCode: string, status: 'present' | 'absent', topic?: string) => Promise<void>;
  updateMarks: (subjectCode: string, test1: number, test2: number, assignment: number, lab: number) => Promise<void>;
  submitAssignment: (assignmentId: string, text: string, fileName?: string) => Promise<void>;
  createAssignment: (data: Partial<Assignment>) => Promise<void>;
  gradeAssignment: (assignmentId: string, marks: number, feedback: string) => Promise<void>;
  applyLeave: (leave: Partial<LeaveApplication>) => Promise<void>;
  reviewLeave: (leaveId: string, status: 'approved' | 'rejected', notes?: string) => Promise<void>;
  payFee: (amount: number, method: string) => Promise<boolean>;
  toggleRoomOccupancy: (roomId: string, activity?: string) => Promise<void>;
  markNoticeRead: (noticeId: string) => void;
  addNotice: (notice: Partial<Notice>) => Promise<void>;
  updateStudyPlanSlot: (dayIndex: number, slotIndex: number, completed: boolean) => void;
  regenerateStudyPlan: (dailyHours: number) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(DEMO_USERS.student);
  const [activeTab, setActiveTab] = useState<string>('student-dashboard');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const [attendance, setAttendance] = useState<SubjectAttendance[]>(INITIAL_ATTENDANCE);
  const [marks, setMarks] = useState<InternalMark[]>(INITIAL_MARKS);
  const [results] = useState<SemesterResult[]>(PREVIOUS_SEMESTER_RESULTS);
  const [timetable] = useState<TimetableSlot[]>(WEEKLY_TIMETABLE);
  const [exams] = useState<ExamScheduleItem[]>(EXAM_SCHEDULE);
  const [assignments, setAssignments] = useState<Assignment[]>(INITIAL_ASSIGNMENTS);
  const [notices, setNotices] = useState<Notice[]>(INITIAL_NOTICES);
  const [leaves, setLeaves] = useState<LeaveApplication[]>(INITIAL_LEAVES);
  const [fees, setFees] = useState<FeeRecord>(INITIAL_FEES);
  const [rooms, setRooms] = useState<CampusRoom[]>(INITIAL_CAMPUS_ROOMS);
  const [studyPlan, setStudyPlan] = useState<DayStudyPlan[]>(INITIAL_STUDY_PLAN);

  // Sync with dark mode class on document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Initial fetch from backend if server is active
  useEffect(() => {
    async function loadBackendData() {
      try {
        const [attRes, marksRes, asgRes, notRes, lvRes, feeRes, rmRes] = await Promise.allSettled([
          fetch('/api/attendance').then(r => r.json()),
          fetch('/api/marks').then(r => r.json()),
          fetch('/api/assignments').then(r => r.json()),
          fetch('/api/notices').then(r => r.json()),
          fetch('/api/leaves').then(r => r.json()),
          fetch('/api/fees').then(r => r.json()),
          fetch('/api/rooms').then(r => r.json()),
        ]);

        if (attRes.status === 'fulfilled' && attRes.value?.attendance) {
          setAttendance(attRes.value.attendance);
        }
        if (marksRes.status === 'fulfilled' && marksRes.value?.marks) {
          setMarks(marksRes.value.marks);
        }
        if (asgRes.status === 'fulfilled' && asgRes.value?.assignments) {
          setAssignments(asgRes.value.assignments);
        }
        if (notRes.status === 'fulfilled' && notRes.value?.notices) {
          setNotices(notRes.value.notices);
        }
        if (lvRes.status === 'fulfilled' && lvRes.value?.leaves) {
          setLeaves(lvRes.value.leaves);
        }
        if (feeRes.status === 'fulfilled' && feeRes.value?.fees) {
          setFees(feeRes.value.fees);
        }
        if (rmRes.status === 'fulfilled' && rmRes.value?.rooms) {
          setRooms(rmRes.value.rooms);
        }
      } catch (e) {
        console.warn('Backend live sync skipped, working in synchronized client mode', e);
      }
    }
    loadBackendData();
  }, []);

  const activeRole: UserRole = currentUser?.role || 'student';

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const loginAs = (role: UserRole) => {
    const user = DEMO_USERS[role];
    if (user) {
      setCurrentUser(user);
      if (role === 'student') setActiveTab('student-dashboard');
      else if (role === 'faculty') setActiveTab('faculty-portal');
      else if (role === 'parent') setActiveTab('parent-portal');
      else if (role === 'admin') setActiveTab('admin-portal');
    }
  };

  const loginWithEmail = async (email: string, role: UserRole) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role })
      });
      const data = await res.json();
      if (data.success && data.user) {
        setCurrentUser(data.user);
        if (data.user.role === 'student') setActiveTab('student-dashboard');
        else if (data.user.role === 'faculty') setActiveTab('faculty-portal');
        else if (data.user.role === 'parent') setActiveTab('parent-portal');
        else if (data.user.role === 'admin') setActiveTab('admin-portal');
        return;
      }
    } catch (e) {
      // fallback
    }
    loginAs(role);
  };

  const logout = () => {
    setCurrentUser(null);
    setActiveTab('landing');
  };

  const markAttendance = async (subjectCode: string, status: 'present' | 'absent', topic?: string) => {
    try {
      const res = await fetch('/api/attendance/mark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subjectCode,
          studentStatusList: [{ studentId: 'usr_stu_1', status }],
          topicCovered: topic || 'Class Lecture'
        })
      });
      const data = await res.json();
      if (data.success && data.attendance) {
        setAttendance(data.attendance);
        return;
      }
    } catch (e) {
      // fallback
    }

    setAttendance(prev =>
      prev.map(item => {
        if (item.subjectCode === subjectCode) {
          const total = item.totalClasses + 1;
          const attended = status === 'present' ? item.attendedClasses + 1 : item.attendedClasses;
          const pct = parseFloat(((attended / total) * 100).toFixed(1));
          return {
            ...item,
            totalClasses: total,
            attendedClasses: attended,
            percentage: pct,
            history: [
              {
                date: new Date().toISOString().split('T')[0],
                status,
                topicCovered: topic || 'Regular Class Session'
              },
              ...item.history
            ]
          };
        }
        return item;
      })
    );
  };

  const updateMarks = async (subjectCode: string, test1: number, test2: number, assignment: number, lab: number) => {
    try {
      const res = await fetch('/api/marks/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subjectCode, test1, test2, assignment, lab })
      });
      const data = await res.json();
      if (data.success && data.marks) {
        setMarks(data.marks);
        return;
      }
    } catch (e) {
      // fallback
    }

    setMarks(prev =>
      prev.map(m => {
        if (m.subjectCode === subjectCode) {
          const tot = test1 + test2 + assignment + lab;
          return { ...m, test1, test2, assignment, lab, totalInternal: tot };
        }
        return m;
      })
    );
  };

  const submitAssignment = async (assignmentId: string, text: string, fileName?: string) => {
    try {
      const res = await fetch('/api/assignments/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignmentId, submittedText: text, submittedFile: fileName })
      });
      const data = await res.json();
      if (data.success && data.assignments) {
        setAssignments(data.assignments);
        return;
      }
    } catch (e) {
      // fallback
    }

    setAssignments(prev =>
      prev.map(a => {
        if (a.id === assignmentId) {
          return {
            ...a,
            status: 'submitted',
            submittedText: text,
            submittedFile: fileName || 'assignment_submission.pdf',
            submittedAt: new Date().toLocaleString('en-US', { hour12: false })
          };
        }
        return a;
      })
    );
  };

  const createAssignment = async (data: Partial<Assignment>) => {
    try {
      const res = await fetch('/api/assignments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const resData = await res.json();
      if (resData.success && resData.assignments) {
        setAssignments(resData.assignments);
        return;
      }
    } catch (e) {
      // fallback
    }

    const newAsg: Assignment = {
      id: `asg_${Date.now()}`,
      subjectCode: data.subjectCode || 'CS501',
      subjectName: data.subjectName || 'Algorithms',
      title: data.title || 'New Assignment',
      description: data.description || '',
      assignedDate: new Date().toISOString().split('T')[0],
      dueDate: data.dueDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      maxMarks: data.maxMarks || 10,
      status: 'pending'
    };
    setAssignments(prev => [newAsg, ...prev]);
  };

  const gradeAssignment = async (assignmentId: string, marksObtained: number, feedback: string) => {
    try {
      const res = await fetch('/api/assignments/grade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignmentId, marksObtained, feedback })
      });
      const data = await res.json();
      if (data.success && data.assignments) {
        setAssignments(data.assignments);
        return;
      }
    } catch (e) {
      // fallback
    }

    setAssignments(prev =>
      prev.map(a => (a.id === assignmentId ? { ...a, status: 'graded', obtainedMarks: marksObtained, feedback } : a))
    );
  };

  const applyLeave = async (leaveData: Partial<LeaveApplication>) => {
    try {
      const res = await fetch('/api/leaves', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...leaveData,
          studentName: currentUser?.name || 'Aarav Sharma',
          rollNumber: currentUser?.rollNumber || 'CS2023041'
        })
      });
      const data = await res.json();
      if (data.success && data.leaves) {
        setLeaves(data.leaves);
        return;
      }
    } catch (e) {
      // fallback
    }

    const newLeave: LeaveApplication = {
      id: `lv_${Date.now()}`,
      studentId: currentUser?.id || 'usr_stu_1',
      studentName: currentUser?.name || 'Aarav Sharma',
      rollNumber: currentUser?.rollNumber || 'CS2023041',
      department: currentUser?.department || 'Computer Science & Engineering',
      startDate: leaveData.startDate || new Date().toISOString().split('T')[0],
      endDate: leaveData.endDate || new Date().toISOString().split('T')[0],
      totalDays: leaveData.totalDays || 1,
      type: leaveData.type || 'Medical',
      reason: leaveData.reason || '',
      status: 'pending',
      appliedAt: new Date().toLocaleString('en-US', { hour12: false })
    };
    setLeaves(prev => [newLeave, ...prev]);
  };

  const reviewLeave = async (leaveId: string, status: 'approved' | 'rejected', notes?: string) => {
    try {
      const res = await fetch(`/api/leaves/${leaveId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, reviewNotes: notes, reviewedBy: currentUser?.name || 'Prof. Sunita Rao' })
      });
      const data = await res.json();
      if (data.success && data.leaves) {
        setLeaves(data.leaves);
        return;
      }
    } catch (e) {
      // fallback
    }

    setLeaves(prev =>
      prev.map(l =>
        l.id === leaveId
          ? {
              ...l,
              status,
              reviewNotes: notes,
              reviewedBy: currentUser?.name || 'Prof. Sunita Rao',
              reviewedAt: new Date().toLocaleString('en-US', { hour12: false })
            }
          : l
      )
    );
  };

  const payFee = async (amount: number, method: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/fees/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, method })
      });
      const data = await res.json();
      if (data.success && data.fees) {
        setFees(data.fees);
        return true;
      }
    } catch (e) {
      // fallback
    }

    setFees(prev => {
      const newPaid = prev.paidAmount + amount;
      const newDue = Math.max(0, prev.totalFee - newPaid);
      return {
        ...prev,
        paidAmount: newPaid,
        dueAmount: newDue,
        status: newDue === 0 ? 'Paid' : 'Partial',
        transactions: [
          {
            id: `tx_${Date.now()}`,
            amount,
            date: new Date().toISOString().split('T')[0],
            method,
            receiptNumber: `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
            status: 'Success'
          },
          ...prev.transactions
        ]
      };
    });
    return true;
  };

  const toggleRoomOccupancy = async (roomId: string, activity?: string) => {
    try {
      const res = await fetch(`/api/rooms/${roomId}/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activity })
      });
      const data = await res.json();
      if (data.success && data.rooms) {
        setRooms(data.rooms);
        return;
      }
    } catch (e) {
      // fallback
    }

    setRooms(prev =>
      prev.map(r => {
        if (r.id === roomId) {
          const occ = !r.isOccupied;
          return {
            ...r,
            isOccupied: occ,
            currentActivity: occ ? activity || 'Special Lecture Session' : undefined,
            nextFreeTime: occ ? '04:30 PM' : 'Available Now'
          };
        }
        return r;
      })
    );
  };

  const markNoticeRead = async (noticeId: string) => {
    setNotices(prev => prev.map(n => (n.id === noticeId ? { ...n, read: true } : n)));
    try {
      await fetch(`/api/notices/${noticeId}/read`, { method: 'POST' });
    } catch (e) {
      // ignore
    }
  };

  const addNotice = async (noticeData: Partial<Notice>) => {
    try {
      const res = await fetch('/api/notices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...noticeData,
          postedBy: currentUser?.name || 'Academic Office'
        })
      });
      const data = await res.json();
      if (data.success && data.notices) {
        setNotices(data.notices);
        return;
      }
    } catch (e) {
      // fallback
    }

    const newN: Notice = {
      id: `not_${Date.now()}`,
      title: noticeData.title || 'Notice',
      content: noticeData.content || '',
      category: noticeData.category || 'General',
      postedBy: currentUser?.name || 'Dean of Academic Affairs',
      date: new Date().toISOString().split('T')[0],
      priority: noticeData.priority || 'normal',
      targetRoles: ['student', 'faculty', 'parent'],
      read: false
    };
    setNotices(prev => [newN, ...prev]);
  };

  const updateStudyPlanSlot = (dayIndex: number, slotIndex: number, completed: boolean) => {
    setStudyPlan(prev => {
      const copy = [...prev];
      if (copy[dayIndex] && copy[dayIndex].slots[slotIndex]) {
        copy[dayIndex].slots[slotIndex].completed = completed;
      }
      return copy;
    });
  };

  const regenerateStudyPlan = async (dailyHours: number) => {
    try {
      const res = await fetch('/api/ai/planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dailyHours })
      });
      const data = await res.json();
      if (data.success && data.studyPlan) {
        setStudyPlan(data.studyPlan);
        return;
      }
    } catch (e) {
      // fallback
    }
  };

  const unreadNoticesCount = notices.filter(n => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        currentUser,
        activeRole,
        activeTab,
        theme,
        attendance,
        marks,
        results,
        timetable,
        exams,
        assignments,
        notices,
        leaves,
        fees,
        rooms,
        studyPlan,
        unreadNoticesCount,
        setActiveTab,
        toggleTheme,
        loginAs,
        loginWithEmail,
        logout,
        markAttendance,
        updateMarks,
        submitAssignment,
        createAssignment,
        gradeAssignment,
        applyLeave,
        reviewLeave,
        payFee,
        toggleRoomOccupancy,
        markNoticeRead,
        addNotice,
        updateStudyPlanSlot,
        regenerateStudyPlan
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
