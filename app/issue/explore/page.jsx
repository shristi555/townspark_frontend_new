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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import {
	FaRegCommentDots,
	FaRegThumbsUp,
	FaMapMarkerAlt,
} from "react-icons/fa";
import { MdCategory } from "react-icons/md";
import { BsCheckCircle, BsCircle } from "react-icons/bs";
import { IoMdImages } from "react-icons/io";
import { HiOutlineSun, HiOutlineMoon } from "react-icons/hi";
import { cn } from "@/lib/utils";
import api from "@/services/api";
import { useNeedAuth } from "@/hooks/auth-check";

async function exploreIssue(page = 1, page_size = 10, params = {}) {
	// Construct relative path as api instance handled baseURL
	const url = new URL("/profile/explore", process.env.NEXT_PUBLIC_API_URL);
	url.searchParams.set("page", String(page));
	url.searchParams.set("page_size", String(page_size));
	
	Object.keys(params).forEach(
		(k) => params[k] && url.searchParams.set(k, params[k])
	);

	try {
		// Just pass the path and params, let axios handle the rest
		const resp = await api.get(url.pathname + url.search);
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
			? process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, '') + issue.images[0].image
			: null;

	return (
		<motion.div
			initial={{ opacity: 0, y: 12 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: 12 }}
			transition={{ duration: 0.28 }}
			className='w-full'
		>
			<Card
				className={cn(
					"flex flex-col h-full overflow-hidden border-0",
					"bg-white dark:bg-zinc-900",
					"shadow-sm dark:shadow-black/40 hover:shadow-lg transition-shadow duration-300"
				)}
			>
				<CardHeader className='flex flex-row items-center gap-3'>
					<Avatar>
						<AvatarFallback>
							{issue.reported_by?.[0]?.toUpperCase() || "U"}
						</AvatarFallback>
					</Avatar>
					<div className='min-w-0'>
						<h3 className='font-semibold text-lg dark:text-white truncate'>
							{issue.title}
						</h3>
						<p className='text-xs text-zinc-500 dark:text-zinc-400 truncate'>
							Reported by {issue.reported_by}
						</p>
					</div>
					<div className='ml-auto flex items-center gap-2'>
						<Badge
							variant={
								issue.is_resolved ? "success" : "secondary"
							}
							className={cn(
								"flex items-center gap-1 px-2 py-1 text-xs",
								issue.is_resolved
									? "bg-green-500 text-white"
									: "bg-yellow-500 text-white"
							)}
						>
							{issue.is_resolved ? (
								<BsCheckCircle className='mr-1' />
							) : (
								<BsCircle className='mr-1' />
							)}
							{issue.is_resolved ? "Resolved" : "Open"}
						</Badge>
						<Badge
							variant='outline'
							className='flex items-center gap-1 px-2 py-1 text-xs'
						>
							<MdCategory />
							{issue.category}
						</Badge>
					</div>
				</CardHeader>

				{/* Rest of IssueCard remains same */}
				{firstImage ? (
					<div className='w-full h-48 sm:h-56 lg:h-44 overflow-hidden rounded-b-lg'>
						<img
							src={firstImage}
							alt={issue.title}
							className='object-cover w-full h-full transition-transform duration-300 hover:scale-105'
							loading='lazy'
						/>
					</div>
				) : (
					<div
						className='w-full h-44 sm:h-56 lg:h-44 rounded-b-lg flex items-center justify-center
                    bg-gradient-to-r from-zinc-100 to-white dark:from-zinc-800 dark:to-zinc-900 text-zinc-400 dark:text-zinc-500'
					>
						<IoMdImages className='text-3xl opacity-60' />
					</div>
				)}

				<CardContent className='flex-1'>
					<p className='text-sm dark:text-zinc-200 mb-3 line-clamp-3'>
						{issue.description}
					</p>
					<div className='flex flex-wrap gap-2 items-center'>
						<Badge
							variant='secondary'
							className='flex items-center gap-2 max-w-full'
						>
							<FaMapMarkerAlt />
							<span className='truncate max-w-[14rem]'>
								{issue.address}
							</span>
						</Badge>
						<Badge
							variant='outline'
							className='flex items-center gap-1'
						>
							<IoMdImages />
							{issue.images.length} images
						</Badge>
					</div>
				</CardContent>

				<CardFooter className='flex justify-between items-center'>
					<div className='flex gap-4 items-center'>
						<span className='flex items-center gap-1 text-zinc-500 dark:text-zinc-400'>
							<FaRegCommentDots />
							{issue.comments_count}
						</span>
						<span className='flex items-center gap-1 text-zinc-500 dark:text-zinc-400'>
							<FaRegThumbsUp />
							{issue.likes_count}
						</span>
					</div>
					<span className='text-xs text-zinc-400 dark:text-zinc-500'>
						{new Date(issue.created_at).toLocaleString()}
					</span>
				</CardFooter>
			</Card>
		</motion.div>
	);
}

