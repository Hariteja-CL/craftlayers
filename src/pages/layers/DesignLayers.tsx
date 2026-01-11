
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ServiceCard } from '../../components/portfolio/ServiceCard';

export function DesignLayers() {
    const navigate = useNavigate();

    return (
        <div className="space-y-12 pb-20">
            {/* Hero */}
            <section className="bg-surface border-b border-border-muted py-20">
                <div className="container mx-auto px-6 max-w-container">
                    <Link to="/" className="inline-flex items-center text-sm font-medium text-content-secondary hover:text-primary-main-400 mb-8 transition-colors">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Home
                    </Link>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-2xl bg-layer-design-bg text-layer-design-text">
                            <Layers className="w-8 h-8" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-content-primary">
                            Design Layer
                        </h1>
                    </div>
                    <p className="text-xl text-content-secondary max-w-2xl leading-relaxed">
                        Crafting intuitive, accessible, and scalable user experiences for complex enterprise ecosystems.
                    </p>
                </div>
            </section>

            {/* Content Grid */}
            <section className="container mx-auto px-6 max-w-container">
                <h2 className="text-2xl font-bold mb-8">Featured Work</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                    {/* Inwards Case Study */}
                    <div onClick={() => navigate('/work/inwards')} className="cursor-pointer">
                        <ServiceCard
                            title="Inwards"
                            description="Mental health SaaS platform connecting patients and therapists."
                            icon={<img src="/assets/images/icon-design.svg" className="w-8 h-8" />}
                            className="h-full hover:border-orange-400"
                        />
                    </div>

                    {/* Governance Case Study */}
                    <div onClick={() => navigate('/work/governance')} className="cursor-pointer">
                        <ServiceCard
                            title="Architecting Governance"
                            description="Managing 'Vibe Coding' debt with a 3-tier token architecture."
                            icon={<Layers className="w-8 h-8 text-indigo-500" />}
                            className="h-full hover:border-indigo-400"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}
