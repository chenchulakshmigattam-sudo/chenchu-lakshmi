import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Briefcase,
  CalendarCheck,
  FileSpreadsheet,
  BookOpenCheck,
  FileText,
  Bell,
  CheckCircle2,
  XCircle,
  PlusCircle,
  Users,
  AlertTriangle,
  Send,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const FacultyPortalView: React.FC = () => {
  const {
    currentUser,
    attendance,
    markAttendance,
    marks,
    updateMarks,
    assignments,
    createAssignment,
    leaves,
    reviewLeave,
    addNotice,
    setActiveTab
  } = useApp();

  const [activeTab, setActiveTabState] = useState<'attendance' | 'marks' | 'assignments' | 'leaves' | 'notices'>('attendance');

  // Attendance form
  const [attSubject, setAttSubject] = useState('CS501');
  const [attDate, setAttDate] = useState(new Date().toISOString().split('T')[0]);
  const [attTopic, setAttTopic] = useState('Graph Theory & Maximum Flow');
  const [attStatus, setAttStatus] = useState<'present' | 'absent'>('present');
  const [attSuccess, setAttSuccess] = useState(false);

  // Leave review notes
  const [leaveNotes, setLeaveNotes] = useState('Granted duty leave for representing institute at ICPC.');

  // Notice form
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeContent, setNoticeContent] = useState('');
  const [noticeCategory, setNoticeCategory] = useState<'Academic' | 'Exam' | 'Attendance' | 'Event'>('Academic');
  const [noticePriority, setNoticePriority] = useState<'normal' | 'high' | 'urgent'>('normal');
  const [noticeSuccess, setNoticeSuccess] = useState(false);

  const handleMarkAttendance = async (e: React.FormEvent) => {
    e.preventDefault();
    await markAttendance(attSubject, attStatus, attTopic);
    setAttSuccess(true);
    setTimeout(() => setAttSuccess(false), 3000);
  };

  const handlePublishNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    await addNotice({
      title: noticeTitle,
      content: noticeContent,
      category: noticeCategory,
      priority: noticePriority
    });
    setNoticeSuccess(true);
    setNoticeTitle('');
    setNoticeContent('');
    setTimeout(() => setNoticeSuccess(false), 3000);
    try {
      confetti({ particleCount: 50, spread: 50, origin: { y: 0.7 } });
    } catch (e) {}
  };

  const pendingLeaves = leaves.filter(l => l.status === 'pending');

  return (
    <div className="space-y-6 pb-12">
      {/* Faculty Hero Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-700 via-blue-800 to-slate-900 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold backdrop-blur-sm">
            <Briefcase className="w-4 h-4 text-indigo-300" /> Faculty Operations Workspace
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {currentUser?.name || 'Prof. Sunita Rao'}
          </h1>
          <p className="text-xs sm:text-sm text-indigo-100/90">
            {currentUser?.designation || 'Senior Associate Professor'} • {currentUser?.department || 'Computer Science & Engineering'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-white/20 text-xs font-bold backdrop-blur-sm">
            Assigned Courses: CS501 & CS506P
          </span>
        </div>
      </div>

      {/* Faculty Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveTabState('attendance')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'attendance'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
          }`}
        >
          <CalendarCheck className="w-4 h-4" /> Mark Attendance
        </button>

        <button
          onClick={() => setActiveTabState('marks')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'marks'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" /> Enter Internal Marks
        </button>

        <button
          onClick={() => setActiveTabState('leaves')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 relative ${
            activeTab === 'leaves'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" /> Review Leaves ({pendingLeaves.length})
          {pendingLeaves.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          )}
        </button>

        <button
          onClick={() => setActiveTabState('notices')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'notices'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
          }`}
        >
          <Bell className="w-4 h-4" /> Publish Circular
        </button>
      </div>

      {/* Tab 1: Attendance Register */}
      {activeTab === 'attendance' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Daily Attendance Register</h3>
                <p className="text-xs text-slate-500">Record attendance for today's session</p>
              </div>
              {attSuccess && (
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Saved & Synced!
                </span>
              )}
            </div>

            <form onSubmit={handleMarkAttendance} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Select Subject</label>
                <select
                  value={attSubject}
                  onChange={e => setAttSubject(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                >
                  <option value="CS501">CS501 - Design & Analysis of Algorithms</option>
                  <option value="CS506P">CS506P - Cloud & AI Systems Lab</option>
                  <option value="CS503">CS503 - Machine Learning</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Date</label>
                <input
                  type="date"
                  value={attDate}
                  onChange={e => setAttDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Topic Covered</label>
                <input
                  type="text"
                  required
                  value={attTopic}
                  onChange={e => setAttTopic(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              {/* Aarav Sharma quick roll check */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">Aarav Sharma (Roll: CS2023041)</p>
                    <p className="text-[11px] text-slate-500">B.Tech CSE - Section A</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setAttStatus('present')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        attStatus === 'present' ? 'bg-emerald-600 text-white' : 'bg-white border text-slate-600'
                      }`}
                    >
                      Present
                    </button>
                    <button
                      type="button"
                      onClick={() => setAttStatus('absent')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        attStatus === 'absent' ? 'bg-rose-600 text-white' : 'bg-white border text-slate-600'
                      }`}
                    >
                      Absent
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md"
              >
                Submit Attendance to Ledger
              </button>
            </form>
          </div>

          <div className="lg:col-span-6 p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Department Attendance Health (Section A)
            </h3>

            <div className="space-y-3">
              {attendance.map(a => (
                <div key={a.subjectCode} className="p-3 rounded-2xl bg-slate-800/80 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="font-bold">{a.subjectName}</span>
                    <span
                      className={`font-mono font-bold ${
                        a.percentage < 75 ? 'text-rose-400' : 'text-emerald-400'
                      }`}
                    >
                      {a.percentage}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-700 overflow-hidden">
                    <div
                      className={`h-full ${a.percentage < 75 ? 'bg-rose-500' : 'bg-blue-500'}`}
                      style={{ width: `${a.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Marks Entry */}
      {activeTab === 'marks' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Internal Marks Entry Desk</h3>
              <p className="text-xs text-slate-500">Edit scores for continuous internal assessment</p>
            </div>
            <button
              onClick={() => setActiveTab('marks-results')}
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              Open Full Marks View &rarr;
            </button>
          </div>

          <div className="space-y-3">
            {marks.map(m => (
              <div
                key={m.subjectCode}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <span className="font-mono text-[10px] text-slate-400">{m.subjectCode}</span>
                  <h4 className="font-bold text-slate-900 dark:text-white">{m.subjectName}</h4>
                  <p className="text-slate-500 text-[11px]">Credits: {m.credits} • Est Grade: {m.estimatedGrade}</p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-blue-600 bg-blue-50 dark:bg-blue-950 px-2.5 py-1 rounded-lg">
                    {m.totalInternal} / 60 Marks
                  </span>
                  <button
                    onClick={() => setActiveTab('marks-results')}
                    className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 font-bold text-[11px]"
                  >
                    Edit Scores
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Leave Approval Queue */}
      {activeTab === 'leaves' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Student Leave Applications</h3>
              <p className="text-xs text-slate-500">Approve duty leaves, medical condonations, and academic exemptions</p>
            </div>
          </div>

          <div className="space-y-4">
            {leaves.map(lv => (
              <div
                key={lv.id}
                className="p-5 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/40 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white">{lv.studentName}</span>
                      <span className="font-mono text-xs text-slate-400">({lv.rollNumber})</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-100 text-blue-700">
                        {lv.type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                      <strong>Dates:</strong> {lv.startDate} to {lv.endDate} ({lv.totalDays} Days)
                    </p>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                      lv.status === 'approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : lv.status === 'rejected'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800 animate-pulse'
                    }`}
                  >
                    {lv.status}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 text-xs text-slate-600 dark:text-slate-300">
                  <p><strong>Reason stated:</strong> {lv.reason}</p>
                  {lv.reviewNotes && (
                    <p className="mt-1 text-emerald-700 dark:text-emerald-300 font-medium">
                      <strong>Faculty Endorsement:</strong> {lv.reviewNotes}
                    </p>
                  )}
                </div>

                {lv.status === 'pending' && (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                    <input
                      type="text"
                      value={leaveNotes}
                      onChange={e => setLeaveNotes(e.target.value)}
                      placeholder="Add faculty remarks or condonation notes..."
                      className="flex-1 text-xs p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => reviewLeave(lv.id, 'approved', leaveNotes)}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Approve Leave
                      </button>
                      <button
                        onClick={() => reviewLeave(lv.id, 'rejected', 'Insufficient attendance buffer')}
                        className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow flex items-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Reject
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Notice Publisher */}
      {activeTab === 'notices' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Publish Course Circular or Notice</h3>
              <p className="text-xs text-slate-500">Broadcast updates directly to student & parent notification centers</p>
            </div>
            {noticeSuccess && (
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                Circular Broadcasted!
              </span>
            )}
          </div>

          <form onSubmit={handlePublishNotice} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Notice Title</label>
                <input
                  type="text"
                  required
                  value={noticeTitle}
                  onChange={e => setNoticeTitle(e.target.value)}
                  placeholder="e.g. Mandatory Lab Test Announcement"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                  <select
                    value={noticeCategory}
                    onChange={e => setNoticeCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="Academic">Academic</option>
                    <option value="Exam">Exam</option>
                    <option value="Attendance">Attendance</option>
                    <option value="Event">Event</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Priority</label>
                  <select
                    value={noticePriority}
                    onChange={e => setNoticePriority(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Notice Content</label>
              <textarea
                rows={4}
                required
                value={noticeContent}
                onChange={e => setNoticeContent(e.target.value)}
                placeholder="Write circular details, dates, and requirements..."
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" /> Broadcast Notice to All Students & Parents
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
