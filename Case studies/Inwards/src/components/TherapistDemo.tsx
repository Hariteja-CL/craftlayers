import { useState } from 'react';
import { LayoutDashboard, User, TrendingUp, BookOpen, Zap, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TherapistDashboardHome } from './therapist/TherapistDashboardHome';
import { PatientProfileOverview } from './therapist/PatientProfileOverview';
import { EmotionalTimeline } from './therapist/EmotionalTimeline';
import { JournalSentimentAnalysis } from './therapist/JournalSentimentAnalysis';
import { TherapistActionsPanel } from './therapist/TherapistActionsPanel';

type TherapistPage = 'dashboard' | 'profile' | 'timeline' | 'sentiment' | 'actions';

interface TherapistDemoProps {
  onBack?: () => void;
}

export function TherapistDemo({ onBack }: TherapistDemoProps) {
  const [currentPage, setCurrentPage] = useState<TherapistPage>('dashboard');
  const [pageHistory, setPageHistory] = useState<TherapistPage[]>(['dashboard']);

  const navigateToPage = (page: TherapistPage) => {
    setPageHistory([...pageHistory, page]);
    setCurrentPage(page);
  };

  const goBack = () => {
    if (pageHistory.length > 1) {
      const newHistory = [...pageHistory];
      newHistory.pop();
      setPageHistory(newHistory);
      setCurrentPage(newHistory[newHistory.length - 1]);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <TherapistDashboardHome
            onNavigateToProfile={() => navigateToPage('profile')}
            onNavigateToTimeline={() => navigateToPage('timeline')}
            onNavigateToSentiment={() => navigateToPage('sentiment')}
            onNavigateToActions={() => navigateToPage('actions')}
          />
        );
      case 'profile':
        return <PatientProfileOverview />;
      case 'timeline':
        return <EmotionalTimeline />;
      case 'sentiment':
        return <JournalSentimentAnalysis />;
      case 'actions':
        return <TherapistActionsPanel />;
      default:
        return (
          <TherapistDashboardHome
            onNavigateToProfile={() => navigateToPage('profile')}
            onNavigateToTimeline={() => navigateToPage('timeline')}
            onNavigateToSentiment={() => navigateToPage('sentiment')}
            onNavigateToActions={() => navigateToPage('actions')}
          />
        );
    }
  };

  const navItems = [
    { id: 'dashboard' as TherapistPage, icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'profile' as TherapistPage, icon: User, label: 'Patient Profile' },
    { id: 'timeline' as TherapistPage, icon: TrendingUp, label: 'Timeline' },
    { id: 'sentiment' as TherapistPage, icon: BookOpen, label: 'Sentiment' },
    { id: 'actions' as TherapistPage, icon: Zap, label: 'Actions' },
  ];

  return (
    <div className="min-h-screen bg-neutral-100">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-neutral-200 sticky top-0 z-50">
        <div className="max-w-[1440px] mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-lg">⚕️</span>
              </div>
              <div>
                <h2 className="text-neutral-900">Therapist Dashboard</h2>
                <p className="text-neutral-500 text-xs">Dr. Martinez</p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setCurrentPage(item.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                        isActive
                          ? 'bg-orange-500 text-white shadow-sm'
                          : 'text-neutral-600 hover:bg-neutral-100'
                      }`}
                    >
                      <Icon className="size-4" />
                      <span className="text-sm">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Back Button */}
              {onBack && (
                <button
                  onClick={onBack}
                  className="flex items-center gap-2 px-4 py-2 border border-neutral-200 rounded-xl text-neutral-700 hover:bg-neutral-50 transition-all"
                >
                  <ArrowLeft className="size-4" />
                  <span className="text-sm">Back to Home</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Page Content */}
      <div className="min-h-[calc(100vh-80px)]">
        <AnimatePresence exitBeforeEnter>
          <motion.div key={currentPage} className="w-full h-full">
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}