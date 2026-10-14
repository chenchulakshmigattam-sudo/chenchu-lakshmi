import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Clock,
  Calendar,
  MapPin,
  User,
  Download,
  CheckCircle2,
  AlertCircle,
  FileText,
  Printer,
  X,
  Compass
} from 'lucide-react';

export const TimetableExamsView: React.FC = () => {
  const { timetable, exams } = useApp();
  const [selectedDay, setSelectedDay] = useState<string>('Monday');
  const [activeTab, setActiveTabState] = useState<'timetable' | 'exams'>('timetable');
  const [showHallTicketModal, setShowHallTicketModal] = useState(false);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const currentDaySlots = timetable.filter(s => s.day === selectedDay).sort((a, b) => a.period - b.period);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Timetable & Examination Schedule</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
              Odd Semester 2026
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Weekly class schedule, classroom allocations, examination dates, and seating slips.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowHallTicketModal(true)}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-500/20 transition-all flex items-center gap-2"
          >
            <FileText className="w-4 h-4" /> Digital Hall Ticket
          </button>
        </div>
      </div>

      {/* Main Mode Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveTabState('timetable')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'timetable'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
          }`}
        >
          <Clock className="w-4 h-4" /> Weekly Class Timetable
        </button>
        <button
          onClick={() => setActiveTabState('exams')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'exams'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" /> Examination Date Sheet & Seating ({exams.length})
        </button>
      </div>

      {/* Timetable Tab Content */}
      {activeTab === 'timetable' && (
        <div className="space-y-5">
          {/* Day Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {days.map(d => (
              <button
                key={d}
                onClick={() => setSelectedDay(d)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedDay === d
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          {/* Period Timeline Cards */}
          <div className="space-y-3">
            {currentDaySlots.map(slot => (
              <div
                key={slot.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 flex flex-col items-center justify-center font-extrabold flex-shrink-0">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Period</span>
                    <span className="text-base">{slot.period}</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-400">{slot.subjectCode}</span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
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

                    <h3 className="text-base font-bold text-slate-900 dark:text-white">{slot.subjectName}</h3>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-0.5">
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-blue-500" /> {slot.faculty}
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                        <MapPin className="w-3.5 h-3.5 text-rose-500" /> {slot.room}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-3 text-xs border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 dark:border-slate-800">
                  <div className="font-mono font-bold text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-blue-600" /> {slot.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Exams Tab Content */}
      {activeTab === 'exams' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 dark:bg-purple-950/40 dark:border-purple-900 flex items-center justify-between text-xs text-purple-900 dark:text-purple-200">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-600" />
              <span>
                <strong>Mid-Semester Exam Window:</strong> November 04, 2026 – November 16, 2026. Reporting time: 09:30 AM.
              </span>
            </div>
            <button
              onClick={() => setShowHallTicketModal(true)}
              className="text-xs font-bold text-purple-700 dark:text-purple-300 underline"
            >
              Verify Seating Slip
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {exams.map((exam, idx) => (
              <div
                key={exam.id}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-mono text-xs font-bold text-purple-600 dark:text-purple-400">
                        Paper {idx + 1} • {exam.subjectCode}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">{exam.subjectName}</h3>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                      Seat: {exam.seatNumber}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Exam Date</span>
                      <p className="font-bold text-slate-800 dark:text-slate-200">{exam.date}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Timing</span>
                      <p className="font-bold text-slate-800 dark:text-slate-200">{exam.time}</p>
                    </div>
                    <div className="col-span-2 pt-1 border-t border-slate-200/40 dark:border-slate-700">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Examination Hall</span>
                      <p className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-rose-500" /> {exam.room}
                      </p>
                    </div>
                  </div>

                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-bold text-slate-700 dark:text-slate-300">Syllabus Scope:</span>
                    <p className="mt-0.5 text-[11px] leading-relaxed">{exam.syllabus}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold">
                  <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Hall Ticket Verified
                  </span>
                  <span className="text-slate-400 font-mono">{exam.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Digital Hall Ticket Modal */}
      {showHallTicketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white text-slate-900 w-full max-w-xl rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b pb-4">
              <div>
                <h2 className="text-lg font-extrabold">DIGITAL EXAMINATION HALL TICKET</h2>
                <p className="text-xs text-slate-500">APEX INSTITUTE OF TECHNOLOGY & SCIENCE • AUTONOMOUS</p>
              </div>
              <button
                onClick={() => setShowHallTicketModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Candidate Name</span>
                <p className="font-bold">Aarav Sharma</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Roll Number</span>
                <p className="font-mono font-bold">CS2023041</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Course</span>
                <p className="font-bold">B.Tech CSE - Sem 5</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Controller Auth</span>
                <p className="font-bold text-emerald-600">VALIDATED</p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider">Permitted Papers & Seating</h4>
              <div className="divide-y text-xs border rounded-2xl overflow-hidden">
                {exams.map(e => (
                  <div key={e.id} className="p-2.5 flex items-center justify-between bg-white hover:bg-slate-50">
                    <div>
                      <span className="font-bold">{e.subjectName}</span>
                      <span className="text-slate-400 ml-1">({e.subjectCode})</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-blue-600">{e.date}</span>
                      <p className="text-[10px] text-slate-500">{e.room} | Seat {e.seatNumber}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold hover:bg-slate-50 flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" /> Print Hall Ticket
              </button>
              <button
                onClick={() => setShowHallTicketModal(false)}
                className="px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
