// ... (imports remain same)
import { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { TrendingUp, Users, AlertCircle, Search, ArrowLeft, Bell, FileText, LayoutGrid, Settings, LogOut, Calendar, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';

// --- Dummy Data --- (Keep as is)
const PATIENTS = [
    { id: 1, name: "John Doe", status: "Active", lastEntry: "Today, 9AM", risk: "Low", age: 34, diagnosis: "Generalized Anxiety", notes: "Showing steady improvement. Good adherence to CBT exercises." },
    { id: 2, name: "Sarah Smith", status: "Active", lastEntry: "Yesterday", risk: "Medium", age: 28, diagnosis: "Depression", notes: "Reported lower mood scores this week. Flagged for check-in." },
    { id: 3, name: "Mike Johnson", status: "Flagged", lastEntry: "2 days ago", risk: "High", age: 45, diagnosis: "PTSD", notes: "Missed last two sessions. Urgent follow-up required." },
    { id: 4, name: "Emily Davis", status: "Active", lastEntry: "Today, 10AM", risk: "Low", age: 31, diagnosis: "Stress", notes: "Doing well. Using meditation features daily." },
    { id: 5, name: "Alex Turner", status: "Inactive", lastEntry: "1 week ago", risk: "Low", age: 29, diagnosis: "Social Anxiety", notes: "Stable. Monthly check-in scheduled." },
];

const SCHEDULE = [
    { id: 101, time: "10:00 AM", patient: "Emily Davis", type: "Follow-up", status: "upcoming" },
    { id: 102, time: "01:30 PM", patient: "John Doe", type: "CBT Review", status: "upcoming" },
    { id: 103, time: "03:00 PM", patient: "Sarah Smith", type: "Emergency", status: "urgent" },
];

const REPORTS = [
    { id: 1, title: "Monthly Progress Summary", date: "Oct 2023", patient: "All Patients", type: "Summary" },
    { id: 2, title: "CBT Eficacy Analysis", date: "Sep 25, 2023", patient: "John Doe", type: "Clinical" },
    { id: 3, title: "Meditation Adherence Report", date: "Sep 20, 2023", patient: "Emily Davis", type: "Activity" },
];

const ALERTS = [
    { id: 1, title: "High Risk Indicator", message: "Mike Johnson has missed 2 consecutive sessions.", severity: "high", time: "2 hours ago" },
    { id: 2, title: "Mood Drop Alert", message: "Sarah Smith reported a mood score of 2/10.", severity: "medium", time: "5 hours ago" },
];

// --- Components ---

export function TherapistDashboard() {
    const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);
    const [activeTab, setActiveTab] = useState('Patients');
    const selectedPatient = PATIENTS.find(p => p.id === selectedPatientId);

    // Derived Stats
    const activePatients = PATIENTS.filter(p => p.status === 'Active').length;
    const highRisk = PATIENTS.filter(p => p.risk === 'High').length;

    return (
        <div className="min-h-screen cl-bg-neutral-surface-level-1 font-sans flex cl-text-primary">

            {/* Sidebar */}
            <aside className="w-64 cl-surface-card border-r cl-border-subtle flex-shrink-0 flex flex-col fixed h-full z-20">
                <div className="p-6">
                    <div className="flex items-center gap-2 cl-text-color-brand-primary-base mb-8">
                        <LayoutGrid className="w-6 h-6" />
                        <span className="text-xl font-bold tracking-tight">Inwards Pro</span>
                    </div>

                    <nav className="space-y-1">
                        <SidebarItem
                            icon={<Users className="w-5 h-5" />}
                            label="Patients"
                            active={activeTab === 'Patients'}
                            onClick={() => setActiveTab('Patients')}
                        />
                        <SidebarItem
                            icon={<FileText className="w-5 h-5" />}
                            label="Reports"
                            active={activeTab === 'Reports'}
                            onClick={() => setActiveTab('Reports')}
                        />
                        <SidebarItem
                            icon={<Bell className="w-5 h-5" />}
                            label="Alerts"
                            badge="2"
                            active={activeTab === 'Alerts'}
                            onClick={() => setActiveTab('Alerts')}
                        />
                    </nav>
                </div>

                <div className="mt-auto p-6 border-t cl-border-subtle">
                    <nav className="space-y-1">
                        <SidebarItem icon={<Settings className="w-5 h-5" />} label="Settings" />
                        <SidebarItem icon={<LogOut className="w-5 h-5" />} label="Log Out" />
                    </nav>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8 overflow-y-auto">

                {/* Header */}
                <header className="flex justify-between items-center mb-10">
                    <Link to="/work/inwards" className="flex items-center text-sm font-medium cl-text-secondary hover:cl-text-color-brand-primary-base transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Case Study
                    </Link>

                    <div className="relative w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 cl-text-neutral-text-low-contrast" />
                        <input
                            type="text"
                            placeholder="Search patients..."
                            className="w-full pl-10 pr-4 py-2.5 rounded-full border cl-border-default cl-bg-neutral-surface-level-0 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all placeholder:text-gray-400 cl-text-primary"
                        />
                    </div>
                </header>

                {/* Content Area Based on Active Tab */}

                {activeTab === 'Patients' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {/* Stats Row */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <StatCard
                                label="Active Patients"
                                value={activePatients}
                                trend="+2 this week"
                                icon={<Users className="w-6 h-6 cl-text-color-brand-primary-base" />}
                                bg="cl-bg-color-brand-primary-background"
                            />
                            <StatCard
                                label="High Risk"
                                value={highRisk}
                                trend="Needs attention"
                                trendColor="cl-text-semantic-error-text"
                                icon={<AlertCircle className="w-6 h-6 cl-text-semantic-error-icon" />}
                                bg="cl-bg-semantic-error-background"
                            />
                            <StatCard
                                label="Avg. Mood"
                                value="Positive"
                                trend="Stable"
                                trendColor="cl-text-semantic-success-text"
                                icon={<TrendingUp className="w-6 h-6 cl-text-semantic-success-icon" />}
                                bg="cl-bg-semantic-success-background"
                            />
                        </div>

                        {/* Split View: Patient List + Detail Panel */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Patient Overview List */}
                            <Card className="lg:col-span-2 p-0 overflow-hidden border cl-border-subtle shadow-sm cl-bg-neutral-surface-level-0">
                                <div className="p-6 border-b cl-border-subtle flex justify-between items-center">
                                    <h2 className="text-lg font-bold cl-text-primary">Patient Overview</h2>
                                    <button className="text-sm font-medium cl-text-neutral-text-medium-contrast hover:cl-text-color-brand-primary-base transition-colors">View All</button>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="text-xs font-semibold cl-text-neutral-text-low-contrast uppercase tracking-wider cl-bg-neutral-surface-level-1 border-b cl-border-subtle">
                                                <th className="px-6 py-4">Patient</th>
                                                <th className="px-6 py-4">Status</th>
                                                <th className="px-6 py-4">Last Entry</th>
                                                <th className="px-6 py-4">Risk Level</th>
                                                <th className="px-6 py-4 w-10"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y cl-divide-subtle">
                                            {PATIENTS.map(patient => (
                                                <tr
                                                    key={patient.id}
                                                    onClick={() => setSelectedPatientId(patient.id)}
                                                    className={`group cursor-pointer hover:cl-bg-neutral-surface-level-1 transition-colors ${selectedPatientId === patient.id ? 'cl-bg-neutral-surface-level-1' : ''}`}
                                                >
                                                    <td className="px-6 py-4">
                                                        <div className="font-semibold cl-text-primary group-hover:cl-text-color-brand-primary-base transition-colors">{patient.name}</div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm cl-text-secondary">{patient.status}</td>
                                                    <td className="px-6 py-4 text-sm cl-text-secondary">{patient.lastEntry}</td>
                                                    <td className="px-6 py-4">
                                                        <RiskBadge level={patient.risk} />
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <ChevronRight className="w-4 h-4 cl-text-neutral-text-low-contrast group-hover:cl-text-color-brand-primary-base" />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </Card>

                            {/* Side Panel: Dynamic Content */}
                            <Card className="col-span-1 border cl-border-default cl-bg-neutral-surface-level-1 shadow-none min-h-[500px] flex flex-col relative overflow-hidden">
                                {selectedPatient ? (
                                    <div className="flex flex-col h-full absolute inset-0 cl-bg-neutral-surface-level-0 animate-in slide-in-from-right-8 duration-300">
                                        <div className="p-6 border-b cl-border-subtle flex justify-between items-start cl-bg-neutral-surface-level-1">
                                            <div>
                                                <h3 className="text-xl font-bold cl-text-primary">{selectedPatient.name}</h3>
                                                <p className="text-sm cl-text-color-brand-primary-base font-medium">{selectedPatient.diagnosis}</p>
                                            </div>
                                            <button onClick={() => setSelectedPatientId(null)} className="cl-text-neutral-text-low-contrast hover:cl-text-primary p-1 hover:cl-bg-neutral-surface-level-2 rounded-md transition-all">×</button>
                                        </div>

                                        <div className="p-6 space-y-6 overflow-y-auto flex-1">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="p-3 cl-bg-neutral-surface-level-1 rounded-lg border cl-border-subtle">
                                                    <span className="text-xs cl-text-neutral-text-low-contrast uppercase font-bold block mb-1">Status</span>
                                                    <span className="text-sm font-semibold cl-text-primary">{selectedPatient.status}</span>
                                                </div>
                                                <div className="p-3 cl-bg-neutral-surface-level-1 rounded-lg border cl-border-subtle">
                                                    <span className="text-xs cl-text-neutral-text-low-contrast uppercase font-bold block mb-1">Age</span>
                                                    <span className="text-sm font-semibold cl-text-primary">{selectedPatient.age}</span>
                                                </div>
                                            </div>

                                            <div className="cl-bg-semantic-warning-background rounded-xl p-4 border cl-border-semantic-warning-border">
                                                <h4 className="text-xs font-bold cl-text-semantic-warning-text uppercase mb-2 flex items-center gap-2">
                                                    <FileText className="w-3 h-3" /> Latest Note
                                                </h4>
                                                <p className="text-sm cl-text-primary italic leading-relaxed">"{selectedPatient.notes}"</p>
                                            </div>

                                            <div className="space-y-3">
                                                <h4 className="text-xs font-bold cl-text-neutral-text-low-contrast uppercase">Recent Activity</h4>
                                                <div className="flex items-center gap-3 text-sm cl-text-secondary">
                                                    <div className="w-2 h-2 rounded-full cl-bg-semantic-success-icon"></div>
                                                    Meditation Session (15m)
                                                </div>
                                                <div className="flex items-center gap-3 text-sm cl-text-secondary">
                                                    <div className="w-2 h-2 rounded-full cl-bg-semantic-info-icon"></div>
                                                    Journal Entry Logged
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-4 border-t cl-border-subtle cl-bg-neutral-surface-level-1 flex gap-3">
                                            <Button className="w-full cl-bg-color-brand-primary-base hover:cl-bg-color-brand-primary-interaction text-white shadow-sm">View Full Profile</Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-6 flex flex-col h-full cl-bg-neutral-surface-level-2">
                                        <h3 className="text-lg font-bold cl-text-color-brand-primary-base mb-6 flex items-center gap-2">
                                            <Calendar className="w-5 h-5" />
                                            Daily Schedule
                                        </h3>

                                        <div className="space-y-4 relative">
                                            {/* Timeline Line */}
                                            <div className="absolute left-[19px] top-4 bottom-4 w-0.5 cl-bg-border-subtle"></div>

                                            {SCHEDULE.map((item) => (
                                                <div key={item.id} className="relative pl-10 group cursor-pointer">
                                                    <div className={`absolute left-3 top-3 w-3 h-3 rounded-full border-2 border-white shadow-sm z-10 ${item.status === 'urgent' ? 'cl-bg-semantic-error-icon' : 'cl-bg-color-brand-primary-interaction'}`}></div>

                                                    <div className={`p-4 rounded-xl border transition-all ${item.status === 'urgent' ? 'cl-surface-card cl-border-semantic-error-border shadow-md ring-4 cl-ring-semantic-error-background' : 'cl-surface-card cl-border-subtle shadow-sm hover:shadow-md'}`}>
                                                        <div className="flex justify-between items-start mb-2">
                                                            <span className="text-xs font-bold cl-text-secondary">{item.time}</span>
                                                            <span className="text-[10px] font-bold cl-text-color-brand-primary-base uppercase tracking-wider">{item.type}</span>
                                                        </div>
                                                        <h4 className="font-bold cl-text-primary text-sm mb-1">{item.patient}</h4>
                                                        {item.status === 'urgent' && (
                                                            <div className="mt-2 inline-flex items-center px-2 py-1 cl-bg-semantic-error-background cl-text-semantic-error-text text-[10px] font-bold rounded-md uppercase border cl-border-semantic-error-border">
                                                                Emergency
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mt-auto pt-8 text-center">
                                            <p className="text-xs cl-text-neutral-text-low-contrast">Select a patient from the list to view detailed profile</p>
                                        </div>
                                    </div>
                                )}
                            </Card>
                        </div>
                    </div>
                )}

                {activeTab === 'Reports' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold cl-text-primary">Generated Reports</h2>
                            <Button size="sm" variant="outline">Filter by Date</Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {REPORTS.map((report) => (
                                <Card key={report.id} className="p-6 border cl-border-subtle shadow-sm hover:shadow-md transition-shadow cl-surface-card">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-3 cl-bg-color-brand-primary-background rounded-lg">
                                            <FileText className="w-6 h-6 cl-text-color-brand-primary-base" />
                                        </div>
                                        <span className="text-xs font-medium cl-text-neutral-text-low-contrast">{report.date}</span>
                                    </div>
                                    <h3 className="font-bold cl-text-primary mb-1">{report.title}</h3>
                                    <p className="text-sm cl-text-secondary mb-6">{report.patient}</p>
                                    <Button className="w-full cl-bg-neutral-surface-level-0 cl-border-default cl-text-secondary hover:cl-bg-neutral-surface-level-1">Download</Button>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'Alerts' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-2xl">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold cl-text-primary">Recent Alerts</h2>
                            <span className="px-3 py-1 cl-bg-semantic-error-background cl-text-semantic-error-text rounded-full text-xs font-bold">2 New</span>
                        </div>
                        <div className="space-y-4">
                            {ALERTS.map((alert) => (
                                <Card key={alert.id} className={`p-4 border-l-4 shadow-sm flex items-start gap-4 ${alert.severity === 'high' ? 'cl-border-semantic-error-border cl-bg-semantic-error-background' : 'cl-border-semantic-warning-border cl-bg-semantic-warning-background'}`}>
                                    <div className={`p-2 rounded-full ${alert.severity === 'high' ? 'cl-bg-semantic-error-background cl-text-semantic-error-icon' : 'cl-bg-semantic-warning-background cl-text-semantic-warning-icon'}`}>
                                        <AlertCircle className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold cl-text-primary">{alert.title}</h3>
                                            <span className="text-xs cl-text-neutral-text-low-contrast">{alert.time}</span>
                                        </div>
                                        <p className="text-sm cl-text-secondary mt-1">{alert.message}</p>
                                        <div className="mt-4 flex gap-2">
                                            <Button size="sm" className={alert.severity === 'high' ? 'cl-bg-semantic-error-icon hover:opacity-90 text-white' : 'cl-bg-semantic-warning-icon hover:opacity-90 text-white'}>Review Case</Button>
                                            <Button size="sm" variant="ghost">Dismiss</Button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
}

// --- Sub Components ---

function SidebarItem({ icon, label, active, badge, onClick }: any) {
    return (
        <div
            onClick={onClick}
            className={`px-3 py-2.5 rounded-lg flex items-center justify-between cursor-pointer transition-all group ${active ? 'cl-bg-color-brand-primary-background cl-text-color-brand-primary-base font-medium' : 'cl-text-secondary hover:cl-bg-neutral-surface-level-1 hover:cl-text-primary'}`}
        >
            <div className="flex items-center gap-3">
                {icon}
                <span className="text-sm">{label}</span>
            </div>
            {badge && (
                <span className="px-2 py-0.5 cl-bg-semantic-error-background cl-text-semantic-error-text text-[10px] font-bold rounded-full">{badge}</span>
            )}
        </div>
    )
}

function StatCard({ label, value, trend, icon, bg, trendColor = "cl-text-color-brand-primary-base" }: any) {
    return (
        <div className="cl-surface-card p-6 rounded-2xl border cl-border-subtle shadow-sm flex items-start justify-between">
            <div>
                <p className="cl-text-secondary text-sm font-medium mb-2">{label}</p>
                <h3 className="text-3xl font-bold cl-text-primary mb-2">{value}</h3>
                <span className={`text-xs font-bold ${trendColor}`}>
                    {trend}
                </span>
            </div>
            <div className={`p-3 rounded-xl ${bg}`}>
                {icon}
            </div>
        </div>
    )
}

function RiskBadge({ level }: { level: string }) {
    const styles = {
        High: "cl-bg-semantic-error-background cl-text-semantic-error-text cl-border-semantic-error-border",
        Medium: "cl-bg-semantic-warning-background cl-text-semantic-warning-text cl-border-semantic-warning-border",
        Low: "cl-bg-neutral-surface-level-2 cl-text-secondary cl-border-subtle"
    };
    const style = styles[level as keyof typeof styles] || styles.Low;

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${style}`}>
            {level}
        </span>
    )
}
