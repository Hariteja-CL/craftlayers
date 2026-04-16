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
        <div className={cn("inline-flex items-center cl-bg-color-brand-primary-background cl-p-inset-200 cl-radius-full gap-3 cl-elevation-surface", className)}>
            <div className="w-10 h-10 rounded-full overflow-hidden cl-border-thin cl-border-solid cl-border-color-brand-primary-base shrink-0">
                <img
                    src={avatarSrc}
                    alt="Designer"
                    className="w-full h-full object-cover"
                />
            </div>
            <span className="cl-text-color-brand-primary-base cl-weight-medium cl-text-200 tracking-wide pr-3">{label}</span>
        </div>
    );
}
