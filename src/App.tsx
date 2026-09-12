import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';

// The Library is lazy-loaded. Its reader pulls in react-markdown + remark-gfm,
// which added ~182 kB (~55 kB gzip) to the main bundle when imported eagerly —
// a cost paid by every visitor, including those who never open the Library.
const Library = lazy(() => import('./pages/library/Library').then((m) => ({ default: m.Library })));
const HandbookLanding = lazy(() => import('./pages/library/HandbookLanding').then((m) => ({ default: m.HandbookLanding })));
const HandbookChapter = lazy(() => import('./pages/library/HandbookChapter').then((m) => ({ default: m.HandbookChapter })));
import { LayoutShell } from './components/layout/LayoutShell';
import { Home } from './pages/Home';
// About.tsx is retained on disk until the Profile route has been reviewed,
// but is no longer routed — /about redirects to /profile.
import { Profile } from './pages/Profile';
import { Contact } from './pages/Contact';
import { ForRole } from './pages/ForRole';
import { BlogListing } from './pages/blog/BlogListing';
import { BlogPost } from './pages/blog/BlogPost';
import { Inwards } from './pages/work/Inwards';
import { Enculture } from './pages/work/Enculture';
import { UserDashboard } from './pages/work/UserDashboard';
import { TherapistDashboard } from './pages/work/TherapistDashboard';
import { CultureDashboard } from './components/dashboard/CultureDashboard';
import { CrawlerTracker } from './pages/CrawlerTracker';
import { Works } from './pages/work/Works';
import { RespondentExperience } from './pages/work/RespondentExperience';
import { DashboardExplainability } from './pages/work/DashboardExplainability';
import { DesignSystemGovernance } from './pages/work/DesignSystemGovernance';
import { Governance } from './pages/work/Governance';
import { DesignLayers } from './pages/layers/DesignLayers';
import { AILayers } from './pages/layers/AILayers';
import { SecurityLayers } from './pages/layers/SecurityLayers';

import { ArchitecturingGovernance } from './pages/work/ArchitecturingGovernance';

import { ScrollToTop as ScrollHandler } from './components/layout/ScrollToTop';

function LibraryFallback() {
    return (
        <p className="cl-text-200 cl-text-neutral-text-low-contrast py-20" role="status">
            Loading…
        </p>
    );
}

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
          <Route path="/library" element={<Suspense fallback={<LibraryFallback />}><Library /></Suspense>} />
          <Route path="/library/ai-product-development" element={<Suspense fallback={<LibraryFallback />}><HandbookLanding /></Suspense>} />
          <Route path="/library/ai-product-development/:chapterSlug" element={<Suspense fallback={<LibraryFallback />}><HandbookChapter /></Suspense>} />
          <Route path="/blog" element={<BlogListing />} />
          <Route path="/blog/secure-ux" element={<BlogPost />} />
          <Route path="/blog/governance" element={<Governance />} />
          <Route path="/work" element={<Works />} />
          <Route path="/work/respondent-experience" element={<RespondentExperience />} />
          <Route path="/work/dashboard-explainability" element={<DashboardExplainability />} />
          <Route path="/work/design" element={<DesignLayers />} />
          <Route path="/work/design-system-governance" element={<DesignSystemGovernance />} />

          <Route path="/work/architecturing-governance" element={<ArchitecturingGovernance />} />
          <Route path="/work/ai" element={<AILayers />} />
          <Route path="/work/security" element={<SecurityLayers />} />
          <Route path="/work/inwards" element={<Inwards />} />
          <Route path="/work/inwards/user" element={<UserDashboard />} />
          <Route path="/work/inwards/therapist" element={<TherapistDashboard />} />
          <Route path="/work/enculture" element={<Enculture />} />
          <Route path="/dashboard/culture" element={<CultureDashboard />} />
          {/* Internal. Not in the nav, and disallowed in robots.txt — the
              session gate is what actually keeps it private. */}
          <Route path="/dashboard/crawlers" element={<CrawlerTracker />} />
          <Route path="/contact" element={<Contact />} />
          {/* Role-specific readings of the existing evidence. Not in the nav —
              these are links you send someone. */}
          <Route path="/for/:slug" element={<ForRole />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
