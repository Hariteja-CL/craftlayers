
import { ArrowLeft, ShieldCheck, Lock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { ServiceCard } from '../../components/portfolio/ServiceCard';

export function SecurityLayers() {
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
                        <div className="p-3 rounded-2xl bg-layer-security-bg text-layer-security-text">
                            <ShieldCheck className="w-8 h-8" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-content-primary">
                            Security Layer
                        </h1>
                    </div>
                    <p className="text-xl text-content-secondary max-w-2xl leading-relaxed">
                        Building trust through transparent, compliant, and secure user interfaces.
                    </p>
                </div>
            </section>

            {/* Content Grid */}
            <section className="container mx-auto px-6 max-w-container">
                <h2 className="text-2xl font-bold mb-8">Case Studies</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                    {/* Secure UX Blog Post Link */}
                    <div onClick={() => navigate('/work/secure-ux')} className="cursor-pointer">
                        <ServiceCard
                            title="Authenticating Trust"
                            description="How to design 2FA and Biometrics without friction."
                            icon={<Lock className="w-8 h-8 text-blue-500" />}
                            className="h-full hover:border-blue-400"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}
