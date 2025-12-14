
import { Avatar, AvatarImage, AvatarFallback } from '../ui/Avatar';

// Note: We'll use the SVGs as images for now since we haven't migrated them to React components
// or we can import them if they are in assets.

export function ProfileSection() {
    return (
        <section className="px-6 pb-20 max-w-container mx-auto">
            <div className="bg-surface rounded-2xl border border-border-DEFAULT p-8 md:p-12 flex flex-col md:flex-row items-center md:items-start gap-8 shadow-sm">

                {/* Profile Image */}
                <div className="flex-shrink-0">
                    <Avatar className="w-32 h-32 md:w-40 md:h-40 rounded-2xl border-2 border-white shadow-md">
                        <AvatarImage src="/assets/images/profile-hero.svg" alt="Hariteja" className="object-cover" />
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
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M14.8667 0H1.13333C0.5 0 0 0.5 0 1.13333V14.8667C0 15.5 0.5 16 1.13333 16H14.8667C15.5 16 16 15.5 16 14.8667V1.13333C16 0.5 15.5 0 14.8667 0Z" fill="#0076B2" />
                                <path d="M4.73335 13.6V6.00002H2.33335V13.6H4.73335ZM3.53335 4.93335C4.30002 4.93335 4.93335 4.30002 4.93335 3.53335C4.93335 2.76668 4.30002 2.13335 3.53335 2.13335C2.76668 2.13335 2.13335 2.76668 2.13335 3.53335C2.13335 4.30002 2.76668 4.93335 3.53335 4.93335ZM13.6667 13.6H11.2667V9.46671C11.2667 8.40005 10.8 7.73338 9.86668 7.73338C8.86668 7.73338 8.26668 8.40005 8.26668 9.46671V13.6H5.86668C5.86668 13.6 5.90002 6.66668 5.86668 6.00002H8.26668V7.03335C8.63335 6.40002 9.50002 5.86668 10.6334 5.86668C12.3334 5.86668 13.6667 7.00001 13.6667 9.36668V13.6Z" fill="white" />
                            </svg>
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
