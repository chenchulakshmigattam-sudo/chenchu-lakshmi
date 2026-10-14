import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Calendar,
  CreditCard,
  BookOpen,
  Filter,
  CheckCheck
} from 'lucide-react';

export const NotificationsView: React.FC = () => {
  const { notices, markNoticeRead } = useApp();
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filteredNotices = notices.filter(n => {
    if (categoryFilter === 'all') return true;
    return n.category === categoryFilter;
  });

  const markAllRead = () => {
    notices.forEach(n => markNoticeRead(n.id));
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Campus Circulars & Notification Center</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
              {notices.filter(n => !n.read).length} Unread
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Official circulars, examination alerts, attendance shortage warnings, and fee deadlines.
          </p>
        </div>

        <button
          onClick={markAllRead}
          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5"
        >
          <CheckCheck className="w-4 h-4 text-blue-600" /> Mark All as Read
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        {['all', 'Academic', 'Exam', 'Attendance', 'Fees', 'Event'].map(cat => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
              categoryFilter === cat
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
            }`}
          >
            {cat === 'all' ? 'All Notices' : cat}
          </button>
        ))}
      </div>

      {/* Notice Cards Feed */}
      <div className="space-y-4">
        {filteredNotices.map(notice => {
          const isUrgent = notice.priority === 'urgent';
          const isHigh = notice.priority === 'high';

          return (
            <div
              key={notice.id}
              onClick={() => markNoticeRead(notice.id)}
              className={`p-6 rounded-3xl border-2 transition-all hover:shadow-md cursor-pointer space-y-3 ${
                !notice.read
                  ? isUrgent
                    ? 'border-rose-400 bg-rose-50/30 dark:bg-rose-950/20'
                    : 'border-blue-400 bg-blue-50/30 dark:bg-blue-950/20'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  {!notice.read && (
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse flex-shrink-0" />
                  )}
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                      notice.category === 'Attendance'
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                        : notice.category === 'Exam'
                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                        : notice.category === 'Fees'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                    }`}
                  >
                    {notice.category}
                  </span>

                  {isUrgent && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-rose-600 text-white">
                      Urgent Action
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                  <span>{notice.date}</span>
                  <span>•</span>
                  <span>Posted by: {notice.postedBy}</span>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{notice.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  {notice.content}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-400">
                <span className="capitalize">Target Audience: {notice.targetRoles.join(', ')}</span>
                <span className="font-semibold text-blue-600 dark:text-blue-400">
                  {notice.read ? 'Acknowledged' : 'Click to acknowledge'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
