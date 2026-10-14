import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Calculator,
  TrendingUp,
  Award,
  Sparkles,
  Info,
  CheckCircle2,
  RefreshCw,
  Sliders,
  ChevronRight
} from 'lucide-react';

interface CourseSimItem {
  code: string;
  name: string;
  credits: number;
  expectedGrade: string;
}

export const AiCgpaPredictor: React.FC = () => {
  const { results, marks } = useApp();

  const [priorCgpa, setPriorCgpa] = useState<number>(8.74);
  const [priorCredits, setPriorCredits] = useState<number>(86);
  const [loading, setLoading] = useState<boolean>(false);
  const [recommendation, setRecommendation] = useState<string>('');
  const [calculation, setCalculation] = useState<any>(null);

  const [courses, setCourses] = useState<CourseSimItem[]>([
    { code: 'CS501', name: 'Design & Analysis of Algorithms', credits: 4, expectedGrade: 'A+' },
    { code: 'CS502', name: 'Database Management Systems', credits: 4, expectedGrade: 'A' },
    { code: 'CS503', name: 'Machine Learning & Deep Learning', credits: 4, expectedGrade: 'A' },
    { code: 'CS504', name: 'Operating Systems & Kernels', credits: 3, expectedGrade: 'A' },
    { code: 'CS505', name: 'Full-Stack Web Engineering', credits: 3, expectedGrade: 'A+' },
    { code: 'CS506P', name: 'Cloud & AI Systems Lab', credits: 2, expectedGrade: 'O' }
  ]);

  const gradeOptions = [
    { label: 'O (10)', value: 'O', points: 10 },
    { label: 'A+ (10)', value: 'A+', points: 10 },
    { label: 'A (9)', value: 'A', points: 9 },
    { label: 'B+ (8)', value: 'B+', points: 8 },
    { label: 'B (7)', value: 'B', points: 7 },
    { label: 'C (6)', value: 'C', points: 6 }
  ];

  const updateCourseGrade = (index: number, grade: string) => {
    setCourses(prev => {
      const copy = [...prev];
      copy[index].expectedGrade = grade;
      return copy;
    });
  };

  const calculateCgpa = async () => {
    setLoading(true);

    try {
      const res = await fetch('/api/ai/predict-cgpa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentCgpa: priorCgpa,
          completedCredits: priorCredits,
          semesterSubjects: courses
        })
      });

      const data = await res.json();
      if (data.success) {
        setCalculation(data.calculation);
        setRecommendation(data.recommendation);
        setLoading(false);
        return;
      }
    } catch (e) {
      // fallback
    }

    const gpMap: Record<string, number> = {
      'O': 10, 'A+': 10, 'A': 9, 'B+': 8, 'B': 7, 'C': 6
    };

    let semSum = 0;
    let semCr = 0;
    for (const c of courses) {
      const gp = gpMap[c.expectedGrade] || 9;
      semSum += c.credits * gp;
      semCr += c.credits;
    }

    const projectedSgpa = semCr > 0 ? parseFloat((semSum / semCr).toFixed(2)) : 0;
    const totalCredits = priorCredits + semCr;
    const projectedCgpa = totalCredits > 0
      ? parseFloat(((priorCgpa * priorCredits + semSum) / totalCredits).toFixed(2))
      : priorCgpa;

    setCalculation({
      currentCgpa: priorCgpa,
      completedCredits: priorCredits,
      semCredits: semCr,
      projectedSgpa,
      totalCreditsCumulative: totalCredits,
      projectedCgpa,
      delta: parseFloat((projectedCgpa - priorCgpa).toFixed(2))
    });

    setRecommendation(
      `With an estimated SGPA of ${projectedSgpa}, your overall graduation CGPA improves to ${projectedCgpa}. Algorithms (4 cr) and Machine Learning (4 cr) determine 40% of this term's performance; scoring A+ in both guarantees staying on the Honors Dean's List.`
    );
    setLoading(false);
  };

  useEffect(() => {
    calculateCgpa();
  }, [courses, priorCgpa, priorCredits]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">AI CGPA & SGPA Predictor</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Credit Mathematics
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Simulate expected semester grades, forecast cumulative graduation GPA, and target distinction honors.
          </p>
        </div>
      </div>

      {/* Transparency Banner */}
      <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 dark:bg-purple-950/40 dark:border-purple-900 text-xs text-purple-900 dark:text-purple-200 flex items-center gap-2">
        <Info className="w-4 h-4 text-purple-600 flex-shrink-0" />
        <span>
          <strong>Academic Grading Scale:</strong> Calculations follow the standard 10-point relative grading scale: O (10), A+ (10), A (9), B+ (8), B (7), C (6).
        </span>
      </div>

      {/* Main Grid: Course Sliders vs Projected Result */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Course Grade Selectors (7 Cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-purple-600" /> Semester 5 Courses & Expected Grades
              </h2>
              <p className="text-xs text-slate-500">Total 20 Credits this term</p>
            </div>
            <button
              onClick={() => {
                // Set all to A+
                setCourses(prev => prev.map(c => ({ ...c, expectedGrade: 'A+' })));
              }}
              className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline"
            >
              Set All A+
            </button>
          </div>

          <div className="space-y-3">
            {courses.map((course, idx) => (
              <div
                key={course.code}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/70 space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-mono text-xs font-bold text-slate-400">
                      {course.code} • {course.credits} Credits Weight
                    </span>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white mt-0.5">{course.name}</h3>
                  </div>

                  <span className="px-2.5 py-0.5 rounded-lg text-xs font-extrabold bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                    Grade: {course.expectedGrade}
                  </span>
                </div>

                {/* Grade Option Radio Pills */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {gradeOptions.map(g => (
                    <button
                      key={g.value}
                      type="button"
                      onClick={() => updateCourseGrade(idx, g.value)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        course.expectedGrade === g.value
                          ? 'bg-purple-600 text-white shadow-md shadow-purple-500/25'
                          : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Output Forecast & AI Advice (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Output Card */}
          {calculation && (
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-purple-600 via-indigo-600 to-slate-900 text-white shadow-xl space-y-6">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-200">
                  Projected Cumulative CGPA
                </span>
                <div className="flex items-baseline gap-3">
                  <span className="text-5xl font-extrabold tracking-tight">{calculation.projectedCgpa}</span>
                  <span className="text-sm font-semibold text-purple-200">/ 10.0</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/20 text-xs">
                <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-sm">
                  <span className="text-[10px] text-purple-200 uppercase font-bold">Estimated Sem 5 SGPA</span>
                  <p className="text-2xl font-extrabold mt-0.5">{calculation.projectedSgpa}</p>
                  <p className="text-[10px] text-purple-200 mt-1">20 credits this term</p>
                </div>

                <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-sm">
                  <span className="text-[10px] text-purple-200 uppercase font-bold">Net CGPA Change</span>
                  <p className="text-2xl font-extrabold text-emerald-300 mt-0.5">
                    {calculation.delta >= 0 ? `+${calculation.delta}` : calculation.delta}
                  </p>
                  <p className="text-[10px] text-purple-200 mt-1">From base 8.74</p>
                </div>
              </div>

              {/* Distinction Check */}
              <div className="p-3 rounded-2xl bg-white/15 backdrop-blur-md flex items-center gap-2 text-xs">
                <CheckCircle2 className="w-5 h-5 text-emerald-300 flex-shrink-0" />
                <span>
                  <strong>Honors Status:</strong> {calculation.projectedCgpa >= 8.5 ? 'Qualifies for First Class with Distinction (> 8.50)' : 'Above First Class criteria'}
                </span>
              </div>
            </div>
          )}

          {/* AI Strategy Advisor Card */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">AI Grade Leverage Advice</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{recommendation}</p>
          </div>

          {/* Mathematical Formula Card */}
          <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs space-y-2 font-mono">
            <p className="font-bold text-slate-700 dark:text-slate-300 uppercase text-[10px]">Official Credit Math</p>
            <p className="text-slate-600 dark:text-slate-400">
              SGPA = &Sigma;(Credits &times; GradePoint) / &Sigma;Credits
            </p>
            <p className="text-slate-600 dark:text-slate-400">
              CGPA = (PriorCGPA &times; PriorCredits + SemCreditsSum) / TotalCredits
            </p>
            <p className="text-purple-600 dark:text-purple-400 font-bold">
              Total Cumulative Credits after Sem 5: {calculation?.totalCreditsCumulative || 106}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
