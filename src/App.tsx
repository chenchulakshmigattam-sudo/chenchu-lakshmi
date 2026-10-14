import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';

// Views
import { LandingPage } from './views/LandingPage';
import { AuthView } from './views/AuthView';
import { StudentDashboard } from './views/StudentDashboard';
import { FacultyPortalView } from './views/FacultyPortalView';
import { ParentPortalView } from './views/ParentPortalView';
import { AdminPortalView } from './views/AdminPortalView';
import { AttendanceView } from './views/AttendanceView';
import { MarksResultsView } from './views/MarksResultsView';
import { TimetableExamsView } from './views/TimetableExamsView';
import { AssignmentsView } from './views/AssignmentsView';
import { AiAttendancePredictor } from './views/AiAttendancePredictor';
import { AiCgpaPredictor } from './views/AiCgpaPredictor';
import { SmartStudyPlanner } from './views/SmartStudyPlanner';
import { AiChatbotView } from './views/AiChatbotView';
import { CampusMapView } from './views/CampusMapView';
import { NotificationsView } from './views/NotificationsView';
import { LeaveApplicationView } from './views/LeaveApplicationView';
import { FeesLedgerView } from './views/FeesLedgerView';
import { ProfileSettingsView } from './views/ProfileSettingsView';

const AppContent: React.FC = () => {
  const { activeTab } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'landing':
        return <LandingPage />;
      case 'login':
        return <AuthView />;
      case 'student-dashboard':
        return <StudentDashboard />;
      case 'faculty-portal':
        return <FacultyPortalView />;
      case 'parent-portal':
        return <ParentPortalView />;
      case 'admin-portal':
        return <AdminPortalView />;
      case 'attendance':
        return <AttendanceView />;
      case 'marks-results':
        return <MarksResultsView />;
      case 'timetable-exams':
        return <TimetableExamsView />;
      case 'assignments':
        return <AssignmentsView />;
      case 'ai-attendance-predictor':
        return <AiAttendancePredictor />;
      case 'ai-cgpa-predictor':
        return <AiCgpaPredictor />;
      case 'smart-study-planner':
        return <SmartStudyPlanner />;
      case 'ai-chatbot':
        return <AiChatbotView />;
      case 'campus-map':
        return <CampusMapView />;
      case 'notifications':
        return <NotificationsView />;
      case 'leave-applications':
        return <LeaveApplicationView />;
      case 'fees-ledger':
        return <FeesLedgerView />;
      case 'profile-settings':
        return <ProfileSettingsView />;
      default:
        return <StudentDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex flex-col font-sans transition-colors">
      <Navbar onToggleMobileMenu={() => setMobileMenuOpen(prev => !prev)} />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-6">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
