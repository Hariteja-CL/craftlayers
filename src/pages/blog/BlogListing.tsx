
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
            {/* Blog Hero */}
            <section className="bg-surface border-b border-border-muted py-16 md:py-24">
                <div className="container mx-auto px-6 max-w-container text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-content-primary mb-4">
                        Blog
                    </h1>
                    <p className="text-xl text-content-secondary max-w-2xl mx-auto">
                        Insights on the intersection of design, security, and the future of digital experiences.
                    </p>
                </div>
            </section>

            {/* Content Container */}
            <section className="container mx-auto px-6 max-w-container">
                {/* Search & Filter */}
                <SearchFilterBar />

                {/* Blog Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {BLOG_POSTS.map((post) => (
                        <BlogCard key={post.id} {...post} />
                    ))}
                </div>
            </section>
        </div>
    );
}
