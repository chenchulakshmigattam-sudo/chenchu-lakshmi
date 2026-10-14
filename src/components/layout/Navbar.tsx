import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  GraduationCap,
  Sparkles,
  Bell,
  Sun,
  Moon,
  LogOut,
  UserCheck,
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  Menu,
  ShieldCheck,
  BookOpen
} from 'lucide-react';
import { UserRole } from '../../types';

interface NavbarProps {
  onToggleMobileMenu: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleMobileMenu }) => {
  const {
    currentUser,
    activeRole,
    activeTab,
    theme,
    toggleTheme,
    loginAs,
    logout,
    notices,
    unreadNoticesCount,
    markNoticeRead,
    setActiveTab
  } = useApp();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  const roles: { role: UserRole; label: string; desc: string; icon: string }[] = [
    { role: 'student', label: 'Student (Aarav)', desc: 'Roll: CS2023041 • Sem 5', icon: '👨‍🎓' },
    { role: 'faculty', label: 'Faculty (Prof. Rao)', desc: 'CSE Dept • Course Head', icon: '👩‍🏫' },
    { role: 'parent', label: 'Parent (Rajesh)', desc: "Parent of Aarav Sharma", icon: '👨‍👧' },
    { role: 'admin', label: 'Dean / Admin (Dr. Raman)', desc: 'Academic Admin & Registrar', icon: '🏛️' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 dark:bg-slate-900/95 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Mobile menu toggle + Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <button
            onClick={() => setActiveTab(currentUser ? (currentUser.role === 'student' ? 'student-dashboard' : `${currentUser.role}-portal`) : 'landing')}
            className="flex items-center gap-2.5 group text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">Smart College</span>
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
                  <Sparkles className="w-2.5 h-2.5" /> AI 2026
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">Digital Campus Companion</p>
            </div>
          </button>
        </div>

        {/* Center: Live Role Badge & Fast Switcher */}
        {currentUser && (
          <div className="relative hidden md:block">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-200 bg-blue-50/70 hover:bg-blue-100/80 text-blue-900 dark:border-blue-800/80 dark:bg-blue-950/40 dark:text-blue-200 transition-all text-xs font-semibold"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="capitalize">Role: {activeRole}</span>
              <span className="text-slate-400">|</span>
              <span className="font-normal text-slate-600 dark:text-slate-300 max-w-[120px] truncate">{currentUser.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            </button>

            {showRoleMenu && (
              <div className="absolute left-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Switch Demo Role</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Test different user perspectives instant</p>
                </div>
                <div className="space-y-1 mt-1">
                  {roles.map(r => (
                    <button
                      key={r.role}
                      onClick={() => {
                        loginAs(r.role);
                        setShowRoleMenu(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition-colors ${
                        activeRole === r.role
                          ? 'bg-blue-50 text-blue-700 font-semibold dark:bg-blue-900/40 dark:text-blue-300'
                          : 'hover:bg-slate-50 text-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">{r.icon}</span>
                        <div>
                          <p className="font-medium">{r.label}</p>
                          <p className="text-[10px] text-slate-400">{r.desc}</p>
                        </div>
                      </div>
                      {activeRole === r.role && <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Right Action Icons: Notification, Theme, Profile/Logout */}
        <div className="flex items-center gap-2">
          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              className="relative p-2 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
              title="Notices & Alerts"
            >
              <Bell className="w-5 h-5" />
              {unreadNoticesCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {unreadNoticesCount}
                </span>
              )}
            </button>

            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-3 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-800 dark:text-slate-100">Campus Notices</span>
                    {unreadNoticesCount > 0 && (
                      <span className="px-2 py-0.5 text-[11px] font-semibold bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300 rounded-full">
                        {unreadNoticesCount} new
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setActiveTab('notifications');
                      setShowNotifMenu(false);
                    }}
                    className="text-xs text-blue-600 hover:underline dark:text-blue-400"
                  >
                    View All
                  </button>
                </div>

                <div className="max-h-72 overflow-y-auto space-y-2">
                  {notices.slice(0, 4).map(notice => (
                    <div
                      key={notice.id}
                      onClick={() => {
                        markNoticeRead(notice.id);
                        setActiveTab('notifications');
                        setShowNotifMenu(false);
                      }}
                      className={`p-2.5 rounded-xl text-xs cursor-pointer transition-all border ${
                        !notice.read
                          ? 'bg-blue-50/80 border-blue-200 dark:bg-blue-950/40 dark:border-blue-900'
                          : 'bg-slate-50 border-slate-100 dark:bg-slate-800/50 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-semibold text-slate-900 dark:text-white line-clamp-1">{notice.title}</span>
                        {notice.priority === 'urgent' && (
                          <span className="text-[10px] uppercase font-bold text-rose-600 bg-rose-100 dark:bg-rose-950 px-1.5 py-0.5 rounded">
                            Urgent
                          </span>
                        )}
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 text-[11px]">{notice.content}</p>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2">
                        <span>{notice.category}</span>
                        <span>{notice.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-600 hover:text-amber-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-amber-400 dark:hover:bg-slate-800 transition-colors"
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>

          {/* User profile & session */}
          {currentUser ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setActiveTab('profile-settings')}
                className="flex items-center gap-2 group text-left"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/30 group-hover:ring-blue-500 transition-all"
                />
                <div className="hidden xl:block">
                  <p className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    {currentUser.name}
                  </p>
                  <p className="text-[10px] text-slate-400 capitalize">{currentUser.role}</p>
                </div>
              </button>

              <button
                onClick={logout}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setActiveTab('login')}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition-all"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
