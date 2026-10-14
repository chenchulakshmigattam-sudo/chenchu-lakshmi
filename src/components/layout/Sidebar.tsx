import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  CalendarCheck,
  FileSpreadsheet,
  Clock,
  BookOpenCheck,
  BrainCircuit,
  Calculator,
  CalendarDays,
  Bot,
  Users,
  Briefcase,
  ShieldAlert,
  MapPin,
  Bell,
  FileText,
  UserCircle2,
  Home,
  AlertTriangle,
  X,
  CreditCard,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  show: boolean;
  highlight?: boolean;
  isAi?: boolean;
  badge?: string;
  badgeColor?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const { activeTab, setActiveTab, activeRole, currentUser, attendance, assignments, unreadNoticesCount } = useApp();

  // Check if any subject attendance is below 75%
  const hasAttendanceShortage = attendance.some(a => a.percentage < 75);
  const pendingAssignmentsCount = assignments.filter(a => a.status === 'pending').length;

  const navSections: NavSection[] = [
    {
      title: 'Portals & Dashboards',
      items: [
        { id: 'landing', label: 'Home / Overview', icon: Home, show: true },
        { id: 'student-dashboard', label: 'Student Dashboard', icon: LayoutDashboard, show: true, highlight: activeRole === 'student' },
        { id: 'faculty-portal', label: 'Faculty Portal', icon: Briefcase, show: true, highlight: activeRole === 'faculty' },
        { id: 'parent-portal', label: 'Parent Portal', icon: Users, show: true, highlight: activeRole === 'parent' },
        { id: 'admin-portal', label: 'Admin Console', icon: ShieldAlert, show: true, highlight: activeRole === 'admin' }
      ]
    },
    {
      title: 'Academics & Schedule',
      items: [
        {
          id: 'attendance',
          label: 'Attendance Tracking',
          icon: CalendarCheck,
          show: true,
          badge: hasAttendanceShortage ? 'Alert <75%' : undefined,
          badgeColor: 'bg-rose-500 text-white'
        },
        { id: 'marks-results', label: 'Internal Marks & GPA', icon: FileSpreadsheet, show: true },
        { id: 'timetable-exams', label: 'Timetable & Exams', icon: Clock, show: true },
        {
          id: 'assignments',
          label: 'Assignments',
          icon: BookOpenCheck,
          show: true,
          badge: pendingAssignmentsCount > 0 ? `${pendingAssignmentsCount} Due` : undefined,
          badgeColor: 'bg-amber-500 text-white'
        }
      ]
    },
    {
      title: 'AI Companion Engine',
      items: [
        { id: 'ai-attendance-predictor', label: 'AI Attendance Forecast', icon: BrainCircuit, show: true, isAi: true },
        { id: 'ai-cgpa-predictor', label: 'CGPA Predictor', icon: Calculator, show: true, isAi: true },
        { id: 'smart-study-planner', label: 'Smart Study Planner', icon: CalendarDays, show: true, isAi: true },
        { id: 'ai-chatbot', label: 'AI Academic Companion', icon: Bot, show: true, isAi: true }
      ]
    },
    {
      title: 'Campus Services & Welfare',
      items: [
        { id: 'campus-map', label: 'Campus Map & Rooms', icon: MapPin, show: true },
        {
          id: 'notifications',
          label: 'Notices & Circulars',
          icon: Bell,
          show: true,
          badge: unreadNoticesCount > 0 ? `${unreadNoticesCount}` : undefined,
          badgeColor: 'bg-blue-600 text-white'
        },
        { id: 'leave-applications', label: 'Leave Applications', icon: FileText, show: true },
        { id: 'fees-ledger', label: 'Fee Structure & Pay', icon: CreditCard, show: true },
        { id: 'profile-settings', label: 'Profile & Settings', icon: UserCircle2, show: true }
      ]
    }
  ];

  const handleSelectTab = (tabId: string) => {
    setActiveTab(tabId);
    onCloseMobile();
  };

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between py-4 px-3">
      {/* Scrollable menu links */}
      <div className="space-y-6 overflow-y-auto pr-1">
        {navSections.map((section, idx) => (
          <div key={idx}>
            <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
              {section.title}
            </p>
            <div className="space-y-1">
              {section.items.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 dark:bg-blue-600'
                        : 'text-slate-700 hover:text-blue-600 hover:bg-blue-50/70 dark:text-slate-300 dark:hover:text-blue-400 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon
                        className={`w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110 ${
                          isActive
                            ? 'text-white'
                            : item.isAi
                            ? 'text-indigo-500 dark:text-indigo-400'
                            : 'text-slate-500 group-hover:text-blue-600 dark:text-slate-400 dark:group-hover:text-blue-400'
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {item.isAi && !isActive && (
                        <Sparkles className="w-3 h-3 text-indigo-400 animate-pulse" />
                      )}
                      {item.badge && (
                        <span
                          className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
                            isActive ? 'bg-white/20 text-white' : item.badgeColor
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Role mini card at bottom */}
      {currentUser && (
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
          <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 flex items-center gap-2.5">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-500"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{currentUser.name}</p>
              <p className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wider">
                {currentUser.role}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 h-[calc(100vh-4rem)] sticky top-16 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-30 transition-colors">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="fixed inset-y-0 left-0 w-72 bg-white dark:bg-slate-900 shadow-2xl flex flex-col z-50 animate-in slide-in-from-left duration-200">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="font-extrabold text-slate-900 dark:text-white text-sm">Navigation Menu</span>
              <button
                onClick={onCloseMobile}
                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">{sidebarContent}</div>
          </div>
        </div>
      )}
    </>
  );
};
