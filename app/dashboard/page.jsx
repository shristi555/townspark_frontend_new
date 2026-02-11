"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/auth_store";
import { useNeedAuth } from "@/hooks/auth-check";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
	LayoutDashboard,
	FileText,
	CheckCircle2,
	Clock,
	TrendingUp,
	Plus,
	MapPin,
	MessageSquare,
	ThumbsUp,
	ArrowRight,
	Activity
} from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	Cell
} from "recharts";
import api from "@/services/api";

export default function DashboardPage() {
	const { loading: authLoading } = useNeedAuth();
	const fetchProfile = useAuthStore((state) => state.fetchProfile);
	const profileData = useAuthStore((state) => state.profileData);
	const user = useAuthStore((state) => state.user);
	const [isLoading, setIsLoading] = useState(true);
	const [communityStats, setCommunityStats] = useState(null);

	useEffect(() => {
		const loadData = async () => {
			if (!profileData) {
				await fetchProfile();
			}

			// Fetch some global stats for "Community Pulse"
			try {
				const res = await api.get('profile/analytics/');
				if (res.success) {
					setCommunityStats(res.response);
				}
			} catch (err) {
				console.error("Failed to fetch community stats", err);
			}

			setIsLoading(false);
		};
		loadData();
	}, [fetchProfile, profileData]);

	if (authLoading || isLoading) {
		return <DashboardSkeleton />;
	}
	const stats = profileData?.stats || {
		total_issues_reported: 0,
		total_resolved: 0,
		total_issues_liked: 0,
		total_comments_made: 0,
		impact_rank: "N/A",
		resolution_overview: [],
		category_breakdown: []
	};

	const recentIssues = profileData?.reported_issues?.issues?.slice(0, 3) || [];


	return (
		<div className='min-h-screen bg-background text-foreground transition-colors duration-500'>
			<div className='container mx-auto px-4 py-8 max-w-7xl space-y-8'>

				{/* Welcome Header */}
				<header className='flex flex-col md:flex-row md:items-center justify-between gap-6'>
					<div className='space-y-1'>
						<motion.h1
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							className='text-3xl md:text-5xl font-black tracking-tight'
						>
							Welcome back, {user?.first_name || "Neighbor"}!
						</motion.h1>
						<p className='text-muted-foreground font-medium'>
							Here's what's happening in your neighborhood today.
						</p>
					</div>
					<div className='flex items-center gap-3'>
						<Button asChild size='lg' className='rounded-2xl font-black shadow-xl shadow-primary/20 hover:-translate-y-1 transition-all'>
							<Link href='/issue/create'>
								<Plus className='w-5 h-5 mr-2' /> Report Issue
							</Link>
						</Button>
					</div>
				</header>

				{/* Quick Stats Grid */}
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
					<StatCard
						title="Total Reports"
						value={stats.total_issues_reported || 0}
						icon={FileText}
						color="text-primary"
						description="Issues you've contributed"
						delay={0.1}
					/>
					<StatCard
						title="Resolved"
						value={stats.total_resolved || 0}
						icon={CheckCircle2}
						color="text-emerald-500"
						description="Community fixes realized"
						delay={0.2}
					/>
					<StatCard
						title="Engagement"
						value={(stats.total_issues_liked || 0) + (stats.total_comments_made || 0)}
						icon={Activity}
						color="text-blue-500"
						description="Total likes and comments"
						delay={0.3}
					/>
					<StatCard
						title="Impact Rank"
						value={stats.impact_rank || "#--"}
						icon={TrendingUp}
						color="text-amber-500"
						description="Your standing in community"
						delay={0.4}
					/>
				</div>

				<div className='grid grid-cols-1 lg:grid-cols-12 gap-8'>

					{/* Activity Feed (Left) */}
					<div className='lg:col-span-8 space-y-6'>
						<div className='flex items-center justify-between'>
							<h3 className='text-xs font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2'>
								<Clock className='w-4 h-4' /> Your Recent Reports
							</h3>
							<Button variant='ghost' asChild size='sm' className='text-primary font-bold'>
								<Link href='/issue/mine'>View All <ArrowRight className='w-4 h-4 ml-1' /></Link>
							</Button>
						</div>

						<div className='grid grid-cols-1 gap-4'>
							{recentIssues.length > 0 ? (
								recentIssues.map((issue, idx) => (
									<RecentIssueItem key={issue.id} issue={issue} delay={idx * 0.1} />
								))
							) : (
								<Card className='rounded-3xl border-dashed border-2 p-12 text-center bg-transparent'>
									<div className='p-6 rounded-full bg-muted/50 w-20 h-20 flex items-center justify-center mx-auto mb-4'>
										<FileText className='w-10 h-10 text-muted-foreground opacity-20' />
									</div>
									<h4 className='font-bold text-lg'>No reports yet</h4>
									<p className='text-muted-foreground'>Help improve your neighborhood by reporting your first issue!</p>
									<Button asChild variant='outline' className='mt-6 rounded-xl font-bold'>
										<Link href='/issue/create'>Get Started</Link>
									</Button>
								</Card>
							)}
						</div>

						{/* Quick Analytics Summary */}
						<Card className='rounded-3xl border-border bg-card overflow-hidden'>
							<CardHeader>
								<CardTitle className='text-lg font-black'>Resolution Overview</CardTitle>
								<CardDescription>How quickly your reported issues are handled.</CardDescription>
							</CardHeader>
							<CardContent className='h-[250px] w-full pt-4'>
								<ResponsiveContainer width="100%" height="100%">
									<BarChart data={stats.resolution_overview}>
										<CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
										<XAxis
											dataKey="day"
											axisLine={false}
											tickLine={false}
											tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12, fontWeight: 600 }}
										/>
										<Tooltip
											cursor={{ fill: 'hsl(var(--primary) / 0.1)' }}
											contentStyle={{
												backgroundColor: 'hsl(var(--card))',
												borderColor: 'hsl(var(--border))',
												borderRadius: '12px',
												fontWeight: 'bold'
											}}
										/>
										<Bar
											dataKey="reported"
											fill="hsl(var(--primary) / 0.3)"
											radius={[4, 4, 0, 0]}
											name="Issues Reported"
										/>
										<Bar
											dataKey="resolved"
											fill="hsl(var(--primary))"
											radius={[4, 4, 0, 0]}
											name="Issues Resolved"
										/>
									</BarChart>
								</ResponsiveContainer>
							</CardContent>
						</Card>
					</div>

					{/* Neighborhood Pulse (Right) */}
					<div className='lg:col-span-4 space-y-6'>
						<h3 className='text-xs font-black uppercase tracking-[0.2em] text-muted-foreground'>Community Activity</h3>

						<Card className='rounded-3xl border-border bg-card shadow-xl shadow-primary/5'>
							<CardHeader>
								<CardTitle className='text-lg font-black'>Top Categories</CardTitle>
							</CardHeader>
							<CardContent className='space-y-4'>
								{stats.category_breakdown?.length > 0 ? (
									stats.category_breakdown.slice(0, 4).map((cat, idx) => (
										<CategoryProgress
											key={cat.category}
											label={cat.category.charAt(0).toUpperCase() + cat.category.slice(1)}
											progress={Math.min(100, (cat.count / (stats.total_issues_reported || 1)) * 100)}
											count={cat.count}
										/>
									))
								) : (
									<p className='text-xs text-muted-foreground text-center py-4'>No category data yet</p>
								)}
							</CardContent>
						</Card>

						<Card className='rounded-3xl bg-zinc-900 text-white dark:bg-zinc-800 border-0 shadow-2xl overflow-hidden relative'>
							<div className='absolute top-0 right-0 p-8 opacity-10'>
								<TrendingUp className='w-24 h-24 rotate-12' />
							</div>
							<CardHeader className='relative z-10'>
								<CardTitle className='text-2xl font-black'>Explore Neighborhood</CardTitle>
								<CardDescription className='text-zinc-400 font-medium'>See what others are reporting and help support the cause.</CardDescription>
							</CardHeader>
							<CardContent className='relative z-10 pb-8'>
								<Button asChild variant='secondary' className='w-full rounded-2xl h-14 font-black text-lg shadow-xl shadow-black/20'>
									<Link href='/issue/explore'>Explore All Issues</Link>
								</Button>
							</CardContent>
						</Card>

						{/* Community Pulse Section */}
						{communityStats && (
							<Card className='rounded-3xl border-border bg-card shadow-xl shadow-primary/5 overflow-hidden'>
								<CardHeader className='pb-2'>
									<CardTitle className='text-lg font-black'>Community Pulse</CardTitle>
									<CardDescription>Global Townspark Activity</CardDescription>
								</CardHeader>
								<CardContent className='space-y-4 pb-6'>
									<div className='grid grid-cols-2 gap-3'>
										<div className='p-4 rounded-2xl bg-muted/50'>
											<p className='text-[10px] font-black uppercase text-muted-foreground'>Global Issues</p>
											<p className='text-xl font-black'>{communityStats.total_issues_reported}</p>
										</div>
										<div className='p-4 rounded-2xl bg-emerald-500/10'>
											<p className='text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400'>Resolved</p>
											<p className='text-xl font-black text-emerald-600 dark:text-emerald-400'>{communityStats.total_issues_resolved}</p>
										</div>
									</div>
									<div className='p-4 rounded-2xl bg-blue-500/10 flex items-center justify-between'>
										<div>
											<p className='text-[10px] font-black uppercase text-blue-600 dark:text-blue-400'>Resolution Rate</p>
											<p className='text-xl font-black text-blue-600 dark:text-blue-400'>{communityStats.resolution_stats?.resolution_rate_percentage}%</p>
										</div>
										<Activity className='w-8 h-8 text-blue-500/30' />
									</div>
								</CardContent>
							</Card>
						)}
					</div>

				</div>
			</div>
		</div>
	);
}

