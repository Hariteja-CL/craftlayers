import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for merging tailwind classes
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const buttonVariants = cva(
    "inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-brand-primary-base disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                solid: "cl-bg-brand-primary-base cl-text-brand-primary-on-base hover:cl-bg-brand-primary-interaction cl-border-thin cl-border-transparent",
                secondary: "cl-bg-neutral-surface-level-2 cl-text-neutral-text-high-contrast hover:cl-bg-neutral-surface-level-3 cl-border-thin cl-border-border-color-default",
                outline: "cl-border-thin cl-border-border-color-default bg-transparent cl-text-neutral-text-high-contrast hover:cl-bg-neutral-surface-level-2",
                ghost: "hover:cl-bg-neutral-surface-level-2 cl-text-neutral-text-medium-contrast hover:cl-text-neutral-text-high-contrast",
                link: "cl-text-brand-primary-base underline-offset-4 hover:underline p-0 h-auto",
            },
            size: {
                sm: "h-8 px-4 text-xs",
                md: "h-10 px-6 text-sm",     // Default button size
                lg: "h-12 px-8 text-base",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "solid",
            size: "md",
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, ...props }, ref) => {
        return (
            <button
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export { Button, buttonVariants };
