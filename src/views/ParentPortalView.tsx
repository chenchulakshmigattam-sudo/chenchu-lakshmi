import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  ShieldCheck,
  CalendarCheck,
  FileSpreadsheet,
  CreditCard,
  Bell,
  Clock,
  Phone,
  Mail,
  AlertTriangle,
  Download,
  CheckCircle2,
  ChevronRight,
  Printer,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ParentPortalView: React.FC = () => {
  const {
    currentUser,
    attendance,
    marks,
    fees,
    payFee,
    exams,
    notices,
    setActiveTab
  } = useApp();

  const [payAmount, setPayAmount] = useState<number>(fees.dueAmount || 24500);
  const [paymentMethod, setPaymentMethod] = useState<string>('UPI (Google Pay / PhonePe)');
  const [isProcessingPay, setIsProcessingPay] = useState<boolean>(false);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);

  // Overall attendance
  const totalClassesSum = attendance.reduce((acc, curr) => acc + curr.totalClasses, 0);
  const attendedClassesSum = attendance.reduce((acc, curr) => acc + curr.attendedClasses, 0);
  const overallPct = totalClassesSum > 0 ? parseFloat(((attendedClassesSum / totalClassesSum) * 100).toFixed(1)) : 0;
  const lowAttendanceSubjects = attendance.filter(a => a.percentage < 75);

  const handlePayFee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (payAmount <= 0) return;
    setIsProcessingPay(true);
    const ok = await payFee(payAmount, paymentMethod);
    setIsProcessingPay(false);
    if (ok) {
      setPaymentSuccess(true);
      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } catch (e) {}
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-700 via-teal-700 to-slate-900 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold backdrop-blur-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-300" /> Authorized Parent Portal • Secure Link
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Parent Oversight: Aarav Sharma
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90">
            Linked Ward: <strong>Aarav Sharma</strong> (Roll: CS2023041) • B.Tech Computer Science, Semester 5, Section A
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('fees-ledger')}
            className="px-4 py-2.5 rounded-xl bg-white text-emerald-800 hover:bg-emerald-50 font-bold text-xs shadow-md transition-all flex items-center gap-2"
          >
            <CreditCard className="w-4 h-4 text-emerald-700" /> Fee Ledger ({fees.status})
          </button>
        </div>
      </div>

      {/* Critical Attendance Alert for Parents */}
      {lowAttendanceSubjects.length > 0 && (
        <div className="p-5 rounded-3xl bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-300 dark:border-rose-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-rose-600 text-white flex-shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-rose-950 dark:text-rose-100">
                Attendance Shortfall Alert Sent to Parent: Machine Learning is at {lowAttendanceSubjects[0].percentage}%
              </h3>
              <p className="text-xs text-rose-700 dark:text-rose-300 mt-0.5">
                University regulation requires minimum 75% attendance. Aarav must attend 10 consecutive classes or produce medical certificate to avoid condonation fine.
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('ai-attendance-predictor')}
            className="flex-shrink-0 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
          >
            View Predictor
          </button>
        </div>
      )}

      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Attendance */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Verified Attendance</span>
            <CalendarCheck className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{overallPct}%</span>
            <span className="text-xs font-semibold text-slate-500">({attendedClassesSum}/{totalClassesSum} classes)</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full" style={{ width: `${overallPct}%` }} />
          </div>
        </div>

        {/* CGPA */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Academic Standing</span>
            <FileSpreadsheet className="w-4 h-4 text-purple-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">8.74</span>
            <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">Cumulative CGPA</span>
          </div>
          <p className="text-[11px] text-slate-500">First Class with Distinction (Rank Top 5%)</p>
        </div>

        {/* Pending Fee */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Balance Tuition Fee</span>
            <CreditCard className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              ₹{fees.dueAmount.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-amber-600">Due Oct 31</span>
          </div>
          <p className="text-[11px] text-slate-500">Paid so far: ₹{fees.paidAmount.toLocaleString()}</p>
        </div>
      </div>

      {/* Main Grid: Fee Payment Portal & Mentor Contact */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Fee Payment Gateway (7 Cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-600" /> Semester Fee Payment & Receipt Desk
              </h2>
              <span className="text-xs font-bold font-mono text-emerald-600">Secure 256-bit SSL</span>
            </div>
            <p className="text-xs text-slate-500">Instant digital receipts with official QR stamp</p>
          </div>

          {paymentSuccess ? (
            <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-3 animate-in fade-in">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="text-base font-bold text-emerald-900 dark:text-emerald-100">
                Payment of ₹{payAmount.toLocaleString()} Received Successfully!
              </h3>
              <p className="text-xs text-emerald-700 dark:text-emerald-300">
                Receipt Number: <strong>REC-2026-9821</strong> • Sent via SMS to +91 98765 43210
              </p>
              <button
                onClick={() => setPaymentSuccess(false)}
                className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
              >
                Make Another Payment
              </button>
            </div>
          ) : (
            <form onSubmit={handlePayFee} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border">
                <div>
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Tuition Fee</span>
                  <p className="font-bold text-slate-800 dark:text-slate-200">₹{fees.tuitionFee.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Laboratory & Computing</span>
                  <p className="font-bold text-slate-800 dark:text-slate-200">₹{fees.labFee.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Library & Digital Commons</span>
                  <p className="font-bold text-slate-800 dark:text-slate-200">₹{fees.libraryFee.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Total Semester Bill</span>
                  <p className="font-extrabold text-blue-600">₹{fees.totalFee.toLocaleString()}</p>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Payment Amount (₹)
                </label>
                <input
                  type="number"
                  required
                  min={100}
                  max={fees.dueAmount}
                  value={payAmount}
                  onChange={e => setPayAmount(parseFloat(e.target.value) || 0)}
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={e => setPaymentMethod(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium"
                >
                  <option value="UPI (Google Pay / PhonePe)">UPI (Google Pay / PhonePe / Paytm)</option>
                  <option value="Net Banking (HDFC / ICICI / SBI)">Net Banking (HDFC / ICICI / SBI)</option>
                  <option value="Debit / Credit Card">Debit / Credit Card (Visa / Mastercard / RuPay)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isProcessingPay || fees.dueAmount === 0}
                className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
              >
                {isProcessingPay ? 'Authorizing Bank...' : `Pay ₹${payAmount.toLocaleString()} Now`}
              </button>
            </form>
          )}

          {/* Past Transactions Ledger */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Fee Receipt Ledger</h4>
            <div className="divide-y text-xs border rounded-2xl overflow-hidden">
              {fees.transactions.map(tx => (
                <div key={tx.id} className="p-3 flex items-center justify-between bg-white dark:bg-slate-900">
                  <div>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{tx.receiptNumber}</span>
                    <p className="text-[11px] text-slate-400">{tx.date} • {tx.method}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-emerald-600">+₹{tx.amount.toLocaleString()}</span>
                    <span className="block text-[10px] text-emerald-700 dark:text-emerald-400 font-bold uppercase">PAID</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Faculty Mentor Contact & Examination Reminders (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Faculty Mentor Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
                alt="Prof. Sunita Rao"
                className="w-12 h-12 rounded-2xl object-cover ring-2 ring-indigo-500"
              />
              <div>
                <span className="text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400 tracking-wider">
                  Assigned Faculty Advisor
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Prof. Sunita Rao</h3>
                <p className="text-[11px] text-slate-500">Dept of Computer Science & Engineering</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              "Aarav demonstrates excellent problem-solving ability in Algorithms and Web Engineering. Please ensure he attends upcoming Machine Learning revision sessions to clear his attendance condonation."
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <a
                href="tel:+919876567890"
                className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 font-bold flex items-center justify-center gap-1.5 text-slate-700 dark:text-slate-200"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-600" /> Call Mentor
              </a>
              <a
                href="mailto:sunita.rao@campus.edu"
                className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 font-bold flex items-center justify-center gap-1.5 text-slate-700 dark:text-slate-200"
              >
                <Mail className="w-3.5 h-3.5 text-blue-600" /> Send Email
              </a>
            </div>
          </div>

          {/* Upcoming Examinations Reminder */}
          <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-purple-400" /> Ward Examination Schedule
            </h3>

            <div className="space-y-2 text-xs">
              {exams.slice(0, 3).map(ex => (
                <div key={ex.id} className="p-2.5 rounded-xl bg-slate-800/80 flex items-center justify-between">
                  <div>
                    <span className="font-bold">{ex.subjectName}</span>
                    <p className="text-[10px] text-slate-400">{ex.date} • {ex.time}</p>
                  </div>
                  <span className="font-mono text-purple-300 font-bold">{ex.room}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
