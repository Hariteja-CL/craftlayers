import { Link } from "react-router-dom";
import { ArrowRight, Clock } from "lucide-react";
import { BlogPost } from "@/data/blog-content";
import { cn } from "@/lib/utils";

interface BlogCardProps {
    post: BlogPost;
    className?: string;
}

export function BlogCard({ post, className }: BlogCardProps) {
    return (
        <Link
            to={`/blog/${post.slug}`}
            className={cn(
                "group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border-default p-lg transition-all duration-300",
                // Glassmorphism effect: White with opacity + Blur
                "bg-white/60 backdrop-blur-md hover:bg-white/80",
                // Hover Border & Shadow
                "hover:border-primary-500 hover:shadow-lg",
                className
            )}
        >
            <div className="flex flex-col gap-md">
                <div className="flex items-center gap-xs font-medium text-content-tertiary uppercase tracking-wider">
                    <span className="text-caption text-primary-500">{post.tags[0]}</span>
                    <span className="text-caption">•</span>
                    <span className="text-body-sm">{post.date}</span>
                </div>

                <h3 className="text-h3 font-bold text-content-primary transition-colors group-hover:text-primary-700">
                    {post.title}
                </h3>

                <p className="text-content-secondary line-clamp-3 font-normal leading-relaxed">
                    {post.excerpt}
                </p>
            </div>

            <div className="mt-lg flex items-center justify-between border-t border-border-muted pt-md">
                <div className="flex items-center gap-xs text-sm text-content-tertiary">
                    <Clock className="w-4 h-4" />
                    <span>{post.readTime}</span>
                </div>
                <span className="inline-flex items-center gap-xs text-sm font-medium text-primary-500 transition-all group-hover:translate-x-1">
                    Read Post <ArrowRight className="w-4 h-4" />
                </span>
            </div>
        </Link>
    );
}
