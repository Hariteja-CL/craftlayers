import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Card, CardTitle } from '../ui/Card';
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
                "cursor-pointer group h-full flex flex-col justify-between border-gray-100 hover:border-primary-main-400 shadow-sm transition-all duration-300 bg-white p-6 md:p-8 rounded-xl",
                isActive ? "border-primary-main-400 ring-1 ring-primary-main-400" : "hover:shadow-primary-main-400/10",
                className
            )}
        >
            <div className="space-y-6">
                {/* Icon Container at top */}
                <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300 bg-orange-50/50"
                )}>
                    {icon}
                </div>

                <div className="space-y-3">
                    <CardTitle className="text-2xl font-bold text-gray-900">{title}</CardTitle>
                    <p className="text-content-secondary text-base leading-relaxed">
                        {description}
                    </p>

                </div>
            </div>

            <div className="mt-8 flex items-center text-sm font-medium text-gray-400 group-hover:text-primary-main-400 transition-colors">
                Explore <ArrowRight className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
            </div>
        </Card>
    );
}
