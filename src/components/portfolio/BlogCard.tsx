
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/Card';
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
            <Card className="h-full flex flex-col overflow-hidden border-transparent hover:border-primary-main-400 transition-all duration-300">
                {imageUrl && (
                    <div className="w-full h-48 overflow-hidden bg-surface-subtle">
                        <img
                            src={imageUrl}
                            alt={title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    </div>
                )}

                <CardHeader className="pb-2">
                    <div className="flex justify-between items-center mb-2">
                        <Badge variant="secondary" className="text-xs uppercase tracking-wider">{category}</Badge>
                        <span className="text-xs text-content-tertiary">{date}</span>
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary-main-400 transition-colors">
                        {title}
                    </CardTitle>
                </CardHeader>

                <CardContent className="flex-grow">
                    <CardDescription className="line-clamp-3">
                        {excerpt}
                    </CardDescription>
                </CardContent>

                <CardFooter className="pt-0">
                    <div className="flex items-center text-sm font-medium text-primary-main-400 gap-1 group-hover:gap-2 transition-all">
                        Read Article <ArrowRight className="h-4 w-4" />
                    </div>
                </CardFooter>
            </Card>
        </Link>
    );
}
