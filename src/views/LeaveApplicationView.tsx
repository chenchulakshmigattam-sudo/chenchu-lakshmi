import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FileText,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  PlusCircle,
  Upload,
  AlertCircle,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const LeaveApplicationView: React.FC = () => {
  const { leaves, applyLeave, reviewLeave, currentUser, activeRole } = useApp();

  const [showApplyModal, setShowApplyModal] = useState(false);
  const [leaveType, setLeaveType] = useState<'Medical' | 'Academic' | 'Personal' | 'Duty Leave'>('Medical');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [reason, setReason] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsApplying(true);

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    await applyLeave({
      type: leaveType,
      startDate,
      endDate,
      totalDays: days,
      reason
    });

    setIsApplying(false);
    setShowApplyModal(false);
    setReason('');
    setAppliedSuccess(true);
    setTimeout(() => setAppliedSuccess(false), 4000);

    try {
      confetti({ particleCount: 50, spread: 50, origin: { y: 0.7 } });
    } catch (e) {}
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Leave Applications & Condonation</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
              Official Workflow
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Apply for medical leaves, hackathon duty exemptions, and track faculty review endorsements.
          </p>
        </div>

        <button
          onClick={() => setShowApplyModal(true)}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" /> Submit New Leave Request
        </button>
      </div>

      {appliedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>
            <strong>Application Submitted!</strong> Forwarded to Faculty Advisor Prof. Sunita Rao for attendance condonation review.
          </span>
        </div>
      )}

      {/* Info Card on Attendance Condonation */}
      <div className="p-5 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4" /> University Regulation on Leave Condonation
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          Approved Medical and Duty Leaves (inter-collegiate events, hackathons, sports) are counted toward authorized condonation of up to 10% attendance shortage under University Academic Code Rule 14.
        </p>
      </div>

      {/* Leave Applications History */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">Application Ledger & Status</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {leaves.map(lv => (
            <div
              key={lv.id}
              className={`p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 transition-all shadow-sm space-y-4 flex flex-col justify-between ${
                lv.status === 'approved'
                  ? 'border-emerald-300 dark:border-emerald-900/80'
                  : lv.status === 'rejected'
                  ? 'border-rose-300 dark:border-rose-900/80'
                  : 'border-amber-300 dark:border-amber-800/80'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-mono text-xs font-bold text-slate-400">
                      ID: {lv.id} • {lv.totalDays} Day(s)
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                      {lv.type} Leave
                    </h3>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                      lv.status === 'approved'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : lv.status === 'rejected'
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}
                  >
                    {lv.status}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 text-xs space-y-1">
                  <p className="text-slate-500">
                    Duration: <strong className="text-slate-800 dark:text-slate-200">{lv.startDate} to {lv.endDate}</strong>
                  </p>
                  <p className="text-slate-600 dark:text-slate-300 pt-1">
                    <strong>Reason:</strong> {lv.reason}
                  </p>
                </div>

                {lv.reviewNotes && (
                  <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-xs text-emerald-800 dark:text-emerald-200 space-y-0.5">
                    <p className="font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Reviewed by {lv.reviewedBy}
                    </p>
                    <p className="text-[11px] italic">"{lv.reviewNotes}"</p>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>Applied: {lv.appliedAt}</span>
                <span>Applicant: {lv.studentName}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Submit Leave Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl p-6 space-y-4 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Apply for Student Leave</h3>
              <button onClick={() => setShowApplyModal(false)} className="p-1 rounded text-slate-400">
                &times;
              </button>
            </div>

            <form onSubmit={handleApply} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Leave Category</label>
                <select
                  value={leaveType}
                  onChange={e => setLeaveType(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                >
                  <option value="Medical">Medical Leave (Requires Clinical Certificate)</option>
                  <option value="Academic">Academic Duty (Hackathon / Conference / Project)</option>
                  <option value="Duty Leave">Institutional Representation (Sports / Cultural)</option>
                  <option value="Personal">Personal / Family Emergency</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Detailed Reason & Proof Details
                </label>
                <textarea
                  rows={3}
                  required
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  placeholder="State clinical symptoms, hospital name, or conference registration ID..."
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div className="p-3 border-2 border-dashed rounded-xl text-center text-slate-500">
                <Upload className="w-5 h-5 mx-auto text-blue-500 mb-1" />
                <p className="text-[11px]">Upload Medical Certificate / Event Ticket (PDF / Image)</p>
                <span className="text-[10px] text-slate-400">Attached: verified_medical_slip.pdf</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="px-4 py-2 border rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isApplying}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl"
                >
                  {isApplying ? 'Submitting...' : 'Submit to Advisor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
