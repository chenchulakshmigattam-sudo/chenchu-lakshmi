import React from 'react';
import { useApp } from '../context/AppContext';
import {
  GraduationCap,
  CalendarCheck,
  TrendingUp,
  AlertTriangle,
  Clock,
  BookOpenCheck,
  CreditCard,
  Bot,
  BrainCircuit,
  ArrowRight,
  CheckCircle2,
  Calendar,
  MapPin,
  Sparkles,
  FileText
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const {
    currentUser,
    attendance,
    marks,
    timetable,
    exams,
    assignments,
    fees,
    setActiveTab
  } = useApp();

  // Overall attendance calculation
  const totalClassesSum = attendance.reduce((acc, curr) => acc + curr.totalClasses, 0);
  const attendedClassesSum = attendance.reduce((acc, curr) => acc + curr.attendedClasses, 0);
  const overallPct = totalClassesSum > 0 ? parseFloat(((attendedClassesSum / totalClassesSum) * 100).toFixed(1)) : 0;

  // Subjects at risk (< 75%)
  const atRiskSubjects = attendance.filter(a => a.percentage < 75);

  // Today's classes (simulate Wednesday / schedule)
  const todayClasses = timetable.filter(t => t.day === 'Wednesday');

  // Pending assignments
  const pendingAssignments = assignments.filter(a => a.status === 'pending');

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800 text-white p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/15 text-blue-100 text-xs font-semibold backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Fall 2026 Academic Session • Active
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {currentUser?.name || 'Aarav Sharma'}! 👋
            </h1>
            <p className="text-xs sm:text-sm text-blue-100/90 max-w-xl">
              Roll No: <span className="font-mono font-bold">{currentUser?.rollNumber || 'CS2023041'}</span> • B.Tech Computer Science (Sem 5, Sec A) • Faculty Advisor: Prof. Sunita Rao
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('ai-chatbot')}
              className="px-4 py-2.5 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <Bot className="w-4 h-4 text-blue-600" /> Ask AI Companion
            </button>
            <button
              onClick={() => setActiveTab('smart-study-planner')}
              className="px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-semibold text-xs backdrop-blur-md transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300" /> Smart Planner
            </button>
          </div>
        </div>
      </div>

      {/* Critical Shortfall Warning Banner if any subject < 75% */}
      {atRiskSubjects.length > 0 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-rose-50 border-2 border-rose-300 dark:bg-rose-950/40 dark:border-rose-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500 text-white flex-shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-rose-900 dark:text-rose-200">
                Attendance Shortfall Warning: {atRiskSubjects.map(s => `${s.subjectName} (${s.percentage}%)`).join(', ')}
              </h3>
              <p className="text-xs text-rose-700 dark:text-rose-300 mt-0.5">
                University regulation mandates 75% minimum attendance to sit for semester examinations. You need to attend the next 10 consecutive classes in Machine Learning.
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('ai-attendance-predictor')}
            className="flex-shrink-0 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20 transition-all flex items-center gap-1.5"
          >
            <BrainCircuit className="w-4 h-4" /> Run AI Predictor
          </button>
        </div>
      )}

      {/* 4 Metric Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Attendance Meter */}
        <div
          onClick={() => setActiveTab('attendance')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 transition-all cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Attendance</span>
            <div className="p-2 rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{overallPct}%</span>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Overall Safe
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Attended {attendedClassesSum} / {totalClassesSum} classes
            </p>
            {/* Visual Bar */}
            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 mt-3 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  overallPct >= 75 ? 'bg-blue-600' : 'bg-rose-500'
                }`}
                style={{ width: `${Math.min(100, overallPct)}%` }}
              />
            </div>
          </div>
        </div>

        {/* CGPA */}
        <div
          onClick={() => setActiveTab('marks-results')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 transition-all cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Cumulative CGPA</span>
            <div className="p-2 rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white">8.74</span>
              <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">/ 10.0</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Sem 4 SGPA: 8.82 • 86 Credits Earned
            </p>
            <div className="mt-3 flex items-center justify-between text-[11px] text-purple-600 dark:text-purple-400 font-semibold">
              <span>Forecast Semester 5</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

        {/* Assignments Due */}
        <div
          onClick={() => setActiveTab('assignments')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 transition-all cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Pending Tasks</span>
            <div className="p-2 rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400">
              <BookOpenCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{pendingAssignments.length}</span>
              <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">Assignments Due</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate">
              Next: Algorithms PS4 (Due Oct 15)
            </p>
            <div className="mt-3 flex items-center justify-between text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
              <span>Submit Solution</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

        {/* Fee Status */}
        <div
          onClick={() => setActiveTab('fees-ledger')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 transition-all cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Tuition Fee Due</span>
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                ₹{fees.dueAmount.toLocaleString()}
              </span>
              <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">Due Oct 31</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Paid: ₹{fees.paidAmount.toLocaleString()} / ₹{fees.totalFee.toLocaleString()}
            </p>
            <div className="mt-3 flex items-center justify-between text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
              <span>View Receipt Ledger</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Today's Schedule & Subjects Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Today's Timetable & Upcoming Exams */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Classes */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" /> Today's Class Schedule (Wednesday)
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">4 lecture and laboratory sessions scheduled</p>
              </div>
              <button
                onClick={() => setActiveTab('timetable-exams')}
                className="text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
              >
                Full Week
              </button>
            </div>

            <div className="space-y-3">
              {todayClasses.map((slot, index) => (
                <div
                  key={slot.id}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-blue-300 dark:hover:border-blue-700 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 text-xs font-bold flex items-center justify-center flex-shrink-0">
                      P{slot.period}
                    </span>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                        {slot.subjectName} ({slot.subjectCode})
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {slot.faculty} • <span className="font-semibold text-blue-600 dark:text-blue-400">{slot.room}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 text-xs">
                    <span className="font-mono text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 font-semibold">
                      {slot.time}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        slot.type === 'lab'
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                          : slot.type === 'tutorial'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}
                    >
                      {slot.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Examinations Countdown */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-purple-600" /> Upcoming Mid-Semester II Exams (Nov 2026)
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Starting in 21 days • Hall ticket issued</p>
              </div>
              <button
                onClick={() => setActiveTab('timetable-exams')}
                className="text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
              >
                View Hall Ticket
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {exams.slice(0, 4).map(exam => (
                <div
                  key={exam.id}
                  className="p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                      {exam.subjectName}
                    </span>
                    <span className="text-[10px] font-mono bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 px-1.5 py-0.5 rounded font-bold">
                      {exam.subjectCode}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
                    <p className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-blue-500" /> {exam.date} • {exam.time}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" /> {exam.room} • Seat {exam.seatNumber}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Subject-wise Attendance & Quick Actions */}
        <div className="space-y-6">
          {/* Subject Attendance Card */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Attendance by Course</h2>
              <button
                onClick={() => setActiveTab('attendance')}
                className="text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
              >
                Details
              </button>
            </div>

            <div className="space-y-3">
              {attendance.map(item => (
                <div key={item.subjectCode} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[170px]">
                      {item.subjectName}
                    </span>
                    <span
                      className={`font-mono font-bold ${
                        item.percentage < 75
                          ? 'text-rose-600 dark:text-rose-400'
                          : item.percentage < 80
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-blue-600 dark:text-blue-400'
                      }`}
                    >
                      {item.percentage}%
                    </span>
                  </div>

                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        item.percentage < 75
                          ? 'bg-rose-500'
                          : item.percentage < 80
                          ? 'bg-amber-500'
                          : 'bg-blue-600'
                      }`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>{item.attendedClasses} / {item.totalClasses} attended</span>
                    {item.percentage < 75 ? (
                      <span className="text-rose-600 dark:text-rose-400 font-bold">Needs +10 classes</span>
                    ) : (
                      <span className="text-slate-400">{item.room}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setActiveTab('ai-attendance-predictor')}
              className="w-full py-2.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-950/50 dark:text-blue-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <BrainCircuit className="w-3.5 h-3.5" /> Open Attendance Forecaster
            </button>
          </div>

          {/* Quick Shortcuts */}
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Instant Student Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setActiveTab('leave-applications')}
                className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-left transition-colors flex flex-col justify-between"
              >
                <FileText className="w-4 h-4 text-emerald-400 mb-1" />
                <span className="text-xs font-bold">Apply Leave</span>
                <span className="text-[10px] text-slate-400">Duty / Medical</span>
              </button>
              <button
                onClick={() => setActiveTab('campus-map')}
                className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-left transition-colors flex flex-col justify-between"
              >
                <MapPin className="w-4 h-4 text-cyan-400 mb-1" />
                <span className="text-xs font-bold">Find Free Room</span>
                <span className="text-[10px] text-slate-400">Live Campus Map</span>
              </button>
              <button
                onClick={() => setActiveTab('ai-cgpa-predictor')}
                className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-left transition-colors flex flex-col justify-between"
              >
                <TrendingUp className="w-4 h-4 text-purple-400 mb-1" />
                <span className="text-xs font-bold">CGPA Goal</span>
                <span className="text-[10px] text-slate-400">Grade Solver</span>
              </button>
              <button
                onClick={() => setActiveTab('assignments')}
                className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-left transition-colors flex flex-col justify-between"
              >
                <BookOpenCheck className="w-4 h-4 text-amber-400 mb-1" />
                <span className="text-xs font-bold">Assignments</span>
                <span className="text-[10px] text-slate-400">2 Pending</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
