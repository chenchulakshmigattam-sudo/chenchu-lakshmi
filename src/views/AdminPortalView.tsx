import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldAlert,
  Users,
  Building,
  GraduationCap,
  Activity,
  Bell,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  PlusCircle,
  ToggleLeft,
  ToggleRight,
  Send,
  Database
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AdminPortalView: React.FC = () => {
  const {
    currentUser,
    rooms,
    toggleRoomOccupancy,
    notices,
    addNotice,
    attendance
  } = useApp();

  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastContent, setBroadcastContent] = useState('');
  const [broadcastPriority, setBroadcastPriority] = useState<'normal' | 'high' | 'urgent'>('urgent');
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    await addNotice({
      title: broadcastTitle,
      content: broadcastContent,
      category: 'General',
      priority: broadcastPriority,
      postedBy: 'Dean & Academic Administration'
    });
    setBroadcastSuccess(true);
    setBroadcastTitle('');
    setBroadcastContent('');
    setTimeout(() => setBroadcastSuccess(false), 3000);
    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } catch (e) {}
  };

  const departments = [
    { name: 'Computer Science & Engineering', students: 480, faculty: 32, avgAttendance: '84.2%' },
    { name: 'Electronics & Communication', students: 360, faculty: 24, avgAttendance: '86.1%' },
    { name: 'Artificial Intelligence & Data Science', students: 320, faculty: 22, avgAttendance: '88.5%' },
    { name: 'Mechanical & Robotics', students: 260, faculty: 20, avgAttendance: '82.0%' }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-slate-800">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold backdrop-blur-sm border border-white/20">
            <ShieldAlert className="w-4 h-4 text-amber-400" /> Academic Administration Master Console
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {currentUser?.name || 'Dr. K. Raman'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Dean of Academic Administration & Registrar • Apex Institute of Technology & Science
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-950/80 text-emerald-400 border border-emerald-800 text-xs font-bold flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 animate-pulse" /> All Campus Systems Operational
          </span>
        </div>
      </div>

      {/* 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Enrolled Students</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">1,420</span>
            <span className="text-xs font-semibold text-emerald-600">Active</span>
          </div>
          <p className="text-[11px] text-slate-500">Across 4 Engineering Departments</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Teaching Faculty</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">98</span>
            <span className="text-xs font-semibold text-blue-600">Professors</span>
          </div>
          <p className="text-[11px] text-slate-500">Ph.D & Industry Mentors</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Classrooms & Labs</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{rooms.length}</span>
            <span className="text-xs font-semibold text-purple-600">Active Facilities</span>
          </div>
          <p className="text-[11px] text-slate-500">
            {rooms.filter(r => !r.isOccupied).length} currently available
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Campus Uptime</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-600">99.8%</span>
            <span className="text-xs font-semibold text-slate-500">Node Cluster</span>
          </div>
          <p className="text-[11px] text-slate-500">Biometrics & AI Engine Syncing</p>
        </div>
      </div>

      {/* Main Grid: Broadcast Circular & Room Master Control */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Broadcast Announcement (6 Cols) */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Bell className="w-4 h-4 text-blue-600" /> College-Wide Broadcast Dispatcher
              </h3>
              <p className="text-xs text-slate-500">Pushes priority circulars instantly to all student & parent portals</p>
            </div>
            {broadcastSuccess && (
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                Broadcast Published!
              </span>
            )}
          </div>

          <form onSubmit={handleBroadcast} className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Circular Headline</label>
              <input
                type="text"
                required
                value={broadcastTitle}
                onChange={e => setBroadcastTitle(e.target.value)}
                placeholder="e.g. Campus Holiday Notice or Examination Hall Guideline"
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Broadcast Priority</label>
              <select
                value={broadcastPriority}
                onChange={e => setBroadcastPriority(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
              >
                <option value="urgent">Urgent (Red Alert Banner on All Dashboards)</option>
                <option value="high">High Priority</option>
                <option value="normal">Standard Notice</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Official Circular Body</label>
              <textarea
                rows={4}
                required
                value={broadcastContent}
                onChange={e => setBroadcastContent(e.target.value)}
                placeholder="Detail official instructions from the Office of Academic Affairs..."
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md flex items-center gap-2"
            >
              <Send className="w-3.5 h-3.5" /> Dispatch Institutional Notice
            </button>
          </form>
        </div>

        {/* Right: Room & Facility Availability Master Control (6 Cols) */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="border-b pb-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Building className="w-4 h-4 text-purple-600" /> Facility Occupancy Master Control
            </h3>
            <p className="text-xs text-slate-500">Toggle live status of classrooms, labs, and auditoriums</p>
          </div>

          <div className="max-h-96 overflow-y-auto space-y-2.5 pr-1">
            {rooms.map(room => (
              <div
                key={room.id}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 dark:text-white">{room.roomNumber}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 font-semibold">
                      {room.building}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {room.name} • Capacity: {room.capacity}
                  </p>
                  {room.currentActivity && (
                    <p className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">
                      Active: {room.currentActivity}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                      room.isOccupied
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                    }`}
                  >
                    {room.isOccupied ? 'Occupied' : 'Free / Available'}
                  </span>

                  <button
                    onClick={() => toggleRoomOccupancy(room.id, 'Ad-hoc Faculty Seminar')}
                    className="p-1 rounded-lg text-slate-400 hover:text-blue-600"
                    title="Toggle occupancy state"
                  >
                    {room.isOccupied ? (
                      <ToggleRight className="w-6 h-6 text-rose-600" />
                    ) : (
                      <ToggleLeft className="w-6 h-6 text-emerald-600" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Department Analytics Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">Academic Departments Health Summary</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b text-slate-400 font-bold uppercase text-[10px]">
                <th className="py-2.5 px-3">Department</th>
                <th className="py-2.5 px-3 text-center">Enrolled Students</th>
                <th className="py-2.5 px-3 text-center">Faculty Count</th>
                <th className="py-2.5 px-3 text-center">Average Attendance</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {departments.map((dept, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">{dept.name}</td>
                  <td className="py-3 px-3 text-center font-mono">{dept.students}</td>
                  <td className="py-3 px-3 text-center font-mono">{dept.faculty}</td>
                  <td className="py-3 px-3 text-center font-mono font-bold text-blue-600 dark:text-blue-400">
                    {dept.avgAttendance}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700">
                      OPTIMAL
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
