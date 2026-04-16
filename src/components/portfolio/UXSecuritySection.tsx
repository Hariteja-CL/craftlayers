import { ShieldCheck, EyeOff, Lock, AlertTriangle } from 'lucide-react';

export function UXSecuritySection() {
    return (
        <section className="py-24 cl-bg-neutral-surface-level-0">
            <div className="max-w-7xl mx-auto px-6">
                <div className="mb-16">
                    <h2 className="text-3xl font-bold cl-text-neutral-text-high-contrast mb-4 tracking-tight">
                        UX + Security
                    </h2>
                    <p className="cl-text-neutral-text-medium-contrast max-w-2xl text-lg">
                        UX decisions are security decisions. I build products that protect data by design, not by accident.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="p-8 rounded-3xl cl-bg-neutral-surface-level-1 border cl-border-border-color-default shadow-sm hover:-translate-y-1 transition-transform">
                        <div className="w-12 h-12 rounded-xl cl-bg-semantic-success-background flex items-center justify-center mb-6">
                            <ShieldCheck className="cl-text-semantic-success-text w-6 h-6" />
                        </div>
                        <h4 className="text-lg font-bold cl-text-neutral-text-high-contrast mb-3">Security-First Thinking</h4>
                        <p className="text-sm cl-text-neutral-text-medium-contrast leading-relaxed">
                            Every interface element is audited for potential data exposure, ensuring that usability never comes at the cost of vulnerability.
                        </p>
                    </div>

                    <div className="p-8 rounded-3xl cl-bg-neutral-surface-level-1 border cl-border-border-color-default shadow-sm hover:-translate-y-1 transition-transform">
                        <div className="w-12 h-12 rounded-xl cl-bg-brand-primary-background flex items-center justify-center mb-6">
                            <Lock className="cl-text-brand-primary-base w-6 h-6" />
                        </div>
                        <h4 className="text-lg font-bold cl-text-neutral-text-high-contrast mb-3">Data Least-Privilege</h4>
                        <p className="text-sm cl-text-neutral-text-medium-contrast leading-relaxed">
                            I apply the principle of least privilege to the UI, showing only the data necessary for the current task to reduce the surface area for leaks.
                        </p>
                    </div>

                    <div className="p-8 rounded-3xl cl-bg-neutral-surface-level-1 border cl-border-border-color-default shadow-sm hover:-translate-y-1 transition-transform">
                        <div className="w-12 h-12 rounded-xl cl-bg-semantic-error-background flex items-center justify-center mb-6">
                            <EyeOff className="cl-text-semantic-error-text w-6 h-6" />
                        </div>
                        <h4 className="text-lg font-bold cl-text-neutral-text-high-contrast mb-3">Privacy Integrity</h4>
                        <p className="text-sm cl-text-neutral-text-medium-contrast leading-relaxed">
                            Using obscured inputs, session-aware state management, and clear authorization boundaries to maintain user privacy throughout the flow.
                        </p>
                    </div>
                </div>

                {/* Example Block */}
                <div className="mt-12 p-8 rounded-3xl cl-bg-neutral-surface-level-2 border cl-border-border-color-default border-dashed">
                    <div className="flex flex-col lg:flex-row gap-8 items-center">
                        <div className="lg:w-1/3">
                            <div className="flex items-center gap-2 mb-4 text-semantic-error-text font-bold text-xs uppercase tracking-widest">
                                <AlertTriangle className="w-4 h-4" />
                                Real-World Vulnerability
                            </div>
                            <h4 className="text-2xl font-bold cl-text-neutral-text-high-contrast mb-4">The PII Cookie Leak</h4>
                            <p className="text-sm cl-text-neutral-text-low-contrast leading-relaxed">
                                A common UX shortcut: Storing user information in unencrypted cookies for "faster loading."
                            </p>
                        </div>
                        
                        <div className="lg:w-2/3 grid sm:grid-cols-2 gap-6">
                            <div className="p-6 rounded-2xl cl-bg-neutral-surface-level-1 border cl-border-border-color-default">
                                <h5 className="font-bold text-semantic-error-text text-xs mb-3 uppercase tracking-widest">Case Study: PII Leak</h5>
                                <div className="space-y-4">
                                    <div>
                                        <div className="text-[10px] font-bold cl-text-neutral-text-low-contrast uppercase mb-1">Issue</div>
                                        <div className="text-xs cl-text-neutral-text-high-contrast">PII stored in cookies (client-side exposure)</div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-bold cl-text-neutral-text-low-contrast uppercase mb-1">Risk</div>
                                        <div className="text-xs cl-text-neutral-text-high-contrast">User data vulnerability via XSS/Interception</div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 rounded-2xl cl-bg-neutral-surface-level-1 border cl-border-border-color-default">
                                <h5 className="font-bold text-semantic-success-text text-xs mb-3 uppercase tracking-widest">Resolution</h5>
                                <div className="space-y-4">
                                    <div>
                                        <div className="text-[10px] font-bold cl-text-neutral-text-low-contrast uppercase mb-1">Fix</div>
                                        <div className="text-xs cl-text-neutral-text-high-contrast">Moved to secure storage and improved UX handling</div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-bold cl-text-neutral-text-low-contrast uppercase mb-1">Impact</div>
                                        <div className="text-xs cl-text-neutral-text-high-contrast">Reduced exposure risk and improved data safety</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
