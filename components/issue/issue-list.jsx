"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
	Search,
	Plus,
	Filter,
	Calendar,
	MapPin,
	MessageSquare,
	ThumbsUp,
	Clock,
	CheckCircle2,
	XCircle,
	Archive,
} from "lucide-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import BackButton from "../ui/back-button";

const STATUS_CONFIG = {
	pending: {
		label: "Pending",
		color: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20",
		icon: Clock,
	},
	in_progress: {
		label: "In Progress",
		color: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
		icon: Clock,
	},
	resolved: {
		label: "Resolved",
		color: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
		icon: CheckCircle2,
	},
	closed: {
		label: "Closed",
		color: "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20",
		icon: Archive,
	},
};

const CATEGORY_COLORS = {
	pothole: "bg-orange-500/10 text-orange-700 dark:text-orange-400",
	streetlight: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
	garbage: "bg-green-500/10 text-green-700 dark:text-green-400",
	water: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
	drainage: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-400",
	road: "bg-red-500/10 text-red-700 dark:text-red-400",
	other: "bg-purple-500/10 text-purple-700 dark:text-purple-400",
};

function IssueCard({ issue, onClick }) {
	const statusConfig =
		STATUS_CONFIG[issue.is_resolved ? "resolved" : "pending"];
	const StatusIcon = statusConfig.icon;
	const categoryColor =
		CATEGORY_COLORS[issue.category] || CATEGORY_COLORS.other;

	return (
		<Card
			className='group cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] border-2 hover:border-primary/50'
			onClick={() => onClick(issue.id)}
		>
			<CardContent className='p-0'>
				<div className='flex gap-4 p-4'>
					{/* Image Thumbnail */}
					<div className='relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-muted'>
						{issue.images && issue.images.length > 0 ? (
							<Image
								src={`${process.env.NEXT_PUBLIC_API_URL}${issue.images[0].image}`}
								alt={issue.title}
								fill
								className='object-cover'
								unoptimized
							/>
						) : (
							<div className='w-full h-full flex items-center justify-center text-muted-foreground'>
								<Archive className='w-8 h-8' />
							</div>
						)}
					</div>

					{/* Content */}
					<div className='flex-1 min-w-0 space-y-2'>
						<div className='flex items-start justify-between gap-2'>
							<h3 className='font-semibold text-base line-clamp-1 group-hover:text-primary transition-colors'>
								{issue.title}
							</h3>
							<Badge
								variant='outline'
								className={`${statusConfig.color} flex items-center gap-1 text-xs`}
							>
								<StatusIcon className='w-3 h-3' />
								{statusConfig.label}
							</Badge>
						</div>

						<p className='text-sm text-muted-foreground line-clamp-2'>
							{issue.description}
						</p>

						<div className='flex flex-wrap items-center gap-3 text-xs text-muted-foreground'>
							<Badge
								variant='secondary'
								className={categoryColor}
							>
								{issue.category}
							</Badge>

							<div className='flex items-center gap-1'>
								<Calendar className='w-3 h-3' />
								<span>
									{formatDistanceToNow(
										new Date(issue.created_at),
										{
											addSuffix: true,
										}
									)}
								</span>
							</div>

							{issue.address && (
								<div className='flex items-center gap-1'>
									<MapPin className='w-3 h-3' />
									<span className='truncate max-w-[150px]'>
										{issue.address.split(",")[0]}
									</span>
								</div>
							)}

							<div className='flex items-center gap-3'>
								<div className='flex items-center gap-1'>
									<MessageSquare className='w-3 h-3' />
									<span>{issue.comments_count || 0}</span>
								</div>
								<div className='flex items-center gap-1'>
									<ThumbsUp className='w-3 h-3' />
									<span>{issue.likes_count || 0}</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

export default function IssueList({ issues, onIssueClick, onCreateNew }) {
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [categoryFilter, setCategoryFilter] = useState("all");

	// Filter and search logic
	const filteredIssues = useMemo(() => {
		return issues.filter((issue) => {
			// Search filter
			const matchesSearch =
				issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				issue.description
					.toLowerCase()
					.includes(searchQuery.toLowerCase());

			// Status filter
			const matchesStatus =
				statusFilter === "all" ||
				(statusFilter === "pending" && !issue.is_resolved) ||
				(statusFilter === "resolved" && issue.is_resolved);

			// Category filter
			const matchesCategory =
				categoryFilter === "all" || issue.category === categoryFilter;

			return matchesSearch && matchesStatus && matchesCategory;
		});
	}, [issues, searchQuery, statusFilter, categoryFilter]);

	const stats = useMemo(() => {
		return {
			total: issues.length,
			pending: issues.filter((i) => !i.is_resolved).length,
			resolved: issues.filter((i) => i.is_resolved).length,
		};
	}, [issues]);

	return (
		<div className='min-h-screen bg-gradient-to-br from-background via-background to-muted/20'>
			<div className='container mx-auto px-4 py-8 max-w-6xl'>
				{/* Header */}
				<div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8'>
					<div>
						<div className='flex gap-2'>
							<BackButton />
							<h1 className='text-3xl font-bold tracking-tight'>
								My Reported Issues
							</h1>
						</div>
						<p className='text-muted-foreground mt-1'>
							Track and manage your community reports
						</p>
					</div>
					<Button
						onClick={onCreateNew}
						size='lg'
						className='shadow-lg hover:shadow-xl transition-shadow'
					>
						<Plus className='w-5 h-5 mr-2' />
						New Report
					</Button>
				</div>

				{/* Stats Cards */}
				<div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6'>
					<Card className='border-2'>
						<CardContent className='pt-6'>
							<div className='flex items-center justify-between'>
								<div>
									<p className='text-sm font-medium text-muted-foreground'>
										Total Issues
									</p>
									<h3 className='text-2xl font-bold mt-1'>
										{stats.total}
									</h3>
								</div>
								<div className='w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center'>
									<Archive className='w-6 h-6 text-primary' />
								</div>
							</div>
						</CardContent>
					</Card>

					<Card className='border-2'>
						<CardContent className='pt-6'>
							<div className='flex items-center justify-between'>
								<div>
									<p className='text-sm font-medium text-muted-foreground'>
										Pending
									</p>
									<h3 className='text-2xl font-bold mt-1 text-yellow-600 dark:text-yellow-400'>
										{stats.pending}
									</h3>
								</div>
								<div className='w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center'>
									<Clock className='w-6 h-6 text-yellow-600 dark:text-yellow-400' />
								</div>
							</div>
						</CardContent>
					</Card>

					<Card className='border-2'>
						<CardContent className='pt-6'>
							<div className='flex items-center justify-between'>
								<div>
									<p className='text-sm font-medium text-muted-foreground'>
										Resolved
									</p>
									<h3 className='text-2xl font-bold mt-1 text-green-600 dark:text-green-400'>
										{stats.resolved}
									</h3>
								</div>
								<div className='w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center'>
									<CheckCircle2 className='w-6 h-6 text-green-600 dark:text-green-400' />
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Filters */}
				<Card className='mb-6 shadow-md'>
					<CardContent className='pt-6'>
						<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
							{/* Search */}
							<div className='relative'>
								<Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
								<Input
									placeholder='Search issues...'
									value={searchQuery}
									onChange={(e) =>
										setSearchQuery(e.target.value)
									}
									className='pl-10'
								/>
							</div>

							{/* Status Filter */}
							<Select
								value={statusFilter}
								onValueChange={setStatusFilter}
							>
								<SelectTrigger>
									<SelectValue placeholder='All Status' />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='all'>
										All Status
									</SelectItem>
									<SelectItem value='pending'>
										Pending
									</SelectItem>
									<SelectItem value='resolved'>
										Resolved
									</SelectItem>
								</SelectContent>
							</Select>

							{/* Category Filter */}
							<Select
								value={categoryFilter}
								onValueChange={setCategoryFilter}
							>
								<SelectTrigger>
									<SelectValue placeholder='All Categories' />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='all'>
										All Categories
									</SelectItem>
									<SelectItem value='pothole'>
										Pothole
									</SelectItem>
									<SelectItem value='streetlight'>
										Street Light
									</SelectItem>
									<SelectItem value='garbage'>
										Garbage
									</SelectItem>
									<SelectItem value='water'>
										Water Supply
									</SelectItem>
									<SelectItem value='drainage'>
										Drainage
									</SelectItem>
									<SelectItem value='road'>
										Road Damage
									</SelectItem>
									<SelectItem value='other'>Other</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</CardContent>
				</Card>

				{/* Issues List */}
				<div className='space-y-4'>
					{filteredIssues.length === 0 ? (
						<Card className='border-2 border-dashed'>
							<CardContent className='py-12'>
								<div className='text-center text-muted-foreground'>
									<Archive className='w-12 h-12 mx-auto mb-4 opacity-50' />
									<p className='text-lg font-medium'>
										No issues found
									</p>
									<p className='text-sm mt-1'>
										{issues.length === 0
											? "Create your first issue report"
											: "Try adjusting your filters"}
									</p>
								</div>
							</CardContent>
						</Card>
					) : (
						filteredIssues.map((issue) => (
							<IssueCard
								key={issue.id}
								issue={issue}
								onClick={onIssueClick}
							/>
						))
					)}
				</div>
			</div>
		</div>
	);
}
