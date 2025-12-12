import { MousePointerClick } from 'lucide-react';
import { cn } from './Button';

interface InteractiveChipProps {
    className?: string;
}

export function InteractiveChip({ className }: InteractiveChipProps) {
    return (
        <div className={cn("inline-flex items-center gap-1.5 bg-gray-900 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg uppercase tracking-wider backdrop-blur-md bg-opacity-90", className)}>
            <MousePointerClick className="w-3 h-3 text-orange-400" />
            <span>Interactive Prototype</span>
        </div>
    );
}
