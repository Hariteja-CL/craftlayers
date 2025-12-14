import { Briefcase, Fingerprint } from 'lucide-react';
import { Badge } from '../components/ui/Badge';

export function About() {
    return (
        <div className="pt-20 pb-24 px-6 md:px-12 max-w-container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">

                {/* Left Column: Text Content */}
                <div className="lg:col-span-6 space-y-8 self-center">
                    <div className="space-y-4">
                        <div className="text-orange-500 font-bold tracking-widest text-xs uppercase">
                            About Me
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1A1A1A] tracking-tight">
                            Behind
                            <br />
                            The Layers.
                        </h1>
                    </div>

                    <div className="space-y-6 text-lg text-gray-500 leading-relaxed font-medium">
                        <p>
                            I am <span className="text-gray-900 font-bold">Hariteja Nandipati</span>, a Design System Architect based in Hyderabad.
                        </p>
                        <p>
                            My philosophy sits at the intersection of three disciplines that rarely talk to each other:
                        </p>

                        <ul className="space-y-4 pt-2">
                            <li className="flex items-start gap-3">
                                <div className="mt-2 w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                                <span>
                                    <span className="text-gray-900 font-bold">Cognitive Science:</span> Understanding <span className="italic">why</span> users click.
                                </span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="mt-2 w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                                <span>
                                    <span className="text-gray-900 font-bold">System Architecture:</span> Scalable component libraries.
                                </span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="mt-2 w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                                <span>
                                    <span className="text-gray-900 font-bold">Security Protocol:</span> Trust by design.
                                </span>
                            </li>
                        </ul>

                        <p className="pt-2">
                            Currently serving as a <span className="text-gray-900 font-bold">Senior UX Designer</span>, I help enterprise teams untangle legacy complexity and weave it into compliant, accessible interfaces.
                        </p>
                    </div>
                </div>

                {/* Right Column: Bento Grid */}
                <div className="lg:col-span-6 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">

                    {/* Stat Card 1: Experience */}
                    <div className="bg-white p-8 rounded-[2rem] shadow-sm flex flex-col justify-center min-h-[160px] hover:shadow-lg transition-all duration-300">
                        <div className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-2">
                            08<span className="text-orange-500">+</span>
                        </div>
                        <div className="text-xs font-bold text-gray-400 tracking-widest uppercase">
                            Years Experience
                        </div>
                    </div>

                    {/* Stat Card 2: Projects */}
                    <div className="bg-[#0B1121] p-8 rounded-[2rem] shadow-xl flex flex-col justify-center min-h-[160px] text-white hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                        <div className="text-4xl lg:text-5xl font-extrabold mb-2">
                            50<span className="text-blue-500">+</span>
                        </div>
                        <div className="text-xs font-bold text-gray-400 tracking-widest uppercase">
                            Projects Shipped
                        </div>
                    </div>

                    {/* Large Card: Career Trajectory */}
                    <div className="md:col-span-2 bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sm relative overflow-hidden group hover:shadow-xl transition-all duration-300">
                        {/* Background Watermark */}
                        <Fingerprint className="absolute top-1/2 right-[-20px] w-64 h-64 text-gray-50 opacity-[0.03] -translate-y-1/2 rotate-12 pointer-events-none transition-opacity duration-300 group-hover:opacity-[0.06]" />

                        <div className="relative z-10">
                            <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-8">
                                <Briefcase className="w-5 h-5 text-orange-500" />
                                Career Trajectory
                            </h3>

                            <div className="space-y-8 pl-2 border-l-2 border-dashed border-gray-100 ml-2">
                                {/* HCLTech */}
                                <div className="pl-6 relative">
                                    <div className="absolute top-1.5 left-[-25px] w-4 h-4 rounded-full border-4 border-white bg-orange-500 shadow-sm" />
                                    <div className="font-bold text-gray-900 text-lg">Sr. Designer</div>
                                    <div className="text-sm text-gray-500 font-medium">HCLTech • Jul 2024 - Present</div>
                                    <div className="text-xs text-gray-400 mt-1">CX Strategy & Research</div>
                                </div>

                                {/* [24]7.ai */}
                                <div className="pl-6 relative">
                                    <div className="absolute top-1.5 left-[-25px] w-4 h-4 rounded-full border-4 border-white bg-gray-200" />
                                    <div className="font-bold text-gray-900 text-lg">Product Designer</div>
                                    <div className="text-sm text-gray-500 font-medium">[24]7.ai • Jun 2021 - Aug 2024</div>
                                    <div className="text-xs text-gray-400 mt-1">Conversational AI & Enterprise SaaS</div>
                                </div>

                                {/* Freelance */}
                                <div className="pl-6 relative">
                                    <div className="absolute top-1.5 left-[-25px] w-4 h-4 rounded-full border-4 border-white bg-gray-200" />
                                    <div className="font-bold text-gray-900 text-lg">UX Design Consultant</div>
                                    <div className="text-sm text-gray-500 font-medium">Freelance • Aug 2020 - Jun 2021</div>
                                    <div className="text-xs text-gray-400 mt-1">Design Systems & Strategy</div>
                                </div>

                                {/* OpenText */}
                                <div className="pl-6 relative">
                                    <div className="absolute top-1.5 left-[-25px] w-4 h-4 rounded-full border-4 border-white bg-gray-200" />
                                    <div className="font-bold text-gray-900 text-lg">User Experience Designer</div>
                                    <div className="text-sm text-gray-500 font-medium">OpenText • Mar 2020 - Jul 2020</div>
                                </div>

                                {/* Ray Business Technologies */}
                                <div className="pl-6 relative">
                                    <div className="absolute top-1.5 left-[-25px] w-4 h-4 rounded-full border-4 border-white bg-gray-200" />
                                    <div className="font-bold text-gray-900 text-lg">User Experience Designer</div>
                                    <div className="text-sm text-gray-500 font-medium">Ray Business Technologies • May 2017 - Mar 2020</div>
                                    <div className="text-xs text-gray-400 mt-1">Fintech & Web Applications</div>
                                </div>
                            </div>

                            {/* Tech Stack Pills */}
                            <div className="mt-12 flex flex-wrap gap-2">
                                {["Figma", "React", "Tailwind", "WCAG 2.2", "Storybook", "Jira"].map((tech) => (
                                    <Badge key={tech} variant="secondary" className="px-4 py-1.5 bg-gray-50 text-gray-600 border border-gray-100 text-xs font-bold uppercase tracking-wider hover:bg-gray-100 hover:text-gray-900 transition-colors">
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
