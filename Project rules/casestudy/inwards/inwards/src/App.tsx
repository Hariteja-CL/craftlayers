import { useState } from 'react';
import { CaseStudyHero } from './components/CaseStudyHero';
import { RoleSelection } from './components/RoleSelection';
import { UserDashboard } from './components/UserDashboard';
import { TherapistDashboard } from './components/TherapistDashboard';
import { MobileDemo } from './components/MobileDemo';
import { TherapistDemo } from './components/TherapistDemo';
import { MainLandingPage } from './components/MainLandingPage';
import { CaseStudy } from './components/CaseStudy';

type View = 'case-study' | 'main' | 'hero' | 'role-selection' | 'user' | 'therapist' | 'mobile' | 'therapist-demo';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('case-study');

  const handleOpenUserDashboard = () => {
    setCurrentView('user');
  };

  const handleOpenTherapistDashboard = () => {
    setCurrentView('therapist');
  };

  const handleBackToHero = () => {
    setCurrentView('hero');
  };

  const handleBackToRoleSelection = () => {
    setCurrentView('role-selection');
  };

  const handleSelectRole = (role: 'user' | 'therapist') => {
    setCurrentView(role);
  };

  const handleSelectMobileUser = () => {
    setCurrentView('mobile');
  };

  const handleSelectDesktopTherapist = () => {
    setCurrentView('therapist-demo');
  };

  const handleBackToMain = () => {
    setCurrentView('main');
  };

  const handleBackToCaseStudy = () => {
    setCurrentView('case-study');
  };

  const handleViewPrototype = () => {
    setCurrentView('main');
  };

  const handleViewUserDashboard = () => {
    setCurrentView('mobile');
  };

  const handleViewTherapistDashboard = () => {
    setCurrentView('therapist-demo');
  };

  if (currentView === 'case-study') {
    return (
      <CaseStudy
        onViewPrototype={handleViewPrototype}
        onViewUserDashboard={handleViewUserDashboard}
        onViewTherapistDashboard={handleViewTherapistDashboard}
      />
    );
  }

  if (currentView === 'main') {
    return (
      <MainLandingPage
        onSelectUser={handleSelectMobileUser}
        onSelectTherapist={handleSelectDesktopTherapist}
      />
    );
  }

  if (currentView === 'mobile') {
    return <MobileDemo onBack={handleBackToCaseStudy} />;
  }

  if (currentView === 'therapist-demo') {
    return <TherapistDemo onBack={handleBackToCaseStudy} />;
  }

  if (currentView === 'hero') {
    return (
      <CaseStudyHero
        onOpenUserDashboard={handleOpenUserDashboard}
        onOpenTherapistDashboard={handleOpenTherapistDashboard}
      />
    );
  }

  if (currentView === 'role-selection') {
    return <RoleSelection onSelectRole={handleSelectRole} />;
  }

  if (currentView === 'user') {
    return <UserDashboard onBack={handleBackToHero} />;
  }

  if (currentView === 'therapist') {
    return <TherapistDashboard onBack={handleBackToHero} />;
  }

  return null;
}