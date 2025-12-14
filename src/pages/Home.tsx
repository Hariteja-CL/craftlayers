import { useNavigate } from 'react-router-dom';
import { HeroSection } from '../components/portfolio/HeroSection';
import { ServiceCard } from '../components/portfolio/ServiceCard';
import { ProfileSection } from '../components/portfolio/ProfileSection';


export function Home() {
    const navigate = useNavigate();

    return (
        <div className="space-y-4 pb-20">
            <HeroSection />

            {/* Main Bento Grid Section */}
            <section id="work" className="px-6 max-w-container mx-auto">
                {/* Section Header */}
                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="text-left">
                        <h2 className="text-4xl font-extrabold text-[#1A1A1A] mb-2 tracking-tight">The Craft Layers</h2>
                        <p className="text-gray-500 text-lg">My professional portfolio and personal brand ecosystem.</p>
                    </div>
                    <div className="text-gray-400 font-mono text-xs tracking-widest uppercase mb-1">
                        EST. 2025
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">

                    {/* Row 1, Item 1: Design Layer (Light, Large) */}
                    <div className="md:col-span-5 lg:col-span-5">
                        <ServiceCard
                            title="Design Layer"
                            description="Human-centered UX for complex enterprise platforms. Specializing in Design Systems that scale."
                            icon={<img src="/assets/images/icon-design.svg" alt="" className="w-6 h-6" />}
                            variant="light"
                            onClick={() => navigate('/work/design')}
                            className="h-full min-h-[320px]"
                        />
                    </div>

                    {/* Row 1, Item 2: AI Layer (Dark, Large) */}
                    <div className="md:col-span-7 lg:col-span-7">
                        <ServiceCard
                            title="AI Layer"
                            description="Generative UI & Adaptive flows. Exploring how AI automates design without losing soul."
                            icon={<img src="/assets/images/icon-ai.svg" alt="" className="w-6 h-6 invert opacity-90" />} // Invert icon for dark mode
                            variant="dark"
                            onClick={() => navigate('/work/ai')}
                            className="h-full min-h-[320px]"
                        />
                    </div>

                    {/* Row 2, Item 1: Security Layer (Light, Small) */}
                    <div className="md:col-span-4 lg:col-span-4">
                        <ServiceCard
                            title="Security Layer"
                            description="Building trust through secure design patterns. Privacy UX & Identity management."
                            icon={<img src="/assets/images/icon-security.svg" alt="" className="w-6 h-6" />}
                            variant="light"
                            onClick={() => navigate('/work/security')}
                            className="h-full min-h-[280px]"
                        />
                    </div>

                    {/* Row 2, Item 2: Profile Section (Custom, Wide) */}
                    <div className="md:col-span-8 lg:col-span-8">
                        <ProfileSection />
                    </div>

                </div>
            </section>
        </div>
    );
}
