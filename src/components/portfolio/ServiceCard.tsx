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
    variant = "light",
    onClick,
    className,
}: ServiceCardProps & { variant?: "light" | "dark" }) {
    const isDark = variant === "dark";

    return (
        <Card
            onClick={onClick}
            className={cn(
                "cursor-pointer group h-full flex flex-col justify-between transition-all duration-300 p-8 rounded-[2rem] border-0",
                // Light Mode
                !isDark && "bg-white text-gray-900 shadow-sm hover:shadow-md",
                // Dark Mode
                isDark && "bg-[#0B1121] text-white shadow-xl hover:shadow-2xl hover:bg-[#11192e]", // Deep Navy
                className
            )}
        >
            <div className="space-y-6">
                {/* Icon Container */}
                <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors duration-300",
                    isDark ? "bg-white/10" : "bg-orange-50"
                )}>
                    {icon}
                </div>

                <div className="space-y-2">
                    <CardTitle className={cn(
                        "text-2xl font-bold",
                        isDark ? "text-white" : "text-gray-900"
                    )}>
                        {title}
                    </CardTitle>
                    <p className={cn(
                        "text-base leading-relaxed font-medium",
                        isDark ? "text-gray-200" : "text-gray-500"
                    )}>
                        {description}
                    </p>
                </div>
            </div>

            <div className={cn(
                "mt-8 flex items-center justify-between text-sm font-semibold tracking-wide uppercase",
                isDark ? "text-orange-500" : "text-gray-900"
            )}>
                {isDark ? "EXP_02" : "Explore Case Studies"}
                <ArrowRight className={cn(
                    "h-5 w-5 transition-transform duration-300",
                    "group-hover:translate-x-1"
                )} />
            </div>
        </Card>
    );
}
