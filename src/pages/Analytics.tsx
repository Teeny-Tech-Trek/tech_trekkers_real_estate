import React, { useEffect, useRef, useState } from "react";
import { BarChart3, TrendingUp, Users, DollarSign, Calendar, Target } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Chart, registerables } from 'chart.js';
import {
  fetchAgentAnalytics,
  fetchConversionFunnel,
  AgentAnalytics,
  ConversionFunnel,
} from "@/services/analyticsApi";
import { useAuth } from "@/contexts/AuthContext";
import { AxiosError } from 'axios';

// Register Chart.js components
Chart.register(...registerables);

const Analytics: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth();
  const organizationId = user?.organization?.id;
  const [agentAnalytics, setAgentAnalytics] = useState<AgentAnalytics[]>([]);
  const [conversionFunnel, setConversionFunnel] = useState<ConversionFunnel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Refs for chart canvases
  const revenueChartRef = useRef<HTMLCanvasElement>(null);
  const funnelChartRef = useRef<HTMLCanvasElement>(null);
  const revenueChartInstance = useRef<Chart | null>(null);
  const funnelChartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (authLoading) {
      console.log('Auth is still loading');
      return;
    }

    if (!user) {
      console.log('No user found in auth context');
      setError("Please log in to view analytics.");
      setLoading(false);
      return;
    }

    if (!organizationId) {
      console.log('User object:', user);
      setError("No organization associated with your account.");
      setLoading(false);
      return;
    }

    // Validate organizationId format
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(organizationId);
    if (!isValidObjectId) {
      console.log('Invalid organizationId:', organizationId);
      setError("Invalid organization ID format.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        console.log('Fetching analytics for organizationId:', organizationId);
        setLoading(true);
        const [agents, funnel] = await Promise.all([
          fetchAgentAnalytics(organizationId),
          fetchConversionFunnel(organizationId),
        ]);
        setAgentAnalytics(agents);
        setConversionFunnel(funnel);
      } catch (err: unknown) {
        const axiosError = err as AxiosError<{ error: string }>;
        console.error('Error fetching analytics:', axiosError.response?.data?.error || axiosError.message);
        setError(axiosError.response?.data?.error || "Failed to load analytics data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [organizationId, authLoading, user]);

  // Initialize charts when data is loaded
  useEffect(() => {
    if (loading || authLoading || !agentAnalytics.length || !conversionFunnel) return;

    // Destroy existing charts
    if (revenueChartInstance.current) {
      revenueChartInstance.current.destroy();
    }
    if (funnelChartInstance.current) {
      funnelChartInstance.current.destroy();
    }

    // Initialize Revenue Chart
    if (revenueChartRef.current) {
      const ctx = revenueChartRef.current.getContext('2d');
      if (ctx) {
        revenueChartInstance.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
              label: 'Revenue',
              data: agentAnalytics.map(agent => parseFloat(agent.revenue.replace(/[$,]/g, '')) / agentAnalytics.length),
              borderColor: '#16a34a',
              backgroundColor: 'rgba(22, 163, 74, 0.2)',
              tension: 0.4,
              fill: true,
            }],
          },
          options: {
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
                title: { display: true, text: 'Revenue ($)' },
              },
            },
          },
        });
      }
    }

    // Initialize Funnel Chart
    if (funnelChartRef.current) {
      const ctx = funnelChartRef.current.getContext('2d');
      if (ctx) {
        funnelChartInstance.current = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['New', 'Qualifying', 'Interested', 'Booked', 'Closed', 'Nurture'],
            datasets: [{
              label: 'Leads',
              data: conversionFunnel?.funnel ? [
                conversionFunnel.funnel.new || 0,
                conversionFunnel.funnel.qualifying || 0,
                conversionFunnel.funnel.interested || 0,
                conversionFunnel.funnel.booked || 0,
                conversionFunnel.funnel.closed || 0,
                conversionFunnel.funnel.nurture || 0,
              ] : [0, 0, 0, 0, 0, 0],
              backgroundColor: ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe', '#eff6ff'],
            }],
          },
          options: {
            responsive: true,
            indexAxis: 'y',
            scales: {
              x: {
                beginAtZero: true,
                title: { display: true, text: 'Number of Leads' },
              },
            },
          },
        });
      }
    }

    // Cleanup function
    return () => {
      if (revenueChartInstance.current) {
        revenueChartInstance.current.destroy();
      }
      if (funnelChartInstance.current) {
        funnelChartInstance.current.destroy();
      }
    };
  }, [agentAnalytics, conversionFunnel, loading, authLoading]);

  // Calculate key metrics
  const totalRevenue = agentAnalytics.reduce((sum, agent) => {
    const revenue = parseFloat(agent.revenue.replace(/[$,]/g, '')) || 0;
    return sum + revenue;
  }, 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' });

  const totalLeads = conversionFunnel?.totalLeads || 0;
  const totalConversions = conversionFunnel?.funnel?.closed || 0;
  const conversionRate = totalLeads ? ((totalConversions / totalLeads) * 100).toFixed(1) + '%' : '0%';
  const totalInteractions = agentAnalytics.reduce((sum, agent) => sum + agent.conversations, 0);

  const metrics = [
    {
      title: "Total Revenue",
      value: totalRevenue,
      change: "+12.5%",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Conversion Rate",
      value: conversionRate,
      change: "+3.2%",
      icon: Target,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Leads Generated",
      value: totalLeads.toLocaleString(),
      change: "+18.7%",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Avatar Interactions",
      value: totalInteractions.toLocaleString(),
      change: "+25.1%",
      icon: BarChart3,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  if (loading || authLoading) {
    return <div className="min-h-screen bg-gray-50 p-6">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen bg-gray-50 p-6 text-red-600">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600">Track your performance and revenue</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Calendar size={12} />
              Last 30 days
            </Badge>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {metric.title}
                  </CardTitle>
                  <div className={`p-2 rounded-full ${metric.bgColor}`}>
                    <Icon className={`h-4 w-4 ${metric.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metric.value}</div>
                  <div className="flex items-center mt-1">
                    <TrendingUp size={12} className="text-green-600 mr-1" />
                    <span className="text-xs text-green-600">{metric.change}</span>
                    <span className="text-xs text-gray-500 ml-1">vs last month</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Over Time</CardTitle>
              <CardDescription>Monthly revenue generated by avatars</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <canvas ref={revenueChartRef} id="revenueChart"></canvas>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Conversion Funnel</CardTitle>
              <CardDescription>Lead progression through sales stages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <canvas ref={funnelChartRef} id="funnelChart"></canvas>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Avatar Performance</CardTitle>
            <CardDescription>Individual avatar statistics and revenue attribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Avatar</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Leads</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Conversions</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Conversion Rate</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Revenue</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Commission</th>
                  </tr>
                </thead>
                <tbody>
                  {agentAnalytics.map((avatar, index) => {
                    const conversions = Math.round(avatar.leadsGenerated * (avatar.conversionRate / 100));
                    const commission = (parseFloat(avatar.revenue.replace(/[$,]/g, '')) * 0.01).toLocaleString();
                    return (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{avatar.name}</td>
                        <td className="py-3 px-4">{avatar.leadsGenerated}</td>
                        <td className="py-3 px-4">{conversions}</td>
                        <td className="py-3 px-4">
                          <Badge variant="secondary">{avatar.conversionRate.toFixed(1)}%</Badge>
                        </td>
                        <td className="py-3 px-4 font-medium text-green-600">{avatar.revenue}</td>
                        <td className="py-3 px-4 text-blue-600">${commission}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;