"use client";

import React, {
	useEffect,
	useState,
	useRef,
	useCallback,
	useMemo,
} from "react";
import {
	Card,
	CardHeader,
	CardContent,
	CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import {
	FaRegCommentDots,
	FaRegThumbsUp,
	FaMapMarkerAlt,
	FaSearch,
	FaFilter,
} from "react-icons/fa";
import { MdCategory, MdKeyboardArrowRight } from "react-icons/md";
import { BsCheckCircle, BsCircle, BsCalendar3 } from "react-icons/bs";
import { IoMdImages, IoMdFlash } from "react-icons/io";
import { cn } from "@/lib/utils";
import api from "@/services/api";
import { useNeedAuth } from "@/hooks/auth-check";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format, isWithinInterval, startOfDay, endOfDay } from "date-fns";

async function exploreIssue(page = 1, page_size = 10, params = {}) {
	try {
		const query = new URLSearchParams({
			page: String(page),
			page_size: String(page_size),
			...params,
		}).toString();

		const resp = await api.get(`/profile/explore/?${query}`);
		if (resp.success) {
			return resp.response;
		}
	} catch (error) {
		console.error("Error exploring issues:", error);
		return null;
	}
}

function IssueCard({ issue }) {
	const firstImage =
		issue.images && issue.images.length > 0
			? (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '') + issue.images[0].image
			: null;

	return (
		<motion.div
			layout
			initial={{ opacity: 0, scale: 0.95 }}
			animate={{ opacity: 1, scale: 1 }}
			exit={{ opacity: 0, scale: 0.95 }}
			transition={{ duration: 0.3 }}
		>
			<Link href={`/issue/details/${issue.id}`}>
				<Card className='group h-full flex flex-col overflow-hidden border-border bg-card hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 cursor-pointer rounded-2xl'>
					{/* Image Overlay Header */}
					<div className='relative h-56 overflow-hidden'>
						{firstImage ? (
							<img
								src={firstImage}
								alt={issue.title}
								className='object-cover w-full h-full transition-transform duration-700 group-hover:scale-110'
								loading='lazy'
							/>
						) : (
							<div className='w-full h-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 text-zinc-400'>
								<IoMdImages className='text-4xl opacity-50' />
							</div>
						)}
						{/* Badges Overlay */}
						<div className='absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none'>
							<Badge className={cn(
								"px-3 py-1 text-[10px] font-bold uppercase tracking-wider shadow-lg border-0",
								issue.is_resolved
									? "bg-emerald-500 text-white"
									: "bg-amber-500 text-white"
							)}>
								{issue.is_resolved ? (
									<BsCheckCircle className='mr-1.5 h-3 w-3' />
								) : (
									<BsCircle className='mr-1.5 h-3 w-3' />
								)}
								{issue.is_resolved ? "Resolved" : "Open"}
							</Badge>
							<Badge variant="secondary" className="backdrop-blur-md bg-white/20 dark:bg-black/20 text-white border-0 shadow-lg px-2 py-1">
								{issue.category}
							</Badge>
						</div>
					</div>

					<CardHeader className='p-5 pb-2'>
						<div className='flex items-start justify-between gap-3'>
							<div className='space-y-1 min-w-0'>
								<h3 className='font-bold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2'>
									{issue.title}
								</h3>
							</div>
						</div>
					</CardHeader>

					<CardContent className='px-5 flex-1'>
						<p className='text-sm text-muted-foreground line-clamp-3 mb-4 min-h-[4.5rem]'>
							{issue.description}
						</p>
						<div className='flex flex-col gap-2'>
							<div className='flex items-center gap-2 text-[11px] text-zinc-500 dark:text-zinc-500'>
								<FaMapMarkerAlt className='text-primary/70 shrink-0' />
								<span className='truncate'>{issue.address}</span>
							</div>
							<div className='flex items-center gap-2 text-[11px] text-zinc-500 dark:text-zinc-500'>
								<BsCalendar3 className='shrink-0' />
								<span>{formatDistanceToNow(new Date(issue.created_at), { addSuffix: true })}</span>
							</div>
						</div>
					</CardContent>

					<div className='px-5 py-4 mt-auto border-t border-border flex items-center justify-between'>
						<div className='flex items-center gap-4'>
							<div className='flex items-center gap-1.5 group/stat'>
								<div className='p-1.5 rounded-full bg-primary/5 group-hover/stat:bg-primary/10 transition-colors'>
									<FaRegThumbsUp className='text-xs text-primary' />
								</div>
								<span className='text-xs font-semibold'>{issue.likes_count}</span>
							</div>
							<div className='flex items-center gap-1.5 group/stat'>
								<div className='p-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 group-hover/stat:bg-zinc-200 dark:group-hover/stat:bg-zinc-700 transition-colors'>
									<FaRegCommentDots className='text-xs text-zinc-500' />
								</div>
								<span className='text-xs font-semibold text-zinc-500'>{issue.comments_count}</span>
							</div>
						</div>

						<div className='flex -space-x-2'>
							<Avatar className='w-6 h-6 border-2 border-white dark:border-zinc-900 ring-2 ring-primary/20'>
								<AvatarFallback className='text-[10px] bg-primary text-white font-bold'>
									{issue.reported_by?.[0]?.toUpperCase() || "U"}
								</AvatarFallback>
							</Avatar>
						</div>
					</div>
				</Card>
			</Link>
		</motion.div>
	);
}

