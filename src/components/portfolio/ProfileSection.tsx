

// Note: We'll use the SVGs as images for now since we haven't migrated them to React components
// or we can import them if they are in assets.

import profileHero from '../../assets/images/profile.png';
import linkedinIcon from '../../assets/images/linkedin.svg';

export function ProfileSection() {
    return (
        <div className="w-full h-full bg-[#EBF2FA] rounded-[2rem] p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 md:gap-12 relative overflow-hidden group hover:shadow-lg transition-all duration-300">
            {/* Background Blob */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <div className="relative z-10 flex-shrink-0">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-xl overflow-hidden relative">
                    <img src={profileHero} alt="Hariteja" className="w-full h-full object-cover" />
                    <div className="absolute bottom-2 right-2 bg-white rounded-full p-1 shadow-sm">
                        <img src={linkedinIcon} alt="in" className="w-4 h-4" />
                    </div>
                </div>
            </div>

            <div className="relative z-10 flex-1 text-center md:text-left space-y-4">
                <div>
                    <div className="flex items-center justify-center md:justify-start gap-2 text-gray-500 text-xs uppercase tracking-wide font-semibold mb-2">
                        <span>Hariteja Nandipati</span>
                        <span className="w-1 h-1 rounded-full bg-gray-500" />
                        <span>Hyderabad, India</span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                        Senior UX Designer & Architect.
                    </h3>
                </div>

                <p className="text-gray-600 leading-relaxed font-medium">
                    8+ years experience. I don't just design screens; I architect secure, scalable design ecosystems for complex SaaS products.
                </p>

                <div className="flex items-center justify-center md:justify-start gap-4 pt-2">
                    <a href="https://linkedin.com/in/hariteja-nandipati" className="bg-[#1A1A1A] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-black flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-orange-500/40">
                        <span className="text-lg">in</span> Connect
                    </a>
                    <a href="/resume.html" target="_blank" className="bg-white border border-gray-200 text-gray-700 px-6 py-2.5 rounded-full text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500/20">
                        View/Print Resume
                    </a>
                </div>
            </div>
        </div>
    );
}
