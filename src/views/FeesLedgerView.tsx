import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  CreditCard,
  Download,
  Printer,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertCircle,
  X,
  FileCheck,
  Receipt
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const FeesLedgerView: React.FC = () => {
  const { fees, payFee, currentUser } = useApp();

  const [payAmount, setPayAmount] = useState<number>(fees.dueAmount || 24500);
  const [method, setMethod] = useState<string>('UPI (Google Pay / PhonePe)');
  const [showPayModal, setShowPayModal] = useState<boolean>(false);
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);
  const [isPaying, setIsPaying] = useState<boolean>(false);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPaying(true);
    await payFee(payAmount, method);
    setIsPaying(false);
    setShowPayModal(false);

    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch (e) {}
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Fee Structure & Online Payment</h1>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                fees.status === 'Paid'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              Status: {fees.status}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Academic Year {fees.academicYear} • Odd Semester 5 Tuition & Examination Fees
          </p>
        </div>

        {fees.dueAmount > 0 && (
          <button
            onClick={() => setShowPayModal(true)}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2"
          >
            <CreditCard className="w-4 h-4" /> Pay Outstanding Balance (₹{fees.dueAmount.toLocaleString()})
          </button>
        )}
      </div>

      {/* Top 3 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Semester Bill</span>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white">₹{fees.totalFee.toLocaleString()}</p>
          <p className="text-[11px] text-slate-500">Tuition, Labs, Library & Exams</p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Amount Paid So Far</span>
          <p className="text-3xl font-extrabold text-emerald-600">₹{fees.paidAmount.toLocaleString()}</p>
          <p className="text-[11px] text-slate-500">{fees.transactions.length} Verified Transactions</p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Balance Pending</span>
          <p className="text-3xl font-extrabold text-amber-600">₹{fees.dueAmount.toLocaleString()}</p>
          <p className="text-[11px] text-slate-500">Payment Due Date: {fees.dueDate}</p>
        </div>
      </div>

      {/* Itemized Fee Breakdown Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">Itemized Fee Structure</h2>

        <div className="divide-y text-xs">
          <div className="py-3 flex justify-between font-medium">
            <span className="text-slate-700 dark:text-slate-300">Tuition & Instructional Fee</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white">₹{fees.tuitionFee.toLocaleString()}</span>
          </div>
          <div className="py-3 flex justify-between font-medium">
            <span className="text-slate-700 dark:text-slate-300">Computer Center, GPU Cluster & Lab Consumables</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white">₹{fees.labFee.toLocaleString()}</span>
          </div>
          <div className="py-3 flex justify-between font-medium">
            <span className="text-slate-700 dark:text-slate-300">Digital Library, IEEE Journals & Commons Fee</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white">₹{fees.libraryFee.toLocaleString()}</span>
          </div>
          <div className="py-3 flex justify-between font-medium">
            <span className="text-slate-700 dark:text-slate-300">University Examination & Hall Ticket Fee</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white">₹{fees.examFee.toLocaleString()}</span>
          </div>
          <div className="py-3 flex justify-between font-extrabold text-sm border-t-2 text-blue-600 dark:text-blue-400">
            <span>Total Payable for Semester 5</span>
            <span className="font-mono">₹{fees.totalFee.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Receipts History */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Payment Receipts & Audit Slips</h2>
          <span className="text-xs text-slate-400">Click any receipt to view and print official slip</span>
        </div>

        <div className="space-y-3">
          {fees.transactions.map(tx => (
            <div
              key={tx.id}
              onClick={() => setSelectedReceipt(tx)}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-blue-400 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{tx.receiptNumber}</span>
                  <p className="text-slate-500 text-[11px]">{tx.date} • {tx.method}</p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4">
                <span className="text-base font-extrabold text-emerald-600 font-mono">
                  ₹{tx.amount.toLocaleString()}
                </span>
                <button className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1">
                  <Download className="w-3.5 h-3.5" /> View Slip
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Gateway Modal */}
      {showPayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl p-6 space-y-4 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Pay College Fees Online</h3>
              <button onClick={() => setShowPayModal(false)} className="p-1 rounded text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePay} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Payment Amount (Max: ₹{fees.dueAmount.toLocaleString()})
                </label>
                <input
                  type="number"
                  required
                  min={500}
                  max={fees.dueAmount}
                  value={payAmount}
                  onChange={e => setPayAmount(parseFloat(e.target.value) || 0)}
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Payment Method</label>
                <select
                  value={method}
                  onChange={e => setMethod(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium"
                >
                  <option value="UPI (Google Pay / PhonePe)">UPI (Google Pay / PhonePe / Paytm)</option>
                  <option value="Net Banking (HDFC / ICICI / SBI)">Net Banking (HDFC / ICICI / SBI)</option>
                  <option value="Debit / Credit Card">Debit / Credit Card (Visa / Mastercard)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPayModal(false)}
                  className="px-4 py-2 border rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPaying}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md"
                >
                  {isPaying ? 'Processing...' : `Confirm Pay ₹${payAmount.toLocaleString()}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white text-slate-900 w-full max-w-md rounded-3xl shadow-2xl p-6 space-y-4">
            <div className="flex items-start justify-between border-b pb-3">
              <div>
                <h3 className="font-extrabold text-sm">APEX INSTITUTE OF TECHNOLOGY & SCIENCE</h3>
                <p className="text-[10px] text-slate-500">OFFICIAL FEE PAYMENT ACKNOWLEDGEMENT</p>
              </div>
              <button onClick={() => setSelectedReceipt(null)} className="p-1 rounded text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Receipt No:</span>
                <span className="font-mono font-bold">{selectedReceipt.receiptNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date & Time:</span>
                <span className="font-medium">{selectedReceipt.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Student Name:</span>
                <span className="font-bold">Aarav Sharma (CS2023041)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Mode:</span>
                <span>{selectedReceipt.method}</span>
              </div>
              <div className="flex justify-between pt-2 border-t font-bold text-sm text-emerald-700">
                <span>Amount Paid:</span>
                <span>₹{selectedReceipt.amount.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-2">
              <span className="text-[10px] text-emerald-600 font-bold uppercase flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" /> Digitally Reconciled
              </span>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 border rounded-xl font-bold flex items-center gap-1"
              >
                <Printer className="w-3.5 h-3.5" /> Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
