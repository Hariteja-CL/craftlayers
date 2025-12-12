import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './Button'; // Reuse utility

const badgeVariants = cva(
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
        variants: {
            variant: {
                default: "border-transparent bg-primary-main-100 text-primary-main-700 hover:bg-primary-main-200",
                secondary: "border-transparent bg-surface-subtle text-content-secondary hover:bg-surface-DEFAULT",
                outline: "text-content-primary border-border-DEFAULT",
                success: "border-transparent bg-pastel-green-500/20 text-success-700 hover:bg-pastel-green-500/30",
                warning: "border-transparent bg-pastel-orange-500/20 text-warning-700 hover:bg-pastel-orange-500/30",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    );
}

export { Badge, badgeVariants };
