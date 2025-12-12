import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/Card';
import { cn } from '../ui/Button';

interface ServiceCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    isActive?: boolean;
    onClick?: () => void;
    className?: string;
}

export function ServiceCard({
    title,
    description,
    icon,
    isActive = false,
    onClick,
    className,
}: ServiceCardProps) {
    return (
        <Card
            onClick={onClick}
            className={cn(
                "cursor-pointer group h-full flex flex-col justify-between border-transparent transition-all duration-300",
                isActive ? "border-primary-main-400 ring-1 ring-primary-main-400" : "hover:border-primary-main-400",
                className
            )}
        >
            <CardHeader>
                <div className={cn(
                    "w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors duration-300",
                    "bg-gray-100 group-hover:bg-primary-main-400"
                )}>
                    {/* Icon Wrapper: Clone element to enforce color change or use CSS */}
                    <div className="text-content-secondary group-hover:text-white transition-colors duration-300">
                        {icon}
                    </div>
                </div>
                <CardTitle>{title}</CardTitle>
            </CardHeader>

            <CardContent>
                <p className="text-content-secondary leading-relaxed">
                    {description}
                </p>
            </CardContent>

            <CardFooter>
                <div className="flex items-center text-sm font-medium text-content-tertiary group-hover:text-primary-main-400 group-hover:gap-2 transition-all duration-300">
                    Explore <ArrowRight className="ml-1 h-4 w-4" />
                </div>
            </CardFooter>
        </Card>
    );
}
