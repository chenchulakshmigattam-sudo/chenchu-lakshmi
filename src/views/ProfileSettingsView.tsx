import React from 'react';
import { useApp } from '../context/AppContext';
import {
  UserCircle2,
  Moon,
  Sun,
  ShieldCheck,
  CheckCircle2,
  Mail,
  Phone,
  GraduationCap,
  Sparkles,
  Layers,
  Cpu,
  ArrowRight
} from 'lucide-react';
import { UserRole } from '../types';

export const ProfileSettingsView: React.FC = () => {
  const { currentUser, activeRole, theme, toggleTheme, loginAs } = useApp();

  const demoAccounts: { role: UserRole; name: string; email: string; desc: string; icon: string }[] = [
    { role: 'student', name: 'Aarav Sharma', email: 'aarav.sharma@campus.edu', desc: 'B.Tech CSE Sem 5 • Roll CS2023041', icon: '👨‍🎓' },
    { role: 'faculty', name: 'Prof. Sunita Rao', email: 'sunita.rao@campus.edu', desc: 'CSE Dept • Course Head Algorithms & Labs', icon: '👩‍🏫' },
    { role: 'parent', name: 'Rajesh Sharma', email: 'rajesh.sharma@gmail.com', desc: 'Parent of Aarav Sharma', icon: '👨‍👧' },
    { role: 'admin', name: 'Dr. K. Raman', email: 'dean.academic@campus.edu', desc: 'Dean of Academic Administration & Registrar', icon: '🏛️' }
  ];

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Profile & System Settings</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage your campus digital identity, appearance theme, and explore multi-role credentials.
          </p>
        </div>

        <button
          onClick={toggleTheme}
          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-2"
        >
          {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
          <span>{theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}</span>
        </button>
      </div>

      {/* User Identity Card */}
      {currentUser && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-20 h-20 rounded-3xl object-cover ring-4 ring-blue-500/30"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">{currentUser.name}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  {currentUser.role}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {currentUser.department || 'Computer Science & Engineering'} • {currentUser.email}
              </p>
              {currentUser.rollNumber && (
                <p className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                  University Roll: {currentUser.rollNumber} • Semester {currentUser.semester} ({currentUser.section})
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Contact Email</span>
              <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">{currentUser.email}</p>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Verified Phone</span>
              <p className="font-semibold text-slate-800 dark:text-slate-200">{currentUser.phone || '+91 98765 12345'}</p>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Session Security</span>
              <p className="font-semibold text-emerald-600 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" /> Multi-Factor Active
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Demo Credentials & Quick Switcher Matrix */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-blue-600" /> Hackathon Demo Credentials & Role Switcher
          </h2>
          <p className="text-xs text-slate-500">
            Click any account below to instantly switch portals and test the entire user journey.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {demoAccounts.map(acc => {
            const isCurrent = activeRole === acc.role;

            return (
              <div
                key={acc.role}
                onClick={() => loginAs(acc.role)}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                  isCurrent
                    ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{acc.icon}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900 dark:text-white">{acc.name}</span>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {acc.role}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{acc.desc}</p>
                    <p className="text-[10px] font-mono text-slate-500">{acc.email}</p>
                  </div>
                </div>

                {isCurrent ? (
                  <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0" />
                ) : (
                  <ArrowRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Project Architecture & Tech Stack Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-blue-600 text-white">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold">Hackathon 2026 Project Architecture</h3>
            <p className="text-xs text-slate-400">Smart College Assistant – An AI-Powered Digital Campus Companion</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs pt-2">
          <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
            <span className="text-[10px] font-bold uppercase text-blue-400">Frontend Stack</span>
            <p className="font-bold">React 19 + TypeScript</p>
            <p className="text-[11px] text-slate-400">Tailwind CSS v4 + Motion</p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
            <span className="text-[10px] font-bold uppercase text-indigo-400">Backend Server</span>
            <p className="font-bold">Node.js + Express.js</p>
            <p className="text-[11px] text-slate-400">Full-stack REST API Routes</p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
            <span className="text-[10px] font-bold uppercase text-purple-400">AI Model Engine</span>
            <p className="font-bold">Gemini 3.8 Flash</p>
            <p className="text-[11px] text-slate-400">@google/genai TypeScript SDK</p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
            <span className="text-[10px] font-bold uppercase text-emerald-400">Security & RBAC</span>
            <p className="font-bold">Role-Based Access</p>
            <p className="text-[11px] text-slate-400">Students, Faculty, Parents, Admins</p>
          </div>
        </div>
      </div>
    </div>
  );
};
