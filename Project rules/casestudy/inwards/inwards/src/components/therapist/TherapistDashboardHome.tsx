import { motion } from 'motion/react';
import { AlertTriangle, TrendingUp, Users, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const patients = [
  { id: 1, name: 'Sarah Chen', lastSession: '2 days ago', mood: 'Anxious', riskScore: 72, compliance: 85, status: 'warning' },
  { id: 2, name: 'Michael Torres', lastSession: '1 day ago', mood: 'Stable', riskScore: 45, compliance: 92, status: 'normal' },
  { id: 3, name: 'Emma Williams', lastSession: '5 days ago', mood: 'Depressed', riskScore: 88, compliance: 45, status: 'critical' },
  { id: 4, name: 'James Anderson', lastSession: 'Today', mood: 'Improving', riskScore: 38, compliance: 95, status: 'normal' },
  { id: 5, name: 'Olivia Martinez', lastSession: '3 days ago', mood: 'Anxious', riskScore: 65, compliance: 78, status: 'warning' },
  { id: 6, name: 'David Kim', lastSession: '1 day ago', mood: 'Stable', riskScore: 42, compliance: 88, status: 'normal' },
];

const alerts = [
  { id: 1, patient: 'Emma Williams', message: 'Missed last 3 meditation sessions', severity: 'critical', time: '2h ago' },
  { id: 2, patient: 'Sarah Chen', message: 'Journal sentiment trending negative', severity: 'warning', time: '5h ago' },
  { id: 3, patient: 'Olivia Martinez', message: 'Risk score increased by 15 points', severity: 'warning', time: '1d ago' },
];

const engagementData = [
  { week: 'W1', sessions: 24, completions: 22 },
  { week: 'W2', sessions: 28, completions: 25 },
  { week: 'W3', sessions: 26, completions: 24 },
  { week: 'W4', sessions: 30, completions: 28 },
  { week: 'W5', sessions: 32, completions: 29 },
  { week: 'W6', sessions: 35, completions: 32 },
];

interface TherapistDashboardHomeProps {
  onNavigateToProfile?: () => void;
  onNavigateToTimeline?: () => void;
  onNavigateToSentiment?: () => void;
  onNavigateToActions?: () => void;
}

export function TherapistDashboardHome({
  onNavigateToProfile,
  onNavigateToTimeline,
  onNavigateToSentiment,
  onNavigateToActions
}: TherapistDashboardHomeProps) {
  const getRiskColor = (score: number) => {
    if (score >= 70) return 'text-red-600 bg-red-50';
    if (score >= 50) return 'text-orange-600 bg-orange-50';
    return 'text-green-600 bg-green-50';
  };

  const getStatusColor = (status: string) => {
    if (status === 'critical') return 'bg-red-100 text-red-700 border-red-200';
    if (status === 'warning') return 'bg-orange-100 text-orange-700 border-orange-200';
    return 'bg-green-100 text-green-700 border-green-200';
  };

  return (
    <div className="w-full min-h-screen bg-neutral-50 p-8">
      <div className="max-w-[1440px] mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-neutral-900 mb-2">Therapist Dashboard</h1>
            <p className="text-neutral-600">Monitor patient wellness and engagement</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-4 py-3 bg-white rounded-2xl border border-neutral-200 flex items-center gap-3">
              <Users className="size-5 text-orange-500" />
              <div>
                <p className="text-neutral-500 text-xs">Active Patients</p>
                <p className="text-neutral-900 text-xl">24</p>
              </div>
            </div>
            <div className="px-4 py-3 bg-white rounded-2xl border border-neutral-200 flex items-center gap-3">
              <Activity className="size-5 text-blue-500" />
              <div>
                <p className="text-neutral-500 text-xs">Avg Compliance</p>
                <p className="text-neutral-900 text-xl">82%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Patient Table - Left 8 cols */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="col-span-8 bg-white rounded-2xl border border-neutral-200 shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-neutral-900">Patient Overview</h3>
              <button className="px-4 py-2 text-sm text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-xl transition-colors">
                View All
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-200">
                    <th className="text-left text-xs text-neutral-500 pb-3">Patient Name</th>
                    <th className="text-left text-xs text-neutral-500 pb-3">Last Session</th>
                    <th className="text-left text-xs text-neutral-500 pb-3">Current Mood</th>
                    <th className="text-left text-xs text-neutral-500 pb-3">Risk Score</th>
                    <th className="text-left text-xs text-neutral-500 pb-3">Compliance</th>
                    <th className="text-left text-xs text-neutral-500 pb-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((patient, index) => (
                    <motion.tr
                      key={patient.id}
                      onClick={onNavigateToProfile}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      whileHover={{ scale: 1.02 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-neutral-100 hover:bg-neutral-50 hover:shadow-md transition-all cursor-pointer"
                    >
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center text-white text-sm">
                            {patient.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="text-neutral-900 text-sm">{patient.name}</span>
                        </div>
                      </td>
                      <td className="py-4 text-neutral-600 text-sm">{patient.lastSession}</td>
                      <td className="py-4 text-neutral-900 text-sm">{patient.mood}</td>
                      <td className="py-4">
                        <span className={`px-3 py-1 rounded-lg text-sm ${getRiskColor(patient.riskScore)}`}>
                          {patient.riskScore}
                        </span>
                      </td>
                      <td className="py-4 text-neutral-900 text-sm">{patient.compliance}%</td>
                      <td className="py-4">
                        <span className={`px-3 py-1 rounded-lg text-xs border ${getStatusColor(patient.status)}`}>
                          {patient.status === 'critical' ? 'High Risk' : patient.status === 'warning' ? 'Monitor' : 'Stable'}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Alerts Panel - Right 4 cols */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="col-span-4 bg-white rounded-2xl border border-neutral-200 shadow-sm p-6"
          >
            <div className="flex items-center gap-2 mb-6">
              <AlertTriangle className="size-5 text-orange-500" />
              <h3 className="text-neutral-900">Recent Alerts</h3>
            </div>

            <div className="space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-xl border ${
                    alert.severity === 'critical'
                      ? 'bg-red-50 border-red-200'
                      : 'bg-orange-50 border-orange-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-neutral-900 text-sm">{alert.patient}</p>
                    <span className="text-neutral-500 text-xs">{alert.time}</span>
                  </div>
                  <p className={`text-sm ${
                    alert.severity === 'critical' ? 'text-red-700' : 'text-orange-700'
                  }`}>
                    {alert.message}
                  </p>
                </div>
              ))}
            </div>

            <button className="w-full mt-4 px-4 py-2 text-sm text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-xl transition-colors border border-neutral-200">
              View All Alerts
            </button>
          </motion.div>
        </div>

        {/* Engagement Chart - Full Width */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="size-5 text-blue-500" />
            <h3 className="text-neutral-900">Patient Engagement Over Time</h3>
          </div>

          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={engagementData}>
                <XAxis
                  dataKey="week"
                  stroke="#a3a3a3"
                  style={{ fontSize: '12px' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  stroke="#a3a3a3"
                  style={{ fontSize: '12px' }}
                  axisLine={false}
                  tickLine={false}
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
                  dataKey="sessions"
                  stroke="#FF9933"
                  strokeWidth={3}
                  dot={{ fill: '#FF9933', r: 5 }}
                  name="Scheduled Sessions"
                />
                <Line
                  type="monotone"
                  dataKey="completions"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', r: 5 }}
                  name="Completed Sessions"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}