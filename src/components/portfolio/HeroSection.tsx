
export function HeroSection() {
    return (
        <section className="relative px-6 pt-12 pb-16 md:pt-24 md:pb-24 max-w-container mx-auto text-center md:text-left">
            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-50 border border-orange-100 mb-8">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                </span>
                <span className="text-xs font-bold text-orange-700 tracking-wider uppercase">Available for new projects</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6 text-[#1A1A1A]">
                Designing Clarity.
                <br />
                <span className="text-gray-500">Converging AI & Trust.</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-500 max-w-3xl leading-relaxed font-medium">
                One portfolio that blends <span className="text-gray-900 border-b-2 border-orange-200">user experience</span>, <span className="text-gray-900 border-b-2 border-orange-200">trust</span>, and <span className="text-gray-900 border-b-2 border-orange-200">intelligence</span>.
            </p>
        </section>
    );
}
