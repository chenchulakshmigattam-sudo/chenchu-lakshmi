import React from 'react';
import { useApp } from '../context/AppContext';
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  BrainCircuit,
  CalendarCheck,
  FileSpreadsheet,
  MapPin,
  Bot,
  Users,
  Briefcase,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Compass,
  CreditCard
} from 'lucide-react';
import { UserRole } from '../types';

export const LandingPage: React.FC = () => {
  const { loginAs, setActiveTab } = useApp();

  const demoRoles: { role: UserRole; name: string; title: string; badge: string; color: string; desc: string; icon: string }[] = [
    {
      role: 'student',
      name: 'Aarav Sharma',
      title: 'B.Tech CSE, Sem 5 (Roll: CS2023041)',
      badge: 'Student View',
      color: 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300',
      desc: 'Track attendance, check internal marks, predict CGPA, use AI study planner and view exam timetable.',
      icon: '👨‍🎓'
    },
    {
      role: 'faculty',
      name: 'Prof. Sunita Rao',
      title: 'Dept of Computer Science & Engg.',
      badge: 'Faculty Portal',
      color: 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-300',
      desc: 'Take classroom attendance, upload internal marks, publish assignments and approve student leave requests.',
      icon: '👩‍🏫'
    },
    {
      role: 'parent',
      name: 'Rajesh Sharma',
      title: 'Linked Student: Aarav Sharma',
      badge: 'Parent Portal',
      color: 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300',
      desc: 'Monitor real-time academic progress, attendance alerts, exam schedules and pay college tuition fees online.',
      icon: '👨‍👧'
    },
    {
      role: 'admin',
      name: 'Dr. K. Raman',
      title: 'Dean of Academic Administration & Registrar',
      badge: 'Admin Console',
      color: 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300',
      desc: 'Manage campus infrastructure, broadcast official circulars, review college-wide attendance and room usage.',
      icon: '🏛️'
    }
  ];

  const features = [
    {
      title: 'AI Attendance Predictor',
      desc: 'Calculates exact classes you can miss or need to attend to satisfy the mandatory 75% attendance rule.',
      icon: BrainCircuit,
      color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/40',
      tab: 'ai-attendance-predictor'
    },
    {
      title: 'CGPA & SGPA Forecast Engine',
      desc: 'Simulate semester exam grades and calculate projected cumulative GPA with credit-weighted mathematics.',
      icon: FileSpreadsheet,
      color: 'text-indigo-600 bg-indigo-100 dark:bg-indigo-900/40',
      tab: 'ai-cgpa-predictor'
    },
    {
      title: 'Smart AI Study Planner',
      desc: 'Generates day-by-day revision schedules tailored to upcoming exams, weak subjects, and available hours.',
      icon: Sparkles,
      color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/40',
      tab: 'smart-study-planner'
    },
    {
      title: 'AI Academic Companion Chatbot',
      desc: 'Instant answers for campus queries, concept explanations in Algorithms/ML/DBMS, and academic rules.',
      icon: Bot,
      color: 'text-cyan-600 bg-cyan-100 dark:bg-cyan-900/40',
      tab: 'ai-chatbot'
    },
    {
      title: 'Interactive Campus Navigation',
      desc: 'Explore campus buildings and check real-time classroom and computer laboratory occupancy status.',
      icon: MapPin,
      color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/40',
      tab: 'campus-map'
    },
    {
      title: 'Multi-Role Portals & Fee Ledger',
      desc: 'Dedicated workflows for students, faculty, parents, and admins with instant digital fee receipts.',
      icon: Users,
      color: 'text-amber-600 bg-amber-100 dark:bg-amber-900/40',
      tab: 'student-dashboard'
    }
  ];

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-indigo-700 to-slate-900 text-white p-8 sm:p-12 lg:p-16 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-blue-400/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 rounded-full bg-indigo-400/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-blue-200">
            <Sparkles className="w-4 h-4 text-amber-300" />
            Hackathon 2026 Presentation Project
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Smart College Assistant <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-cyan-200 to-white">
              An AI-Powered Digital Campus Companion
            </span>
          </h1>

          <p className="text-base sm:text-lg text-blue-100/90 leading-relaxed font-normal">
            Eliminating delayed attendance updates, lost internal marks, missed circulars, and study chaos.
            One unified digital platform linking students, teachers, parents, and campus administration.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => loginAs('student')}
              className="px-6 py-3.5 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-bold text-sm shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-2"
            >
              Launch Student Demo <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveTab('ai-chatbot')}
              className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-sm backdrop-blur-md transition-all flex items-center gap-2"
            >
              <Bot className="w-4 h-4 text-cyan-300" /> Test AI Chatbot
            </button>
          </div>
        </div>
      </section>

      {/* Demo Role Selector Bar */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Quick Demo Role Launchpad</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Click any profile below to instantly experience the website from that role's dashboard.
            </p>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
            <ShieldCheck className="w-3.5 h-3.5" /> 4 Roles Ready
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {demoRoles.map(roleItem => (
            <div
              key={roleItem.role}
              onClick={() => loginAs(roleItem.role)}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all hover:scale-[1.02] hover:shadow-xl flex flex-col justify-between ${roleItem.color}`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{roleItem.icon}</span>
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/80 dark:bg-slate-900/80">
                    {roleItem.badge}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">{roleItem.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{roleItem.title}</p>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3">{roleItem.desc}</p>
              </div>

              <div className="pt-4 mt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs font-bold">
                <span>Enter as {roleItem.role}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Core Hackathon Innovations</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Engineered to replace paper logs, fragmented emails, and manual student advising.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                onClick={() => setActiveTab(feat.tab)}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${feat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{feat.desc}</p>
                </div>

                <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
                  <span>Explore Module</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Problem vs Solution Comparison Card */}
      <section className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Digital Transformation</span>
          <h2 className="text-2xl font-extrabold">Traditional Campus vs Smart Assistant</h2>
          <p className="text-xs text-slate-400">How this Hackathon project solves everyday college friction.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-900/40 space-y-3">
            <h3 className="text-sm font-bold text-rose-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Traditional Pain Points
            </h3>
            <ul className="text-xs text-slate-300 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-rose-400">•</span> Attendance recorded on paper registers; student finds out shortage only right before final exams.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400">•</span> Internal marks posted on pin-boards; parents have zero visibility into mid-term performance.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400">•</span> Circulars buried in cluttered WhatsApp groups; deadlines and fee penalties missed.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400">•</span> No personalized guidance on study schedules or what grades are required to maintain honors CGPA.
              </li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-900/40 space-y-3">
            <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Smart Assistant Solutions
            </h3>
            <ul className="text-xs text-slate-300 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">•</span> Real-time attendance ledger with instant warning alerts whenever a subject drops below 75%.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">•</span> AI Predictors determine exact attendance and CGPA targets, showing formulas & guidance.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">•</span> Automated study planner creates balanced Pomodoro daily revision plans for upcoming exams.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">•</span> Seamless Parent & Faculty portals with transparent fee payments and leave approvals.
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};
