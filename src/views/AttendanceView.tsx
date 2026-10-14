import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  CalendarCheck,
  AlertTriangle,
  CheckCircle2,
  BrainCircuit,
  History,
  Clock,
  Filter,
  Users,
  PlusCircle,
  X,
  Sparkles
} from 'lucide-react';
import { SubjectAttendance } from '../types';

export const AttendanceView: React.FC = () => {
  const { attendance, markAttendance, activeRole, setActiveTab } = useApp();
  const [selectedSubject, setSelectedSubject] = useState<SubjectAttendance | null>(null);
  const [showLogModal, setShowLogModal] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'critical' | 'safe'>('all');

  // Faculty marking state
  const [markingSubject, setMarkingSubject] = useState('CS501');
  const [markingDate, setMarkingDate] = useState(new Date().toISOString().split('T')[0]);
  const [topicCovered, setTopicCovered] = useState('Dynamic Programming & Graph Theory');
  const [studentStatus, setStudentStatus] = useState<'present' | 'absent'>('present');
  const [markingSuccess, setMarkingSuccess] = useState(false);

  // Overall attendance calculation
  const totalClassesSum = attendance.reduce((acc, curr) => acc + curr.totalClasses, 0);
  const attendedClassesSum = attendance.reduce((acc, curr) => acc + curr.attendedClasses, 0);
  const overallPct = totalClassesSum > 0 ? parseFloat(((attendedClassesSum / totalClassesSum) * 100).toFixed(1)) : 0;

  const filteredAttendance = attendance.filter(item => {
    if (filterType === 'critical') return item.percentage < 75;
    if (filterType === 'safe') return item.percentage >= 75;
    return true;
  });

  const handleFacultySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await markAttendance(markingSubject, studentStatus, topicCovered);
    setMarkingSuccess(true);
    setTimeout(() => setMarkingSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Attendance Management</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
              Min 75% Rule
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time biometric & faculty ledger updates with predictive shortage forecasting.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('ai-attendance-predictor')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center gap-2"
          >
            <BrainCircuit className="w-4 h-4" /> AI Attendance Predictor
          </button>
        </div>
      </div>

      {/* Aggregate Overview Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="md:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Semester 5 Cumulative Attendance</p>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">{overallPct}%</span>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    overallPct >= 75
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                  }`}
                >
                  {overallPct >= 75 ? 'Above 75% Threshold' : 'Critical Shortfall Risk'}
                </span>
              </div>
            </div>
            <div className="text-right text-xs text-slate-500 dark:text-slate-400">
              <p className="font-semibold text-slate-800 dark:text-slate-200">{attendedClassesSum} Attended</p>
              <p>{totalClassesSum} Total Classes Conducted</p>
            </div>
          </div>

          <div className="mt-4 space-y-1.5">
            <div className="flex justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              <span>0%</span>
              <span className="text-rose-600 font-bold">75% Mandatory Condonation Line</span>
              <span>100%</span>
            </div>
            <div className="relative w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  overallPct >= 75 ? 'bg-blue-600' : 'bg-rose-500'
                }`}
                style={{ width: `${Math.min(100, overallPct)}%` }}
              />
              {/* 75% marker marker */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-rose-500/80 z-10"
                style={{ left: '75%' }}
                title="75% Mandatory Threshold"
              />
            </div>
          </div>
        </div>

        {/* Condonation & Policy Card */}
        <div className="p-5 rounded-3xl bg-slate-900 text-white border border-slate-800 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">University Attendance Policy</span>
            <h3 className="text-sm font-bold mt-1">Rule 14(b) - Examination Eligibility</h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Students must maintain &ge; 75% in each individual theory & lab course. Shortfalls between 65%-74% require Dean approval via medical or academic duty leave certification.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('leave-applications')}
            className="mt-4 text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1.5"
          >
            Submit Medical Condonation Leave &rarr;
          </button>
        </div>
      </div>

      {/* Faculty Attendance Marking Sheet (Visible for faculty or when selected) */}
      {(activeRole === 'faculty' || activeRole === 'admin') && (
        <div className="p-6 rounded-3xl bg-indigo-50/70 border-2 border-indigo-200 dark:bg-indigo-950/30 dark:border-indigo-900 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-indigo-600 text-white">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-indigo-950 dark:text-indigo-200">
                  Faculty Quick Register: Mark Class Attendance
                </h3>
                <p className="text-xs text-indigo-700 dark:text-indigo-300">
                  Faculty mode enabled: Select subject, date, and record Aarav Sharma's attendance
                </p>
              </div>
            </div>
            {markingSuccess && (
              <span className="px-3 py-1 text-xs font-bold bg-emerald-600 text-white rounded-lg animate-in fade-in flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Attendance Saved!
              </span>
            )}
          </div>

          <form onSubmit={handleFacultySubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Subject</label>
              <select
                value={markingSubject}
                onChange={e => setMarkingSubject(e.target.value)}
                className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
              >
                {attendance.map(a => (
                  <option key={a.subjectCode} value={a.subjectCode}>
                    {a.subjectCode} - {a.subjectName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Session Date</label>
              <input
                type="date"
                value={markingDate}
                onChange={e => setMarkingDate(e.target.value)}
                className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Topic Covered</label>
              <input
                type="text"
                value={topicCovered}
                onChange={e => setTopicCovered(e.target.value)}
                placeholder="e.g. Backpropagation Math"
                className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Status for Aarav Sharma</label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setStudentStatus('present')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                    studentStatus === 'present'
                      ? 'bg-emerald-600 text-white shadow'
                      : 'bg-white dark:bg-slate-900 text-slate-600 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  Present
                </button>
                <button
                  type="button"
                  onClick={() => setStudentStatus('absent')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                    studentStatus === 'absent'
                      ? 'bg-rose-600 text-white shadow'
                      : 'bg-white dark:bg-slate-900 text-slate-600 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  Absent
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1"
                >
                  Save
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterType === 'all'
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
            }`}
          >
            All Courses ({attendance.length})
          </button>
          <button
            onClick={() => setFilterType('critical')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterType === 'critical'
                ? 'bg-rose-600 text-white'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
            }`}
          >
            Shortage Risk &lt;75% ({attendance.filter(a => a.percentage < 75).length})
          </button>
          <button
            onClick={() => setFilterType('safe')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterType === 'safe'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
            }`}
          >
            Safe &ge;75% ({attendance.filter(a => a.percentage >= 75).length})
          </button>
        </div>
      </div>

      {/* Subject Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredAttendance.map(subject => {
          const isAtRisk = subject.percentage < 75;
          const isBorderline = subject.percentage >= 75 && subject.percentage < 80;

          return (
            <div
              key={subject.subjectCode}
              className={`p-5 rounded-3xl bg-white dark:bg-slate-900 border-2 transition-all hover:shadow-lg flex flex-col justify-between ${
                isAtRisk
                  ? 'border-rose-400/80 bg-rose-50/20 dark:bg-rose-950/10'
                  : isBorderline
                  ? 'border-amber-300 dark:border-amber-800'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-mono text-[11px] font-bold text-slate-500 dark:text-slate-400">
                      {subject.subjectCode} • {subject.credits} Credits
                    </span>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white mt-0.5 line-clamp-1">
                      {subject.subjectName}
                    </h3>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-extrabold ${
                      isAtRisk
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                        : isBorderline
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                    }`}
                  >
                    {subject.percentage}%
                  </span>
                </div>

                <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
                  <p>Instructor: <span className="font-semibold text-slate-700 dark:text-slate-200">{subject.facultyName}</span></p>
                  <p>Venue: <span className="font-mono font-semibold text-blue-600 dark:text-blue-400">{subject.room}</span></p>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                    <span>{subject.attendedClasses} attended</span>
                    <span>{subject.totalClasses} total</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isAtRisk ? 'bg-rose-500' : isBorderline ? 'bg-amber-500' : 'bg-blue-600'
                      }`}
                      style={{ width: `${subject.percentage}%` }}
                    />
                  </div>
                </div>

                {isAtRisk && (
                  <div className="p-2.5 rounded-xl bg-rose-100/70 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    <span>Must attend next <strong>10 classes</strong> without miss.</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => {
                    setSelectedSubject(subject);
                    setShowLogModal(true);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5"
                >
                  <History className="w-3.5 h-3.5" /> Class Logs ({subject.history.length})
                </button>

                <button
                  onClick={() => setActiveTab('ai-attendance-predictor')}
                  className="px-3 py-1.5 rounded-xl text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/40 text-xs font-bold flex items-center gap-1"
                >
                  <BrainCircuit className="w-3.5 h-3.5" /> Forecast &rarr;
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Class Log Modal */}
      {showLogModal && selectedSubject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  {selectedSubject.subjectName} ({selectedSubject.subjectCode})
                </h3>
                <p className="text-xs text-slate-500">Official Class-by-Class Attendance Ledger</p>
              </div>
              <button
                onClick={() => setShowLogModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto space-y-2.5 pr-1">
              {selectedSubject.history.map((hist, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{hist.date}</span>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">{hist.topicCovered}</p>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      hist.status === 'present'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                        : hist.status === 'leave'
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                    }`}
                  >
                    {hist.status}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <span>Overall Course Score: {selectedSubject.percentage}%</span>
              <button
                onClick={() => setShowLogModal(false)}
                className="px-4 py-2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-xl font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
