import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  BookOpenCheck,
  Clock,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Upload,
  PlusCircle,
  X,
  FileText,
  Sparkles,
  Award,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Assignment } from '../types';

export const AssignmentsView: React.FC = () => {
  const { assignments, submitAssignment, createAssignment, gradeAssignment, activeRole } = useApp();
  const [filter, setFilter] = useState<'all' | 'pending' | 'submitted' | 'graded'>('all');

  // Submit Modal
  const [submittingAssignment, setSubmittingAssignment] = useState<Assignment | null>(null);
  const [solutionText, setSolutionText] = useState('');
  const [fileName, setFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Faculty Create Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubjectCode, setNewSubjectCode] = useState('CS501');
  const [newSubjectName, setNewSubjectName] = useState('Design & Analysis of Algorithms');
  const [newDescription, setNewDescription] = useState('');
  const [newDueDate, setNewDueDate] = useState(new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]);
  const [newMaxMarks, setNewMaxMarks] = useState(10);

  // Faculty Grade Modal
  const [gradingAssignment, setGradingAssignment] = useState<Assignment | null>(null);
  const [gradeScore, setGradeScore] = useState(9);
  const [gradeFeedback, setGradeFeedback] = useState('Comprehensive proofs and well-formatted code.');

  const filtered = assignments.filter(a => {
    if (filter === 'pending') return a.status === 'pending';
    if (filter === 'submitted') return a.status === 'submitted';
    if (filter === 'graded') return a.status === 'graded';
    return true;
  });

  const handleSubmitSolution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submittingAssignment) return;
    setIsSubmitting(true);
    await submitAssignment(submittingAssignment.id, solutionText, fileName || 'algorithms_problemset4_solution.pdf');
    setIsSubmitting(false);
    setSubmittingAssignment(null);
    setSolutionText('');
    setFileName('');

    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch (e) {
      // ignore
    }
  };

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    await createAssignment({
      title: newTitle,
      subjectCode: newSubjectCode,
      subjectName: newSubjectName,
      description: newDescription,
      dueDate: newDueDate,
      maxMarks: Number(newMaxMarks)
    });
    setShowCreateModal(false);
    setNewTitle('');
    setNewDescription('');
  };

  const handleSaveGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingAssignment) return;
    await gradeAssignment(gradingAssignment.id, Number(gradeScore), gradeFeedback);
    setGradingAssignment(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Assignments & Submissions</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300">
              {assignments.filter(a => a.status === 'pending').length} Action Required
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track coursework deadlines, submit problem sets, and review faculty rubric evaluations.
          </p>
        </div>

        {(activeRole === 'faculty' || activeRole === 'admin') && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition-all flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" /> Create New Assignment
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            filter === 'all'
              ? 'bg-blue-600 text-white'
              : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
          }`}
        >
          All ({assignments.length})
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            filter === 'pending'
              ? 'bg-amber-600 text-white'
              : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
          }`}
        >
          Pending Submission ({assignments.filter(a => a.status === 'pending').length})
        </button>
        <button
          onClick={() => setFilter('submitted')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            filter === 'submitted'
              ? 'bg-blue-600 text-white'
              : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
          }`}
        >
          Under Review ({assignments.filter(a => a.status === 'submitted').length})
        </button>
        <button
          onClick={() => setFilter('graded')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            filter === 'graded'
              ? 'bg-emerald-600 text-white'
              : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
          }`}
        >
          Evaluated ({assignments.filter(a => a.status === 'graded').length})
        </button>
      </div>

      {/* Assignment Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map(asg => {
          const isPending = asg.status === 'pending';
          const isSubmitted = asg.status === 'submitted';
          const isGraded = asg.status === 'graded';

          return (
            <div
              key={asg.id}
              className={`p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 transition-all hover:shadow-lg flex flex-col justify-between ${
                isPending
                  ? 'border-amber-300 dark:border-amber-800/80 bg-amber-50/20 dark:bg-amber-950/10'
                  : isGraded
                  ? 'border-emerald-300 dark:border-emerald-900/70 bg-emerald-50/20 dark:bg-emerald-950/10'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-mono text-xs font-bold text-slate-400">
                      {asg.subjectCode} • {asg.subjectName}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">{asg.title}</h3>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider ${
                      isPending
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                        : isSubmitted
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                    }`}
                  >
                    {isPending ? 'Due Soon' : isSubmitted ? 'Submitted' : 'Graded'}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{asg.description}</p>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 pt-1">
                  <span className="flex items-center gap-1 font-semibold text-rose-600 dark:text-rose-400">
                    <Clock className="w-3.5 h-3.5" /> Due: {asg.dueDate}
                  </span>
                  <span>•</span>
                  <span>Max Score: <strong>{asg.maxMarks} Marks</strong></span>
                </div>

                {/* Graded Details */}
                {isGraded && (
                  <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-emerald-600" /> Score Awarded:
                      </span>
                      <span className="font-mono font-extrabold text-sm text-emerald-700 dark:text-emerald-300">
                        {asg.obtainedMarks} / {asg.maxMarks}
                      </span>
                    </div>
                    {asg.feedback && (
                      <p className="text-[11px] text-emerald-800 dark:text-emerald-300 italic">
                        "{asg.feedback}"
                      </p>
                    )}
                  </div>
                )}

                {/* Submitted text preview */}
                {isSubmitted && asg.submittedAt && (
                  <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-xs text-blue-900 dark:text-blue-200">
                    <p className="font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Submitted on {asg.submittedAt}
                    </p>
                    {asg.submittedFile && (
                      <p className="text-[11px] text-blue-700 dark:text-blue-300 mt-1 font-mono">
                        📎 {asg.submittedFile}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                {isPending && (
                  <button
                    onClick={() => setSubmittingAssignment(asg)}
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" /> Submit Assignment Solution
                  </button>
                )}

                {/* Faculty Grading Action */}
                {(activeRole === 'faculty' || activeRole === 'admin') && isSubmitted && (
                  <button
                    onClick={() => {
                      setGradingAssignment(asg);
                      setGradeScore(asg.maxMarks);
                    }}
                    className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5"
                  >
                    <Award className="w-3.5 h-3.5" /> Grade Student Work
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Student Submission Modal */}
      {submittingAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl p-6 space-y-4 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Submit: {submittingAssignment.title}
                </h3>
                <p className="text-xs text-slate-500">{submittingAssignment.subjectName}</p>
              </div>
              <button
                onClick={() => setSubmittingAssignment(null)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitSolution} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Solution Notes / GitHub URL / Explanation
                </label>
                <textarea
                  rows={4}
                  required
                  value={solutionText}
                  onChange={e => setSolutionText(e.target.value)}
                  placeholder="Paste your solution summary, implementation links, or algorithmic approach..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Upload File / PDF Document (Simulated)
                </label>
                <div className="p-4 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl text-center space-y-2">
                  <FileText className="w-8 h-8 text-blue-500 mx-auto" />
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                    {fileName || 'Click to select report_v1_final.pdf'}
                  </p>
                  <button
                    type="button"
                    onClick={() => setFileName('algorithms_ps4_aarav_sharma.pdf')}
                    className="px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200"
                  >
                    Simulate Attach PDF
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSubmittingAssignment(null)}
                  className="px-4 py-2 rounded-xl border text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20"
                >
                  {isSubmitting ? 'Uploading...' : 'Confirm Final Submission'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Faculty Create Assignment Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl p-6 space-y-4 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Create New Course Assignment</h3>
              <button onClick={() => setShowCreateModal(false)} className="p-1 rounded text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Subject</label>
                <select
                  value={newSubjectCode}
                  onChange={e => {
                    setNewSubjectCode(e.target.value);
                    if (e.target.value === 'CS501') setNewSubjectName('Design & Analysis of Algorithms');
                    else if (e.target.value === 'CS503') setNewSubjectName('Machine Learning');
                    else setNewSubjectName('Full-Stack Web Engineering');
                  }}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                >
                  <option value="CS501">CS501 - Design & Analysis of Algorithms</option>
                  <option value="CS503">CS503 - Machine Learning & Deep Learning</option>
                  <option value="CS505">CS505 - Full-Stack Web Engineering</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Assignment Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Lab Project 5: Docker Containerization"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Instructions & Problem Statement</label>
                <textarea
                  rows={3}
                  required
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  placeholder="Detail instructions, test cases, and deliverables..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Due Date</label>
                  <input
                    type="date"
                    required
                    value={newDueDate}
                    onChange={e => setNewDueDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Max Marks</label>
                  <input
                    type="number"
                    value={newMaxMarks}
                    onChange={e => setNewMaxMarks(parseFloat(e.target.value) || 10)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl"
                >
                  Publish Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Faculty Grade Modal */}
      {gradingAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl p-6 space-y-4 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Grade Student Submission</h3>
              <button onClick={() => setGradingAssignment(null)} className="p-1 rounded text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGrade} className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <p className="font-bold">{gradingAssignment.title}</p>
                <p className="text-slate-500">{gradingAssignment.submittedText}</p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Marks Awarded (Max: {gradingAssignment.maxMarks})
                </label>
                <input
                  type="number"
                  step="0.5"
                  max={gradingAssignment.maxMarks}
                  min={0}
                  value={gradeScore}
                  onChange={e => setGradeScore(parseFloat(e.target.value) || 0)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Qualitative Feedback</label>
                <textarea
                  rows={3}
                  value={gradeFeedback}
                  onChange={e => setGradeFeedback(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setGradingAssignment(null)}
                  className="px-4 py-2 border rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl"
                >
                  Submit Grade & Evaluation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
