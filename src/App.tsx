import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { ScrollToTop } from "./components/layout/ScrollToTop";
import Home from "./pages/Home";
import BlogListing from "./pages/BlogListing";
import BlogPost from "./pages/BlogPost";
import DesignLayer from "./pages/DesignLayer";
import InwardsCaseStudy from "./pages/case-studies/Inwards";
import UserDemoPage from "./pages/case-studies/UserDemo";
import TherapistDemoPage from "./pages/case-studies/TherapistDemo";

function App() {
    return (
        <Router>
            <ScrollToTop />
            <div className="min-h-screen bg-background font-sans text-foreground antialiased selection:bg-primary/10 selection:text-primary">
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/blog" element={<BlogListing />} />
                    <Route path="/blog/:slug" element={<BlogPost />} />
                    <Route path="/work/design" element={<DesignLayer />} />
                    <Route path="/work/design/inwards" element={<InwardsCaseStudy />} />
                    <Route path="/work/design/inwards/demo/user" element={<UserDemoPage />} />
                    <Route path="/work/design/inwards/demo/therapist" element={<TherapistDemoPage />} />
                    <Route path="*" element={<div className="p-20 text-center"><h1>404 - Page Not Found</h1><p>The requested route does not exist.</p></div>} />
                </Routes>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