function IssueSkeleton() {
	return (
		<Card className='mb-4 border-0 bg-white dark:bg-zinc-900 shadow-sm dark:shadow-black/40'>
			<CardHeader className='flex flex-row items-center gap-3'>
				<Skeleton className='w-10 h-10 rounded-full' />
				<div className='w-full'>
					<Skeleton className='w-32 h-4 mb-1' />
					<Skeleton className='w-20 h-3' />
				</div>
			</CardHeader>
			<Skeleton className='w-full h-44 sm:h-56 rounded mb-2' />
			<CardContent>
				<Skeleton className='w-3/4 h-4 mb-2' />
				<Skeleton className='w-1/2 h-3 mb-2' />
			</CardContent>
			<CardFooter className='flex justify-between items-center'>
				<Skeleton className='w-16 h-4' />
				<Skeleton className='w-20 h-3' />
			</CardFooter>
		</Card>
	);
}

export default function ExplorePage() {
	const { loading: authLoading } = useNeedAuth();
	const [issues, setIssues] = useState([]);
	const [page, setPage] = useState(1);
	const [pageSize] = useState(10);
	const [totalPages, setTotalPages] = useState(1);
	const [loading, setLoading] = useState(false);
	const [initialLoading, setInitialLoading] = useState(true);
	const [hasMore, setHasMore] = useState(true);
	const [search, setSearch] = useState("");
	const [category, setCategory] = useState("");
	const loaderRef = useRef(null);
	const { theme, setTheme } = useTheme();

	const fetchIssues = useCallback(
		async (pageNum = 1, opts = {}) => {
			setLoading(true);
			const data = await exploreIssue(pageNum, pageSize, opts);
			if (data) {
				setIssues((prev) =>
					pageNum === 1 ? data.results : [...prev, ...data.results]
				);
				setTotalPages(data.total_pages || 1);
				setHasMore(pageNum < (data.total_pages || 1));
			}
			setLoading(false);
			setInitialLoading(false);
		},
		[pageSize]
	);

	useEffect(() => {
		fetchIssues(1);
	}, [fetchIssues]);

	useEffect(() => {
		if (!hasMore || loading) return;
		const observer = new window.IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && hasMore && !loading) {
					setPage((prev) => prev + 1);
				}
			},
			{ rootMargin: "200px", threshold: 0.25 }
		);
		if (loaderRef.current) observer.observe(loaderRef.current);
		return () => {
			if (loaderRef.current) observer.unobserve(loaderRef.current);
		};
	}, [hasMore, loading]);

	useEffect(() => {
		if (page > 1) fetchIssues(page);
	}, [page, fetchIssues]);

	const filteredIssues = useMemo(() => {
		return issues.filter((i) => {
			const q = search.trim().toLowerCase();
			const matchesSearch =
				!q ||
				i.title.toLowerCase().includes(q) ||
				i.description.toLowerCase().includes(q) ||
				(i.address || "").toLowerCase().includes(q);
			const matchesCategory = !category || i.category === category;
			return matchesSearch && matchesCategory;
		});
	}, [issues, search, category]);

	const categories = useMemo(() => {
		const set = new Set(issues.map((i) => i.category));
		return Array.from(set).filter(Boolean);
	}, [issues]);

	if (authLoading) {
		return (
			<div className='flex items-center justify-center min-h-screen'>
				<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
			</div>
		);
	}

	return (
		<div className='min-h-screen px-3 sm:px-6 lg:px-12 py-8 bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300'>
			<div className='max-w-7xl mx-auto'>
				<header
					className='mb-6 rounded-lg p-6
                     bg-gradient-to-r from-amber-50 to-white dark:from-zinc-900 dark:to-zinc-950
                     shadow-sm dark:shadow-black/40'
				>
					<div className='flex items-start justify-between gap-4 flex-col sm:flex-row'>
						<div className='flex flex-col'>
							<motion.h1
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.35 }}
								className='text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white'
							>
								Explore Community Issues
							</motion.h1>
							<p className='text-sm text-zinc-600 dark:text-zinc-300 mt-1'>
								Discover, discuss, and help resolve issues in
								your community. Scroll to load more.
							</p>
						</div>

						<div className='flex items-center gap-2 mt-4 sm:mt-0'>
							<Button
								variant='ghost'
								onClick={() =>
									setTheme(
										theme === "dark" ? "light" : "dark"
									)
								}
								aria-label='Toggle theme'
								className='p-2'
							>
								{theme === "dark" ? (
									<HiOutlineSun className='text-lg' />
								) : (
									<HiOutlineMoon className='text-lg' />
								)}
							</Button>
						</div>
					</div>

					<div className='mt-4 grid grid-cols-1 md:grid-cols-3 gap-3'>
						<Input
							placeholder='Search title, description or address...'
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className='col-span-2'
						/>
						<select
							aria-label='Filter by category'
							value={category}
							onChange={(e) => setCategory(e.target.value)}
							className='px-3 py-2 rounded-md bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200'
						>
							<option value=''>All categories</option>
							{categories.map((c) => (
								<option key={c} value={c}>
									{c}
								</option>
							))}
						</select>
					</div>
				</header>

				<div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
					<main className='lg:col-span-3'>
						{initialLoading ? (
							<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6'>
								{Array.from({ length: 4 }).map((_, i) => (
									<IssueSkeleton key={i} />
								))}
							</div>
						) : filteredIssues.length === 0 ? (
							<div className='rounded-lg p-8 text-center bg-white dark:bg-zinc-900 shadow-sm dark:shadow-black/40'>
								<p className='text-zinc-600 dark:text-zinc-400'>
									No issues found for your filters.
								</p>
								{issues.length > 0 && (
									<p className='text-sm text-zinc-500 dark:text-zinc-500 mt-2'>
										Try clearing search or category.
									</p>
								)}
							</div>
						) : (
							<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6'>
								<AnimatePresence>
									{filteredIssues.map((issue) => (
										<IssueCard
											key={issue.id}
											issue={issue}
										/>
									))}
								</AnimatePresence>
							</div>
						)}

						<div
							ref={loaderRef}
							className='h-14 flex justify-center items-center mt-6'
						>
							{loading && !initialLoading && (
								<div className='flex items-center gap-3'>
									<Skeleton className='w-24 h-8 rounded-lg' />
									<span className='text-zinc-500 dark:text-zinc-400'>
										Loading...
									</span>
								</div>
							)}
							{!hasMore && !loading && issues.length > 0 && (
								<span className='text-zinc-400 dark:text-zinc-500 text-sm'>
									No more issues to show.
								</span>
							)}
							{hasMore && !loading && !initialLoading && (
								<Button
									onClick={() => setPage((p) => p + 1)}
									variant='outline'
								>
									Load more
								</Button>
							)}
						</div>
					</main>

					<aside className='hidden lg:block sticky top-20 self-start'>
						<div className='w-full rounded-lg p-4 bg-white dark:bg-zinc-900 shadow-sm dark:shadow-black/40'>
							<h4 className='font-semibold mb-2 text-zinc-900 dark:text-white'>
								Filters
							</h4>
							<div className='flex flex-col gap-2'>
								<label className='text-sm text-zinc-600 dark:text-zinc-400'>
									Quick categories
								</label>
								<div className='flex flex-wrap gap-2'>
									<Badge
										variant={
											category === ""
												? "secondary"
												: "outline"
										}
										className='cursor-pointer'
										onClick={() => setCategory("")}
									>
										All
									</Badge>
									{categories.map((c) => (
										<Badge
											key={c}
											variant={
												category === c
													? "secondary"
													: "outline"
											}
											className='cursor-pointer'
											onClick={() => setCategory(c)}
										>
											{c}
										</Badge>
									))}
								</div>
								<div className='mt-4'>
									<p className='text-xs text-zinc-500 dark:text-zinc-400'>
										Total results
									</p>
									<p className='text-xl font-bold text-zinc-900 dark:text-white'>
										{issues.length}
									</p>
								</div>
							</div>
						</div>

						<div className='mt-4 w-full rounded-lg p-4 bg-amber-50 dark:bg-zinc-800 shadow-sm dark:shadow-black/40'>
							<p className='text-sm text-zinc-900 dark:text-zinc-100'>
								Tip: use the search for fast filtering. Scroll
								to the bottom to load more.
							</p>
						</div>
					</aside>
				</div>
			</div>
		</div>
	);
}
