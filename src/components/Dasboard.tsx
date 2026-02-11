import React from 'react';
import { 
  UserPlus, 
  Building2, 
  TrendingUp,
  TrendingDown,
  MessageSquare,
  Calendar,
  Target,
  DollarSign,
  CheckCircle2,
  Clock,
  Phone,
  Award
} from 'lucide-react';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Mock data
const leadsData = [
  { date: 'Jan 11', newLeads: 45, closed: 12 },
  { date: 'Jan 14', newLeads: 52, closed: 15 },
  { date: 'Jan 17', newLeads: 48, closed: 18 },
  { date: 'Jan 20', newLeads: 61, closed: 14 },
  { date: 'Jan 23', newLeads: 55, closed: 20 },
  { date: 'Jan 26', newLeads: 67, closed: 22 },
  { date: 'Jan 29', newLeads: 58, closed: 19 },
  { date: 'Feb 01', newLeads: 72, closed: 25 },
  { date: 'Feb 04', newLeads: 64, closed: 21 },
  { date: 'Feb 07', newLeads: 69, closed: 28 },
  { date: 'Feb 10', newLeads: 75, closed: 30 },
];

const topAgents = [
  { id: 1, name: 'Sarah Chen', conversions: 48, revenue: 2840000, avatar: 'SC', trend: 12 },
  { id: 2, name: 'Marcus Williams', conversions: 42, revenue: 2560000, avatar: 'MW', trend: 8 },
  { id: 3, name: 'Emily Rodriguez', conversions: 38, revenue: 2180000, avatar: 'ER', trend: -3 },
  { id: 4, name: 'David Kumar', conversions: 35, revenue: 2020000, avatar: 'DK', trend: 15 },
];

const recentActivities = [
  { id: 1, type: 'lead', title: 'New lead from website', time: '5 min ago', icon: UserPlus, color: 'cyan' },
  { id: 2, type: 'visit', title: 'Property visit scheduled - Marina Bay', time: '12 min ago', icon: Calendar, color: 'blue' },
  { id: 3, type: 'chat', title: 'Chat conversation with John Doe', time: '23 min ago', icon: MessageSquare, color: 'purple' },
  { id: 4, type: 'deal', title: 'Deal closed - $850,000', time: '1 hr ago', icon: CheckCircle2, color: 'green' },
  { id: 5, type: 'call', title: 'Scheduled call with prospect', time: '2 hrs ago', icon: Phone, color: 'cyan' },
];

