import { useNavigate } from 'react-router-dom';
import { HeroSection } from '../components/portfolio/HeroSection';
import { ServiceCard } from '../components/portfolio/ServiceCard';

export function Home() {
    const navigate = useNavigate();

    return (
        <div className="space-y-12">
            <HeroSection />

            {/* Layers Grid Section */}
            <section id="work" className="px-6 max-w-container mx-auto">
                <div className="mb-10 text-center md:text-left">
                    <h2 className="text-3xl font-bold text-content-primary mb-2 lowercase">craftlayers</h2>
                    <p className="text-content-secondary text-lg">Select a layer to explore my work.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">

                    {/* Design Layer */}
                    <div className="lg:col-span-4">
                        <ServiceCard
                            title="Design Layer"
                            description="Human-centered UX for enterprise platforms."
                            icon={<img src="/assets/images/icon-design.svg" alt="Design" className="w-8 h-8" />}
                            isActive={false} // Removed active state for uniformity
                            onClick={() => navigate('/work/design')}
                            className="bg-surface hover:shadow-lg h-full"
                        />
                    </div>

                    {/* AI Layer */}
                    <div className="lg:col-span-4">
                        <ServiceCard
                            title="AI Layer"
                            description="Exploring AI-driven design automation."
                            icon={<img src="/assets/images/icon-ai.svg" alt="AI" className="w-8 h-8" />}
                            onClick={() => navigate('/work/ai')}
                            className="bg-surface hover:shadow-lg h-full"
                        />
                    </div>

                    {/* Security Layer */}
                    <div className="lg:col-span-4">
                        <ServiceCard
                            title="Security Layer"
                            description="Building trust through secure design."
                            icon={<img src="/assets/images/icon-security.svg" alt="Security" className="w-8 h-8" />}
                            onClick={() => navigate('/work/security')}
                            className="bg-surface hover:shadow-lg h-full"
                        />
                    </div>

                </div>
            </section>


        </div>
    );
}
