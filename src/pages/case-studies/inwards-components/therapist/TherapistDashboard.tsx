import { useState } from 'react';
import { Home, User, TrendingUp, FileText, ClipboardList, ArrowLeft } from 'lucide-react';
import { TherapistHome } from './TherapistHome';
import { PatientProfile } from './PatientProfile';
import { EmotionalTimeline } from './EmotionalTimeline';
import { SentimentAnalysis } from './SentimentAnalysis';
import { ActionsPanel } from './ActionsPanel';

type Page = 'home' | 'profile' | 'timeline' | 'sentiment' | 'actions';

interface TherapistDashboardMainProps {
  onBack: () => void;
}

export function TherapistDashboardMain({ onBack }: TherapistDashboardMainProps) {
  const [activePage, setActivePage] = useState<Page>('home');

  const navigation = [
    { id: 'home' as Page, label: 'Dashboard', icon: Home },
    { id: 'profile' as Page, label: 'Patient Profile', icon: User },
    { id: 'timeline' as Page, label: 'Emotional Timeline', icon: TrendingUp },
    { id: 'sentiment' as Page, label: 'Sentiment Analysis', icon: FileText },
    { id: 'actions' as Page, label: 'Actions', icon: ClipboardList },
  ];

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <TherapistHome />;
      case 'profile':
        return <PatientProfile />;
      case 'timeline':
        return <EmotionalTimeline />;
      case 'sentiment':
        return <SentimentAnalysis />;
      case 'actions':
        return <ActionsPanel />;
      default:
        return <TherapistHome />;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      {/* Sidebar Navigation */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-neutral-200 p-6 flex flex-col">
        <div className="mb-8">
          <h1 className="text-neutral-900">Inwards</h1>
          <p className="text-neutral-500 text-sm mt-1">Therapist Portal</p>
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
                    ? 'bg-purple-50 text-purple-600'
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
