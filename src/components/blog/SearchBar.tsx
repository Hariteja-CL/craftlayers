import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    className?: string;
}

export function SearchBar({ value, onChange, className }: SearchBarProps) {
    return (
        <div className={cn("relative group", className)}>
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-content-tertiary group-focus-within:text-primary-500 transition-colors" />
            <input
                type="text"
                placeholder="Search articles..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full h-12 pl-11 pr-4 bg-surface-subtle/50 backdrop-blur-sm border border-border-default rounded-lg text-content-primary placeholder:text-content-tertiary outline-none transition-all focus:border-primary-500 focus:bg-white focus:shadow-sm"
            />
        </div>
    );
}
