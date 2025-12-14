import { useNavigate } from 'react-router-dom';
import { HeroSection } from '../components/portfolio/HeroSection';
import { ServiceCard } from '../components/portfolio/ServiceCard';
import { ProfileSection } from '../components/portfolio/ProfileSection';
import { BlogCard } from '../components/portfolio/BlogCard';

export function Home() {
    const navigate = useNavigate();

    return (
        <div className="space-y-4">
            <HeroSection />

            {/* Layers Grid Section */}
            <section id="work" className="px-6 max-w-container mx-auto">
                <div className="mb-10 text-left">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">The Craft Layers</h2>
                    <p className="text-content-primary text-lg mb-1">Where human-centered design meets technical intelligence.</p>
                    <p className="text-content-secondary text-base">Select a layer to explore my work.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">

                    {/* Design Layer */}
                    <div className="lg:col-span-4">
                        <ServiceCard
                            title="Design Layer"
                            description="Human-centered UX for enterprise platforms."
                            icon={<div className="text-orange-400"><img src="/assets/images/icon-design.svg" alt="" className="w-6 h-6" /></div>}
                            onClick={() => navigate('/work/design')}
                            className="h-full border border-gray-200"
                        />
                    </div>

                    {/* AI Layer */}
                    <div className="lg:col-span-4">
                        <ServiceCard
                            title="AI Layer"
                            description="Exploring AI-driven design automation."
                            icon={<div className="text-yellow-500"><img src="/assets/images/icon-ai.svg" alt="" className="w-6 h-6" /></div>}
                            onClick={() => navigate('/work/ai')}
                            className="h-full border border-gray-200"
                        />
                    </div>

                    {/* Security Layer */}
                    <div className="lg:col-span-4">
                        <ServiceCard
                            title="Security Layer"
                            description="Building trust through secure design."
                            icon={<div className="text-green-500"><img src="/assets/images/icon-security.svg" alt="" className="w-6 h-6" /></div>}
                            onClick={() => navigate('/work/security')}
                            className="h-full border border-gray-200"
                        />
                    </div>

                </div>
            </section>

            {/* Latest Insights Section */}
            <section className="px-6 py-20 max-w-container mx-auto">
                <div className="flex items-center justify-between mb-10">
                    <h2 className="text-3xl font-bold text-gray-900">Latest Insights</h2>
                    <button
                        onClick={() => navigate('/blog')}
                        className="text-primary-main-400 font-medium hover:underline"
                    >
                        View all
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <BlogCard
                        title="Secure UX: Balancing Trust and Usability"
                        excerpt="How to design security features that enhance rather than hinder the user experience. A deep dive into authentication patterns."
                        category="Security"
                        date="Oct 24, 2024"
                        slug="/work/secure-ux"
                        imageUrl="/assets/images/blog/secure-ux-cover.png"
                    />
                    {/* Placeholder for more posts if needed, using Layout's grid */}
                </div>
            </section>

            <ProfileSection />
        </div>
    );
}
