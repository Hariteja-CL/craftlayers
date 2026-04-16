
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface BlogCardProps {
    title: string;
    excerpt: string;
    category: string;
    date: string;
    slug: string; // e.g., "/work/secure-ux"
    imageUrl?: string;
}

export function BlogCard({ title, excerpt, category, date, slug, imageUrl }: BlogCardProps) {
    return (
        <Link to={slug} className="block group h-full">
            <Card className="h-full flex flex-col p-3 cl-surface-page rounded-[2rem] border-0 cl-elevation-surface hover:cl-elevation-raised hover:-translate-y-1 transition-all duration-300">
                {imageUrl && (
                    <div className="w-full aspect-[4/3] overflow-hidden rounded-[1.5rem] relative">
                        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300 z-10" />
                        <img
                            src={imageUrl}
                            alt={title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute top-4 left-4 z-20">
                            <Badge variant="secondary" className="cl-surface-card opacity-90 backdrop-blur-md cl-text-neutral-text-high-contrast shadow-sm border-0 font-semibold px-3 py-1">
                                {category}
                            </Badge>
                        </div>
                    </div>
                )}

                <div className="flex flex-col flex-grow p-5 space-y-4">
                    <div className="space-y-2 flex-grow">
                        <div className="text-xs font-mono cl-text-neutral-text-medium-contrast uppercase tracking-widest">
                            {date}
                        </div>
                        <h3 className="text-xl font-bold cl-text-neutral-text-high-contrast leading-tight cl-group-hover-text-color-brand-primary-base transition-colors">
                            {title}
                        </h3>
                        <p className="cl-text-neutral-text-medium-contrast text-sm leading-relaxed line-clamp-3">
                            {excerpt}
                        </p>
                    </div>

                    <div className="flex items-center text-sm font-bold cl-text-neutral-text-high-contrast cl-group-hover-text-color-brand-primary-base gap-2 transition-all pt-2">
                        Read Insight <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                </div>
            </Card>
        </Link>
    );
}
