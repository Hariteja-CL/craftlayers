
import { BlogCard } from '../../components/portfolio/BlogCard';
import { SearchFilterBar } from '../../components/portfolio/SearchFilterBar';

// Mock Data
const BLOG_POSTS = [
    {
        id: 1,
        title: "Secure UX: Balancing Trust and Usability",
        excerpt: "How to design security features that enhance rather than hinder the user experience. A deep dive into authentication patterns.",
        category: "Security",
        date: "Oct 24, 2024",
        slug: "/work/secure-ux",
        imageUrl: "/assets/images/blog/secure-ux-cover.png"
    },
    // Add placeholder if needed
];

export function BlogListing() {
    return (
        <div className="space-y-12 pb-20">
            {/* Insights Hero (Aligned with Home Hero) */}
            <section className="px-6 pt-12 pb-8 md:pt-24 max-w-container mx-auto">
                <div className="max-w-4xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 mb-6">
                        <span className="text-xs font-bold text-blue-600 tracking-wider uppercase">Thought Leadership</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6 text-[#1A1A1A]">
                        Latest Insights.
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-500 leading-relaxed font-medium">
                        Exploring the intersection of <span className="text-gray-900">design systems</span>, <span className="text-gray-900">security</span>, and the <span className="text-gray-900">future of AI</span>.
                    </p>
                </div>
            </section>

            {/* Content Container */}
            <section className="container mx-auto px-6 max-w-container">
                {/* Search & Filter - keeping functionality, styles might need tweak later */}
                <div className="mb-12">
                    <SearchFilterBar />
                </div>

                {/* Blog Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {BLOG_POSTS.map((post) => (
                        <div key={post.id} className="h-full">
                            <BlogCard {...post} />
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
