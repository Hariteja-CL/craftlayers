import { cn } from './Button';

interface DesignerNoteChipProps {
    avatarSrc?: string;
    label?: string;
    className?: string;
}

export function DesignerNoteChip({
    avatarSrc = "/assets/images/avatar-placeholder.png", // Default or specific avatar
    label = "My Note",
    className
}: DesignerNoteChipProps) {
    return (
        <div className={cn("inline-flex items-center bg-orange-500 rounded-full p-1.5 pr-6 gap-3 shadow-sm", className)}>
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/20 shrink-0">
                <img
                    src={avatarSrc}
                    alt="Designer"
                    className="w-full h-full object-cover"
                />
            </div>
            <span className="text-white font-medium text-lg tracking-wide">{label}</span>
        </div>
    );
}
