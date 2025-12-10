import { useState } from 'react';
import { Home, TrendingUp, Compass, FileText, Sparkles, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MobileDashboard } from './mobile/MobileDashboard';
import { MobileMoodTrends } from './mobile/MobileMoodTrends';
import { MobileMeditationInsights } from './mobile/MobileMeditationInsights';
import { MobileJournalAnalytics } from './mobile/MobileJournalAnalytics';
import { MobileRecommendations } from './mobile/MobileRecommendations';

type MobilePage = 'dashboard' | 'mood' | 'meditation' | 'journal' | 'recommendations';

interface MobileDemoProps {
  onBack?: () => void;
}

export function MobileDemo({ onBack }: MobileDemoProps) {
  const [currentPage, setCurrentPage] = useState<MobilePage>('dashboard');
  const [pageHistory, setPageHistory] = useState<MobilePage[]>(['dashboard']);

  const navigateToPage = (page: MobilePage) => {
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
          <MobileDashboard
            onNavigateToMood={() => navigateToPage('mood')}
            onNavigateToMeditation={() => navigateToPage('meditation')}
            onNavigateToJournal={() => navigateToPage('journal')}
            onNavigateToRecommendations={() => navigateToPage('recommendations')}
          />
        );
      case 'mood':
        return <MobileMoodTrends onBack={goBack} />;
      case 'meditation':
        return <MobileMeditationInsights onBack={goBack} />;
      case 'journal':
        return <MobileJournalAnalytics onBack={goBack} />;
      case 'recommendations':
        return <MobileRecommendations onBack={goBack} />;
      default:
        return (
          <MobileDashboard
            onNavigateToMood={() => navigateToPage('mood')}
            onNavigateToMeditation={() => navigateToPage('meditation')}
            onNavigateToJournal={() => navigateToPage('journal')}
            onNavigateToRecommendations={() => navigateToPage('recommendations')}
          />
        );
    }
  };

  const navItems = [
    { id: 'dashboard' as MobilePage, icon: Home, label: 'Home' },
    { id: 'mood' as MobilePage, icon: TrendingUp, label: 'Mood' },
    { id: 'meditation' as MobilePage, icon: Compass, label: 'Meditate' },
    { id: 'journal' as MobilePage, icon: FileText, label: 'Journal' },
    { id: 'recommendations' as MobilePage, icon: Sparkles, label: 'For You' },
  ];

  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-8">
      {/* Back Button */}
      {onBack && (
        <button
          onClick={onBack}
          className="absolute top-8 left-8 flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-neutral-200 shadow-sm hover:shadow-md transition-all text-neutral-700 hover:text-neutral-900"
        >
          <ArrowLeft className="size-4" />
          <span className="text-sm">Back to Home</span>
        </button>
      )}

      {/* Mobile Phone Frame */}
      <div className="relative">
        {/* Phone Bezel */}
        <div className="w-[410px] h-[820px] bg-neutral-900 rounded-[48px] p-3 shadow-2xl">
          {/* Screen */}
          <div className="w-full h-full bg-white rounded-[36px] overflow-hidden relative">
            {/* Status Bar */}
            <div className="absolute top-0 left-0 right-0 h-11 bg-white z-50 flex items-center justify-between px-8">
              <span className="text-xs">9:41</span>
              <div className="w-24 h-6 bg-neutral-900 rounded-full" />
              <div className="flex items-center gap-1">
                <div className="w-4 h-3 border border-neutral-900 rounded-sm" />
                <div className="w-1 h-2 bg-neutral-900 rounded-sm" />
              </div>
            </div>

            {/* Content */}
            <div className="absolute top-11 left-0 right-0 bottom-20 overflow-y-auto">
              <AnimatePresence exitBeforeEnter>
                <motion.div
                  key={currentPage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderPage()}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Bottom Navigation */}
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-white border-t border-neutral-200 px-2 flex items-center justify-around">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentPage(item.id)}
                    className="flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all active:scale-95"
                  >
                    <Icon
                      className={`size-5 transition-colors ${
                        isActive ? 'text-orange-500' : 'text-neutral-400'
                      }`}
                    />
                    <span
                      className={`text-xs transition-colors ${
                        isActive ? 'text-orange-500' : 'text-neutral-500'
                      }`}
                    >
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Phone Buttons */}
        <div className="absolute -right-1 top-24 w-1 h-12 bg-neutral-800 rounded-l" />
        <div className="absolute -right-1 top-40 w-1 h-16 bg-neutral-800 rounded-l" />
        <div className="absolute -left-1 top-32 w-1 h-8 bg-neutral-800 rounded-r" />
      </div>
    </div>
  );
}