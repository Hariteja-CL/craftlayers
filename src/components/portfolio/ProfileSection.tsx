
import { Avatar, AvatarImage, AvatarFallback } from '../ui/Avatar';
// Note: We'll use the SVGs as images for now since we haven't migrated them to React components
// or we can import them if they are in assets.

export function ProfileSection() {
    return (
        <section className="px-6 pb-20 max-w-container mx-auto">
            <div className="bg-surface rounded-2xl border border-border-DEFAULT p-8 md:p-12 flex flex-col md:flex-row items-center md:items-start gap-8 shadow-sm">

                {/* Profile Image */}
                <div className="flex-shrink-0">
                    <Avatar className="w-32 h-32 md:w-40 md:h-40 border-2 border-white shadow-md">
                        <AvatarImage src="/assets/images/profile-hero.svg" alt="Hariteja" />
                        <AvatarFallback>HN</AvatarFallback>
                    </Avatar>
                </div>

                {/* Content */}
                <div className="flex-1 text-center md:text-left">
                    <h3 className="text-2xl font-bold text-content-primary mb-2">
                        Hariteja Nandipati
                    </h3>
                    <p className="text-primary-main-400 font-medium mb-4">
                        Senior UX Designer | Design System Architect | Cyber Security
                    </p>
                    <p className="text-content-secondary leading-relaxed mb-6 max-w-2xl">
                        Sr. Product & UX Designer with 8+ years in SaaS, Design Systems, and secure,
                        data-driven UX. I blend usability and security to build intuitive, compliant, and scalable
                        enterprise experiences.
                    </p>

                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-6">
                        <a
                            href="https://www.linkedin.com/in/hariteja-nandipati"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-[#0077B5] font-medium hover:underline"
                        >
                            <img src="/assets/images/linkedin.svg" alt="LinkedIn" className="w-6 h-6" />
                            Connect me on Linkedin
                        </a>
                        <span className="text-content-tertiary text-sm flex items-center gap-1">
                            📍 Hyderabad, Telangana, India
                        </span>
                    </div>
                </div>

            </div>
        </section>
    );
}
