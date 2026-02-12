"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "@services/api";
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
import { CATEGORY_HEX } from "@/components/issue/constants";

const DEFAULT_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

function AnalyticsPage() {
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchAnalytics = async () => {
			try {
				setLoading(true);
				// Using your Axios instance
				const response = await api.get('profile/analytics');

				// Checking the .success key from your backend response
				if (response.success) {
					setData(response.response);
				} else {
					console.error("Backend Error:", response);
					throw new Error(response.message || "Failed to fetch analytics");
				}
			} catch (err) {
				console.error("Axios Error:", err);
				setError(err.message || "An unexpected error occurred");
			} finally {
				setLoading(false);
			}
		};

		fetchAnalytics();
	}, []);

	// ... (containerVariants and itemVariants remain the same)
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
	};

	const itemVariants = {
		hidden: { y: 20, opacity: 0 },
		visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
	};

	if (loading) {
		return (
			<div className='min-h-screen bg-gradient-to-br from-background to-muted/20 p-6 space-y-6'>
				<Skeleton className='h-12 w-64' />
				<div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
					{[...Array(4)].map((_, i) => <Skeleton key={i} className='h-32' />)}
				</div>
				<div className='grid gap-6 md:grid-cols-2'>
					{[...Array(4)].map((_, i) => <Skeleton key={i} className='h-96' />)}
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen flex items-center justify-center p-6">
				<Card className="w-full max-w-md border-destructive">
					<CardHeader>
						<CardTitle className="text-destructive flex items-center gap-2">
							<AlertCircle className="h-5 w-5" />
							Data Fetching Failed
						</CardTitle>
						<CardDescription>{error}</CardDescription>
					</CardHeader>
				</Card>
			</div>
		);
	}

	const statsCards = [
		{
			title: "Total Issues",
			value: data?.total_issues_reported ?? 0,
			icon: AlertCircle,
			description: "Issues reported",
			color: "text-blue-500",
			bgColor: "bg-blue-500/10",
		},
		{
			title: "Resolved Issues",
			value: data?.total_issues_resolved ?? 0,
			icon: CheckCircle2,
			description: `${data?.resolution_stats?.resolution_rate_percentage ?? 0}% resolution rate`,
			color: "text-green-500",
			bgColor: "bg-green-500/10",
		},
		{
			title: "Total Likes",
			value: data?.total_likes_received ?? 0,
			icon: ThumbsUp,
			description: `${data?.engagement_metrics?.avg_likes_per_issue ?? 0} avg per issue`,
			color: "text-pink-500",
			bgColor: "bg-pink-500/10",
		},
		{
			title: "Total Comments",
			value: data?.total_comments_received ?? 0,
			icon: MessageSquare,
			description: `${data?.engagement_metrics?.avg_comments_per_issue ?? 0} avg per issue`,
			color: "text-purple-500",
			bgColor: "bg-purple-500/10",
		},
	];

	const statusData = data?.status_breakdown
		? Object.entries(data.status_breakdown).map(([key, value]) => ({
			name: key.charAt(0).toUpperCase() + key.slice(1),
			value,
		}))
		: [];

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
						Live metrics from the Townspark ecosystem
					</p>
				</motion.div>

				{/* Stats Grid */}
				<div className='grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'>
					{statsCards.map((stat, index) => (
						<motion.div key={index} variants={itemVariants}>
							<Card className='overflow-hidden border-muted hover:shadow-lg transition-all duration-300'>
								<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
									<CardTitle className='text-sm font-medium'>{stat.title}</CardTitle>
									<div className={`p-2 rounded-lg ${stat.bgColor}`}>
										<stat.icon className={`h-4 w-4 ${stat.color}`} />
									</div>
								</CardHeader>
								<CardContent>
									<div className='text-3xl font-bold'>{stat.value.toLocaleString()}</div>
									<p className='text-xs text-muted-foreground mt-1'>{stat.description}</p>
								</CardContent>
							</Card>
						</motion.div>
					))}
				</div>

				{/* Main Charts */}
				<div className='grid gap-6 md:grid-cols-2'>
					<motion.div variants={itemVariants}>
						<Card className='shadow-lg border-muted'>
							<CardHeader>
								<CardTitle className='flex items-center gap-2'>
									<TrendingUp className='h-5 w-5 text-blue-500' />
									Reporting Trends
								</CardTitle>
							</CardHeader>
							<CardContent>
								<ResponsiveContainer width='100%' height={300}>
									<LineChart data={data?.issues_reported_over_time ?? []}>
										<CartesianGrid strokeDasharray='3 3' className='stroke-muted' />
										<XAxis dataKey='month' className='text-xs' />
										<YAxis />
										<Tooltip />
										<Line type='monotone' dataKey='count' stroke='#3b82f6' strokeWidth={2} />
									</LineChart>
								</ResponsiveContainer>
							</CardContent>
						</Card>
					</motion.div>

					<motion.div variants={itemVariants}>
						<Card className='shadow-lg border-muted'>
							<CardHeader>
								<CardTitle className='flex items-center gap-2'>
									<Package className='h-5 w-5 text-purple-500' />
									Issue Categories
								</CardTitle>
							</CardHeader>
							<CardContent>
								<ResponsiveContainer width='100%' height={300}>
									<PieChart>
										<Pie
											data={data?.category_distribution ?? []}
											dataKey='count'
											nameKey='category'
											cx='50%' cy='50%' outerRadius={80}
										>
											{(data?.category_distribution ?? []).map((entry, index) => (
												<Cell
													key={`cell-${index}`}
													fill={CATEGORY_HEX[entry.category.toLowerCase()] || DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
												/>
											))}
										</Pie>
										<Tooltip />
									</PieChart>
								</ResponsiveContainer>
							</CardContent>
						</Card>
					</motion.div>
				</div>

				{/* Resolution and Activity grids (using similar null-safe data mapping) */}
				<div className='grid gap-6 md:grid-cols-2'>
					<motion.div variants={itemVariants}>
						<Card className='shadow-lg border-muted'>
							<CardHeader>
								<CardTitle className='flex items-center gap-2'>
									<Target className='h-5 w-5 text-green-500' />
									Resolution Status
								</CardTitle>
							</CardHeader>
							<CardContent>
								<ResponsiveContainer width='100%' height={300}>
									<BarChart data={statusData}>
										<XAxis dataKey='name' />
										<YAxis />
										<Tooltip />
										<Bar dataKey='value' fill='#10b981' radius={[4, 4, 0, 0]} />
									</BarChart>
								</ResponsiveContainer>
							</CardContent>
						</Card>
					</motion.div>

					<motion.div variants={itemVariants}>
						<Card className='shadow-lg border-muted'>
							<CardHeader>
								<CardTitle className='flex items-center gap-2'>
									<Clock className='h-5 w-5 text-orange-500' />
									Performance Metrics
								</CardTitle>
							</CardHeader>
							<CardContent className='space-y-4'>
								<div className='flex items-center justify-between p-4 rounded-lg bg-muted/50'>
									<span className='text-sm font-medium'>Avg Resolution Time</span>
									<Badge variant='secondary' className='text-lg'>
										{data?.resolution_stats?.average_resolution_time_days ?? "N/A"} Days
									</Badge>
								</div>
								<div className='flex items-center justify-between p-4 rounded-lg bg-green-500/10 border border-green-500/20'>
									<span className='text-sm font-medium'>Current Resolution Rate</span>
									<Badge className='text-lg bg-green-500'>
										{data?.resolution_stats?.resolution_rate_percentage ?? 0}%
									</Badge>
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