

export function HeroSection() {
    return (
        <section className="relative px-6 py-20 md:py-32 max-w-container mx-auto">
            <div className="flex flex-col-reverse md:flex-row items-center md:items-start justify-between gap-12">

                {/* Text Content */}
                <div className="flex-1 text-center md:text-left space-y-6">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-content-primary">
                        Designing Clarity
                    </h1>

                    <div className="text-xl md:text-2xl font-medium text-primary-main-400">
                        Senior UX Designer | Design System Architect | Cyber Security
                    </div>

                    <p className="text-lg text-content-secondary max-w-2xl leading-relaxed mx-auto md:mx-0">
                        Where human-centered design meets technical intelligence. I build comprehensive systems that bridge the gap between complex engineering and intuitive user experiences.
                    </p>

                    <div className="flex items-center justify-center md:justify-start gap-4 pt-4">
                        <a
                            href="https://www.linkedin.com/in/hariteja-nandipati"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-6 py-3 bg-primary-main-400 text-white font-semibold rounded-lg hover:bg-primary-main-500 transition-colors"
                        >
                            Let's Connect
                        </a>
                        <a
                            href="#work"
                            className="px-6 py-3 border border-border-default text-content-primary font-medium rounded-lg hover:bg-surface-subtle transition-colors"
                        >
                            View Work
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
