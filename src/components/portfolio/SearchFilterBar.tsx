import { Search } from 'lucide-react';
import { cn } from '../ui/Button';

export function SearchFilterBar() {
    return (
        <div className="flex flex-col md:flex-row gap-6 justify-between items-center mb-12">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-content-tertiary" />
                <input
                    type="text"
                    placeholder="Search articles..."
                    className="w-full pl-12 pr-4 py-3 rounded-full border border-border-DEFAULT bg-surface text-content-primary focus:outline-none focus:ring-2 focus:ring-primary-main-400 transition-shadow"
                />
            </div>

            {/* Filter Chips */}
            <div className="flex gap-2 flex-wrap justify-center">
                {['All', 'Design', 'Security', 'AI', 'Engineering'].map((filter, index) => (
                    <button
                        key={filter}
                        className={cn(
                            "px-4 py-2 rounded-full text-sm font-medium border transition-all cursor-pointer",
                            index === 0
                                ? "bg-primary-main-400 text-white border-primary-main-400 shadow-md shadow-primary-main-400/20"
                                : "bg-transparent text-content-secondary border-border-DEFAULT hover:border-primary-main-400 hover:text-primary-main-400"
                        )}
                    >
                        {filter}
                    </button>
                ))}
            </div>
        </div>
    );
}