function StatCard({ title, value, icon: Icon, color, description, delay }) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay }}
		>
			<Card className='rounded-3xl border-border bg-card hover:border-primary/50 transition-all duration-300 group hover:-translate-y-1 shadow-xl shadow-primary/5'>
				<CardContent className='p-6'>
					<div className='flex items-center justify-between mb-4'>
						<div className={`p-3 rounded-2xl bg-muted/50 ${color} group-hover:scale-110 transition-transform`}>
							<Icon className='w-6 h-6' />
						</div>
						<div className='text-xs font-black text-muted-foreground uppercase tracking-widest'>Overview</div>
					</div>
					<div className='space-y-1'>
						<h3 className='text-3xl font-black'>{value}</h3>
						<p className='text-sm font-bold'>{title}</p>
						<p className='text-[10px] text-muted-foreground uppercase font-black tracking-tighter opacity-70'>{description}</p>
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
}

function RecentIssueItem({ issue, delay }) {
	const baseUrl = process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, '');
	const image = issue.images?.[0]?.image ? `${baseUrl}${issue.images[0].image}` : null;

	return (
		<motion.div
			initial={{ opacity: 0, x: -20 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ delay }}
		>
			<Link href={`/issue/details/${issue.id}`} className='block group'>
				<Card className='rounded-3xl border-border bg-card/50 hover:bg-card hover:border-primary/30 transition-all duration-300 group hover:shadow-2xl overflow-hidden'>
					<CardContent className='p-4 flex gap-5'>
						<div className='relative w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-muted flex-shrink-0'>
							{image ? (
								<img src={image} alt={issue.title} className='object-cover w-full h-full group-hover:scale-110 transition-transform duration-700' />
							) : (
								<div className='flex items-center justify-center h-full text-muted-foreground/30'>
									<FileText className='w-8 h-8' />
								</div>
							)}
							<div className='absolute top-2 left-2'>
								<Badge className={cn(
									"px-2 py-0.5 text-[9px] font-black uppercase tracking-tighter border-0 shadow-lg",
									issue.is_resolved ? "bg-emerald-500 text-white" : "bg-amber-500 text-white"
								)}>
									{issue.is_resolved ? "Resolved" : "Open"}
								</Badge>
							</div>
						</div>
						<div className='flex-1 py-1 flex flex-col justify-between'>
							<div className='space-y-1'>
								<div className='flex items-center justify-between'>
									<Badge variant='outline' className='text-[9px] font-black uppercase tracking-widest text-primary/70 border-primary/20'>
										{issue.category}
									</Badge>
									<span className='text-[10px] text-muted-foreground font-bold uppercase'>
										{formatDistanceToNow(new Date(issue.created_at), { addSuffix: true })}
									</span>
								</div>
								<h4 className='text-lg font-black group-hover:text-primary transition-colors line-clamp-1'>{issue.title}</h4>
								<div className='flex items-center gap-2 text-xs text-muted-foreground font-medium'>
									<MapPin className='w-3 h-3 text-primary' />
									<span className='line-clamp-1'>{issue.address}</span>
								</div>
							</div>
							<div className='flex items-center gap-4 pt-2'>
								<div className='flex items-center gap-1 text-[11px] font-bold text-muted-foreground'>
									<ThumbsUp className='w-3 h-3 text-primary' /> {issue.likes_count || 0}
								</div>
								<div className='flex items-center gap-1 text-[11px] font-bold text-muted-foreground'>
									<MessageSquare className='w-3 h-3 text-primary' /> {issue.comments_count || 0}
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</Link>
		</motion.div>
	);
}

