import { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { TrendingUp, Users, AlertCircle, Search, ArrowLeft, Bell, FileText, LayoutGrid, Settings, LogOut, Calendar, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';

// --- Dummy Data ---

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
        <div className="min-h-screen bg-gray-50 font-sans flex text-slate-800">

            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-100 flex-shrink-0 flex flex-col fixed h-full z-20">
                <div className="p-6">
                    <div className="flex items-center gap-2 text-blue-600 mb-8">
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

                <div className="mt-auto p-6 border-t border-gray-50">
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
                    <Link to="/work/inwards" className="flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Case Study
                    </Link>

                    <div className="relative w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search patients..."
                            className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all placeholder:text-gray-400"
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
                                icon={<Users className="w-6 h-6 text-blue-600" />}
                                bg="bg-blue-50"
                            />
                            <StatCard
                                label="High Risk"
                                value={highRisk}
                                trend="Needs attention"
                                trendColor="text-red-500"
                                icon={<AlertCircle className="w-6 h-6 text-red-600" />}
                                bg="bg-red-50"
                            />
                            <StatCard
                                label="Avg. Mood"
                                value="Positive"
                                trend="Stable"
                                trendColor="text-green-600"
                                icon={<TrendingUp className="w-6 h-6 text-green-600" />}
                                bg="bg-green-50"
                            />
                        </div>

                        {/* Split View: Patient List + Detail Panel */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Patient Overview List */}
                            <Card className="lg:col-span-2 p-0 overflow-hidden border border-gray-100 shadow-sm bg-white">
                                <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                                    <h2 className="text-lg font-bold text-gray-900">Patient Overview</h2>
                                    <button className="text-sm font-medium text-gray-400 hover:text-blue-600 transition-colors">View All</button>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-50/50 border-b border-gray-50">
                                                <th className="px-6 py-4">Patient</th>
                                                <th className="px-6 py-4">Status</th>
                                                <th className="px-6 py-4">Last Entry</th>
                                                <th className="px-6 py-4">Risk Level</th>
                                                <th className="px-6 py-4 w-10"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {PATIENTS.map(patient => (
                                                <tr
                                                    key={patient.id}
                                                    onClick={() => setSelectedPatientId(patient.id)}
                                                    className={`group cursor-pointer hover:bg-blue-50/50 transition-colors ${selectedPatientId === patient.id ? 'bg-blue-50' : ''}`}
                                                >
                                                    <td className="px-6 py-4">
                                                        <div className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">{patient.name}</div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-500">{patient.status}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-500">{patient.lastEntry}</td>
                                                    <td className="px-6 py-4">
                                                        <RiskBadge level={patient.risk} />
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-400" />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </Card>

                            {/* Side Panel: Dynamic Content */}
                            <Card className="col-span-1 border border-blue-100 bg-blue-50/30 shadow-none min-h-[500px] flex flex-col relative overflow-hidden">
                                {selectedPatient ? (
                                    <div className="flex flex-col h-full absolute inset-0 bg-white animate-in slide-in-from-right-8 duration-300">
                                        <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-blue-50/50">
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900">{selectedPatient.name}</h3>
                                                <p className="text-sm text-blue-600 font-medium">{selectedPatient.diagnosis}</p>
                                            </div>
                                            <button onClick={() => setSelectedPatientId(null)} className="text-gray-400 hover:text-gray-600 p-1 hover:bg-white rounded-md transition-all">×</button>
                                        </div>

                                        <div className="p-6 space-y-6 overflow-y-auto flex-1">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                                                    <span className="text-xs text-gray-400 uppercase font-bold block mb-1">Status</span>
                                                    <span className="text-sm font-semibold text-gray-900">{selectedPatient.status}</span>
                                                </div>
                                                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                                                    <span className="text-xs text-gray-400 uppercase font-bold block mb-1">Age</span>
                                                    <span className="text-sm font-semibold text-gray-900">{selectedPatient.age}</span>
                                                </div>
                                            </div>

                                            <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                                                <h4 className="text-xs font-bold text-amber-600 uppercase mb-2 flex items-center gap-2">
                                                    <FileText className="w-3 h-3" /> Latest Note
                                                </h4>
                                                <p className="text-sm text-gray-700 italic leading-relaxed">"{selectedPatient.notes}"</p>
                                            </div>

                                            <div className="space-y-3">
                                                <h4 className="text-xs font-bold text-gray-400 uppercase">Recent Activity</h4>
                                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                                    Meditation Session (15m)
                                                </div>
                                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                                    Journal Entry Logged
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex gap-3">
                                            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-200">View Full Profile</Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-6 flex flex-col h-full bg-blue-50/30">
                                        <h3 className="text-lg font-bold text-blue-900 mb-6 flex items-center gap-2">
                                            <Calendar className="w-5 h-5 text-blue-500" />
                                            Daily Schedule
                                        </h3>

                                        <div className="space-y-4 relative">
                                            {/* Timeline Line */}
                                            <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-blue-200/50"></div>

                                            {SCHEDULE.map((item) => (
                                                <div key={item.id} className="relative pl-10 group cursor-pointer">
                                                    <div className={`absolute left-3 top-3 w-3 h-3 rounded-full border-2 border-white shadow-sm z-10 ${item.status === 'urgent' ? 'bg-blue-500' : 'bg-blue-300'}`}></div>

                                                    <div className={`p-4 rounded-xl border transition-all ${item.status === 'urgent' ? 'bg-white border-blue-500 shadow-md ring-4 ring-blue-50/50' : 'bg-white border-blue-100 shadow-sm hover:shadow-md'}`}>
                                                        <div className="flex justify-between items-start mb-2">
                                                            <span className="text-xs font-bold text-gray-500">{item.time}</span>
                                                            <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">{item.type}</span>
                                                        </div>
                                                        <h4 className="font-bold text-gray-900 text-sm mb-1">{item.patient}</h4>
                                                        {item.status === 'urgent' && (
                                                            <div className="mt-2 inline-flex items-center px-2 py-1 bg-red-50 text-red-600 text-[10px] font-bold rounded-md uppercase border border-red-100">
                                                                Emergency
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mt-auto pt-8 text-center">
                                            <p className="text-xs text-blue-400">Select a patient from the list to view detailed profile</p>
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
                            <h2 className="text-2xl font-bold text-gray-900">Generated Reports</h2>
                            <Button size="sm" variant="outline">Filter by Date</Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {REPORTS.map((report) => (
                                <Card key={report.id} className="p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-3 bg-blue-50 rounded-lg">
                                            <FileText className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <span className="text-xs font-medium text-gray-400">{report.date}</span>
                                    </div>
                                    <h3 className="font-bold text-gray-900 mb-1">{report.title}</h3>
                                    <p className="text-sm text-gray-500 mb-6">{report.patient}</p>
                                    <Button className="w-full bg-white border border-gray-200 text-gray-700 hover:bg-gray-50">Download</Button>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'Alerts' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-2xl">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-900">Recent Alerts</h2>
                            <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-bold">2 New</span>
                        </div>
                        <div className="space-y-4">
                            {ALERTS.map((alert) => (
                                <Card key={alert.id} className={`p-4 border-l-4 shadow-sm flex items-start gap-4 ${alert.severity === 'high' ? 'border-l-red-500 bg-red-50/10' : 'border-l-amber-500 bg-amber-50/10'}`}>
                                    <div className={`p-2 rounded-full ${alert.severity === 'high' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                                        <AlertCircle className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold text-gray-900">{alert.title}</h3>
                                            <span className="text-xs text-gray-400">{alert.time}</span>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                                        <div className="mt-4 flex gap-2">
                                            <Button size="sm" className={alert.severity === 'high' ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-amber-600 hover:bg-amber-700 text-white'}>Review Case</Button>
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
            className={`px-3 py-2.5 rounded-lg flex items-center justify-between cursor-pointer transition-all group ${active ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
        >
            <div className="flex items-center gap-3">
                {icon}
                <span className="text-sm">{label}</span>
            </div>
            {badge && (
                <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[10px] font-bold rounded-full">{badge}</span>
            )}
        </div>
    )
}

function StatCard({ label, value, trend, icon, bg, trendColor = "text-blue-600" }: any) {
    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start justify-between">
            <div>
                <p className="text-gray-500 text-sm font-medium mb-2">{label}</p>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">{value}</h3>
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
        High: "bg-red-50 text-red-700 border-red-100",
        Medium: "bg-amber-50 text-amber-700 border-amber-100",
        Low: "bg-gray-100 text-gray-600 border-gray-200"
    };
    const style = styles[level as keyof typeof styles] || styles.Low;

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${style}`}>
            {level}
        </span>
    )
}
