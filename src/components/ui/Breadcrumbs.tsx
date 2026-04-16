import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { cn } from './Button';

export interface BreadcrumbItem {
    label: string;
    path?: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
    className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
    return (
        <nav aria-label="Breadcrumb" className={cn("flex items-center space-x-2 cl-text-075 cl-text-secondary w-full", className)}>
            <ol className="flex items-center space-x-2">
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;
                    return (
                        <li key={item.label} className="flex items-center">
                            {item.path && !isLast ? (
                                <Link 
                                    to={item.path} 
                                    className="hover:cl-text-primary transition-colors cl-focus-ring cl-radius-sm px-1 py-0.5 -ml-1"
                                >
                                    {item.label}
                                </Link>
                            ) : (
                                <span className={cn(
                                    "px-1 py-0.5 -ml-1", 
                                    isLast ? "cl-text-primary cl-weight-semibold" : ""
                                )} aria-current={isLast ? "page" : undefined}>
                                    {item.label}
                                </span>
                            )}
                            {!isLast && (
                                <ChevronRight className="w-3 h-3 mx-1 opacity-50" />
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
