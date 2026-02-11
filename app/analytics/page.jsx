"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	BarChart,
	Bar,
	LineChart,
	Line,
	PieChart,
	Pie,
	Cell,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";
import {
	Activity,
	CheckCircle2,
	Clock,
	MessageSquare,
	ThumbsUp,
	TrendingUp,
	AlertCircle,
	Package,
	Target,
	Calendar,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

function AnalyticsPage() {
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Replace with your actual API call
		const fetchAnalytics = async () => {
			try {
				// const response = await fetch('/api/analytics');
				// const result = await response.json();
				// setData(result.response);

				// Mock data for demonstration
				setTimeout(() => {
					setData({
						total_issues_reported: 4,
						total_issues_resolved: 0,
						total_likes_received: 0,
						total_comments_received: 0,
						issues_reported_over_time: [
							{ month: "2024-12", count: 0 },
							{ month: "2025-01", count: 0 },
							{ month: "2025-02", count: 0 },
							{ month: "2025-03", count: 0 },
							{ month: "2025-04", count: 0 },
							{ month: "2025-05", count: 0 },
							{ month: "2025-06", count: 0 },
							{ month: "2025-07", count: 0 },
							{ month: "2025-08", count: 0 },
							{ month: "2025-09", count: 0 },
							{ month: "2025-10", count: 0 },
							{ month: "2025-11", count: 0 },
						],
						resolution_stats: {
							solved_within_7_days: 0,
							solved_within_30_days: 0,
							average_resolution_time_days: null,
							resolution_rate_percentage: 0.0,
						},
						status_breakdown: {
							resolved: 0,
							pending: 4,
							archived: 0,
						},
						category_distribution: [
							{ category: "water", count: 1 },
							{ category: "streetlight", count: 1 },
							{ category: "garbage", count: 1 },
							{ category: "drainage", count: 1 },
						],
						engagement_metrics: {
							avg_likes_per_issue: 0,
							avg_comments_per_issue: 0,
							most_engaged_issue: {
								id: 1,
								title: "zfgbhjklkhb",
								total_engagement: 0,
							},
						},
						recent_activity: {
							issues_last_30_days: 4,
							avg_issues_per_day: 0.13,
						},
					});
					setLoading(false);
				}, 1000);
			} catch (error) {
				console.error("Error fetching analytics:", error);
				setLoading(false);
			}
		};

		fetchAnalytics();
	}, []);

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
			},
		},
	};

	const itemVariants = {
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

	if (loading) {
		return (
			<div className='min-h-screen bg-gradient-to-br from-background to-muted/20 p-6 space-y-6'>
				<Skeleton className='h-12 w-64' />
				<div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
					{[...Array(4)].map((_, i) => (
						<Skeleton key={i} className='h-32' />
					))}
				</div>
				<div className='grid gap-6 md:grid-cols-2'>
					{[...Array(4)].map((_, i) => (
						<Skeleton key={i} className='h-96' />
					))}
				</div>
			</div>
		);
	}

	const statsCards = [
		{
			title: "Total Issues",
			value: data?.total_issues_reported || 0,
			icon: AlertCircle,
			description: "Issues reported",
			color: "text-blue-500",
			bgColor: "bg-blue-500/10",
		},
		{
			title: "Resolved Issues",
			value: data?.total_issues_resolved || 0,
			icon: CheckCircle2,
			description: `${data?.resolution_stats?.resolution_rate_percentage || 0}% resolution rate`,
			color: "text-green-500",
			bgColor: "bg-green-500/10",
		},
		{
			title: "Total Likes",
			value: data?.total_likes_received || 0,
			icon: ThumbsUp,
			description: `${data?.engagement_metrics?.avg_likes_per_issue || 0} avg per issue`,
			color: "text-pink-500",
			bgColor: "bg-pink-500/10",
		},
		{
			title: "Total Comments",
			value: data?.total_comments_received || 0,
			icon: MessageSquare,
			description: `${data?.engagement_metrics?.avg_comments_per_issue || 0} avg per issue`,
			color: "text-purple-500",
			bgColor: "bg-purple-500/10",
		},
	];

	const statusData = Object.entries(data?.status_breakdown || {}).map(
		([key, value]) => ({
			name: key.charAt(0).toUpperCase() + key.slice(1),
			value,
		})
	);

	return (
		<div className='min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4 md:p-6 lg:p-8'>
			<motion.div
				variants={containerVariants}
				initial='hidden'
				animate='visible'
				className='max-w-7xl mx-auto space-y-8'
			>
				{/* Header */}
				<motion.div variants={itemVariants} className='space-y-2'>
					<h1 className='text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent'>
						Analytics Dashboard
					</h1>
					<p className='text-muted-foreground'>
						Comprehensive overview of your community engagement and
						issue resolution
					</p>
				</motion.div>

				{/* Stats Cards */}
				<div className='grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'>
					{statsCards.map((stat, index) => (
						<motion.div key={index} variants={itemVariants}>
							<Card className='overflow-hidden border-muted hover:shadow-lg transition-all duration-300 hover:scale-105'>
								<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
									<CardTitle className='text-sm font-medium'>
										{stat.title}
									</CardTitle>
									<div
										className={`p-2 rounded-lg ${stat.bgColor}`}
									>
										<stat.icon
											className={`h-4 w-4 ${stat.color}`}
										/>
									</div>
								</CardHeader>
								<CardContent>
									<div className='text-3xl font-bold'>
										{stat.value}
									</div>
									<p className='text-xs text-muted-foreground mt-1'>
										{stat.description}
									</p>
								</CardContent>
							</Card>
						</motion.div>
					))}
				</div>

				{/* Charts Row 1 */}
				<div className='grid gap-6 md:grid-cols-2'>
					{/* Issues Over Time */}
					<motion.div variants={itemVariants}>
						<Card className='shadow-lg border-muted'>
							<CardHeader>
								<CardTitle className='flex items-center gap-2'>
									<TrendingUp className='h-5 w-5 text-blue-500' />
									Issues Reported Over Time
								</CardTitle>
								<CardDescription>
									Monthly trend of reported issues
								</CardDescription>
							</CardHeader>
							<CardContent>
								<ResponsiveContainer width='100%' height={300}>
									<LineChart
										data={data?.issues_reported_over_time}
									>
										<CartesianGrid
											strokeDasharray='3 3'
											className='stroke-muted'
										/>
										<XAxis
											dataKey='month'
											className='text-xs'
											tick={{ fill: "currentColor" }}
										/>
										<YAxis
											tick={{ fill: "currentColor" }}
										/>
										<Tooltip
											contentStyle={{
												backgroundColor:
													"hsl(var(--background))",
												border: "1px solid hsl(var(--border))",
												borderRadius: "8px",
											}}
										/>
										<Legend />
										<Line
											type='monotone'
											dataKey='count'
											stroke='#3b82f6'
											strokeWidth={2}
											dot={{ fill: "#3b82f6", r: 4 }}
											activeDot={{ r: 6 }}
										/>
									</LineChart>
								</ResponsiveContainer>
							</CardContent>
						</Card>
					</motion.div>

					{/* Category Distribution */}
					<motion.div variants={itemVariants}>
						<Card className='shadow-lg border-muted'>
							<CardHeader>
								<CardTitle className='flex items-center gap-2'>
									<Package className='h-5 w-5 text-purple-500' />
									Category Distribution
								</CardTitle>
								<CardDescription>
									Issues by category
								</CardDescription>
							</CardHeader>
							<CardContent>
								<ResponsiveContainer width='100%' height={300}>
									<PieChart>
										<Pie
											data={data?.category_distribution}
											cx='50%'
											cy='50%'
											labelLine={false}
											label={({ category, percent }) =>
												`${category}: ${(percent * 100).toFixed(0)}%`
											}
											outerRadius={80}
											fill='#8884d8'
											dataKey='count'
										>
											{data?.category_distribution.map(
												(entry, index) => (
													<Cell
														key={`cell-${index}`}
														fill={
															COLORS[
																index %
																	COLORS.length
															]
														}
													/>
												)
											)}
										</Pie>
										<Tooltip
											contentStyle={{
												backgroundColor:
													"hsl(var(--background))",
												border: "1px solid hsl(var(--border))",
												borderRadius: "8px",
											}}
										/>
									</PieChart>
								</ResponsiveContainer>
							</CardContent>
						</Card>
					</motion.div>
				</div>

				{/* Charts Row 2 */}
				<div className='grid gap-6 md:grid-cols-2'>
					{/* Status Breakdown */}
					<motion.div variants={itemVariants}>
						<Card className='shadow-lg border-muted'>
							<CardHeader>
								<CardTitle className='flex items-center gap-2'>
									<Target className='h-5 w-5 text-green-500' />
									Status Breakdown
								</CardTitle>
								<CardDescription>
									Current status of all issues
								</CardDescription>
							</CardHeader>
							<CardContent>
								<ResponsiveContainer width='100%' height={300}>
									<BarChart data={statusData}>
										<CartesianGrid
											strokeDasharray='3 3'
											className='stroke-muted'
										/>
										<XAxis
											dataKey='name'
											tick={{ fill: "currentColor" }}
										/>
										<YAxis
											tick={{ fill: "currentColor" }}
										/>
										<Tooltip
											contentStyle={{
												backgroundColor:
													"hsl(var(--background))",
												border: "1px solid hsl(var(--border))",
												borderRadius: "8px",
											}}
										/>
										<Bar
											dataKey='value'
											fill='#10b981'
											radius={[8, 8, 0, 0]}
										/>
									</BarChart>
								</ResponsiveContainer>
							</CardContent>
						</Card>
					</motion.div>

					{/* Resolution Stats */}
					<motion.div variants={itemVariants}>
						<Card className='shadow-lg border-muted'>
							<CardHeader>
								<CardTitle className='flex items-center gap-2'>
									<Clock className='h-5 w-5 text-orange-500' />
									Resolution Statistics
								</CardTitle>
								<CardDescription>
									Issue resolution metrics
								</CardDescription>
							</CardHeader>
							<CardContent className='space-y-4'>
								<div className='flex items-center justify-between p-4 rounded-lg bg-muted/50'>
									<span className='text-sm font-medium'>
										Solved within 7 days
									</span>
									<Badge
										variant='secondary'
										className='text-lg'
									>
										{data?.resolution_stats
											?.solved_within_7_days || 0}
									</Badge>
								</div>
								<div className='flex items-center justify-between p-4 rounded-lg bg-muted/50'>
									<span className='text-sm font-medium'>
										Solved within 30 days
									</span>
									<Badge
										variant='secondary'
										className='text-lg'
									>
										{data?.resolution_stats
											?.solved_within_30_days || 0}
									</Badge>
								</div>
								<div className='flex items-center justify-between p-4 rounded-lg bg-muted/50'>
									<span className='text-sm font-medium'>
										Average resolution time
									</span>
									<Badge
										variant='secondary'
										className='text-lg'
									>
										{data?.resolution_stats
											?.average_resolution_time_days ||
											"N/A"}{" "}
										days
									</Badge>
								</div>
								<div className='flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20'>
									<span className='text-sm font-medium'>
										Resolution Rate
									</span>
									<Badge className='text-lg bg-green-500 hover:bg-green-600'>
										{data?.resolution_stats
											?.resolution_rate_percentage || 0}
										%
									</Badge>
								</div>
							</CardContent>
						</Card>
					</motion.div>
				</div>

				{/* Recent Activity & Engagement */}
				<div className='grid gap-6 md:grid-cols-2'>
					<motion.div variants={itemVariants}>
						<Card className='shadow-lg border-muted'>
							<CardHeader>
								<CardTitle className='flex items-center gap-2'>
									<Calendar className='h-5 w-5 text-blue-500' />
									Recent Activity
								</CardTitle>
								<CardDescription>
									Last 30 days overview
								</CardDescription>
							</CardHeader>
							<CardContent className='space-y-4'>
								<div className='flex items-center justify-between p-4 rounded-lg bg-blue-500/10 border border-blue-500/20'>
									<span className='text-sm font-medium'>
										Issues reported
									</span>
									<span className='text-2xl font-bold text-blue-500'>
										{data?.recent_activity
											?.issues_last_30_days || 0}
									</span>
								</div>
								<div className='flex items-center justify-between p-4 rounded-lg bg-muted/50'>
									<span className='text-sm font-medium'>
										Average per day
									</span>
									<span className='text-2xl font-bold'>
										{data?.recent_activity?.avg_issues_per_day?.toFixed(
											2
										) || 0}
									</span>
								</div>
							</CardContent>
						</Card>
					</motion.div>

					<motion.div variants={itemVariants}>
						<Card className='shadow-lg border-muted'>
							<CardHeader>
								<CardTitle className='flex items-center gap-2'>
									<Activity className='h-5 w-5 text-purple-500' />
									Most Engaged Issue
								</CardTitle>
								<CardDescription>
									Highest community interaction
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className='space-y-4'>
									<div className='p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20'>
										<h3 className='font-semibold text-lg mb-2'>
											{data?.engagement_metrics
												?.most_engaged_issue?.title ||
												"No data"}
										</h3>
										<div className='flex items-center gap-4 text-sm text-muted-foreground'>
											<span className='flex items-center gap-1'>
												<ThumbsUp className='h-4 w-4' />
												Issue #
												{data?.engagement_metrics
													?.most_engaged_issue?.id ||
													0}
											</span>
											<span className='flex items-center gap-1'>
												<Activity className='h-4 w-4' />
												{data?.engagement_metrics
													?.most_engaged_issue
													?.total_engagement ||
													0}{" "}
												engagements
											</span>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					</motion.div>
				</div>
			</motion.div>
		</div>
	);
}

export default AnalyticsPage;