const Dashboard = () => {
  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0f1e3a] to-[#0a1628] -m-4 lg:-m-6 p-4 lg:p-6">
      <div className="max-w-[1920px] mx-auto">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">
                Welcome back, Alex Morgan
              </h1>
              <p className="text-slate-400">
                Here's your real estate performance overview
              </p>
            </div>
            <div className="text-right">
              <div className="text-cyan-400 text-sm font-medium">{currentDate}</div>
              <div className="text-slate-500 text-xs">Updated in real-time</div>
            </div>
          </div>
        </div>

        {/* KPI Metrics Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <KPICard
            icon={UserPlus}
            label="Total Leads"
            value="1,847"
            change="+12.5%"
            trend="up"
            iconColor="cyan"
          />
          <KPICard
            icon={Building2}
            label="Properties Listed"
            value="342"
            change="+8.2%"
            trend="up"
            iconColor="blue"
          />
          <KPICard
            icon={Calendar}
            label="Scheduled Visits"
            value="156"
            change="+15.3%"
            trend="up"
            iconColor="purple"
          />
          <KPICard
            icon={MessageSquare}
            label="Conversations"
            value="2,341"
            change="+9.7%"
            trend="up"
            iconColor="green"
          />
          <KPICard
            icon={Target}
            label="Conversion Rate"
            value="18.4%"
            change="-2.1%"
            trend="down"
            iconColor="emerald"
          />
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Leads Trend Chart - Spans 2 columns */}
          <div className="lg:col-span-2 bg-gradient-to-br from-[#0d1b2a] to-[#162335] rounded-xl border border-cyan-500/10 p-6 shadow-xl">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white mb-1">Leads Trend (30 Days)</h2>
              <p className="text-slate-400 text-sm">Daily new leads vs closed</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={leadsData}>
                <defs>
                  <linearGradient id="newLeadsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="closedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" opacity={0.3} />
                <XAxis 
                  dataKey="date" 
                  stroke="#64748b" 
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                />
                <YAxis 
                  stroke="#64748b" 
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0d1b2a', 
                    border: '1px solid #06b6d4',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Legend 
                  wrapperStyle={{ color: '#94a3b8' }}
                  iconType="circle"
                />
                <Line 
                  type="monotone" 
                  dataKey="newLeads" 
                  stroke="#06b6d4" 
                  strokeWidth={3}
                  name="New Leads"
                  dot={{ fill: '#06b6d4', r: 4 }}
                  activeDot={{ r: 6, fill: '#06b6d4' }}
                  fill="url(#newLeadsGradient)"
                />
                <Line 
                  type="monotone" 
                  dataKey="closed" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  name="Closed Deals"
                  dot={{ fill: '#10b981', r: 4 }}
                  activeDot={{ r: 6, fill: '#10b981' }}
                  fill="url(#closedGradient)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Visit to Conversion */}
          <div className="bg-gradient-to-br from-[#0d1b2a] to-[#162335] rounded-xl border border-cyan-500/10 p-6 shadow-xl">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white mb-1">Visit to Conversion</h2>
              <p className="text-slate-400 text-sm">How many visits turn into deals</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="relative">
                <svg width="200" height="200" className="transform -rotate-90">
                  {/* Background circle */}
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="#1e3a5f"
                    strokeWidth="16"
                  />
                  {/* Progress circle */}
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="url(#conversionGradient)"
                    strokeWidth="16"
                    strokeDasharray={`${(156/850) * 502} 502`}
                    strokeLinecap="round"
                    className="drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                  />
                  <defs>
                    <linearGradient id="conversionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#06b6d4" />
                      <stop offset="50%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-4xl font-bold text-white">18.4%</div>
                  <div className="text-slate-400 text-sm">Conversion</div>
                </div>
              </div>
              <div className="mt-6 space-y-3 w-full">
                <ConversionStep label="Total Visits" value="850" color="blue" />
                <ConversionStep label="Qualified Leads" value="420" color="cyan" />
                <ConversionStep label="Closed Deals" value="156" color="green" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="bg-gradient-to-br from-[#0d1b2a] to-[#162335] rounded-xl border border-cyan-500/10 p-6 shadow-xl">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white mb-1">Recent Activity</h2>
              <p className="text-slate-400 text-sm">Latest leads, visits & chats</p>
            </div>
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </div>
          </div>

          {/* Top Agents */}
          <div className="bg-gradient-to-br from-[#0d1b2a] to-[#162335] rounded-xl border border-cyan-500/10 p-6 shadow-xl">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white mb-1">Top Agents</h2>
              <p className="text-slate-400 text-sm">By conversions & revenue</p>
            </div>
            <div className="space-y-4">
              {topAgents.map((agent, index) => (
                <AgentCard key={agent.id} agent={agent} rank={index + 1} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Components
function KPICard({ 
  icon: Icon, 
  label, 
  value, 
  change, 
  trend, 
  iconColor 
}) {
  const colorMap = {
    cyan: { bg: 'from-cyan-500/20 to-cyan-600/10', icon: 'text-cyan-400', glow: 'shadow-cyan-500/20' },
    blue: { bg: 'from-blue-500/20 to-blue-600/10', icon: 'text-blue-400', glow: 'shadow-blue-500/20' },
    purple: { bg: 'from-purple-500/20 to-purple-600/10', icon: 'text-purple-400', glow: 'shadow-purple-500/20' },
    green: { bg: 'from-green-500/20 to-green-600/10', icon: 'text-green-400', glow: 'shadow-green-500/20' },
    emerald: { bg: 'from-emerald-500/20 to-emerald-600/10', icon: 'text-emerald-400', glow: 'shadow-emerald-500/20' },
  };

  const colors = colorMap[iconColor];

  return (
    <div className={`bg-gradient-to-br from-[#0d1b2a] to-[#162335] rounded-xl border border-cyan-500/10 p-5 shadow-xl hover:shadow-2xl ${colors.glow} transition-all`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colors.bg} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${colors.icon}`} />
        </div>
        <div className={`flex items-center gap-1 text-xs font-medium ${trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
          {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {change}
        </div>
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-slate-400 text-sm">{label}</div>
    </div>
  );
}

function ActivityItem({ activity }) {
  const colorMap = {
    cyan: 'bg-cyan-500/10 text-cyan-400',
    blue: 'bg-blue-500/10 text-blue-400',
    purple: 'bg-purple-500/10 text-purple-400',
    green: 'bg-green-500/10 text-green-400',
  };

  const Icon = activity.icon;
  const colorClass = colorMap[activity.color];

  return (
    <div className="flex items-center gap-4 p-3 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-colors border border-slate-700/30">
      <div className={`w-10 h-10 rounded-lg ${colorClass} flex items-center justify-center flex-shrink-0`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-white text-sm font-medium truncate">{activity.title}</div>
        <div className="text-slate-400 text-xs flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {activity.time}
        </div>
      </div>
    </div>
  );
}

function AgentCard({ agent, rank }) {
  const maxConversions = 48;
  const percentage = (agent.conversions / maxConversions) * 100;

  return (
    <div className="flex items-center gap-4 p-4 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-all border border-slate-700/30">
      <div className="flex items-center gap-3 flex-1">
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-semibold">
            {agent.avatar}
          </div>
          {rank === 1 && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
              <Award className="w-3 h-3 text-yellow-900" />
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-white font-medium">{agent.name}</span>
            <span className={`text-xs flex items-center gap-1 ${agent.trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {agent.trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {Math.abs(agent.trend)}%
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Target className="w-3 h-3" />
              {agent.conversions} deals
            </span>
            <span className="flex items-center gap-1">
              <DollarSign className="w-3 h-3" />
              ${(agent.revenue / 1000000).toFixed(1)}M
            </span>
          </div>
          <div className="mt-2 h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ConversionStep({ label, value, color }) {
  const colorMap = {
    blue: 'bg-blue-500',
    cyan: 'bg-cyan-500',
    green: 'bg-green-500',
  };

  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30 border border-slate-700/30">
      <div className="flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full ${colorMap[color]}`} />
        <span className="text-slate-300 text-sm">{label}</span>
      </div>
      <span className="text-white font-semibold">{value}</span>
    </div>
  );
}

export default Dashboard;