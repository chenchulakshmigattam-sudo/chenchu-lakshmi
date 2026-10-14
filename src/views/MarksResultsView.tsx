import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FileSpreadsheet,
  Award,
  TrendingUp,
  Download,
  Printer,
  Edit3,
  CheckCircle2,
  X,
  FileCheck,
  ChevronRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export const MarksResultsView: React.FC = () => {
  const { marks, results, updateMarks, activeRole, currentUser, setActiveTab } = useApp();
  const [selectedSem, setSelectedSem] = useState(4);
  const [showGradeCardModal, setShowGradeCardModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState<string | null>(null);

  // Edit fields
  const [test1, setTest1] = useState(18);
  const [test2, setTest2] = useState(18);
  const [assignment, setAssignment] = useState(9);
  const [lab, setLab] = useState(9);

  const startEdit = (m: any) => {
    setEditingSubject(m.subjectCode);
    setTest1(m.test1);
    setTest2(m.test2);
    setAssignment(m.assignment);
    setLab(m.lab);
  };

  const saveEdit = async (subjectCode: string) => {
    await updateMarks(subjectCode, Number(test1), Number(test2), Number(assignment), Number(lab));
    setEditingSubject(null);
  };

  const currentResult = results.find(r => r.semester === selectedSem) || results[0];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Internal Marks & Semester Results</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300">
              GPA 8.74
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Continuous Internal Assessment (CIA) marks, end-sem projections, and verified grade cards.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowGradeCardModal(true)}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold text-xs shadow-md transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> Download Official Grade Card
          </button>
          <button
            onClick={() => setActiveTab('ai-cgpa-predictor')}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-500/20 transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" /> CGPA Predictor
          </button>
        </div>
      </div>

      {/* Internal Marks (Semester 5 Ongoing) */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-purple-600" /> Continuous Internal Assessment (Sem 5 - Ongoing)
            </h2>
            <p className="text-xs text-slate-500">Internal Weightage: Test 1 (20) + Test 2 (20) + Assignment (10) + Lab (10) = 60 Marks</p>
          </div>
          {(activeRole === 'faculty' || activeRole === 'admin') && (
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 px-3 py-1 rounded-full border border-indigo-200">
              Faculty Edit Mode Enabled
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">Subject</th>
                <th className="py-3 px-3 text-center">Credits</th>
                <th className="py-3 px-3 text-center">Test 1 (20)</th>
                <th className="py-3 px-3 text-center">Test 2 (20)</th>
                <th className="py-3 px-3 text-center">Assignment (10)</th>
                <th className="py-3 px-3 text-center">Lab/VIVA (10)</th>
                <th className="py-3 px-3 text-center font-bold text-slate-900 dark:text-white">Total CIA (60)</th>
                <th className="py-3 px-3 text-center">Est. Grade</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {marks.map(item => {
                const isEditing = editingSubject === item.subjectCode;

                return (
                  <tr key={item.subjectCode} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3">
                      <span className="font-bold text-slate-900 dark:text-white block">{item.subjectName}</span>
                      <span className="text-[10px] font-mono text-slate-400">{item.subjectCode}</span>
                    </td>
                    <td className="py-3 px-3 text-center font-mono">{item.credits}</td>

                    {/* Test 1 */}
                    <td className="py-3 px-3 text-center font-mono">
                      {isEditing ? (
                        <input
                          type="number"
                          max={20}
                          min={0}
                          value={test1}
                          onChange={e => setTest1(parseFloat(e.target.value) || 0)}
                          className="w-14 text-center py-1 rounded bg-slate-100 dark:bg-slate-800 border"
                        />
                      ) : (
                        item.test1
                      )}
                    </td>

                    {/* Test 2 */}
                    <td className="py-3 px-3 text-center font-mono">
                      {isEditing ? (
                        <input
                          type="number"
                          max={20}
                          min={0}
                          value={test2}
                          onChange={e => setTest2(parseFloat(e.target.value) || 0)}
                          className="w-14 text-center py-1 rounded bg-slate-100 dark:bg-slate-800 border"
                        />
                      ) : (
                        item.test2
                      )}
                    </td>

                    {/* Assignment */}
                    <td className="py-3 px-3 text-center font-mono">
                      {isEditing ? (
                        <input
                          type="number"
                          max={10}
                          min={0}
                          value={assignment}
                          onChange={e => setAssignment(parseFloat(e.target.value) || 0)}
                          className="w-14 text-center py-1 rounded bg-slate-100 dark:bg-slate-800 border"
                        />
                      ) : (
                        item.assignment
                      )}
                    </td>

                    {/* Lab */}
                    <td className="py-3 px-3 text-center font-mono">
                      {isEditing ? (
                        <input
                          type="number"
                          max={10}
                          min={0}
                          value={lab}
                          onChange={e => setLab(parseFloat(e.target.value) || 0)}
                          className="w-14 text-center py-1 rounded bg-slate-100 dark:bg-slate-800 border"
                        />
                      ) : (
                        item.lab
                      )}
                    </td>

                    {/* Total Internal */}
                    <td className="py-3 px-3 text-center font-mono font-bold text-slate-900 dark:text-white">
                      <span className="px-2 py-0.5 rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-extrabold">
                        {isEditing ? test1 + test2 + assignment + lab : item.totalInternal} / 60
                      </span>
                    </td>

                    {/* Est. Grade */}
                    <td className="py-3 px-3 text-center">
                      <span className="px-2 py-0.5 rounded font-bold text-[11px] bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                        {item.estimatedGrade || 'A'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3 text-right">
                      {isEditing ? (
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => saveEdit(item.subjectCode)}
                            className="px-2 py-1 rounded bg-emerald-600 text-white font-bold text-[11px]"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingSubject(null)}
                            className="px-2 py-1 rounded bg-slate-200 dark:bg-slate-700 text-[11px]"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => startEdit(item)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                          title="Edit Marks"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Historical Semester Results (Sem 1 to 4) */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" /> University Official Semester Results
            </h2>
            <p className="text-xs text-slate-500">Cumulative Performance across verified academic terms</p>
          </div>

          {/* Semester Selector Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
            {results.map(res => (
              <button
                key={res.semester}
                onClick={() => setSelectedSem(res.semester)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedSem === res.semester
                    ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Sem {res.semester}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Sem Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Semester SGPA</span>
            <p className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mt-0.5">{currentResult.sgpa}</p>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Cumulative CGPA</span>
            <p className="text-2xl font-extrabold text-purple-600 dark:text-purple-400 mt-0.5">{currentResult.cgpa}</p>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Credits</span>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">{currentResult.totalCredits}</p>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Result Status</span>
            <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1">
              <CheckCircle2 className="w-4 h-4" /> First Class Distinction
            </p>
          </div>
        </div>

        {/* Subject-wise Grade Breakdown */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3">Course Code</th>
                <th className="py-2.5 px-3">Course Title</th>
                <th className="py-2.5 px-3 text-center">Credits</th>
                <th className="py-2.5 px-3 text-center">Letter Grade</th>
                <th className="py-2.5 px-3 text-center">Grade Point</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {currentResult.subjects.map(s => (
                <tr key={s.code} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-600 dark:text-slate-300">{s.code}</td>
                  <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">{s.name}</td>
                  <td className="py-2.5 px-3 text-center font-mono">{s.credits}</td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="px-2 py-0.5 rounded font-extrabold text-[11px] bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                      {s.grade}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono font-bold">{s.gradePoint} / 10</td>
                  <td className="py-2.5 px-3 text-right">
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">CLEARED</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Official Grade Card Modal */}
      {showGradeCardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white text-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Header Document */}
            <div className="flex items-start justify-between border-b pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-extrabold text-sm">
                    AI
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold tracking-tight">APEX INSTITUTE OF TECHNOLOGY & SCIENCE</h2>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Autonomous • NAAC Grade A++ Accredited</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowGradeCardModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Student Metadata */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Student Name</span>
                <p className="font-bold text-slate-900">Aarav Sharma</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Roll Number</span>
                <p className="font-mono font-bold text-slate-900">CS2023041</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Program</span>
                <p className="font-bold text-slate-900">B.Tech (CSE)</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Statement of Marks</span>
                <p className="font-bold text-blue-600">Semester 4 Official</p>
              </div>
            </div>

            {/* Marks List */}
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b text-[10px] font-bold uppercase text-slate-400">
                  <th className="py-2">Course</th>
                  <th className="py-2 text-center">Credits</th>
                  <th className="py-2 text-center">Grade</th>
                  <th className="py-2 text-right">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentResult.subjects.map(s => (
                  <tr key={s.code} className="py-2">
                    <td className="py-2">
                      <span className="font-bold">{s.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono ml-1.5">({s.code})</span>
                    </td>
                    <td className="py-2 text-center font-mono">{s.credits}</td>
                    <td className="py-2 text-center font-bold text-blue-600">{s.grade}</td>
                    <td className="py-2 text-right font-mono font-bold">{s.credits * s.gradePoint}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Cumulative Summary */}
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-between text-xs">
              <div>
                <p className="text-slate-600 font-medium">Semester SGPA: <strong className="text-blue-700">{currentResult.sgpa}</strong></p>
                <p className="text-slate-600 font-medium">Cumulative CGPA: <strong className="text-purple-700">{currentResult.cgpa}</strong></p>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span className="text-[11px] font-bold text-emerald-700 uppercase">Digitally Stamped & Verified</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold hover:bg-slate-50 flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" /> Print
              </button>
              <button
                onClick={() => setShowGradeCardModal(false)}
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
