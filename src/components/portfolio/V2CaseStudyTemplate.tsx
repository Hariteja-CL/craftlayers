import React from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../ui/Breadcrumbs';
import { Badge } from '../ui/Badge';

interface Section {
    title: string;
    id: string;
    content: React.ReactNode;
}

interface CaseStudyProps {
    title: string;
    subtitle: string;
    impactLabel: string;
    impactValue: string;
    role: string;
    duration: string;
    badges: string[];
    sections: Section[];
    headerImage?: string;
}

export function V2CaseStudyTemplate({
    title,
    subtitle,
    impactLabel,
    impactValue,
    role,
    duration,
    badges,
    sections,
}: CaseStudyProps) {
    return (
        <article className="cl-bg-neutral-surface-level-0 min-h-screen font-sans pb-32">
            {/* Case Study Header */}
            <header className="pt-12 pb-16 border-b cl-border-border-color-default cl-bg-neutral-surface-level-0">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="mb-10">
                        <Breadcrumbs items={[
                            { label: 'Home', path: '/' },
                            { label: 'Work', path: '/work' },
                            { label: title }
                        ]} />
                    </div>

                    <div className="flex flex-col lg:flex-row gap-12 items-start justify-between">
                        <div className="max-w-4xl">
                            <div className="flex flex-wrap gap-2 mb-6">
                                {badges.map((b, i) => (
                                    <Badge key={i} variant={i === 0 ? "solid" : "secondary"}>
                                        {b}
                                    </Badge>
                                ))}
                            </div>
                            <h1 className="text-4xl md:text-6xl font-bold cl-text-neutral-text-high-contrast mb-8 leading-[1.15] tracking-tight">
                                {title}
                            </h1>
                            <p className="text-xl md:text-2xl cl-text-neutral-text-medium-contrast leading-relaxed font-medium">
                                {subtitle}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-x-16 gap-y-10 py-8 px-10 rounded-3xl cl-bg-neutral-surface-level-1 border cl-border-border-color-default shadow-sm min-w-[320px]">
                            <div>
                                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] cl-text-neutral-text-low-contrast mb-2">Impact</h4>
                                <div className="text-2xl font-bold cl-text-brand-primary-base">{impactValue}</div>
                                <div className="text-xs cl-text-neutral-text-medium-contrast">{impactLabel}</div>
                            </div>
                            <div>
                                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] cl-text-neutral-text-low-contrast mb-2">Role</h4>
                                <div className="text-sm font-bold cl-text-neutral-text-high-contrast">{role}</div>
                            </div>
                            <div>
                                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] cl-text-neutral-text-low-contrast mb-2">Duration</h4>
                                <div className="text-sm font-bold cl-text-neutral-text-high-contrast">{duration}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Case Study Content (7 Steps) */}
            <div className="max-w-4xl mx-auto px-6 mt-24 space-y-32">
                {sections.map((section, index) => (
                    <section key={section.id} id={section.id} className="relative">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="flex items-center justify-center w-10 h-10 rounded-xl cl-bg-neutral-surface-level-2 cl-text-neutral-text-high-contrast font-mono font-bold text-sm border cl-border-border-color-default">
                                {index + 1}
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold cl-text-neutral-text-high-contrast tracking-tight">
                                {section.title}
                            </h2>
                        </div>
                        
                        <div className="cl-text-neutral-text-medium-contrast text-lg leading-relaxed">
                            {section.content}
                        </div>
                    </section>
                ))}
            </div>
            
            {/* Next Project Footer */}
            <footer className="mt-40 pt-20 border-t cl-border-border-color-default">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h3 className="text-sm font-bold uppercase tracking-[0.2em] cl-text-neutral-text-low-contrast mb-8">Next Case Study</h3>
                    <Link to="/work" className="group inline-block">
                        <div className="text-3xl md:text-5xl font-bold cl-text-neutral-text-high-contrast group-hover:cl-text-brand-primary-base transition-colors">
                            Return to Workspace →
                        </div>
                    </Link>
                </div>
            </footer>
        </article>
    );
}
