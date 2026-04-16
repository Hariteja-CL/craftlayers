import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './Button'; // Reuse utility

const badgeVariants = cva(
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
        variants: {
            variant: {
                default: "border-transparent cl-bg-color-brand-primary-surface cl-text-color-brand-primary-base hover:cl-bg-color-brand-primary-background",
                solid: "border-transparent cl-bg-color-brand-primary-background cl-text-color-brand-primary-base hover:cl-bg-color-brand-primary-interaction hover:cl-text-color-brand-primary-on-base cl-elevation-raised",
                secondary: "border-transparent cl-bg-neutral-surface-level-2 cl-text-secondary hover:cl-bg-neutral-surface-level-3",
                outline: "cl-text-primary border cl-border-default",
                success: "border-transparent cl-bg-semantic-success-background cl-text-semantic-success-text hover:opacity-80",
                warning: "border-transparent cl-bg-semantic-warning-background cl-text-semantic-warning-text hover:opacity-80",
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