function IssueSkeleton() {
	return (
		<Card className='overflow-hidden animate-pulse border-zinc-200 dark:border-zinc-800 rounded-2xl'>
			<Skeleton className='h-56 w-full' />
			<div className='p-5 space-y-4'>
				<Skeleton className='h-6 w-3/4' />
				<Skeleton className='h-20 w-full' />
				<div className='flex justify-between items-center'>
					<Skeleton className='h-4 w-24' />
					<Skeleton className='h-6 w-6 rounded-full' />
				</div>
			</div>
		</Card>
	);
}

export default function ExplorePage() {
	const { loading: authLoading } = useNeedAuth();
	const [issues, setIssues] = useState([]);
	const [page, setPage] = useState(1);
	const [pageSize] = useState(9);
	const [loading, setLoading] = useState(false);
	const [initialLoading, setInitialLoading] = useState(true);
	const [hasMore, setHasMore] = useState(true);
	const [search, setSearch] = useState("");
	const [category, setCategory] = useState("");
	const [sortBy, setSortBy] = useState("newest");
	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);

	const loaderRef = useRef(null);
	const { theme } = useTheme();

	const fetchIssues = useCallback(
		async (pageNum = 1, opts = {}) => {
			setLoading(true);
			const data = await exploreIssue(pageNum, pageSize, opts);
			if (data) {
				setIssues((prev) =>
					pageNum === 1 ? data.results : [...prev, ...data.results]
				);
				setHasMore(pageNum < (data.total_pages || 1));
			}
			setLoading(false);
			setInitialLoading(false);
		},
		[pageSize]
	);

	// Fetch base data (infinite scroll)
	useEffect(() => {
		// Only trigger reset/initial fetch when SortBy changes
		// Search and Category are now local!
		const filters = {};
		if (sortBy) filters.ordering = sortBy === "newest" ? "-created_at" : "created_at";

		fetchIssues(1, filters);
		setPage(1);
	}, [sortBy, fetchIssues]);

	useEffect(() => {
		if (!hasMore || loading) return;
		const observer = new window.IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && hasMore && !loading) {
					setPage((prev) => prev + 1);
				}
			},
			{ rootMargin: "300px", threshold: 0.1 }
		);
		if (loaderRef.current) observer.observe(loaderRef.current);
		return () => {
			if (loaderRef.current) observer.unobserve(loaderRef.current);
		};
	}, [hasMore, loading]);

	useEffect(() => {
		if (page > 1) {
			const filters = {};
			if (sortBy) filters.ordering = sortBy === "newest" ? "-created_at" : "created_at";
			fetchIssues(page, filters);
		}
	}, [page, fetchIssues, sortBy]);

	// Local filtering logic
	const filteredIssues = useMemo(() => {
		return issues.filter((issue) => {
			const matchesSearch = !search ||
				issue.title.toLowerCase().includes(search.toLowerCase()) ||
				issue.description.toLowerCase().includes(search.toLowerCase()) ||
				(issue.address && issue.address.toLowerCase().includes(search.toLowerCase()));

			const matchesCategory = !category || issue.category === category;

			let matchesDate = true;
			if (startDate || endDate) {
				const issueDate = new Date(issue.created_at);
				if (startDate && endDate) {
					matchesDate = isWithinInterval(issueDate, {
						start: startOfDay(startDate),
						end: endOfDay(endDate)
					});
				} else if (startDate) {
					matchesDate = issueDate >= startOfDay(startDate);
				} else if (endDate) {
					matchesDate = issueDate <= endOfDay(endDate);
				}
			}

			return matchesSearch && matchesCategory && matchesDate;
		});
	}, [issues, search, category, startDate, endDate]);

	if (authLoading) {
		return (
			<div className='flex items-center justify-center min-h-screen bg-zinc-50 dark:bg-zinc-950'>
				<motion.div
					animate={{ rotate: 360 }}
					transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
					className='w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full'
				/>
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-background text-foreground transition-colors duration-500'>
			{/* Premium Hero Section */}
			<section className='relative pt-16 pb-24 overflow-hidden'>
				<div className='absolute inset-0 bg-primary/[0.03] dark:bg-primary/[0.02] -skew-y-3 origin-top-left' />
				<div className='container relative mx-auto px-4 text-center'>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className='inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest'
					>
						<IoMdFlash /> Community Driven
					</motion.div>
					<motion.h1
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.1 }}
						className='text-4xl md:text-6xl font-black mb-6 bg-gradient-to-r from-foreground to-foreground/50 bg-clip-text text-transparent'
					>
						Explore Neighborhood<br />Transformation
					</motion.h1>
					<motion.p
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
						className='max-w-2xl mx-auto text-muted-foreground text-lg mb-12'
					>
						Join thousands of citizens reporting issues, tracking progress, and building a better community together. Every report is a step towards change.
					</motion.p>

					{/* Search & Filters Bar */}
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ delay: 0.3 }}
						className='max-w-5xl mx-auto'
					>
						<div className='flex flex-col gap-4 p-4 bg-card rounded-3xl shadow-2xl shadow-primary/5 border border-border'>
							<div className='flex flex-col md:flex-row gap-3'>
								<div className='flex-1 relative group'>
									<FaSearch className='absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-primary transition-colors' />
									<Input
										placeholder='Search by problem, address, or keyword...'
										value={search}
										onChange={(e) => setSearch(e.target.value)}
										className='pl-12 h-14 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary rounded-2xl'
									/>
								</div>

								{/* Luxury Date Picker */}
								<Popover>
									<PopoverTrigger asChild>
										<Button
											variant="ghost"
											className="h-14 px-6 bg-muted/50 hover:bg-muted border-0 rounded-2xl text-sm font-medium flex items-center gap-3 transition-all"
										>
											<BsCalendar3 className="text-primary h-4 w-4" />
											{startDate ? (
												endDate ? (
													<span className="text-zinc-600 dark:text-zinc-300">
														{format(startDate, "MMM d")} - {format(endDate, "MMM d")}
													</span>
												) : (
													<span>{format(startDate, "MMM d")}</span>
												)
											) : <span className="text-zinc-400">Date Range</span>}
										</Button>
									</PopoverTrigger>
									<PopoverContent className="w-auto p-0 rounded-3xl shadow-2xl border-border overflow-hidden" align="end">
										<div className="p-4 bg-primary/5 border-b border-border">
											<h4 className="font-black text-xs uppercase tracking-widest text-primary">Select Range</h4>
										</div>
										<CalendarComponent
											initialFocus
											mode="range"
											selected={{ from: startDate, to: endDate }}
											onSelect={(range) => {
												setStartDate(range?.from);
												setEndDate(range?.to);
											}}
											className="p-3"
										/>
										{(startDate || endDate) && (
											<div className="p-2 border-t border-border bg-muted/20">
												<Button
													variant="ghost"
													className="w-full text-[10px] font-black uppercase tracking-tighter text-destructive hover:text-destructive hover:bg-destructive/5"
													onClick={() => { setStartDate(null); setEndDate(null); }}
												>
													Clear Dates
												</Button>
											</div>
										)}
									</PopoverContent>
								</Popover>

								<div className='flex gap-2'>
									<select
										aria-label='Category'
										value={category}
										onChange={(e) => setCategory(e.target.value)}
										className='h-14 px-4 bg-muted/50 border-0 rounded-2xl text-sm font-black focus:ring-1 ring-primary transition-all outline-none min-w-[140px]'
									>
										<option value='' className="bg-card">All Categories</option>
										<option value='water' className="bg-card">Water</option>
										<option value='road' className="bg-card">Roads</option>
										<option value='drainage' className="bg-card">Drainage</option>
										<option value='streetlight' className="bg-card">Street Lights</option>
										<option value='garbage' className="bg-card">Garbage</option>
									</select>
									<select
										aria-label='Sort'
										value={sortBy}
										onChange={(e) => setSortBy(e.target.value)}
										className='h-14 px-4 bg-muted/50 border-0 rounded-2xl text-sm font-black focus:ring-1 ring-primary transition-all outline-none min-w-[140px]'
									>
										<option value='newest' className="bg-card">Newest First</option>
										<option value='oldest' className="bg-card">Oldest First</option>
									</select>
								</div>
							</div>
						</div>
					</motion.div>
				</div>
			</section>

			{/* Main Content Area */}
			<div className='container mx-auto px-4 pb-20'>
				<div className='flex items-center justify-between mb-8 pb-4 border-b border-border'>
					<h2 className='text-sm font-bold uppercase tracking-widest text-muted-foreground'>
						Discover Issues ({filteredIssues.length})
					</h2>
					<div className='flex items-center gap-2'>
						<div className='w-2 h-2 rounded-full bg-emerald-500 animate-pulse' />
						<span className='text-xs font-medium text-emerald-600 dark:text-emerald-500'>Local filter active</span>
					</div>
				</div>

				{initialLoading ? (
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
						{Array.from({ length: 6 }).map((_, i) => (
							<IssueSkeleton key={i} />
						))}
					</div>
				) : filteredIssues.length === 0 ? (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className='py-20 text-center rounded-[2.5rem] bg-muted/30 border-2 border-dashed border-border'
					>
						<div className='inline-flex p-6 rounded-full bg-card shadow-xl mb-6'>
							<FaSearch className='text-4xl text-zinc-300' />
						</div>
						<h3 className='text-xl font-bold mb-2'>No issues found</h3>
						<p className='text-zinc-500'>Try adjusting your keywords, date range, or category filters.</p>
						<Button
							variant='link'
							onClick={() => { setSearch(""); setCategory(""); setStartDate(null); setEndDate(null); }}
							className='mt-4 font-bold'
						>
							Clear all local filters
						</Button>
					</motion.div>
				) : (
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
						<AnimatePresence mode='popLayout'>
							{filteredIssues.map((issue) => (
								<IssueCard
									key={issue.id}
									issue={issue}
								/>
							))}
						</AnimatePresence>
					</div>
				)}

				{/* Loading States & Footer */}
				<div
					ref={loaderRef}
					className='mt-16 flex flex-col items-center gap-6'
				>
					{loading && !initialLoading && (
						<div className='flex flex-col items-center gap-3'>
							<div className='flex gap-1'>
								<motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }} className='w-2 h-2 bg-primary rounded-full' />
								<motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className='w-2 h-2 bg-primary rounded-full' />
								<motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className='w-2 h-2 bg-primary rounded-full' />
							</div>
							<span className='text-xs font-bold uppercase tracking-widest text-zinc-500'>Discovering more issues</span>
						</div>
					)}

					{!hasMore && !loading && issues.length > 0 && (
						<div className='flex flex-col items-center gap-4 py-8 px-12 rounded-2xl bg-muted/50 border border-border'>
							<p className='text-sm text-muted-foreground font-medium'>You've explored everything for now!</p>
							<Button asChild size='sm' variant='secondary' className='rounded-full'>
								<Link href='/issue/create'>Report a New Issue</Link>
							</Button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
