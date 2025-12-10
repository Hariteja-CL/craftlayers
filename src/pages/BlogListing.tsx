import { useState, useMemo } from "react";
import { getAllPosts } from "@/lib/blog";
import { BlogCard } from "@/components/blog/BlogCard";
import { SearchBar } from "@/components/blog/SearchBar";
import { X, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function BlogListing() {
    const blogPosts = getAllPosts();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTag, setSelectedTag] = useState<string | null>(null);

    // Get all unique tags from posts
    const allTags = useMemo(() => {
        const tags = new Set<string>();
        blogPosts.forEach(post => post.tags.forEach(tag => tags.add(tag)));
        return Array.from(tags).sort();
    }, []);

    // Filter posts based on search and tag
    const filteredPosts = useMemo(() => {
        return blogPosts.filter((post) => {
            const matchesSearch =
                post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

            const matchesTag = selectedTag ? post.tags.includes(selectedTag) : true;

            return matchesSearch && matchesTag;
        });
    }, [searchQuery, selectedTag]);

    return (
        <div className="container mx-auto px-6 py-24 max-w-[1440px]">
            {/* Back Navigation */}
            <div className="mb-8">
                <Link to="/" className="inline-flex items-center text-content-secondary hover:text-primary-500 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
                </Link>
            </div>

            {/* Header Section */}
            <div className="mb-16 max-w-2xl">
                <h1 className="text-h1 font-bold text-content-primary mb-md">
                    Insights & <span className="text-primary-500">Perspectives</span>
                </h1>
                <p className="text-headline text-content-secondary">
                    Exploring the intersection of seamless design, AI intelligence, and cybersecurity.
                </p>
            </div>

            {/* Controls Section */}
            <div className="mb-12 flex flex-col lg:flex-row gap-lg items-start lg:items-center justify-between">
                <div className="w-full lg:w-[400px]">
                    <SearchBar
                        value={searchQuery}
                        onChange={setSearchQuery}
                    />
                </div>

                <div className="flex flex-wrap gap-sm">
                    {allTags.map(tag => (
                        <button
                            key={tag}
                            onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                            className={`
                                px-4 py-2 rounded-full text-sm font-medium transition-all border
                                ${selectedTag === tag
                                    ? "bg-primary-500 text-white border-primary-500 shadow-lg shadow-primary-500/25"
                                    : "bg-white text-content-secondary border-border-default hover:border-primary-500 hover:text-primary-500"}
                            `}
                        >
                            {tag}
                        </button>
                    ))}
                    {selectedTag && (
                        <button
                            onClick={() => setSelectedTag(null)}
                            className="flex items-center gap-1 px-3 py-2 text-sm text-content-tertiary hover:text-error-500 transition-colors"
                        >
                            <X className="w-4 h-4" /> Clear Filter
                        </button>
                    )}
                </div>
            </div>

            {/* Results Section */}
            {filteredPosts.length > 0 ? (
                <div className="grid gap-lg md:grid-cols-2 lg:grid-cols-3">
                    {filteredPosts.map((post) => (
                        <BlogCard key={post.id} post={post} />
                    ))}
                </div>
            ) : (
                <div className="py-24 text-center border border-dashed border-border-default rounded-xl bg-surface-subtle/30">
                    <h3 className="text-h3 font-bold text-content-primary mb-2">No posts found</h3>
                    <p className="text-content-secondary">
                        Try adjusting your search terms or filters.
                    </p>
                    <button
                        onClick={() => { setSearchQuery(""); setSelectedTag(null); }}
                        className="mt-6 text-primary-500 font-medium hover:underline"
                    >
                        Clear all filters
                    </button>
                </div>
            )}
        </div>
    );
}
