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
    badge?: string;
    variant?: 'light' | 'dark';
}

export function ServiceCard({
    title,
    description,
    icon,
    onClick,
    className,
    badge,
}: ServiceCardProps) {

    return (
        <Card
            onClick={onClick}
            className={cn(
                "cursor-pointer group h-full flex flex-col justify-between p-6 lg:p-10 cl-radius-lg cl-border-thin cl-border-solid relative overflow-hidden",
                "cl-bg-neutral-surface-level-1 cl-border-border-color-default hover:cl-border-border-color-strong",
                className
            )}
        >
            {badge && (
                <div className={cn(
                    "absolute top-4 right-4 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border",
                    "cl-border-border-color-strong cl-text-neutral-text-medium-contrast"
                )}>
                    {badge}
                </div>
            )}
            <div className="space-y-6">
                {/* Icon Container */}
                <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center border cl-border-border-color-default cl-bg-neutral-surface-level-0",
                    "cl-text-brand-primary-base"
                )}>
                    {icon}
                </div>

                <div className="space-y-3">
                    <CardTitle className={cn(
                        "cl-text-300 cl-weight-semibold cl-text-neutral-text-high-contrast"
                    )}>
                        {title}
                    </CardTitle>
                    <p className={cn(
                        "cl-text-075 cl-leading-150 cl-weight-regular line-clamp-3 cl-text-neutral-text-medium-contrast"
                    )}>
                        {description}
                    </p>
                </div>
            </div>

            <div className={cn(
                "mt-8 flex items-center justify-between cl-text-075 cl-weight-medium cl-text-brand-primary-base"
            )}>
                Explore Case Studies
                <ArrowRight className={cn(
                    "h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
                )} />
            </div>
        </Card>
    );
}
