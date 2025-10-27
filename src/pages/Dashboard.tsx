// src/pages/Dashboard.tsx
import React, { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import {
  Users,
  Building,
  Calendar,
  MessageSquare,
  TrendingUp,
  ArrowUpRight,
  IndianRupee,
  Activity,
  Target,
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
      <div className="flex items-center justify-center h-[80vh]">
        <p className="text-gray-600 text-lg">Loading your dashboard...</p>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Leads",
      value: stats?.summary.totalLeads?.toLocaleString() || 0,
      icon: Users,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Properties Listed",
      value: stats?.summary.totalProperties?.toLocaleString() || 0,
      icon: Building,
      color: "from-green-500 to-green-600",
    },
    {
      title: "Scheduled Visits",
      value: stats?.summary.totalVisits?.toLocaleString() || 0,
      icon: Calendar,
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Conversations",
      value: stats?.summary.totalChats?.toLocaleString() || 0,
      icon: MessageSquare,
      color: "from-orange-500 to-orange-600",
    },
    {
      title: "Total Revenue",
      value: stats?.summary.totalRevenueFormatted || "₹0",
      icon: IndianRupee,
      color: "from-emerald-500 to-emerald-600",
    },
    {
      title: "Conversion Rate",
      value: `${stats?.summary.conversionRate}%`,
      icon: Target,
      color: "from-pink-500 to-pink-600",
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
      case "lead": return "bg-blue-50 text-blue-600";
      case "visit": return "bg-purple-50 text-purple-600";
      case "chat": return "bg-orange-50 text-orange-600";
      default: return "bg-gray-50 text-gray-600";
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="p-6 space-y-6"
    >
      {/* Welcome Section */}
      <motion.div variants={itemVariants} className="premium-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.firstName?.split(" ")[0] || user?.firstName}
            </h1>
            <p className="text-gray-600 mt-2">
              Here’s your real estate performance overview
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Today</p>
            <p className="text-2xl font-bold text-gray-900">
              {new Date().toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4"
      >
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div key={index} variants={itemVariants}>
              <Card className="stat-card group cursor-pointer h-full">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-600 mb-1">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                    </div>
                    <div
                      className={`w-11 h-11 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}
                    >
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="apple-card h-full">
            <CardHeader className="pb-4 flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-semibold text-gray-900">
                  Recent Activity
                </CardTitle>
                <CardDescription>Latest leads, visits & chats</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                View All <ArrowUpRight className="h-4 w-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {activity.length === 0 ? (
                  <p className="text-gray-500 text-sm">No recent activity yet.</p>
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
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition"
                      >
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${colorClass}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate text-sm">
                            {item.title}
                          </p>
                          {item.property && (
                            <p className="text-xs text-gray-600 truncate">
                              {item.property}
                            </p>
                          )}
                          {item.messagesCount !== undefined && (
                            <p className="text-xs text-gray-600">
                              {item.messagesCount} messages
                            </p>
                          )}
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {new Date(item.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
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
          <Card className="apple-card h-full">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold text-gray-900">
                Top Agents
              </CardTitle>
              <CardDescription>By conversions & revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topAgents.length === 0 ? (
                  <p className="text-gray-500 text-sm">No agents found.</p>
                ) : (
                  topAgents.map((agent, index) => (
                    <div
                      key={agent.id}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition"
                    >
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                          {agent.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="absolute -top-1 -right-1 text-xs font-bold text-white bg-emerald-500 rounded-full w-5 h-5 flex items-center justify-center">
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">
                          {agent.name}
                        </p>
                        <p className="text-xs text-gray-600">
                          {agent.conversions} conversions • ₹
                          {(agent.revenue / 100000).toFixed(1)}L
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-semibold text-emerald-600">
                          {agent.conversionRate}
                        </p>
                        <p className="text-xs text-gray-500">rate</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leads Trend */}
        <motion.div variants={itemVariants}>
          <Card className="apple-card">
            <CardHeader>
              <CardTitle className="text-lg">Leads Trend (30 Days)</CardTitle>
              <CardDescription>Daily new leads vs closed</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                 <XAxis
  dataKey="date"
  tickFormatter={(v) => new Date(v).getDate().toString()}
  fontSize={12}
  stroke="#9ca3af"
/>

                  <YAxis fontSize={12} stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                    labelFormatter={(v) => new Date(v).toLocaleDateString()}
                  />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: "#3b82f6", r: 4 }}
                    name="Total Leads"
                  />
                  <Line
                    type="monotone"
                    dataKey="closed"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ fill: "#10b981", r: 4 }}
                    name="Closed"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Visit Conversion */}
        <motion.div variants={itemVariants}>
          <Card className="apple-card">
            <CardHeader>
              <CardTitle className="text-lg">Visit to Conversion</CardTitle>
              <CardDescription>How many visits turn into deals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center h-60">
                <div className="relative w-32 h-32">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="#e5e7eb"
                      strokeWidth="12"
                      fill="none"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="#10b981"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${(visitConversion?.visitConversionRate || 0) * 3.51} 351`}
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold text-gray-900">
                      {visitConversion?.visitConversionRate || 0}%
                    </span>
                  </div>
                </div>
                <p className="mt-4 text-sm text-gray-600">
                  {visitConversion?.closedLeads || 0} closed from{" "}
                  {visitConversion?.totalVisits || 0} visits
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;