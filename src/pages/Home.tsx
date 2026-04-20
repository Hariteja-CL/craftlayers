import { useNavigate } from 'react-router-dom';
import { HeroSection } from '../components/portfolio/HeroSection';
import { WorkflowPipeline } from '../components/portfolio/WorkflowPipeline';
import { BusinessImpact } from '../components/portfolio/BusinessImpact';
import { VibeCodingSection } from '../components/portfolio/VibeCodingSection';
import { UXSecuritySection } from '../components/portfolio/UXSecuritySection';
import { ActionFooter } from '../components/portfolio/ActionFooter';
import { ServiceCard } from '../components/portfolio/ServiceCard';
import { ProfileSection } from '../components/portfolio/ProfileSection';

import designIcon from '../assets/images/icon-design.svg';
import aiIcon from '../assets/images/icon-ai.svg';
import securityIcon from '../assets/images/icon-security.svg';

export function Home() {
    const navigate = useNavigate();

    return (
        <div className="cl-bg-neutral-surface-level-0 min-h-screen">
            <HeroSection />
            <div className="max-w-7xl mx-auto px-6 mb-24">
                <ProfileSection />
            </div>

            <WorkflowPipeline />

            <BusinessImpact />

            <VibeCodingSection />

            <UXSecuritySection />

            {/* Selected Work / Design System Layers */}
            <section id="work" className="py-24 cl-bg-neutral-surface-level-0">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="mb-12 text-center">
                        <h2 className="text-3xl font-bold cl-text-neutral-text-high-contrast mb-2 tracking-tight">My System Layers</h2>
                        <p className="cl-text-neutral-text-medium-contrast text-lg">Every product I build operates across three layers: design, AI, and security.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Design Layer */}
                        <ServiceCard
                            title="Design Layer"
                            description="Human-centered UX for complex enterprise platforms. Focus on cognitive load reduction and human-in-the-loop workflows."
                            icon={<img src={designIcon} alt="Design" className="w-5 h-5" />}
                            variant="light"
                            onClick={() => navigate('/work#design')}
                            className="cl-bg-neutral-surface-level-1 border cl-border-border-color-default shadow-sm hover:shadow-md h-full rounded-3xl"
                        />

                        {/* AI Layer */}
                        <ServiceCard
                            title="AI Layer"
                            description="Generative UI & Adaptive flows. Orchestrating agents for autonomous frontends."
                            icon={<img src={aiIcon} alt="AI" className="w-5 h-5 opacity-90 grayscale" />}
                            variant="light"
                            onClick={() => navigate('/work#ai')}
                            className="cl-bg-neutral-surface-level-1 border cl-border-border-color-default shadow-sm hover:shadow-md h-full rounded-3xl"
                        />

                        {/* Security Layer */}
                        <ServiceCard
                            title="Security Layer"
                            description="Implementing zero-trust design patterns and defensive UI architectures."
                            icon={<img src={securityIcon} alt="Security" className="w-5 h-5" />}
                            variant="light"
                            onClick={() => navigate('/work#security')}
                            className="cl-bg-neutral-surface-level-1 border cl-border-border-color-default shadow-sm hover:shadow-md h-full rounded-3xl"
                        />
                    </div>
                    

                </div>
            </section>

            {/* Final CTA */}
            <ActionFooter />
        </div>
    );
}
