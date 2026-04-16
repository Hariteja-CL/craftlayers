import { Briefcase, Fingerprint } from 'lucide-react';
import { Badge } from '../components/ui/Badge';

export function About() {
    return (
        <div className="pt-20 pb-24 px-6 md:px-12 max-w-container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">

                {/* Left Column: Text Content */}
                <div className="lg:col-span-6 space-y-8 self-center">
                    <div className="space-y-4">
                        <div className="cl-text-semantic-warning-text font-bold tracking-widest text-xs uppercase">
                            About Me
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold cl-text-primary tracking-tight">
                            Behind
                            <br />
                            The Layers.
                        </h1>
                    </div>

                    <div className="space-y-6 text-lg cl-text-secondary leading-relaxed font-medium">
                        <p>
                            I am <span className="cl-text-primary font-bold">Hariteja Nandipati</span>, a Design System Architect based in Hyderabad.
                        </p>
                        <p>
                            My philosophy sits at the intersection of three disciplines that rarely talk to each other:
                        </p>

                        <ul className="space-y-4 pt-2">
                            <li className="flex items-start gap-3">
                                <div className="mt-2 w-1.5 h-1.5 rounded-full cl-bg-semantic-warning-icon shrink-0" />
                                <span>
                                    <span className="cl-text-primary font-bold">Cognitive Science:</span> Understanding <span className="italic">why</span> users click.
                                </span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="mt-2 w-1.5 h-1.5 rounded-full cl-bg-semantic-warning-icon shrink-0" />
                                <span>
                                    <span className="cl-text-primary font-bold">System Architecture:</span> Scalable component libraries.
                                </span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="mt-2 w-1.5 h-1.5 rounded-full cl-bg-semantic-warning-icon shrink-0" />
                                <span>
                                    <span className="cl-text-primary font-bold">Security Protocol:</span> Trust by design.
                                </span>
                            </li>
                        </ul>

                        <p className="pt-2">
                            Currently serving as a <span className="cl-text-primary font-bold">Senior UX Designer</span>, I help enterprise teams untangle legacy complexity and weave it into compliant, accessible interfaces.
                        </p>
                    </div>
                </div>

                {/* Right Column: Bento Grid */}
                <div className="lg:col-span-6 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">

                    {/* Stat Card 1: Experience */}
                    <div className="cl-surface-card border cl-border-subtle p-8 rounded-[2rem] shadow-sm flex flex-col justify-center min-h-[160px] hover:cl-elevation-raised transition-all duration-300">
                        <div className="text-4xl lg:text-5xl font-extrabold cl-text-primary mb-2">
                            08<span className="cl-text-semantic-warning-text">+</span>
                        </div>
                        <div className="text-xs font-bold cl-text-secondary tracking-widest uppercase">
                            Years Experience
                        </div>
                    </div>

                    {/* Stat Card 2: Projects */}
                    <div className="cl-bg-neutral-surface-level-1 border cl-border-subtle p-8 rounded-[2rem] shadow-xl flex flex-col justify-center min-h-[160px] cl-text-primary hover:cl-elevation-overlay hover:-translate-y-1 transition-all duration-300">
                        <div className="text-4xl lg:text-5xl font-extrabold mb-2">
                            22<span className="cl-text-semantic-info-text">+</span>
                        </div>
                        <div className="text-xs font-bold cl-text-secondary tracking-widest uppercase mb-1">
                            Projects Shipped
                        </div>
                        <div className="text-[10px] cl-text-neutral-text-low-contrast font-medium">
                            11 Core Products + POCs
                        </div>
                    </div>

                    {/* Large Card: Career Trajectory */}
                    <div className="md:col-span-2 cl-surface-card border cl-border-subtle p-8 md:p-10 rounded-[2.5rem] shadow-sm relative overflow-hidden group hover:cl-elevation-raised transition-all duration-300">
                        {/* Background Watermark */}
                        <Fingerprint className="absolute top-1/2 right-[-20px] w-64 h-64 cl-text-secondary opacity-[0.03] -translate-y-1/2 rotate-12 pointer-events-none transition-opacity duration-300 group-hover:opacity-[0.06]" />

                        <div className="relative z-10">
                            <h3 className="flex items-center gap-2 text-lg font-bold cl-text-primary mb-8">
                                <Briefcase className="w-5 h-5 cl-text-semantic-warning-icon" />
                                Career Trajectory
                            </h3>

                            <div className="space-y-8 pl-2 border-l-2 border-dashed cl-border-subtle ml-2">

                                {/* Enculture (NHR Technologies) */}
                                <div className="pl-6 relative">
                                    <div className="absolute top-1.5 left-[-25px] w-4 h-4 rounded-full border-4 cl-border-neutral-surface-level-0 cl-bg-semantic-warning-icon shadow-sm" />
                                    <div className="font-bold cl-text-primary text-lg">Senior UX Designer</div>
                                    <div className="text-sm cl-text-secondary font-medium">Enculture (NHR Technologies) • Jan 2024 - Present</div>
                                    <div className="text-xs cl-text-neutral-text-low-contrast mt-1">B2B SaaS | Culture Analytics & Insights</div>
                                </div>

                                {/* Clinic Mantra */}
                                <div className="pl-6 relative">
                                    <div className="absolute top-1.5 left-[-25px] w-4 h-4 rounded-full border-4 cl-border-neutral-surface-level-0 cl-bg-neutral-surface-level-3" />
                                    <div className="font-bold cl-text-primary text-lg">Product Designer, UI/UX</div>
                                    <div className="text-sm cl-text-secondary font-medium">Clinic Mantra • Jan 2023 - Aug 2023</div>
                                    <div className="text-xs cl-text-neutral-text-low-contrast mt-1">Healthcare Tech</div>
                                </div>

                                {/* Estate96 (Freelance) */}
                                <div className="pl-6 relative">
                                    <div className="absolute top-1.5 left-[-25px] w-4 h-4 rounded-full border-4 cl-border-neutral-surface-level-0 cl-bg-neutral-surface-level-3" />
                                    <div className="font-bold cl-text-primary text-lg">UX Design Consultant</div>
                                    <div className="text-sm cl-text-secondary font-medium">Estate96 (Freelance) • Aug 2022 - Nov 2022</div>
                                    <div className="text-xs cl-text-neutral-text-low-contrast mt-1">Smart Access Solutions</div>
                                </div>

                                {/* Opia Labs */}
                                <div className="pl-6 relative">
                                    <div className="absolute top-1.5 left-[-25px] w-4 h-4 rounded-full border-4 cl-border-neutral-surface-level-0 cl-bg-neutral-surface-level-3" />
                                    <div className="font-bold cl-text-primary text-lg">User Experience Designer</div>
                                    <div className="text-sm cl-text-secondary font-medium">Opia Labs • Nov 2019 - Jul 2022</div>
                                    <div className="text-xs cl-text-neutral-text-low-contrast mt-1">SaaS Platforms & Web Apps</div>
                                </div>

                                {/* Foyr */}
                                <div className="pl-6 relative">
                                    <div className="absolute top-1.5 left-[-25px] w-4 h-4 rounded-full border-4 cl-border-neutral-surface-level-0 cl-bg-neutral-surface-level-3" />
                                    <div className="font-bold cl-text-primary text-lg">User Experience Designer</div>
                                    <div className="text-sm cl-text-secondary font-medium">Foyr • May 2017 - Nov 2019</div>
                                    <div className="text-xs cl-text-neutral-text-low-contrast mt-1">Immersive Architecture Tech</div>
                                </div>
                            </div>

                            {/* Tech Stack Pills */}
                            <div className="mt-12 flex flex-wrap gap-2">
                                {["Figma", "React", "Tailwind", "WCAG 2.2", "Storybook", "Jira"].map((tech) => (
                                    <Badge key={tech} variant="secondary" className="px-4 py-1.5 cl-bg-neutral-surface-level-2 cl-text-secondary cl-border-default border text-xs font-bold uppercase tracking-wider hover:cl-bg-neutral-surface-level-3 hover:cl-text-primary transition-colors">
                                        {tech}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
