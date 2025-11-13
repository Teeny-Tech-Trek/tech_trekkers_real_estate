import React, { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import {
  Users,
  Building,
  Calendar,
  MessageSquare,
  TrendingUp,
  ArrowUpRight,
  Activity,
  Target,
  Sparkles,
  Zap,
  Clock,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  fetchDashboardStats,
  fetchRecentActivity,
  fetchTopAgents,
  fetchLeadsTrend,
  fetchVisitConversion,
} from "@/services/dashboardApi";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Define variants with proper typing
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [activity, setActivity] = useState<any[]>([]);
  const [topAgents, setTopAgents] = useState<any[]>([]);
  const [trendData, setTrendData] = useState<any[]>([]);
  const [visitConversion, setVisitConversion] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const loadData = async () => {
      try {
        setLoading(true);
        const [
          statsData,
          activityData,
          agentsData,
          trendDataRes,
          conversionData,
        ] = await Promise.all([
          fetchDashboardStats(),
          fetchRecentActivity(10),
          fetchTopAgents(5),
          fetchLeadsTrend(30),
          fetchVisitConversion(),
        ]);

        setStats(statsData);
        setActivity(activityData);
        setTopAgents(agentsData);
        setTrendData(trendDataRes);
        setVisitConversion(conversionData);
      } catch (error) {
        console.error("Error fetching dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-4"
          />
          <p className="text-gray-600 text-base sm:text-lg font-medium">Loading your dashboard...</p>
        </motion.div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Leads",
      value: stats?.summary.totalLeads?.toLocaleString() || 0,
      icon: Users,
      color: "from-blue-500 to-blue-600",
      bgGlow: "group-hover:shadow-blue-500/20",
    },
    {
      title: "Properties Listed",
      value: stats?.summary.totalProperties?.toLocaleString() || 0,
      icon: Building,
      color: "from-green-500 to-green-600",
      bgGlow: "group-hover:shadow-green-500/20",
    },
    {
      title: "Scheduled Visits",
      value: stats?.summary.totalVisits?.toLocaleString() || 0,
      icon: Calendar,
      color: "from-purple-500 to-purple-600",
      bgGlow: "group-hover:shadow-purple-500/20",
    },
    {
      title: "Conversations",
      value: stats?.summary.totalChats?.toLocaleString() || 0,
      icon: MessageSquare,
      color: "from-orange-500 to-orange-600",
      bgGlow: "group-hover:shadow-orange-500/20",
    },
    {
      title: "Conversion Rate",
      value: `${stats?.summary.conversionRate}%`,
      icon: Target,
      color: "from-pink-500 to-pink-600",
      bgGlow: "group-hover:shadow-pink-500/20",
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "lead": return Users;
      case "visit": return Calendar;
      case "chat": return MessageSquare;
      default: return Activity;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "lead": return "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30";
      case "visit": return "bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/30";
      case "chat": return "bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30";
      default: return "bg-gradient-to-br from-gray-500 to-gray-600 text-white shadow-lg shadow-gray-500/30";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-x-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:2rem_2rem] sm:bg-[size:4rem_4rem] pointer-events-none" />
      
      {/* Gradient Orbs */}
      <div className="absolute top-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 sm:w-96 sm:h-96 bg-purple-400/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="p-4 sm:p-6 space-y-6 relative z-10 max-w-7xl mx-auto"
      >
        {/* Welcome Section */}
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/50 via-transparent to-indigo-600/50 opacity-50" />
            <motion.div
              animate={{ x: ['0%', '100%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
            />
            <CardContent className="p-4 sm:p-6 relative z-10">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center gap-2 mb-1"
                  >
                    <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="text-xs font-medium opacity-90">AI-Powered Dashboard</span>
                  </motion.div>
                  <h1 className="text-xl sm:text-2xl font-bold mb-1">
                    Welcome back, {user?.firstName?.split(" ")[0] || user?.firstName}!
                  </h1>
                  <p className="text-blue-100 text-xs sm:text-sm">
                    Here's your real estate performance overview
                  </p>
                </div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-right bg-white/10 backdrop-blur-sm px-3 py-2 sm:px-4 sm:py-3 rounded-xl border border-white/20 w-full sm:w-auto"
                >
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    <p className="text-xs font-medium opacity-90">Today</p>
                  </div>
                  <p className="text-lg sm:text-xl font-bold">
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6"
        >
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div key={index} variants={itemVariants}>
                <Card className={`border-0 shadow-lg hover:shadow-2xl transition-all duration-300 group cursor-pointer h-full bg-white/80 backdrop-blur-sm ${stat.bgGlow}`}>
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col gap-3 sm:gap-4">
                      <div className="flex items-center justify-between">
                        <div
                          className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-r ${stat.color} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}
                        >
                          <Icon className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                        </div>
                        <motion.div
                          whileHover={{ scale: 1.2, rotate: 15 }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                        </motion.div>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">
                          {stat.title}
                        </p>
                        <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                          {stat.value}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Recent Activity */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm h-full overflow-hidden relative">
              <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-blue-400/10 to-transparent rounded-full blur-2xl" />
              <CardHeader className="pb-3 sm:pb-4 relative z-10">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div>
                    <CardTitle className="text-lg sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
                      <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                      Recent Activity
                    </CardTitle>
                    <CardDescription className="text-sm sm:text-base mt-1">Latest leads, visits & chats</CardDescription>
                  </div>
                 
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="space-y-2 max-h-[24rem] sm:max-h-[32rem] overflow-y-auto pr-2">
                  {activity.length === 0 ? (
                    <div className="text-center py-8 sm:py-12">
                      <Activity className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm">No recent activity yet.</p>
                    </div>
                  ) : (
                    activity.map((item, index) => {
                      const Icon = getActivityIcon(item.type);
                      const colorClass = getActivityColor(item.type);
                      return (
                        <motion.div
                          key={item.id}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ scale: 1.02, x: 4 }}
                          className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 border border-transparent hover:border-blue-100 "
                        >
                          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center ${colorClass}`}>
                            <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 truncate text-sm sm:text-base">
                              {item.title}
                            </p>
                            {item.property && (
                              <p className="text-xs sm:text-sm text-gray-600 truncate">
                                {item.property}
                              </p>
                            )}
                            {item.messagesCount !== undefined && (
                              <p className="text-xs sm:text-sm text-gray-600">
                                {item.messagesCount} messages
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 sm:px-3 py-1 rounded-full whitespace-nowrap">
                              {new Date(item.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Top Agents */}
          <motion.div variants={itemVariants}>
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm h-full overflow-hidden relative">
              <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-purple-400/10 to-transparent rounded-full blur-2xl" />
              <CardHeader className="pb-3 sm:pb-4 relative z-10">
                <CardTitle className="text-lg sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                  Top Agents
                </CardTitle>
                <CardDescription className="text-sm sm:text-base mt-1">By conversions & revenue</CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="space-y-2 sm:space-y-3">
                  {topAgents.length === 0 ? (
                    <div className="text-center py-8 sm:py-12">
                      <Users className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm">No agents found.</p>
                    </div>
                  ) : (
                    topAgents.map((agent, index) => (
                      <motion.div
                        key={agent.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-200 border border-transparent hover:border-purple-100 cursor-pointer"
                      >
                        <div className="relative">
                          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-base sm:text-lg shadow-lg">
                            {agent.name.charAt(0).toUpperCase()}
                          </div>
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2 + index * 0.1, type: "spring" }}
                            className="absolute -top-2 -right-2 text-xs font-bold text-white bg-gradient-to-r from-emerald-500 to-green-500 rounded-full w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center shadow-lg"
                          >
                            {index + 1}
                          </motion.span>
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 text-sm sm:text-base">
                            {agent.name}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
                            {agent.conversions} conversions • ₹
                            {(agent.revenue / 100000).toFixed(1)}L
                          </p>
                        </div>
                        <div className="text-right bg-emerald-50 px-2 sm:px-3 py-1 sm:py-2 rounded-xl">
                          <p className="text-xs sm:text-sm font-bold text-emerald-600">
                            {agent.conversionRate}
                          </p>
                          <p className="text-xs text-emerald-600/70">rate</p>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Leads Trend */}
          <motion.div variants={itemVariants}>
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden relative">
              <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-blue-400/10 to-transparent rounded-full blur-2xl" />
              <CardHeader className="relative z-10">
                <CardTitle className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  Leads Trend (30 Days)
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">Daily new leads vs closed</CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <ResponsiveContainer width="100%" height={240} className="min-h-[12rem] sm:min-h-[15rem]">
                  <LineChart data={trendData}>
                    <defs>
                      <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorClosed" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(v) => new Date(v).getDate().toString()}
                      fontSize={10}
                      stroke="#9ca3af"
                      tickLine={false}
                      className="text-xs sm:text-sm"
                    />
                    <YAxis fontSize={10} stroke="#9ca3af" tickLine={false} axisLine={false} className="text-xs sm:text-sm" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "none",
                        borderRadius: "12px",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                        fontSize: "12px",
                      }}
                      labelFormatter={(v) => new Date(v).toLocaleDateString()}
                    />
                    <Line
                      type="monotone"
                      dataKey="total"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ fill: "#3b82f6", r: 4, strokeWidth: 1, stroke: "white" }}
                      activeDot={{ r: 6 }}
                      name="Total Leads"
                      fill="url(#colorTotal)"
                    />
                    <Line
                      type="monotone"
                      dataKey="closed"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={{ fill: "#10b981", r: 4, strokeWidth: 1, stroke: "white" }}
                      activeDot={{ r: 6 }}
                      name="Closed"
                      fill="url(#colorClosed)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Visit Conversion */}
          <motion.div variants={itemVariants}>
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden relative">
              <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-green-400/10 to-transparent rounded-full blur-2xl" />
              <CardHeader className="relative z-10">
                <CardTitle className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Target className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                  Visit to Conversion
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">How many visits turn into deals</CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="flex flex-col items-center justify-center h-64 sm:h-72">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
                    className="relative w-40 h-40 sm:w-48 sm:h-48"
                  >
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="50%"
                        cy="50%"
                        r="40"
                        stroke="#e5e7eb"
                        strokeWidth="12"
                        fill="none"
                        className="sm:r-[80] sm:stroke-[16]"
                      />
                      <motion.circle
                        initial={{ strokeDasharray: "0 502" }}
                        animate={{ strokeDasharray: `${(visitConversion?.visitConversionRate || 0) * 5.02} 502` }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                        cx="50%"
                        cy="50%"
                        r="40"
                        stroke="url(#gradient)"
                        strokeWidth="12"
                        fill="none"
                        strokeLinecap="round"
                        className="sm:r-[80] sm:stroke-[16]"
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#10b981" />
                          <stop offset="100%" stopColor="#059669" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <motion.span
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.8, type: "spring" }}
                        className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent"
                      >
                        {visitConversion?.visitConversionRate || 0}%
                      </motion.span>
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="mt-4 sm:mt-6 text-center bg-gradient-to-r from-green-50 to-emerald-50 px-4 sm:px-6 py-2 sm:py-3 rounded-2xl border border-green-100"
                  >
                    <p className="text-xs sm:text-sm font-semibold text-gray-900">
                      {visitConversion?.closedLeads || 0} closed from{" "}
                      {visitConversion?.totalVisits || 0} visits
                    </p>
                    <p className="text-xs text-gray-600 mt-1">Keep up the great work!</p>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;