function CategoryProgress({ label, progress, count }) {
	return (
		<div className='space-y-2'>
			<div className='flex items-center justify-between text-xs font-bold uppercase tracking-wider'>
				<span className='text-muted-foreground'>{label}</span>
				<span className='text-primary'>{count} reports</span>
			</div>
			<div className='h-2 bg-muted rounded-full overflow-hidden'>
				<motion.div
					initial={{ width: 0 }}
					animate={{ width: `${progress}%` }}
					transition={{ duration: 1, ease: "easeOut" }}
					className='h-full bg-primary rounded-full'
				/>
			</div>
		</div>
	);
}

function DashboardSkeleton() {
	return (
		<div className='container mx-auto px-4 py-8 max-w-7xl animate-pulse space-y-8'>
			<div className='flex justify-between items-center'>
				<Skeleton className='h-12 w-1/3 rounded-xl' />
				<Skeleton className='h-12 w-40 rounded-xl' />
			</div>
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
				{[1, 2, 3, 4].map(i => <Skeleton key={i} className='h-32 rounded-3xl' />)}
			</div>
			<div className='grid grid-cols-1 lg:grid-cols-12 gap-8'>
				<div className='lg:col-span-8 space-y-6'>
					{[1, 2, 3].map(i => <Skeleton key={i} className='h-32 rounded-3xl' />)}
				</div>
				<div className='lg:col-span-4 space-y-6'>
					<Skeleton className='h-64 rounded-3xl' />
					<Skeleton className='h-48 rounded-3xl' />
				</div>
			</div>
		</div>
	);
}
