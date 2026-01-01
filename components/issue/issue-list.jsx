"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
	Search,
	Plus,
	Calendar,
	MapPin,
	MessageSquare,
	ThumbsUp,
	Clock,
	CheckCircle2,
	Archive,
} from "lucide-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import BackButton from "../ui/back-button";
import { ISSUE_CATEGORIES } from "./constants";
import { CategoryBadge, StatusBadge, EmptyState } from "./shared-components";
import { cn } from "@/lib/utils";

//  Utility Components

function IssueThumbnail({ images, title }) {
	return (
		<div className='relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-muted'>
			{images && images.length > 0 ? (
				<Image
					src={`${process.env.NEXT_PUBLIC_API_URL}${images[0].image}`}
					alt={title}
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
	);
}

function IssueMetadata({ issue }) {
	return (
		<div className='flex flex-wrap items-center gap-3 text-xs text-muted-foreground'>
			<CategoryBadge category={issue.category} />

			<div className='flex items-center gap-1'>
				<Calendar className='w-3 h-3' />
				<span>
					{formatDistanceToNow(new Date(issue.created_at), {
						addSuffix: true,
					})}
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
	);
}

//  Card Components

//  Card Components

function IssueCard({ issue, onClick }) {
	return (
		<Card
			className={cn(
				'group cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] border-2 hover:border-primary/50',
				issue.is_archived ? 'opacity-70 bg-muted/50' : ''
			)}
			onClick={() => onClick(issue.id)}
		>
			<CardContent className='p-0'>
				<div className='flex gap-4 p-4'>
					<IssueThumbnail images={issue.images} title={issue.title} />

					<div className='flex-1 min-w-0 space-y-2'>
						<div className='flex items-start justify-between gap-2'>
							<h3 className='font-semibold text-base line-clamp-1 group-hover:text-primary transition-colors'>
								{issue.title}
							</h3>
							<StatusBadge isResolved={issue.is_resolved} isArchived={issue.is_archived} />
						</div>

						<p className='text-sm text-muted-foreground line-clamp-2'>
							{issue.description}
						</p>

						<IssueMetadata issue={issue} />
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

function StatCard({ label, value, icon: Icon, colorClass }) {
	return (
		<Card className='border-2'>
			<CardContent className='pt-6'>
				<div className='flex items-center justify-between'>
					<div>
						<p className='text-sm font-medium text-muted-foreground'>
							{label}
						</p>
						<h3
							className={`text-2xl font-bold mt-1 ${colorClass || ""}`}
						>
							{value}
						</h3>
					</div>
					<div
						className={`w-12 h-12 rounded-full flex items-center justify-center ${
							colorClass?.includes("yellow")
								? "bg-yellow-500/10"
								: colorClass?.includes("green")
									? "bg-green-500/10"
									: colorClass?.includes("zinc") 
										? "bg-zinc-500/10" 
										: "bg-primary/10"
						}`}
					>
						<Icon
							className={`w-6 h-6 ${colorClass || "text-primary"}`}
						/>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

//  Section Components

function ListHeader({ onCreateNew }) {
	return (
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
	);
}

function StatsSection({ stats }) {
	return (
		<div className='grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
			<StatCard label='Total Issues' value={stats.total} icon={Archive} />
			<StatCard
				label='Pending'
				value={stats.pending}
				icon={Clock}
				colorClass='text-yellow-600 dark:text-yellow-400'
			/>
			<StatCard
				label='Resolved'
				value={stats.resolved}
				icon={CheckCircle2}
				colorClass='text-green-600 dark:text-green-400'
			/>
			<StatCard
				label='Archived'
				value={stats.archived}
				icon={Archive}
				colorClass='text-zinc-500'
			/>
		</div>
	);
}

function FilterSection({
	searchQuery,
	onSearchChange,
	statusFilter,
	onStatusChange,
	categoryFilter,
	onCategoryChange,
}) {
	return (
		<Card className='mb-6 shadow-md'>
			<CardContent className='pt-6'>
				<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
					<div className='relative'>
						<Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
						<Input
							placeholder='Search issues...'
							value={searchQuery}
							onChange={(e) => onSearchChange(e.target.value)}
							className='pl-10'
						/>
					</div>

					<Select value={statusFilter} onValueChange={onStatusChange}>
						<SelectTrigger>
							<SelectValue placeholder='All Status' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='all'>All Status</SelectItem>
							<SelectItem value='pending'>Pending</SelectItem>
							<SelectItem value='resolved'>Resolved</SelectItem>
							<SelectItem value='archived'>Archived</SelectItem>
						</SelectContent>
					</Select>

					<Select
						value={categoryFilter}
						onValueChange={onCategoryChange}
					>
						<SelectTrigger>
							<SelectValue placeholder='All Categories' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='all'>All Categories</SelectItem>
							{ISSUE_CATEGORIES.map((cat) => (
								<SelectItem key={cat.value} value={cat.value}>
									{cat.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</CardContent>
		</Card>
	);
}

function IssuesList({ issues, onIssueClick, hasIssues }) {
	if (issues.length === 0) {
		return (
			<Card className='border-2 border-dashed'>
				<CardContent className='py-12'>
					<EmptyState
						icon={Archive}
						title='No issues found'
						description={
							hasIssues
								? "Try adjusting your filters"
								: "Create your first issue report"
						}
					/>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className='space-y-4'>
			{issues.map((issue) => (
				<IssueCard
					key={issue.id}
					issue={issue}
					onClick={onIssueClick}
				/>
			))}
		</div>
	);
}

//  Helper Functions

function filterIssues(issues, searchQuery, statusFilter, categoryFilter) {
	return issues.filter((issue) => {
		const matchesSearch =
			issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			issue.description.toLowerCase().includes(searchQuery.toLowerCase());

		let matchesStatus = true;
		if (statusFilter === "all") {
			// Show all, usually including archived? Or exclude archived by default?
			// Generally "My Issues" should show active ones primarily, but user said "options to archive".
			// Let's include everything in 'all' but maybe user prefers seeing active only. 
			// Let's stick to everything to avoid confusion where issues disappear.
			matchesStatus = true;
		} else if (statusFilter === "archived") {
			matchesStatus = issue.is_archived;
		} else if (statusFilter === "pending") {
			matchesStatus = !issue.is_resolved && !issue.is_archived;
		} else if (statusFilter === "resolved") {
			matchesStatus = issue.is_resolved && !issue.is_archived;
		}

		const matchesCategory =
			categoryFilter === "all" || issue.category === categoryFilter;

		return matchesSearch && matchesStatus && matchesCategory;
	});
}

function calculateStats(issues) {
	return {
		total: issues.length,
		pending: issues.filter((i) => !i.is_resolved && !i.is_archived).length,
		resolved: issues.filter((i) => i.is_resolved && !i.is_archived).length,
		archived: issues.filter((i) => i.is_archived).length,
	};
}

//  Main Component

export default function IssueList({ issues, onIssueClick, onCreateNew }) {
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [categoryFilter, setCategoryFilter] = useState("all");
	// ... rest of component
	
	const filteredIssues = useMemo(
		() => filterIssues(issues, searchQuery, statusFilter, categoryFilter),
		[issues, searchQuery, statusFilter, categoryFilter]
	);

	const stats = useMemo(() => calculateStats(issues), [issues]);

	return (
		<div className='min-h-screen bg-gradient-to-br from-background via-background to-muted/20'>
			<div className='container mx-auto px-4 py-8 max-w-6xl'>
				<ListHeader onCreateNew={onCreateNew} />
				<StatsSection stats={stats} />
				<FilterSection
					searchQuery={searchQuery}
					onSearchChange={setSearchQuery}
					statusFilter={statusFilter}
					onStatusChange={setStatusFilter}
					categoryFilter={categoryFilter}
					onCategoryChange={setCategoryFilter}
				/>
				<IssuesList
					issues={filteredIssues}
					onIssueClick={onIssueClick}
					hasIssues={issues.length > 0}
				/>
			</div>
		</div>
	);
}
