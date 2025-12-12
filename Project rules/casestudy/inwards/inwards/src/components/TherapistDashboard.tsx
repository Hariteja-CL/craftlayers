import { ArrowLeft } from 'lucide-react';
import { TherapistDashboardMain } from './therapist/TherapistDashboard';

interface TherapistDashboardProps {
  onBack: () => void;
}

export function TherapistDashboard({ onBack }: TherapistDashboardProps) {
  return <TherapistDashboardMain onBack={onBack} />;
}