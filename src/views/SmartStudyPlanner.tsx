import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  CalendarDays,
  Sparkles,
  CheckCircle2,
  Clock,
  BookOpen,
  RefreshCw,
  Flame,
  Award,
  Printer,
  Sliders,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const SmartStudyPlanner: React.FC = () => {
  const { studyPlan, updateStudyPlanSlot, regenerateStudyPlan } = useApp();

  const [dailyHours, setDailyHours] = useState<number>(3);
  const [prioritizeWeakSubjects, setPrioritizeWeakSubjects] = useState<boolean>(true);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const handleToggleSlot = (dayIdx: number, slotIdx: number, currentCompleted: boolean) => {
    const nextVal = !currentCompleted;
    updateStudyPlanSlot(dayIdx, slotIdx, nextVal);

    if (nextVal) {
      try {
        confetti({
          particleCount: 50,
          spread: 45,
          origin: { y: 0.8 }
        });
      } catch (e) {
        // ignore
      }
    }
  };

  const handleRegenerate = async () => {
    setIsGenerating(true);
    await regenerateStudyPlan(dailyHours);
    setIsGenerating(false);

    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }
  };

  const totalSlots = studyPlan.reduce((acc, curr) => acc + curr.slots.length, 0);
  const completedSlots = studyPlan.reduce((acc, curr) => acc + curr.slots.filter(s => s.completed).length, 0);
  const completionPct = totalSlots > 0 ? Math.round((completedSlots / totalSlots) * 100) : 0;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Smart AI Study Planner</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Pomodoro Optimizer
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Personalized revision schedules based on upcoming exams, weak topics, and your evening availability.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-50 flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" /> Print Plan
          </button>
          <button
            onClick={handleRegenerate}
            disabled={isGenerating}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-500/20 transition-all flex items-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            {isGenerating ? 'Synthesizing with AI...' : 'Regenerate Plan'}
          </button>
        </div>
      </div>

      {/* Progress & Tuning Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Progress Card */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Study Plan Completion</span>
            <span className="text-xs font-extrabold text-purple-600 dark:text-purple-400">
              {completedSlots} / {totalSlots} Sessions Done
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{completionPct}%</span>
            <span className="text-xs text-slate-500">of planned revision targets</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full transition-all duration-500"
              style={{ width: `${completionPct}%` }}
            />
          </div>
        </div>

        {/* Configuration Controls (2 Cols) */}
        <div className="md:col-span-2 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-purple-600" /> Evening Study Budget:
              </span>
              <span className="font-mono text-purple-600 dark:text-purple-400 text-sm font-extrabold">
                {dailyHours} Hours / Day
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={6}
              step={0.5}
              value={dailyHours}
              onChange={e => setDailyHours(parseFloat(e.target.value))}
              className="w-full accent-purple-600 cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-3 sm:border-l sm:pl-4 border-slate-200 dark:border-slate-800">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={prioritizeWeakSubjects}
                onChange={e => setPrioritizeWeakSubjects(e.target.checked)}
                className="w-4 h-4 rounded text-purple-600 accent-purple-600"
              />
              <span>Focus on ML (Weak Area &lt;75%)</span>
            </label>
          </div>
        </div>
      </div>

      {/* Day by Day Plan Columns / Cards */}
      <div className="space-y-6">
        {studyPlan.map((dayPlan, dayIdx) => (
          <div
            key={dayIdx}
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">{dayPlan.dayName}</h3>
                  <span className="font-mono text-xs text-slate-400 font-semibold">{dayPlan.date}</span>
                </div>
                <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold mt-0.5 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5" /> Goal: {dayPlan.focusGoal}
                </p>
              </div>

              <span className="text-xs text-slate-500 font-medium">
                {dayPlan.slots.filter(s => s.completed).length} / {dayPlan.slots.length} Completed
              </span>
            </div>

            {/* Slots List */}
            <div className="space-y-3">
              {dayPlan.slots.map((slot, slotIdx) => (
                <div
                  key={slotIdx}
                  onClick={() => handleToggleSlot(dayIdx, slotIdx, slot.completed)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    slot.completed
                      ? 'border-emerald-300 bg-emerald-50/40 dark:border-emerald-900/60 dark:bg-emerald-950/20'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/40 hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <button
                      type="button"
                      className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors flex-shrink-0 mt-0.5 ${
                        slot.completed
                          ? 'border-emerald-600 bg-emerald-600 text-white'
                          : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900'
                      }`}
                    >
                      {slot.completed && <CheckCircle2 className="w-4 h-4" />}
                    </button>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">{slot.subject}</span>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            slot.difficulty === 'Challenging'
                              ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                              : slot.difficulty === 'Medium'
                              ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                              : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                          }`}
                        >
                          {slot.difficulty}
                        </span>
                      </div>

                      <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200">{slot.topic}</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{slot.activity}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 text-xs flex-shrink-0">
                    <span className="font-mono text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 px-3 py-1 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold">
                      {slot.time} ({slot.durationMins}m)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
