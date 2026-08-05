import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LayoutShell } from './components/layout/LayoutShell';
import { Home } from './pages/Home';
// About.tsx is retained on disk until the Profile route has been reviewed,
// but is no longer routed — /about redirects to /profile.
import { Profile } from './pages/Profile';
import { Contact } from './pages/Contact';
import { BlogListing } from './pages/blog/BlogListing';
import { BlogPost } from './pages/blog/BlogPost';
import { Inwards } from './pages/work/Inwards';
import { Enculture } from './pages/work/Enculture';
import { UserDashboard } from './pages/work/UserDashboard';
import { TherapistDashboard } from './pages/work/TherapistDashboard';
import { CultureDashboard } from './components/dashboard/CultureDashboard';
import { Works } from './pages/work/Works';
import { RespondentExperience } from './pages/work/RespondentExperience';
import { DashboardExplainability } from './pages/work/DashboardExplainability';
import { Governance } from './pages/work/Governance';
import { DesignLayers } from './pages/layers/DesignLayers';
import { AILayers } from './pages/layers/AILayers';
import { SecurityLayers } from './pages/layers/SecurityLayers';

import { ArchitecturingGovernance } from './pages/work/ArchitecturingGovernance';

import { ScrollToTop as ScrollHandler } from './components/layout/ScrollToTop';

function App() {
  return (
    <Router>
      <ScrollHandler />
      <Routes>
        <Route element={<LayoutShell />}>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          {/* /about now lives at /profile. Client-side redirect for in-app
              navigation; vercel.json handles direct requests. About.tsx is
              retained until the Profile route has been reviewed. */}
          <Route path="/about" element={<Navigate to="/profile" replace />} />
          <Route path="/blog" element={<BlogListing />} />
          <Route path="/blog/secure-ux" element={<BlogPost />} />
          <Route path="/blog/governance" element={<Governance />} />
          <Route path="/work" element={<Works />} />
          <Route path="/work/respondent-experience" element={<RespondentExperience />} />
          <Route path="/work/dashboard-explainability" element={<DashboardExplainability />} />
          <Route path="/work/design" element={<DesignLayers />} />

          <Route path="/work/architecturing-governance" element={<ArchitecturingGovernance />} />
          <Route path="/work/ai" element={<AILayers />} />
          <Route path="/work/security" element={<SecurityLayers />} />
          <Route path="/work/inwards" element={<Inwards />} />
          <Route path="/work/inwards/user" element={<UserDashboard />} />
          <Route path="/work/inwards/therapist" element={<TherapistDashboard />} />
          <Route path="/work/enculture" element={<Enculture />} />
          <Route path="/dashboard/culture" element={<CultureDashboard />} />
          <Route path="/contact" element={<Contact />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
