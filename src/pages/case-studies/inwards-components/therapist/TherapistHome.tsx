import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertTriangle, Clock, UserPlus, ClipboardCheck, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const patients = [
  { id: 1, name: 'Sarah Mitchell', lastSession: '2 days ago', mood: 78, risk: 'low', status: 'Active' },
  { id: 2, name: 'James Chen', lastSession: '5 days ago', mood: 45, risk: 'high', status: 'Needs Attention' },
  { id: 3, name: 'Emily Rodriguez', lastSession: '1 day ago', mood: 82, risk: 'low', status: 'Active' },
  { id: 4, name: 'Michael Thompson', lastSession: '3 days ago', mood: 62, risk: 'medium', status: 'Monitoring' },
  { id: 5, name: 'Lisa Anderson', lastSession: '1 week ago', mood: 55, risk: 'medium', status: 'Check-in Required' },
  { id: 6, name: 'David Park', lastSession: '4 days ago', mood: 88, risk: 'low', status: 'Active' },
];

const alerts = [
  { id: 1, patient: 'James Chen', message: 'Missed last 2 meditation sessions', severity: 'high', time: '2h ago' },
  { id: 2, patient: 'Lisa Anderson', message: 'No journal entries this week', severity: 'medium', time: '1d ago' },
  { id: 3, patient: 'Michael Thompson', message: 'Mood dropped 15 points', severity: 'medium', time: '3h ago' },
];

const engagementData = [
  { week: 'Week 1', engagement: 72 },
  { week: 'Week 2', engagement: 78 },
  { week: 'Week 3', engagement: 75 },
  { week: 'Week 4', engagement: 82 },
  { week: 'Week 5', engagement: 85 },
  { week: 'Week 6', engagement: 88 },
];

export function TherapistHome() {
  const getRiskBadge = (risk: string) => {
    const styles = {
      low: 'bg-green-50 text-green-700 border-green-200',
      medium: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      high: 'bg-red-50 text-red-700 border-red-200',
    };
    return styles[risk as keyof typeof styles] || styles.low;
  };

  return (
    <div className="max-w-7xl">
      <div className="mb-8">
        <h2 className="text-neutral-900 mb-2">Therapist Dashboard</h2>
        <p className="text-neutral-600">Overview of your patient caseload and recent activity</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm"
        >
          <div className="flex items-start justify-between mb-2">
            <p className="text-neutral-500 text-sm">Total Patients</p>
            <div className="p-2 bg-purple-50 rounded-lg">
              <UserPlus className="size-4 text-purple-500" />
            </div>
          </div>
          <h3 className="text-neutral-900">24</h3>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.01 }}
          className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm"
        >
          <div className="flex items-start justify-between mb-2">
            <p className="text-neutral-500 text-sm">Active This Week</p>
            <div className="p-2 bg-green-50 rounded-lg">
              <TrendingUp className="size-4 text-green-500" />
            </div>
          </div>
          <h3 className="text-neutral-900">18</h3>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.01 }}
          className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm"
        >
          <div className="flex items-start justify-between mb-2">
            <p className="text-neutral-500 text-sm">Needs Attention</p>
            <div className="p-2 bg-yellow-50 rounded-lg">
              <AlertTriangle className="size-4 text-yellow-600" />
            </div>
          </div>
          <h3 className="text-neutral-900">3</h3>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.01 }}
          className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm"
        >
          <div className="flex items-start justify-between mb-2">
            <p className="text-neutral-500 text-sm">Avg Engagement</p>
            <div className="p-2 bg-indigo-50 rounded-lg">
              <ClipboardCheck className="size-4 text-indigo-500" />
            </div>
          </div>
          <h3 className="text-neutral-900">85%</h3>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Patient Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-neutral-200">
            <h3 className="text-neutral-900">Patient Overview</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="text-left px-6 py-3 text-neutral-600 text-sm">Name</th>
                  <th className="text-left px-6 py-3 text-neutral-600 text-sm">Last Session</th>
                  <th className="text-left px-6 py-3 text-neutral-600 text-sm">Mood</th>
                  <th className="text-left px-6 py-3 text-neutral-600 text-sm">Risk Level</th>
                  <th className="text-left px-6 py-3 text-neutral-600 text-sm">Status</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient) => (
                  <tr
                    key={patient.id}
                    className="border-t border-neutral-100 hover:bg-neutral-50 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <span className="text-neutral-900">{patient.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-neutral-600 text-sm">{patient.lastSession}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-2 bg-neutral-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-500 rounded-full"
                            style={{ width: `${patient.mood}%` }}
                          />
                        </div>
                        <span className="text-neutral-900 text-sm">{patient.mood}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-lg text-xs border capitalize ${getRiskBadge(
                          patient.risk
                        )}`}
                      >
                        {patient.risk}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-neutral-600 text-sm">{patient.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Alerts Panel */}
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm">
          <div className="p-6 border-b border-neutral-200">
            <div className="flex items-center gap-2">
              <AlertTriangle className="size-5 text-yellow-600" />
              <h3 className="text-neutral-900">Alerts</h3>
            </div>
          </div>
          <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-xl border ${alert.severity === 'high'
                    ? 'bg-red-50 border-red-200'
                    : 'bg-yellow-50 border-yellow-200'
                  }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <span
                    className={`text-sm ${alert.severity === 'high' ? 'text-red-900' : 'text-yellow-900'
                      }`}
                  >
                    {alert.patient}
                  </span>
                  <span className="text-xs text-neutral-500">{alert.time}</span>
                </div>
                <p
                  className={`text-sm ${alert.severity === 'high' ? 'text-red-700' : 'text-yellow-700'
                    }`}
                >
                  {alert.message}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Engagement Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
          <h3 className="text-neutral-900 mb-6">Patient Engagement Over Time</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis dataKey="week" stroke="#737373" style={{ fontSize: '14px' }} />
                <YAxis
                  stroke="#737373"
                  style={{ fontSize: '14px' }}
                  domain={[0, 100]}
                  label={{ value: 'Engagement %', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e5e5',
                    borderRadius: '12px',
                    padding: '12px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="engagement"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  dot={{ fill: '#8b5cf6', r: 6 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
          <h3 className="text-neutral-900 mb-6">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors">
              <Clock className="size-5" />
              <span>Assign Session</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 border border-neutral-200 text-neutral-700 rounded-xl hover:bg-neutral-50 transition-colors">
              <ClipboardCheck className="size-5" />
              <span>Request Assessment</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 border border-neutral-200 text-neutral-700 rounded-xl hover:bg-neutral-50 transition-colors">
              <UserPlus className="size-5" />
              <span>Add New Patient</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
