
import { Lock, ArrowLeft } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { ServiceCard } from '../../components/portfolio/ServiceCard';

export function SecurityLayers() {
    const navigate = useNavigate();

    return (
        <div className="space-y-12 pb-20">
            {/* Header / Hero */}
            <div className="max-w-container mx-auto px-6 pt-12">
                <Link to="/work" className="inline-flex items-center text-sm font-bold cl-text-neutral-text-medium-contrast hover:cl-text-brand-primary-base transition-colors mb-8">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Workspace
                </Link>
                <div className="flex flex-col md:flex-row gap-8 items-start justify-between">
                    <div className="flex-1">
                        <div className="inline-block px-3 py-1 rounded-full cl-bg-semantic-error-background cl-text-semantic-error-text border cl-border-semantic-error-border text-xs font-bold uppercase tracking-wider mb-4">
                            Security Layer
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold cl-text-primary">
                            Security & Compliance
                        </h1>
                        <p className="mt-6 text-lg cl-text-secondary leading-relaxed max-w-2xl">
                            Building trust through transparent protection. My work in the security layer focuses on making complex compliance protocols (SOC2, GDPR) accessible and ensuring users feel safe without adding friction.
                        </p>
                    </div>
                </div>
            </div>

            {/* Case Studies */}
            <div className="max-w-container mx-auto px-6 py-16">
                <h2 className="text-2xl font-bold mb-8 cl-text-primary">Case Studies</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                    {/* Secure UX Blog Post Link */}
                    <div onClick={() => navigate('/blog/secure-ux')} className="cursor-pointer">
                        <ServiceCard
                            title="Authenticating Trust"
                            description="How to design 2FA and Biometrics without friction."
                            icon={<Lock className="w-8 h-8 text-blue-500" />}
                            className="h-full hover:border-blue-400"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
