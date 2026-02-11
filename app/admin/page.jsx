"use client";

import { useEffect, useState } from "react";
import AdminService from "@/services/admin_service";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
    Users, 
    AlertCircle, 
    CheckCircle2, 
    MessageSquare, 
    TrendingUp, 
    ArrowUpRight, 
    ArrowDownRight,
    Calendar,
    Activity
} from "lucide-react";
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    LineChart, Line, PieChart, Pie, Cell, Legend 
} from 'recharts';
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const StatCard = ({ title, value, icon: Icon, trend, trendValue, color }) => (
    <Card className="overflow-hidden border-none shadow-xl hover:scale-[1.02] transition-all duration-300">
        <CardContent className="p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{title}</p>
                    <h3 className="text-3xl font-black mt-1 leading-none">{value}</h3>
                    <div className="flex items-center gap-1 mt-4">
                        {trend === 'up' ? (
                            <div className="flex items-center text-xs font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">
                                <ArrowUpRight className="w-3 h-3 mr-1" /> {trendValue}
                            </div>
                        ) : (
                            <div className="flex items-center text-xs font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">
                                <Activity className="w-3 h-3 mr-1" /> Steady
                            </div>
                        )}
                        <span className="text-[10px] text-muted-foreground font-medium uppercase">vs last month</span>
                    </div>
                </div>
                <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center shadow-lg`}>
                    <Icon className="w-7 h-7 text-white" />
                </div>
            </div>
        </CardContent>
    </Card>
);

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await AdminService.getDashboardStats();
                setStats(data);
            } catch (error) {
                console.error("Failed to fetch admin stats", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (isLoading) {
        return (
            <div className="space-y-8">
                <div className="grid md:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl" />)}
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                    <Skeleton className="h-[400px] rounded-2xl" />
                    <Skeleton className="h-[400px] rounded-2xl" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-10">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black tracking-tight">System Overview</h2>
                    <p className="text-muted-foreground font-medium">Real-time statistics and platform health metrics.</p>
                </div>
                <div className="flex items-center gap-3 bg-background border p-2 rounded-2xl shadow-inner">
                    <div className="flex items-center px-4 py-2 bg-primary/10 text-primary rounded-xl font-bold text-sm">
                        <Calendar className="w-4 h-4 mr-2" />
                        Today: {new Date().toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                    </div>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Total Residents" 
                    value={stats.overview.total_users} 
                    icon={Users} 
                    trend="up" 
                    trendValue={`+${stats.growth.new_users_30d}`}
                    color="bg-blue-600 shadow-blue-500/30"
                />
                <StatCard 
                    title="Total Reports" 
                    value={stats.overview.total_issues} 
                    icon={AlertCircle} 
                    trend="up" 
                    trendValue={`+${stats.growth.new_issues_30d}`}
                    color="bg-purple-600 shadow-purple-500/30"
                />
                <StatCard 
                    title="Resolved Cases" 
                    value={stats.overview.resolved_issues} 
                    icon={CheckCircle2} 
                    trend="steady" 
                    trendValue="Active"
                    color="bg-green-600 shadow-green-500/30"
                />
                <StatCard 
                    title="Wall of Love" 
                    value={stats.overview.active_testimonials} 
                    icon={MessageSquare} 
                    trend="steady" 
                    trendValue="Moderated"
                    color="bg-pink-600 shadow-pink-500/30"
                />
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Weekly Growth Chart */}
                <Card className="lg:col-span-2 border-none shadow-xl rounded-2xl overflow-hidden">
                    <CardHeader className="border-b bg-muted/20">
                        <CardTitle className="flex items-center gap-2">
                             <TrendingUp className="w-5 h-5 text-primary" />
                             Community Activity
                        </CardTitle>
                        <CardDescription>Issue reporting trends over the last 7 weeks</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="h-[300px] w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={stats.weekly_activity}>
                                    <defs>
                                        <linearGradient id="lineColor" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                                    <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '12px', border: 'none', shadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Line 
                                        type="monotone" 
                                        dataKey="count" 
                                        stroke="#2563eb" 
                                        strokeWidth={4} 
                                        dot={{ r: 6, fill: "#2563eb", strokeWidth: 2, stroke: "#fff" }}
                                        activeDot={{ r: 8 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Category Distribution */}
                <Card className="border-none shadow-xl rounded-2xl overflow-hidden">
                    <CardHeader className="border-b bg-muted/20">
                        <CardTitle className="flex items-center gap-2">
                             <Activity className="w-5 h-5 text-primary" />
                             Issue Categories
                        </CardTitle>
                        <CardDescription>Volume breakdown by type</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="h-[300px] w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={stats.categories}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={8}
                                        dataKey="count"
                                    >
                                        {stats.categories.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend verticalAlign="bottom" align="center" />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                 {/* Status Breakdown */}
                 <Card className="border-none shadow-xl rounded-2xl overflow-hidden">
                    <CardHeader className="border-b bg-muted/20">
                        <CardTitle className="flex items-center gap-2">
                            Resolution Status
                        </CardTitle>
                        <CardDescription>Current state of all reported community issues</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats.statuses}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                                    <XAxis dataKey="status" axisLine={false} tickLine={false} />
                                    <YAxis axisLine={false} tickLine={false} />
                                    <Tooltip 
                                         cursor={{fill: 'rgba(0,0,0,0.05)'}}
                                         contentStyle={{ borderRadius: '12px', border: 'none' }}
                                    />
                                    <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                                        {stats.statuses.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.status === 'Resolved' ? '#16a34a' : entry.status === 'Pending' ? '#dc2626' : '#2563eb'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                 </Card>

                 {/* System Health / Tips */}
                 <Card className="border-none shadow-xl rounded-2xl overflow-visible bg-gradient-to-br from-primary to-blue-700 text-primary-foreground relative">
                     <div className="absolute -top-4 -right-4 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
                     <CardHeader>
                         <CardTitle className="text-2xl font-black">Admin Productivity Tip</CardTitle>
                         <CardDescription className="text-primary-foreground/70">How to keep Townspark safe and helpful</CardDescription>
                     </CardHeader>
                     <CardContent className="space-y-6 pt-4">
                         <div className="bg-white/10 p-4 rounded-xl backdrop-blur-md border border-white/20">
                             <p className="font-bold flex items-center gap-2">
                                 <CheckCircle2 className="w-5 h-5 text-green-400" /> Moderation First
                             </p>
                             <p className="text-sm mt-1 opacity-80">Always verify resolved issues before closing the loop with the resident. High quality reports build trust.</p>
                         </div>
                         <div className="bg-white/10 p-4 rounded-xl backdrop-blur-md border border-white/20">
                             <p className="font-bold flex items-center gap-2">
                                 <Users className="w-5 h-5 text-blue-300" /> Respond to Feedback
                             </p>
                             <p className="text-sm mt-1 opacity-80">Moderating testimonials keeps the Wall of Love fresh and prevents spam or harmful content.</p>
                         </div>
                     </CardContent>
                 </Card>
            </div>
        </div>
    );
}
