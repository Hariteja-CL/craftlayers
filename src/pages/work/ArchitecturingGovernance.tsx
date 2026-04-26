import { Zap, TriangleAlert, CheckCircle2, ShieldCheck } from 'lucide-react';
import { FluentiaProgressionVibe } from '../../components/case-studies/FluentiaProgressionVibe';
import { FluentiaProgressionSystem } from '../../components/case-studies/FluentiaProgressionSystem';
import { FluentiaDashboardVibe } from '../../components/case-studies/FluentiaDashboardVibe';
import { FluentiaDashboardSystem } from '../../components/case-studies/FluentiaDashboardSystem';

export function ArchitecturingGovernance() {
    return (
        <div className="min-h-screen cl-bg-neutral-surface-level-0 font-sans text-neutral-800 selection:bg-brand-primary-surface">

            {/* 1. HERO SECTION */}
            <header className="pt-24 lg:pt-32 pb-16 px-6 max-w-5xl mx-auto border-b cl-border-border-color-default">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border cl-border-border-color-default mb-8">
                    <span className="w-2 h-2 rounded-full bg-brand-primary-base animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-widest text-neutral-500">System Architecture</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight cl-text-neutral-text-high-contrast mb-6" style={{ fontFamily: "'DM Serif Display', serif" }}>
                    Architecturing Governance
                </h1>
                <h2 className="text-xl md:text-2xl font-medium cl-text-neutral-text-medium-contrast mb-4 max-w-3xl">
                    Taming AI "Vibe-Code" with Strict System Architecture
                </h2>
                <p className="text-2xl md:text-3xl font-bold cl-text-brand-primary-base tracking-tight mb-8">
                    AI-generated UI breaks production systems. Governance fixes them.
                </p>

                <div className="mb-16 flex flex-col gap-1 max-w-md pl-4 border-l-2 border-neutral-200 py-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">System Note</span>
                    <span className="text-xs font-medium text-neutral-600">
                        This is not a traditional design system. This is a normalization layer for AI outputs.
                    </span>
                </div>

                {/* Hero Image Placeholder */}
                <div className="w-full aspect-[21/9] bg-neutral-100 rounded-3xl border cl-border-border-color-default flex flex-col items-center justify-center relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-rose-50/50 to-emerald-50/50 border-t border-white/50 rounded-3xl" />
                    <div className="flex items-center justify-center gap-12 z-10 w-full px-12">
                        <div className="flex-1 flex flex-col w-full text-left relative z-10">
                            <span className="text-[10px] font-bold text-rose-400 tracking-widest uppercase block mb-3 text-center">Vibe-Coded Output (Unstructured)</span>
                            <div className="w-full transform xl:scale-90 scale-75 origin-top mx-auto opacity-75">
                                <FluentiaProgressionVibe />
                            </div>
                        </div>
                        <Zap className="w-8 h-8 text-neutral-300 shrink-0" />
                        <div className="flex-1 flex flex-col w-full text-left relative z-20">
                            <span className="text-[10px] font-bold text-emerald-500 tracking-widest uppercase block mb-3 text-center">Governed System Output</span>
                            
                            {/* UX/WCAG Callout */}
                            <div className="absolute -top-6 -right-10 bg-white border border-emerald-200 shadow-xl rounded-xl p-4 w-64 z-30 hidden lg:block">
                                <h4 className="text-xs font-bold text-emerald-600 mb-1 flex items-center gap-2"><ShieldCheck className="w-4 h-4"/> UX & WCAG Rules Applied</h4>
                                <ul className="text-[10px] text-neutral-600 space-y-1.5 leading-relaxed">
                                    <li>• <strong>Contrast:</strong> Tokenized semantic colors guarantee AAA WCAG compliance against backgrounds.</li>
                                    <li>• <strong>Semantic HTML:</strong> Removing raw `divs` for accessible structure.</li>
                                    <li>• <strong>Predictability:</strong> Fixed arbitrary `border-radius` (24px vs 20px) to strict token definitions.</li>
                                </ul>
                            </div>

                            <div className="w-full transform xl:scale-90 scale-75 origin-top mx-auto shadow-2xl">
                                <FluentiaProgressionSystem />
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-20 space-y-32">

                {/* 2. THE PROBLEM (HOOK HARD) */}
                <section>
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 items-start">
                        <div className="sticky top-24">
                            <h3 className="text-sm font-bold uppercase tracking-[0.2em] cl-text-brand-primary-base mb-3">The Problem</h3>
                            <h2 className="text-3xl font-bold cl-text-neutral-text-high-contrast tracking-tight mb-4">The Reality of Vibe-Coded UI</h2>
                            <div className="mb-6 flex flex-col gap-1 max-w-md pl-4 border-l-2 border-neutral-200 py-0.5">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">System Note</span>
                                <span className="text-xs font-medium text-neutral-600">
                                    AI is exceptional at generating visuals. It is terrible at generating architecture.
                                </span>
                            </div>
                            <p className="text-lg font-medium cl-text-neutral-text-high-contrast mb-3">
                                Speed without structure creates massive technical debt.
                            </p>
                            <p className="text-sm cl-text-neutral-text-medium-contrast leading-relaxed border-l-2 cl-border-brand-primary-base pl-4">
                                When teams use tools like Cursor or Antigravity to "vibe-code" interfaces, the UI might look acceptable on the surface, but underneath, it's a structural nightmare. Hardcoded hexes, arbitrary padding, and disconnected logic destroy dev-design alignment and shatter scalability.
                            </p>
                        </div>
                        <div className="space-y-8">
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[
                                    "No token structure",
                                    "Inline styling chaos",
                                    "Inconsistent spacing",
                                    "Not scalable"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-4 p-5 rounded-2xl bg-neutral-50/50 border border-neutral-100">
                                        <TriangleAlert className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                                        <span className="text-sm font-bold cl-text-neutral-text-high-contrast leading-relaxed">{item}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="p-6 bg-[#FAFAFA] border border-neutral-200 rounded-2xl font-mono text-xs text-rose-700/80 leading-relaxed overflow-hidden">
                                {`// ❌ Inline styling chaos from AI output
<div style={{ backgroundColor: "#00a99d", padding: "30px", borderRadius: "20px" }}>
    <h1 style={{ fontSize: "28px", color: "#111" }}>Fluentia Mastery</h1>
    <button style={{ background: "#f0f0f0", color: "#555" }}>Export</button>
</div>`}
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. THE 3-LAYER GOVERNANCE SYSTEM (DECISION MAKING) */}
                <section>
                    <div className="p-10 lg:p-12 rounded-[2.5rem] bg-brand-primary-surface border cl-border-brand-primary-base shadow-sm">
                        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 items-start">
                            <div>
                                <h3 className="text-sm font-bold uppercase tracking-[0.2em] cl-text-brand-primary-base mb-3">Architecture</h3>
                                <h2 className="text-3xl lg:text-4xl font-bold cl-text-neutral-text-high-contrast tracking-tight mb-4">Architecting the 3-Layer Token System</h2>
                                <p className="text-sm cl-text-neutral-text-medium-contrast leading-relaxed mb-6">
                                    Why introduce a multi-tiered token system instead of flat variables? Because flat variables lack semantic meaning, and hardcoding breaks scale. We needed a structural interceptor for raw AI output.
                                </p>
                                <div className="flex flex-col gap-1 max-w-md pl-4 border-l-2 border-neutral-200 py-0.5">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">System Note</span>
                                    <span className="text-xs font-medium text-neutral-600">
                                        Trade-off: Initial setup is complex, but it completely eliminates future technical debt from AI generations.
                                    </span>
                                </div>
                            </div>
                            <div className="space-y-6">
                                {/* Layer 1 */}
                                <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border cl-border-border-color-default shadow-sm">
                                    <div className="w-8 h-8 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center shrink-0">
                                        <span className="text-xs font-bold text-neutral-500">L1</span>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold cl-text-neutral-text-high-contrast mb-1">Primitive Tokens</h4>
                                        <p className="text-xs text-neutral-500 mb-2">Raw global values without context. The foundation.</p>
                                        <div className="inline-block px-2 py-1 bg-neutral-50 text-[10px] font-mono rounded text-neutral-500 border border-neutral-100">
                                            #00a99d, 16px, 400
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Layer 2 */}
                                <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border cl-border-border-color-default shadow-sm relative ml-4">
                                    <div className="absolute top-1/2 -left-4 -translate-y-1/2 w-4 h-px bg-neutral-200" />
                                    <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
                                        <span className="text-xs font-bold text-emerald-600">L2</span>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold cl-text-neutral-text-high-contrast mb-1">Semantic Tokens</h4>
                                        <p className="text-xs text-neutral-500 mb-2">Intent-driven mapping. This is what AI should ideally target.</p>
                                        <div className="inline-block px-2 py-1 bg-emerald-50/50 text-[10px] font-mono rounded text-emerald-700 border border-emerald-100">
                                            success-background, spacing-md
                                        </div>
                                    </div>
                                </div>

                                {/* Layer 3 */}
                                <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border cl-border-brand-primary-base/30 shadow-md relative ml-8">
                                    <div className="absolute top-1/2 -left-4 -translate-y-1/2 w-4 h-px bg-neutral-200" />
                                    <div className="w-8 h-8 rounded-full cl-bg-brand-primary-surface border cl-border-brand-primary-base flex items-center justify-center shrink-0">
                                        <span className="text-xs font-bold cl-text-brand-primary-base">L3</span>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold cl-text-neutral-text-high-contrast mb-1">Component-Level Tokens</h4>
                                        <p className="text-xs text-neutral-500 mb-2">Context-specific scoping that rigidly controls the final UI output.</p>
                                        <div className="inline-block px-2 py-1 cl-bg-brand-primary-surface text-[10px] font-mono rounded cl-text-brand-primary-base border cl-border-brand-primary-base/20">
                                            button-primary-bg, card-padding
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 5. THREE-TIER TRANSFORMATION (CRITICAL SECTION) */}
                <section>
                    <div className="mb-12 text-center flex flex-col items-center">
                        <h3 className="text-sm font-bold uppercase tracking-[0.2em] cl-text-brand-primary-base mb-3">Normalization Layer</h3>
                        <h2 className="text-3xl font-bold cl-text-neutral-text-high-contrast tracking-tight mb-6">Taming Cursor & Antigravity Outputs</h2>
                        <div className="flex flex-col gap-1 pl-4 border-l-2 border-neutral-200 py-0.5 text-left">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">System Note</span>
                            <span className="text-xs font-medium text-neutral-600">
                                AI gives speed. Structure gives scale.
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* COLUMN 1 */}
                        <div className="bg-rose-50 border border-rose-100 rounded-3xl p-6 flex flex-col items-center text-center">
                            <div className="w-full flex flex-col items-center justify-center p-3 border-b border-rose-200 mb-6">
                                <span className="text-xs font-bold uppercase tracking-widest text-rose-500 mb-1">AI Generated</span>
                                <span className="text-[10px] text-rose-600/80">Fast but unstructured</span>
                            </div>
                            <div className="w-full aspect-video bg-[#FAFAFA] rounded-xl border border-rose-200 flex flex-col p-4 mb-6 relative text-left">
                                <div className="w-12 h-3 bg-neutral-300 mb-3" />
                                <div className="w-full h-1.5 bg-neutral-200 mb-1" />
                                <div className="w-2/3 h-1.5 bg-neutral-200 mb-4" />
                                <div className="mt-auto w-full py-2 bg-neutral-800 text-white text-[9px] text-center font-sans">Action</div>
                            </div>
                            <div className="w-full h-32 bg-white rounded-lg border border-rose-100 p-4 font-mono text-[9px] text-rose-700 overflow-hidden text-left shadow-inner">
                                {`<div style={{ 
  background: "#F0F0F0",
  padding: "22px" 
}}>`}
                            </div>
                        </div>

                        {/* COLUMN 2 */}
                        <div className="bg-amber-50 border border-amber-100 rounded-3xl p-6 flex flex-col items-center text-center">
                            <div className="w-full flex flex-col items-center justify-center p-3 border-b border-amber-200 mb-6">
                                <span className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-1">Refined</span>
                                <span className="text-[10px] text-amber-700/80">Improved clarity & hierarchy</span>
                            </div>
                            <div className="w-full aspect-video bg-white rounded-xl border border-amber-200 shadow-sm flex flex-col p-5 mb-6 text-left">
                                <div className="w-14 h-3 bg-neutral-300 rounded-sm mb-3" />
                                <div className="w-full h-1.5 bg-neutral-100 rounded-sm mb-1" />
                                <div className="w-2/3 h-1.5 bg-neutral-100 rounded-sm mb-5" />
                                <div className="mt-auto w-full py-2 bg-neutral-900 rounded-md text-white text-[9px] text-center font-medium font-sans">Action</div>
                            </div>
                            <div className="w-full h-32 bg-white rounded-lg border border-amber-100 p-4 font-mono text-[9px] text-amber-700 overflow-hidden text-left shadow-inner">
                                {`<div className="
  bg-neutral-100 
  p-6 rounded-xl
">`}
                            </div>
                        </div>

                        {/* COLUMN 3 */}
                        <div className="cl-bg-brand-primary-surface border cl-border-brand-primary-base rounded-3xl p-6 flex flex-col items-center text-center shadow-md">
                            <div className="w-full flex flex-col items-center justify-center p-3 border-b cl-border-brand-primary-base/30 mb-6">
                                <div className="flex items-center gap-2 mb-1">
                                    <CheckCircle2 className="w-4 h-4 cl-text-brand-primary-base" />
                                    <span className="text-xs font-bold uppercase tracking-widest cl-text-brand-primary-base">System Aligned</span>
                                </div>
                                <span className="text-[10px] text-emerald-800/80">Scalable, consistent, token-driven</span>
                            </div>
                            <div className="w-full aspect-video cl-bg-neutral-surface-level-1 rounded-xl border border-emerald-200 shadow-md flex flex-col cl-p-scale-400 mb-6 text-left">
                                <div className="w-16 h-3 cl-bg-neutral-surface-level-2 cl-radius-full cl-mb-scale-200" />
                                <div className="w-full h-1.5 cl-bg-neutral-surface-level-2 cl-radius-full cl-mb-scale-100" />
                                <div className="w-2/3 h-1.5 cl-bg-neutral-surface-level-2 cl-radius-full cl-mb-scale-400" />
                                <div className="mt-auto w-full py-2 cl-bg-brand-primary-base cl-radius-md text-white text-[9px] text-center font-semibold shadow-sm font-sans">Action</div>
                            </div>
                            <div className="w-full h-32 bg-white rounded-lg border border-emerald-200 p-4 font-mono text-[9px] text-emerald-800 overflow-hidden text-left shadow-inner">
                                {`<div className="
  cl-bg-neutral-level-1
  cl-p-scale-400
">`}
                            </div>
                        </div>
                    </div>
                </section>

                {/* 6. VISUAL COMPARISON (FULL PAGE) */}
                <section className="bg-neutral-50/50 rounded-[2rem] border cl-border-border-color-default shadow-sm p-6 lg:p-10">
                    <div className="mb-10 text-center">
                        <h2 className="text-2xl font-bold cl-text-neutral-text-high-contrast tracking-tight">System-Driven Usability</h2>
                        <p className="text-sm cl-text-neutral-text-medium-contrast mt-2">Scaling governance to interactive dashboards reduces cognitive load and guarantees AAA compliance.</p>
                    </div>
                    
                    <div className="flex flex-col gap-12 pb-10">
                        {/* Vibe Code Dashboard */}
                        <div className="flex flex-col items-center">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-50 border border-rose-200 rounded-full mb-6">
                                <TriangleAlert className="w-4 h-4 text-rose-500" />
                                <span className="text-xs font-bold uppercase tracking-widest text-rose-600">AI Output – inconsistent</span>
                            </div>
                            <div className="w-full max-w-4xl border-2 border-rose-100 rounded-2xl overflow-hidden opacity-90 pointer-events-none shadow-sm bg-white transform xl:scale-100 scale-90 origin-top">
                                <FluentiaDashboardVibe />
                            </div>
                        </div>

                        <div className="h-px w-32 bg-neutral-200 mx-auto" />

                        {/* System Dashboard */}
                        <div className="flex flex-col items-center relative">
                            {/* UX/WCAG Callout */}
                            <div className="absolute top-12 -right-12 bg-white border border-emerald-200 shadow-xl rounded-xl p-5 w-72 z-20 hidden lg:block">
                                <h4 className="text-xs font-bold text-emerald-600 mb-2 flex items-center gap-2"><ShieldCheck className="w-4 h-4"/> UX Impact & Affordances</h4>
                                <ul className="text-[11px] text-neutral-600 space-y-2 leading-relaxed">
                                    <li>• <strong>Predictable Cognitive Load:</strong> <code>cl-p-scale-*</code> rhythm reduces visual noise, allowing users to parse data faster.</li>
                                    <li>• <strong>Clear Affordance:</strong> Hover states (<code>hover:cl-bg-*</code>) map strictly to interactive components, eliminating guesswork.</li>
                                    <li>• <strong>AAA Contrast Natively:</strong> Token matching ensures text always passes WCAG against its background surface.</li>
                                </ul>
                            </div>

                            <div className="inline-flex items-center gap-2 px-4 py-2 cl-bg-semantic-success-background border border-emerald-200 rounded-full mb-6 z-10">
                                <CheckCircle2 className="w-4 h-4 cl-text-semantic-success-text" />
                                <span className="text-xs font-bold uppercase tracking-widest cl-text-semantic-success-text">System Output – token-driven</span>
                            </div>
                            <div className="w-full max-w-4xl border-2 border-emerald-200 rounded-2xl overflow-hidden shadow-2xl cl-bg-neutral-surface-level-0 transform xl:scale-100 scale-90 origin-top">
                                <FluentiaDashboardSystem />
                            </div>
                        </div>

                        <div className="mx-auto flex flex-col gap-1 max-w-md pl-4 border-l-2 border-neutral-200 py-0.5">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">System Note</span>
                            <span className="text-xs font-medium text-neutral-600">
                                Consistency is not a visual outcome. It is a system outcome.
                            </span>
                        </div>
                    </div>
                </section>

                {/* 7. CODE COMPARISON (VERY IMPORTANT) */}
                <section>
                    <div className="mb-8">
                        <h3 className="text-sm font-bold uppercase tracking-[0.2em] cl-text-brand-primary-base mb-3">Enforcement</h3>
                        <h2 className="text-3xl font-bold cl-text-neutral-text-high-contrast tracking-tight mb-6">From Hallucination to Execution</h2>
                        <div className="flex flex-col gap-1 max-w-md pl-4 border-l-2 border-neutral-200 py-0.5">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">System Note</span>
                            <span className="text-xs font-medium text-neutral-600">
                                This is where vibe-coding fails. UI might look fine visually, but the underlying code is a hallucinated mess.
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-[2rem] border cl-border-border-color-default overflow-hidden shadow-sm">
                        
                        {/* LEFT SIDE: AI Code */}
                        <div className="bg-[#FAFAFA] border-r border-neutral-200 flex flex-col">
                            <div className="py-4 text-center border-b border-neutral-200 bg-white">
                                <span className="text-xs font-bold uppercase tracking-widest text-rose-500">Raw Vibe-Code (Hallucination)</span>
                            </div>
                            <div className="p-8 overflow-x-auto flex-1 h-[400px]">
                                <pre className="text-[12px] leading-[1.7] font-mono text-rose-800">
                                    <code>{`<div style={{ 
    padding: "30px", 
    background: "#ffffff", 
    borderRadius: "24px" 
}}>
    <h2 style={{ 
        color: "#1a1a1a", 
        fontSize: "24px", 
        fontWeight: "bold" 
    }}>
        Fluentia Mastery
    </h2>
    
    <div style={{ marginTop: "20px" }}>
        {/* ❌ Hardcoded color */}
        {/* ❌ Arbitrary spacing */}
        <button style={{ 
            background: "#00a99d", 
            padding: "10px 20px",
            borderRadius: "8px",
            color: "#ffffff"
        }}>
            View Report
        </button>
    </div>
</div>`}</code>
                                </pre>
                            </div>
                        </div>

                        {/* RIGHT SIDE: System Code */}
                        <div className="bg-white flex flex-col relative">
                            <div className="absolute top-1/2 -left-4 -translate-y-1/2 w-8 h-8 bg-white border border-neutral-200 rounded-full flex items-center justify-center shadow-sm z-10 hidden lg:flex">
                                <Zap className="w-4 h-4 text-neutral-400" />
                            </div>
                            <div className="py-4 text-center border-b border-neutral-200 cl-bg-brand-primary-surface">
                                <span className="text-xs font-bold uppercase tracking-widest cl-text-brand-primary-base">System Code (Token-Driven)</span>
                            </div>
                            <div className="p-8 overflow-x-auto flex-1 h-[400px]">
                                <pre className="text-[12px] leading-[1.7] font-mono text-emerald-800">
                                    <code>{`<div className="
    cl-bg-neutral-surface-level-0 
    cl-p-scale-500 
    cl-radius-3xl
">
    <h2 className="
        cl-text-neutral-text-high-contrast 
        text-2xl font-bold
    ">
        Fluentia Mastery
    </h2>
    
    <div className="cl-mt-scale-400">
        {/* ✅ Strict token adherence */}
        {/* ✅ Semantic success intent */}
        <button className="
            cl-bg-semantic-success-background 
            cl-text-semantic-success-text 
            cl-px-scale-400 cl-py-scale-200 
            cl-radius-md font-semibold
            hover:cl-bg-semantic-success-900 
            transition-colors
        ">
            View Report
        </button>
    </div>
</div>`}</code>
                                </pre>
                            </div>
                        </div>

                    </div>
                </section>

                {/* 8. TOKEN ENFORCEMENT */}
                <section>
                    <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-8 bg-neutral-900 rounded-[2rem] p-10 md:p-14 text-white overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary-base rounded-full blur-[120px] opacity-20 pointer-events-none" />
                        
                        <div className="relative z-10">
                            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-primary-base mb-2">Strict Binding</h3>
                            <h2 className="text-3xl font-bold tracking-tight mb-8">Token Governance Mapping</h2>
                            <div className="mb-10 flex flex-col gap-1 max-w-md pl-4 border-l-2 border-neutral-700 py-0.5">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">System Note</span>
                                <span className="text-xs font-medium text-neutral-400">
                                    Tokens are not variables. They are enforcement rules.
                                </span>
                            </div>
                            
                            <table className="w-full text-left">
                                <thead>
                                    <tr>
                                        <th className="pb-4 font-bold uppercase text-[10px] tracking-widest text-neutral-500 border-b border-neutral-800">Visual Attribute</th>
                                        <th className="pb-4 font-bold uppercase text-[10px] tracking-widest text-neutral-500 border-b border-neutral-800 pl-4">System Token Override</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="py-5 font-medium text-neutral-300 border-b border-neutral-800/50">#00a99d (Arbitrary Hex)</td>
                                        <td className="py-5 font-mono text-xs text-emerald-400 border-b border-neutral-800/50 pl-4">cl-bg-semantic-success-background</td>
                                    </tr>
                                    <tr>
                                        <td className="py-5 font-medium text-neutral-300 border-b border-neutral-800/50">30px (Hardcoded Padding)</td>
                                        <td className="py-5 font-mono text-xs text-emerald-400 border-b border-neutral-800/50 pl-4">cl-p-scale-500</td>
                                    </tr>
                                    <tr>
                                        <td className="py-5 font-medium text-neutral-300 border-b border-neutral-800/50">24px (Arbitrary Radius)</td>
                                        <td className="py-5 font-mono text-xs text-emerald-400 border-b border-neutral-800/50 pl-4">cl-radius-3xl</td>
                                    </tr>
                                    <tr>
                                        <td className="py-5 font-medium text-neutral-300">#555 (Arbitrary Text)</td>
                                        <td className="py-5 font-mono text-xs text-emerald-400 pl-4">cl-text-neutral-text-medium-contrast</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="relative z-10 flex items-center justify-center">
                            <div className="w-full aspect-square bg-neutral-900 rounded-2xl border border-neutral-800 flex flex-col items-center justify-center p-8 text-left text-[11px] text-emerald-400 min-h-[200px] font-mono shadow-inner relative overflow-hidden">
                                <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500 rounded-full blur-[80px] opacity-10 pointer-events-none" />
                                <div className="w-full">
                                    <span className="text-neutral-500 mb-2 block">// CSS Enforced</span>
                                    <span className="text-rose-400">.cl-p-scale-400</span> {'{\n'}
                                </div>
                                <div className="pl-4 w-full mt-1 mb-1">
                                    <span className="text-amber-300">padding</span>: <span className="text-emerald-400">var</span>(--cl-scale-400);
                                </div>
                                <div className="w-full">{'}'}</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 9. WHY THIS MATTERS */}
                <section>
                    <div className="mb-10 text-center flex flex-col items-center">
                        <h3 className="text-sm font-bold uppercase tracking-[0.2em] cl-text-brand-primary-base mb-3">Tying it to Business</h3>
                        <h2 className="text-3xl font-bold cl-text-neutral-text-high-contrast tracking-tight mb-8">Impact on Product Teams</h2>
                        <div className="flex flex-col gap-1 max-w-md pl-4 border-l-2 border-neutral-200 py-0.5 text-left">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">System Note</span>
                            <span className="text-xs font-medium text-neutral-600">
                                This reduces friction between design, AI, and engineering.
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            "Reduced frontend inconsistencies",
                            "Faster AI-to-production pipeline",
                            "Lower developer cleanup effort",
                            "Scalable UI system"
                        ].map((impact, i) => (
                            <div key={i} className="bg-white p-6 rounded-2xl border cl-border-border-color-default flex flex-col justify-between shadow-sm min-h-[140px] hover:shadow-md transition-shadow">
                                <CheckCircle2 className="w-6 h-6 text-emerald-500 mb-4" />
                                <span className="text-lg font-bold cl-text-neutral-text-high-contrast leading-snug">{impact}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 10. FINAL POSITIONING */}
                <section className="pb-32">
                    <div className="bg-white border-y border-emerald-100 py-24 px-6 text-center shadow-[0_10px_40px_-20px_rgba(0,0,0,0.05)] flex flex-col items-center">
                        <p className="text-2xl md:text-4xl font-bold cl-text-neutral-text-high-contrast max-w-3xl mx-auto leading-tight tracking-tight mb-12">
                            "This is not about designing systems. <br/><span className="text-emerald-600">This is about enforcing them in real-world AI workflows.</span>"
                        </p>
                        <div className="flex flex-col gap-1 max-w-md pl-4 border-l-2 border-neutral-200 py-0.5 text-left">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">System Note</span>
                            <span className="text-xs font-medium text-neutral-600">
                                AI generates output. Governance makes it usable.
                            </span>
                        </div>
                    </div>
                </section>

            </main>
        </div>
    );
}
