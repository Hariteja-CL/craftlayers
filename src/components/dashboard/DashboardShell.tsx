import { Link } from 'react-router-dom';
import { ArrowLeft, LayoutDashboard, Users, FileText, Settings, Bell, Search } from 'lucide-react';
import { cn } from '../ui/Button';
import { Avatar, AvatarFallback } from '../ui/Avatar';

interface DashboardShellProps {
    children: React.ReactNode;
    type: 'user' | 'therapist';
}

export function DashboardShell({ children, type }: DashboardShellProps) {
    // Common Top Navigation / Header for both (simplified)
    // For Therapist: Sidebar + Content
    // For User: Mobile-centric Container (centered)

    if (type === 'therapist') {
        return (
            <div className="min-h-screen bg-gray-50 flex font-sans">
                {/* Sidebar */}
                <aside className="w-64 bg-white border-r border-gray-200 fixed h-full hidden md:flex flex-col">
                    <div className="p-6 flex items-center gap-2 text-blue-600">
                        <LayoutDashboard className="w-6 h-6" />
                        <span className="font-bold text-lg">Inwards Pro</span>
                    </div>

                    <nav className="flex-1 px-4 space-y-1">
                        <NavItem icon={<Users className="w-5 h-5" />} label="Patients" active />
                        <NavItem icon={<FileText className="w-5 h-5" />} label="Reports" />
                        <NavItem icon={<Bell className="w-5 h-5" />} label="Alerts" badge="2" />
                    </nav>

                    <div className="p-4 border-t border-gray-100">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9 bg-blue-100 text-blue-700 border-blue-200">
                                <AvatarFallback>DM</AvatarFallback>
                            </Avatar>
                            <div className="text-sm">
                                <p className="font-medium text-gray-900">Dr. Martinez</p>
                                <p className="text-gray-500 text-xs">Therapist</p>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 md:ml-64 p-8">
                    <header className="flex justify-between items-center mb-8">
                        <Link to="/work/inwards" className="flex items-center text-sm text-gray-500 hover:text-blue-600">
                            <ArrowLeft className="w-4 h-4 mr-1" />
                            Back to Case Study
                        </Link>
                        <div className="flex gap-4">
                            <span className="bg-white border rounded-full px-4 py-2 text-sm text-gray-400 flex items-center w-64">
                                <Search className="w-4 h-4 mr-2" />
                                Search patients...
                            </span>
                        </div>
                    </header>
                    {children}
                </main>
            </div>
        );
    }

    // USER Layout (Mobile optimized, centered on desktop)
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white h-[800px] max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col relative border-8 border-gray-900/5">
                {/* Mobile Status Bar Simulation */}
                <div className="h-6 bg-white w-full flex justify-between px-4 items-center text-[10px] font-medium text-gray-900 z-10">
                    <span>9:41</span>
                    <div className="flex gap-1">
                        <span>5G</span>
                        <div className="w-4 h-2.5 border border-gray-400 rounded-sm relative">
                            <div className="absolute inset-0.5 bg-gray-900 rounded-[1px] w-3/4"></div>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto no-scrollbar relative">
                    <div className="sticky top-0 bg-white/90 backdrop-blur-md z-10 px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                        <Link to="/work/inwards" className="p-2 -ml-2 text-gray-500">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <Avatar className="h-8 w-8 bg-orange-100 text-orange-700">
                            <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                    </div>
                    {children}
                </div>

                {/* Bottom Tab Bar */}
                <div className="h-16 bg-white border-t border-gray-100 flex justify-around items-center px-2">
                    <TabIcon icon={<LayoutDashboard className="w-6 h-6" />} label="Today" active />
                    <TabIcon icon={<FileText className="w-6 h-6" />} label="Journal" />
                    <TabIcon icon={<Settings className="w-6 h-6" />} label="Settings" />
                </div>
            </div>
        </div>
    );
}

// Helpers
function NavItem({ icon, label, active, badge }: any) {
    return (
        <button className={cn(
            "flex items-center w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
            active ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        )}>
            {icon}
            <span className="ml-3 flex-1 text-left">{label}</span>
            {badge && <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full">{badge}</span>}
        </button>
    )
}

function TabIcon({ icon, label, active }: any) {
    return (
        <button className={cn(
            "flex flex-col items-center justify-center w-16 gap-1",
            active ? "text-orange-500" : "text-gray-400 hover:text-gray-600"
        )}>
            {icon}
            <span className="text-[10px] font-medium">{label}</span>
        </button>
    )
}
