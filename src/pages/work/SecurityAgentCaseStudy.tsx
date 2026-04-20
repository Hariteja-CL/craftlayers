import { V2CaseStudyTemplate } from '../../components/portfolio/V2CaseStudyTemplate';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ShieldAlert, Lock, ShieldCheck, EyeOff, Radio } from 'lucide-react';

export function SecurityAgentCaseStudy() {

    const sections = [
        {
            id: "context",
            title: "Security Context",
            content: (
                <div className="space-y-4">
                    <p>
                        This research is grounded in my <strong>IIT Guwahati Advanced Certificate in Cyber Security</strong>. It explores the concept of <strong>Secure UX</strong>—the idea that interface decisions are the first line of defense against human-driven security breaches.
                    </p>
                    <p className="text-sm border-l-2 border-emerald-500 pl-4 italic cl-text-emerald-900 bg-emerald-50 py-2 pr-4 rounded-r-lg">
                        "Security teams protect data. Designers protect decisions."
                    </p>
                </div>
            )
        },
        {
            id: "system-thinking",
            title: "The Defensive Model",
            content: (
                <div className="space-y-6">
                    <p>
                        Implemented a <strong>Pixel-Level Anonymization Logic</strong>. The "Sentinel Agent" acts as a proxy that enforces <strong>Zero-Trust UI</strong> principles, ensuring that sensitive metadata and PII are obfuscated or isolated based on role-based access before rendering in the DOM, managing deep system complexity context.
                    </p>
                    <div className="p-8 border cl-border-border-color-default rounded-3xl cl-bg-neutral-surface-level-1">
                        <div className="grid md:grid-cols-3 gap-8 text-center">
                            <div className="space-y-3">
                                <Radio className="w-5 h-5 mx-auto opacity-50 text-emerald-500" />
                                <div className="font-bold text-sm">Design Tokens</div>
                                <p className="text-[10px] opacity-60 uppercase tracking-widest">Secure Signaling</p>
                            </div>
                            <div className="space-y-3">
                                <Lock className="w-5 h-5 mx-auto opacity-50" />
                                <div className="font-bold text-sm">Sentinel Proxy</div>
                                <p className="text-[10px] opacity-60 uppercase tracking-widest">Data Isolation</p>
                            </div>
                            <div className="space-y-3">
                                <EyeOff className="w-5 h-5 mx-auto text-emerald-500" />
                                <div className="font-bold text-sm">Defensive UI</div>
                                <p className="text-[10px] opacity-60 uppercase tracking-widest">Safe Render</p>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: "proof",
            title: "System Proof: The Sentinel",
            content: (
                <div className="space-y-8 py-4">
                    <p className="text-sm cl-text-neutral-text-medium-contrast">
                        Experience the Sentinel's zero-trust logic. This simulation demonstrates how the UI automatically enforces <strong>SOC2 readiness</strong> by detecting identity leaks and obfuscating them in the browser layer.
                    </p>
                    <Card className="p-10 border-2 border-emerald-500/20 rounded-[3rem] bg-emerald-50/30 relative overflow-hidden group">
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-emerald-500 rounded-lg text-white">
                                        <ShieldCheck className="w-5 h-5" />
                                    </div>
                                    <h4 className="text-lg font-bold tracking-tight text-neutral-900">Sentinel Active: Zero-Trust Pixels</h4>
                                </div>
                                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-bold uppercase">Safe Mode</span>
                            </div>
                            
                            <div className="bg-white border rounded-2xl p-6 mb-8 shadow-sm">
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center shrink-0">
                                        <ShieldAlert className="w-5 h-5 text-neutral-400" />
                                    </div>
                                    <div className="flex-grow">
                                        <div className="h-2 w-24 bg-neutral-200 rounded mb-2" />
                                        <div className="h-4 w-full bg-neutral-100 rounded" />
                                    </div>
                                </div>
                                <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-4 animate-pulse">
                                    <div className="text-red-500"><ShieldAlert className="w-4 h-4" /></div>
                                    <div className="text-[11px] font-bold text-red-900 uppercase tracking-widest leading-none">PII Detected: Anonymizing Layer 4...</div>
                                </div>
                            </div>
 
                            <Button className="w-full bg-emerald-600 text-white hover:bg-emerald-700 justify-between">
                                Validate Security Logic
                                <Radio className="w-4 h-4" />
                            </Button>
                        </div>
                    </Card>
                </div>
            )
        },
        {
            id: "impact",
            title: "Cyber Security Alignment",
            content: (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono">
                    <div className="p-8 rounded-3xl bg-neutral-900 text-white text-center">
                        <div className="text-3xl font-bold text-emerald-400">100%</div>
                        <p className="text-[10px] uppercase font-bold tracking-[0.2em] mt-3 opacity-60">Identity Safety</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-neutral-900 text-white text-center">
                        <div className="text-3xl font-bold text-emerald-400">IIT-G</div>
                        <p className="text-[10px] uppercase font-bold tracking-[0.2em] mt-3 opacity-60">Certified Research</p>
                    </div>
                </div>
            )
        }
    ];

    return (
        <V2CaseStudyTemplate
            title="The Security Sentinel (System-Driven UX)"
            subtitle="Defensive UI architecture for frontend-ready UX orchestration."
            impactValue="Secure"
            impactLabel="Design Posture"
            role="Research & Security Lead"
            duration="2023-24 Certificate"
            badges={["Zero-Trust UI", "Secure UX", "IIT Guwahati Cert"]}
            sections={sections}
        />
    );
}
