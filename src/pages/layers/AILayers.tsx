
import { ArrowLeft, Bot, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ServiceCard } from '../../components/portfolio/ServiceCard';

export function AILayers() {
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
                        <div className="p-3 rounded-2xl bg-layer-ai-bg text-layer-ai-text">
                            <Bot className="w-8 h-8" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-content-primary">
                            AI Layer
                        </h1>
                    </div>
                    <p className="text-xl text-content-secondary max-w-2xl leading-relaxed">
                        Bridge the gap between human intent and machine intelligence through agentic design.
                    </p>
                </div>
            </section>

            {/* Content Grid */}
            <section className="container mx-auto px-6 max-w-container">
                <h2 className="text-2xl font-bold mb-8">Explorations</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <ServiceCard
                        title="Antigravity Agents"
                        description="Designing strict system prompts for coding assistants."
                        icon={<Sparkles className="w-8 h-8 text-purple-500" />}
                        className="h-full hover:border-purple-400"
                    />
                    <ServiceCard
                        title="Generative UI"
                        description="Interfaces that adapt structure based on user context."
                        icon={<Bot className="w-8 h-8 text-gray-400" />}
                        className="h-full hover:border-gray-400"
                    />
                </div>
            </section>
        </div>
    );
}
