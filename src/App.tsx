import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { Hero } from "./components/home/Hero";
import { ServiceCards } from "./components/home/ServiceCards";
import { ProfileSection } from "./components/home/ProfileSection";

function App() {
    return (
        <div className="min-h-screen bg-background font-sans text-foreground antialiased selection:bg-primary/10 selection:text-primary">
            <Navbar />
            <main className="flex flex-col gap-lg">
                <Hero />
                <ServiceCards />
                <ProfileSection />
            </main>
            <Footer />
        </div>
    );
}

export default App;
