import { useState } from 'react';
import { Home, TrendingUp, Brain, BookOpen, Lightbulb, ArrowLeft } from 'lucide-react';
import { Dashboard } from './Dashboard';
import { MoodTrends } from './MoodTrends';
import { MeditationInsights } from './MeditationInsights';
import { JournalAnalytics } from './JournalAnalytics';
import { Recommendations } from './Recommendations';

type Page = 'dashboard' | 'mood' | 'meditation' | 'journal' | 'recommendations';

interface UserDashboardProps {
  onBack: () => void;
}

export function UserDashboard({ onBack }: UserDashboardProps) {
  const [activePage, setActivePage] = useState<Page>('dashboard');

  const navigation = [
    { id: 'dashboard' as Page, label: 'Dashboard', icon: Home },
    { id: 'mood' as Page, label: 'Mood Trends', icon: TrendingUp },
    { id: 'meditation' as Page, label: 'Meditation', icon: Brain },
    { id: 'journal' as Page, label: 'Journal', icon: BookOpen },
    { id: 'recommendations' as Page, label: 'Recommendations', icon: Lightbulb },
  ];

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'mood':
        return <MoodTrends />;
      case 'meditation':
        return <MeditationInsights />;
      case 'journal':
        return <JournalAnalytics />;
      case 'recommendations':
        return <Recommendations />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      {/* Sidebar Navigation */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-neutral-200 p-6 flex flex-col">
        <div className="mb-8">
          <h1 className="text-neutral-900">Inwards</h1>
          <p className="text-neutral-500 text-sm mt-1">Wellness Dashboard</p>
        </div>

        <nav className="space-y-2 flex-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activePage === item.id
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                <Icon className="size-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Back Button */}
        <button
          onClick={onBack}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-neutral-600 hover:bg-neutral-50 transition-all mt-4 border-t border-neutral-200 pt-4"
        >
          <ArrowLeft className="size-5" />
          <span>Change Role</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8 flex-1">
        {renderPage()}
      </main>
    </div>
  );
}
