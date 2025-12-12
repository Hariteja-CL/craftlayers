import { useNavigate } from 'react-router-dom';
import { HeroSection } from '../components/portfolio/HeroSection';
import { ServiceCard } from '../components/portfolio/ServiceCard';
import { ProfileSection } from '../components/portfolio/ProfileSection';

export function Home() {
    const navigate = useNavigate();

    return (
        <div className="space-y-12">
            <HeroSection />

            {/* Layers Grid Section */}
            <section id="work" className="px-6 max-w-container mx-auto">
                <div className="mb-10 text-left">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">The Craft Layers</h2>
                    <p className="text-content-secondary text-lg">Select a dimension to explore my work.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">

                    {/* Design Layer */}
                    <div className="lg:col-span-4">
                        <ServiceCard
                            title="Design Layer"
                            description="Human-centered UX for enterprise platforms"
                            icon={<div className="text-orange-400"><img src="/assets/images/icon-design.svg" alt="" className="w-6 h-6" /></div>}
                            onClick={() => navigate('/work/design')}
                            className="h-full border border-gray-200"
                        />
                    </div>

                    {/* AI Layer */}
                    <div className="lg:col-span-4">
                        <ServiceCard
                            title="AI Layer"
                            description="Exploring AI-driven design automation"
                            icon={<div className="text-yellow-500"><img src="/assets/images/icon-ai.svg" alt="" className="w-6 h-6" /></div>}
                            onClick={() => navigate('/work/ai')}
                            className="h-full border border-gray-200"
                        />
                    </div>

                    {/* Security Layer */}
                    <div className="lg:col-span-4">
                        <ServiceCard
                            title="Security Layer"
                            description="Building trust through secure design"
                            icon={<div className="text-green-500"><img src="/assets/images/icon-security.svg" alt="" className="w-6 h-6" /></div>}
                            onClick={() => navigate('/work/security')}
                            className="h-full border border-gray-200"
                        />
                    </div>

                </div>
            </section>

            <ProfileSection />
        </div>
    );
}
