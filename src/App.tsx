import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LayoutShell } from './components/layout/LayoutShell';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { BlogListing } from './pages/blog/BlogListing';
import { BlogPost } from './pages/blog/BlogPost';
import { Inwards } from './pages/work/Inwards';
import { Enculture } from './pages/work/Enculture';
import { UserDashboard } from './pages/work/UserDashboard';
import { TherapistDashboard } from './pages/work/TherapistDashboard';
import { DesignLayers } from './pages/layers/DesignLayers';
import { AILayers } from './pages/layers/AILayers';
import { SecurityLayers } from './pages/layers/SecurityLayers';
import { CultureDashboard } from './components/dashboard/CultureDashboard';

import { ScrollToTop } from './components/layout/ScrollToTop';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route element={<LayoutShell />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<BlogListing />} />
          <Route path="/work/secure-ux" element={<BlogPost />} />
          <Route path="/work/inwards" element={<Inwards />} />
          <Route path="/work/inwards/user" element={<UserDashboard />} />
          <Route path="/work/inwards/therapist" element={<TherapistDashboard />} />
          <Route path="/work/enculture" element={<Enculture />} />

          {/* Layer Pages */}
          <Route path="/work/design" element={<DesignLayers />} />
          <Route path="/work/ai" element={<AILayers />} />
          <Route path="/work/security" element={<SecurityLayers />} />
          <Route path="/dashboard/culture" element={<CultureDashboard />} />

          {/* Dashboards (Done) */}
          <Route path="/contact" element={<div className="p-20 text-center">Contact Page (Coming Soon)</div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
