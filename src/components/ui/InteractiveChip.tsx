import { MousePointerClick } from 'lucide-react';
import { cn } from './Button';

interface InteractiveChipProps {
    className?: string;
}

export function InteractiveChip({ className }: InteractiveChipProps) {
    return (
        <div className={cn("inline-flex items-center cl-gap-inline-150 cl-bg-color-brand-primary-background cl-text-color-brand-primary-base cl-p-inline-300 cl-p-stack-150 cl-radius-full cl-elevation-raised cl-text-075 cl-weight-bold backdrop-blur-md bg-opacity-90", className)}>
            <MousePointerClick className="w-3 h-3 cl-text-color-brand-primary-base" />
            <span>Interactive Prototype</span>
        </div>
    );
}
