import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for merging tailwind classes
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const buttonVariants = cva(
    "inline-flex items-center justify-center rounded-full font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-main-400 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
    {
        variants: {
            variant: {
                solid: "bg-primary-main-400 text-white hover:bg-primary-main-500 hover:shadow-lg hover:shadow-primary-main-400/40 shadow-md shadow-primary-main-400/20 border border-transparent",
                outline: "border border-border-DEFAULT bg-transparent text-content-primary hover:border-primary-main-400 hover:text-primary-main-400 hover:shadow-md hover:shadow-primary-main-400/10",
                ghost: "hover:bg-surface-subtle text-content-secondary hover:text-content-primary",
                link: "text-primary-main-700 underline-offset-4 hover:underline p-0 h-auto active:scale-100",
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
