import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  BrainCircuit,
  Calculator,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Info,
  ArrowRight,
  TrendingUp,
  RefreshCw
} from 'lucide-react';

export const AiAttendancePredictor: React.FC = () => {
  const { attendance, setActiveTab } = useApp();

  const [selectedSubjectCode, setSelectedSubjectCode] = useState<string>('CS503'); // default to ML (which is low)
  const [targetPercentage, setTargetPercentage] = useState<number>(75);
  const [plannedAbsences, setPlannedAbsences] = useState<number>(1);
  const [upcomingClasses, setUpcomingClasses] = useState<number>(16);

  const [loading, setLoading] = useState<boolean>(false);
  const [aiAdvice, setAiAdvice] = useState<string>('');
  const [calculation, setCalculation] = useState<any>(null);

  const selectedSubject = attendance.find(a => a.subjectCode === selectedSubjectCode) || attendance[0];

  const runPrediction = async () => {
    if (!selectedSubject) return;
    setLoading(true);

    try {
      const res = await fetch('/api/ai/predict-attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attendedClasses: selectedSubject.attendedClasses,
          totalClasses: selectedSubject.totalClasses,
          targetPercentage,
          plannedAbsences,
          upcomingClasses
        })
      });

      const data = await res.json();
      if (data.success) {
        setCalculation(data.calculation);
        setAiAdvice(data.aiAdvice);
        setLoading(false);
        return;
      }
    } catch (e) {
      // fallback calculation
    }

    // Client-side exact math fallback
    const attended = selectedSubject.attendedClasses;
    const total = selectedSubject.totalClasses;
    const currentPct = parseFloat(((attended / total) * 100).toFixed(1));
    const targetRatio = targetPercentage / 100;

    let canMiss = 0;
    if (currentPct >= targetPercentage) {
      canMiss = Math.floor((attended - targetRatio * total) / targetRatio);
    }

    let mustAttend = 0;
    if (currentPct < targetPercentage) {
      mustAttend = Math.ceil((targetRatio * total - attended) / (1 - targetRatio));
    }

    const projAttended = Math.max(0, attended + (upcomingClasses - plannedAbsences));
    const projTotal = total + upcomingClasses;
    const projPct = parseFloat(((projAttended / projTotal) * 100).toFixed(1));

    setCalculation({
      currentPct,
      currentAttended: attended,
      currentTotal: total,
      target: targetPercentage,
      canMissClasses: Math.max(0, canMiss),
      mustAttendConsecutive: Math.max(0, mustAttend),
      projectedAttended: projAttended,
      projectedTotal: projTotal,
      projectedPct: projPct,
      status: projPct >= targetPercentage ? 'SAFE' : 'SHORTAGE_RISK'
    });

    if (projPct >= targetPercentage) {
      setAiAdvice(`Forecast shows you will attain ${projPct}%, which meets the ${targetPercentage}% university examination criteria. You have room for up to ${canMiss} flexible absences.`);
    } else {
      setAiAdvice(`Urgent Alert: Missing ${plannedAbsences} classes will drop your attendance to ${projPct}%. You must attend the next ${mustAttend} consecutive lectures without absence.`);
    }

    setLoading(false);
  };

  useEffect(() => {
    runPrediction();
  }, [selectedSubjectCode, targetPercentage, plannedAbsences, upcomingClasses]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">AI Attendance Predictor</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Predictive Math Engine
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Simulate future leaves, calculate exact condonation requirements, and eliminate attendance surprises.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('attendance')}
          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
        >
          View Attendance Register
        </button>
      </div>

      {/* Notice Banner */}
      <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 dark:bg-blue-950/40 dark:border-blue-900 text-xs text-blue-800 dark:text-blue-200 flex items-center gap-2">
        <Info className="w-4 h-4 text-blue-600 flex-shrink-0" />
        <span>
          <strong>Transparency Notice:</strong> All forecasts are mathematical estimates computed using institutional rules. Individual subject faculty maintain the authoritative official roll.
        </span>
      </div>

      {/* Main Grid: Inputs vs Prediction Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs (5 Cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calculator className="w-4 h-4 text-blue-600" /> Simulation Parameters
            </h2>
            <p className="text-xs text-slate-500">Tune the sliders to test various absence scenarios</p>
          </div>

          {/* Select Subject */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Select Course to Forecast
            </label>
            <select
              value={selectedSubjectCode}
              onChange={e => setSelectedSubjectCode(e.target.value)}
              className="w-full text-xs font-semibold p-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
            >
              {attendance.map(sub => (
                <option key={sub.subjectCode} value={sub.subjectCode}>
                  {sub.subjectCode}: {sub.subjectName} ({sub.percentage}% - {sub.attendedClasses}/{sub.totalClasses})
                </option>
              ))}
            </select>
          </div>

          {/* Current State Summary Card */}
          {selectedSubject && (
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Current Standing:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {selectedSubject.attendedClasses} / {selectedSubject.totalClasses} classes
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Current Percentage:</span>
                <span
                  className={`font-mono font-extrabold ${
                    selectedSubject.percentage < 75 ? 'text-rose-600' : 'text-emerald-600'
                  }`}
                >
                  {selectedSubject.percentage}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Course Faculty:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">{selectedSubject.facultyName}</span>
              </div>
            </div>
          )}

          {/* Target Percentage Slider */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold mb-1">
              <span className="text-slate-700 dark:text-slate-300">Target Attendance %</span>
              <span className="font-mono text-blue-600 dark:text-blue-400 font-extrabold text-sm">
                {targetPercentage}%
              </span>
            </div>
            <input
              type="range"
              min={60}
              max={95}
              step={1}
              value={targetPercentage}
              onChange={e => setTargetPercentage(parseInt(e.target.value, 10))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>60% (Special Condonation)</span>
              <span className="text-rose-600 font-bold">75% (Min Exam Rule)</span>
              <span>95% (Honors)</span>
            </div>
          </div>

          {/* Planned Absences Slider */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold mb-1">
              <span className="text-slate-700 dark:text-slate-300">Planned Absences / Leaves</span>
              <span className="font-mono text-amber-600 dark:text-amber-400 font-extrabold text-sm">
                {plannedAbsences} classes
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={10}
              step={1}
              value={plannedAbsences}
              onChange={e => setPlannedAbsences(parseInt(e.target.value, 10))}
              className="w-full accent-amber-600 cursor-pointer"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              Simulate upcoming hackathons, health leaves, or personal travel
            </p>
          </div>

          {/* Remaining Upcoming Classes */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold mb-1">
              <span className="text-slate-700 dark:text-slate-300">Remaining Classes in Term</span>
              <span className="font-mono text-slate-900 dark:text-white font-extrabold text-sm">
                {upcomingClasses} classes
              </span>
            </div>
            <input
              type="range"
              min={5}
              max={30}
              step={1}
              value={upcomingClasses}
              onChange={e => setUpcomingClasses(parseInt(e.target.value, 10))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>

          <button
            onClick={runPrediction}
            disabled={loading}
            className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Recalculating with AI...' : 'Recalculate Scenario'}
          </button>
        </div>

        {/* Right Output Dashboard (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Primary Result Banner */}
          {calculation && (
            <div
              className={`p-6 sm:p-8 rounded-3xl border-2 transition-all shadow-md ${
                calculation.status === 'SAFE'
                  ? 'bg-gradient-to-br from-emerald-500/10 via-white to-blue-50/40 dark:from-emerald-950/20 dark:via-slate-900 dark:to-blue-950/20 border-emerald-300 dark:border-emerald-800'
                  : 'bg-gradient-to-br from-rose-500/10 via-white to-amber-50/40 dark:from-rose-950/20 dark:via-slate-900 dark:to-amber-950/20 border-rose-300 dark:border-rose-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Projected Final Attendance
                  </span>
                  <div className="flex items-baseline gap-3 mt-1">
                    <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                      {calculation.projectedPct}%
                    </span>
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        calculation.status === 'SAFE'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      }`}
                    >
                      {calculation.status === 'SAFE' ? 'Eligible for Exams' : 'Shortage Threshold Breached'}
                    </span>
                  </div>
                </div>

                <div className="text-right text-xs text-slate-500">
                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                    {calculation.projectedAttended} / {calculation.projectedTotal} Total Projected
                  </p>
                  <p>Target Goal: {targetPercentage}%</p>
                </div>
              </div>

              {/* Actionable Rules / Buffer Display */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-200/60 dark:border-slate-800">
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700 space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Absence Margin Buffer</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">
                      {calculation.canMissClasses}
                    </span>
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                      Classes can be missed
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Without falling below the {targetPercentage}% minimum
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700 space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Consecutive Classes Required</span>
                  <div className="flex items-baseline gap-2">
                    <span
                      className={`text-2xl font-extrabold ${
                        calculation.mustAttendConsecutive > 0
                          ? 'text-rose-600 dark:text-rose-400'
                          : 'text-emerald-600 dark:text-emerald-400'
                      }`}
                    >
                      {calculation.mustAttendConsecutive}
                    </span>
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                      Classes must attend
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Consecutively to recover from shortage
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* AI Strategic Guidance Card */}
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-indigo-600 text-white">
                <BrainCircuit className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  AI Academic Advisor Analysis
                  <span className="text-[10px] bg-indigo-500/30 text-indigo-300 px-2 py-0.5 rounded-full font-mono">
                    gemini-3.8-flash
                  </span>
                </h3>
              </div>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed font-normal">{aiAdvice}</p>
          </div>

          {/* Mathematical Derivation Box */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Mathematical Formula & Calculation Steps
            </h4>

            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 font-mono bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-700">
              <p>
                <strong>Current Percentage:</strong> ({calculation?.currentAttended} / {calculation?.currentTotal}) &times; 100 = {calculation?.currentPct}%
              </p>
              <p>
                <strong>Projected Attended:</strong> {calculation?.currentAttended} + ({upcomingClasses} - {plannedAbsences}) = {calculation?.projectedAttended} classes
              </p>
              <p>
                <strong>Projected Total Classes:</strong> {calculation?.currentTotal} + {upcomingClasses} = {calculation?.projectedTotal} classes
              </p>
              <p className="text-blue-600 dark:text-blue-400 font-bold">
                <strong>Projected Score:</strong> ({calculation?.projectedAttended} / {calculation?.projectedTotal}) &times; 100 = {calculation?.projectedPct}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
