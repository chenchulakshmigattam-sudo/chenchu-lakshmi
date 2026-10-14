import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  GraduationCap,
  Sparkles,
  Lock,
  Mail,
  User,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { UserRole } from '../types';

export const AuthView: React.FC = () => {
  const { loginAs, loginWithEmail, setActiveTab } = useApp();

  const [isRegister, setIsRegister] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [email, setEmail] = useState('aarav.sharma@campus.edu');
  const [password, setPassword] = useState('••••••••');
  const [name, setName] = useState('Aarav Sharma');
  const [rollNumber, setRollNumber] = useState('CS2023041');

  const demoPresets = [
    { role: 'student' as UserRole, name: 'Aarav Sharma', email: 'aarav.sharma@campus.edu', roll: 'CS2023041', label: 'Student Login' },
    { role: 'faculty' as UserRole, name: 'Prof. Sunita Rao', email: 'sunita.rao@campus.edu', label: 'Faculty Login' },
    { role: 'parent' as UserRole, name: 'Rajesh Sharma', email: 'rajesh.sharma@gmail.com', label: 'Parent Login' },
    { role: 'admin' as UserRole, name: 'Dr. K. Raman', email: 'dean.academic@campus.edu', label: 'Admin Login' }
  ];

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    const preset = demoPresets.find(p => p.role === role);
    if (preset) {
      setEmail(preset.email);
      setName(preset.name);
      if (preset.roll) setRollNumber(preset.roll);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginWithEmail(email, selectedRole);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Logo Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 mx-auto flex items-center justify-center text-white shadow-xl shadow-blue-500/25">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Smart College Assistant
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isRegister ? 'Create your official campus identity' : 'Access your role-based academic dashboard'}
          </p>
        </div>

        {/* Auth Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
          {/* Role Selector Tabs */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Select Your Role
            </label>
            <div className="grid grid-cols-4 gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800">
              {(['student', 'faculty', 'parent', 'admin'] as UserRole[]).map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => handleRoleChange(r)}
                  className={`py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                    selectedRole === r
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {isRegister && (
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Enter full name"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>
            )}

            {isRegister && selectedRole === 'student' && (
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Roll Number</label>
                <input
                  type="text"
                  required
                  value={rollNumber}
                  onChange={e => setRollNumber(e.target.value)}
                  placeholder="e.g. CS2023041"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                />
              </div>
            )}

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@campus.edu"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-1.5"
            >
              <span>{isRegister ? 'Register Campus Account' : `Sign In as ${selectedRole}`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* One-click demo triggers */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block text-center">
              Or Launch Instant Demo Account
            </span>
            <div className="grid grid-cols-2 gap-2">
              {demoPresets.map(p => (
                <button
                  key={p.role}
                  type="button"
                  onClick={() => loginAs(p.role)}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300 text-left transition-colors flex items-center gap-1.5 truncate"
                >
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  <span className="truncate">{p.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="text-center pt-2 text-xs text-slate-500">
            {isRegister ? (
              <p>
                Already have an account?{' '}
                <button
                  onClick={() => setIsRegister(false)}
                  className="font-bold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Sign In
                </button>
              </p>
            ) : (
              <p>
                New student or faculty?{' '}
                <button
                  onClick={() => setIsRegister(true)}
                  className="font-bold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Register Now
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
