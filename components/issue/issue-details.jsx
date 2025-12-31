"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	ArrowLeft,
	CheckCircle2,
	Pencil,
	Trash2,
	Calendar,
	User,
	ThumbsUp,
	Map,
	MapPin,
	MessageSquare,
	Send,
	Clock,
	Maximize2,
	ChevronRight,
	Badge,
} from "lucide-react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Image from "next/image";
import useAuthStore from "@/store/auth_store";
import {
	CategoryBadge,
	StatusBadge,
	LoadingState,
} from "./shared-components";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Dynamic map import
const MapView = dynamic(() => import("./map-view"), {
	ssr: false,
	loading: () => (
		<div className='w-full h-[300px] bg-muted animate-pulse rounded-2xl flex items-center justify-center'>
			<LoadingState message='Initializing digital map...' />
		</div>
	),
});

function ImageGallery({ images }) {
	const [selectedImage, setSelectedImage] = useState(0);

	if (!images || images.length === 0) return null;

	const baseUrl = process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, '');

	return (
		<div className='space-y-4'>
			<motion.div 
				layoutId="main-image"
				className='relative w-full aspect-[16/10] sm:aspect-video rounded-3xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 shadow-2xl'
			>
				<Image
					src={`${baseUrl}${images[selectedImage].image}`}
					alt='Issue evidence'
					fill
					className='object-cover transition-all duration-700 hover:scale-105'
					unoptimized
				/>
				<div className='absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none' />
				<div className='absolute bottom-6 right-6'>
					<Badge variant="secondary" className="backdrop-blur-xl bg-background/20 text-foreground border-0 px-3 py-1 text-xs">
						<Maximize2 className='w-3 h-3 mr-2' /> Full Screen
					</Badge>
				</div>
			</motion.div>

			{images.length > 1 && (
				<div className='flex gap-3 overflow-x-auto pb-2 scrollbar-hide'>
					{images.map((img, index) => (
						<button
							key={img.id || index}
							onClick={() => setSelectedImage(index)}
							className={cn(
								'relative w-24 h-24 rounded-2xl flex-shrink-0 overflow-hidden border-2 transition-all duration-300',
								selectedImage === index
									? "border-primary ring-4 ring-primary/20 scale-95"
									: "border-transparent opacity-60 hover:opacity-100"
							)}
						>
							<Image
								src={`${baseUrl}${img.image}`}
								alt={`Thumbnail ${index + 1}`}
								fill
								className='object-cover'
								unoptimized
							/>
						</button>
					))}
				</div>
			)}
		</div>
	);
}

function ProgressTimelineItem({ update, isLast }) {
	return (
		<Link href={`/issue/progress/${update.id}`} className="block group">
			<div className='relative pl-12 pb-8'>
				{!isLast && (
					<div className='absolute left-[15px] top-8 bottom-0 w-[2px] bg-gradient-to-b from-primary/50 to-zinc-100 dark:to-zinc-800' />
				)}

				<div className={cn(
					'absolute left-0 top-1 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 shadow-lg',
					'bg-background border-2 border-primary group-hover:scale-110 group-hover:rotate-12'
				)}>
					<CheckCircle2 className='w-4 h-4 text-primary' />
				</div>

				<div className='p-5 rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300'>
					<div className='flex items-start justify-between mb-2'>
						<div className='space-y-0.5'>
							<h4 className='font-bold text-base group-hover:text-primary transition-colors'>{update.title}</h4>
							<div className='flex items-center gap-2 text-[10px] text-zinc-500 font-medium uppercase tracking-wider'>
								<Clock className='w-3 h-3' />
								{formatDistanceToNow(new Date(update.created_at), { addSuffix: true })}
							</div>
						</div>
						<ChevronRight className='w-5 h-5 text-zinc-300 group-hover:text-primary transition-colors group-hover:translate-x-1' />
					</div>
					<p className='text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed'>
						{update.description}
					</p>
					{update.updated_by && (
						<div className='mt-4 pt-4 border-t border-border flex items-center gap-2'>
							<Avatar className='w-5 h-5'>
								<AvatarFallback className='text-[8px] bg-muted text-muted-foreground'>
									{update.updated_by.first_name?.[0]}
								</AvatarFallback>
							</Avatar>
							<span className='text-[10px] font-bold text-muted-foreground uppercase'>
								Updated by {update.updated_by.first_name}
							</span>
						</div>
					)}
				</div>
			</div>
		</Link>
	);
}

export default function IssueDetails({
	issue,
	onBack,
	onAddComment,
	onToggleLike,
	onDeleteIssue,
	onUpdateIssue,
}) {
	const [comment, setComment] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const user = useAuthStore((state) => state.user);
	const userId = user?.id;

	const handleSubmitComment = async () => {
		if (!comment.trim()) return;
		setIsSubmitting(true);
		try {
			await onAddComment(comment);
			setComment("");
		} finally {
			setIsSubmitting(false);
		}
	};

	const canModifyIssue = userId === issue.requesting_user_id || userId === issue.user?.id;
	const hasProgressUpdates = issue.progress_updates && issue.progress_updates.length > 0;
	const hasLocation = issue.latitude && issue.longitude;

	return (
		<div className='min-h-screen bg-background text-foreground transition-colors duration-500'>
			{/* Top Bar Navigation */}
			<div className='sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border'>
				<div className='container mx-auto px-4 h-16 flex items-center justify-between'>
					<div className='flex items-center gap-4'>
						<Button variant='ghost' size='icon' onClick={onBack} className='rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800'>
							<ArrowLeft className='w-5 h-5' />
						</Button>
						<div className='hidden sm:block'>
							<h2 className='text-sm font-black uppercase tracking-widest'>Issue Details</h2>
							<p className='text-[10px] text-zinc-500 font-bold'>#{issue.id} • {issue.category}</p>
						</div>
					</div>
					
					<div className='flex items-center gap-3'>
						<StatusBadge isResolved={issue.is_resolved} className="h-8 rounded-xl px-4 text-[10px] font-black" />
						{canModifyIssue && (
							<div className='flex items-center gap-2'>
								<Button size='sm' variant='outline' onClick={onUpdateIssue} className='h-8 rounded-xl text-xs font-bold border-zinc-200 dark:border-zinc-800'>
									<Pencil className='w-3 h-3 mr-2' /> Edit
								</Button>
								<AlertDialog>
									<AlertDialogTrigger asChild>
										<Button size='sm' variant='destructive' className='h-8 rounded-xl text-xs font-bold shadow-lg shadow-red-500/20'>
											<Trash2 className='w-3 h-3 mr-2' /> Delete
										</Button>
									</AlertDialogTrigger>
									<AlertDialogContent className="rounded-3xl border-zinc-200 dark:border-zinc-800">
										<AlertDialogHeader>
											<AlertDialogTitle className="text-xl font-black">Hold on! Are you sure?</AlertDialogTitle>
											<AlertDialogDescription className="text-zinc-500">
												This will permanently delete this report. All images, comments, and progress updates will be lost forever.
											</AlertDialogDescription>
										</AlertDialogHeader>
										<AlertDialogFooter>
											<AlertDialogCancel className="rounded-xl font-bold">Cancel</AlertDialogCancel>
											<AlertDialogAction onClick={onDeleteIssue} className="rounded-xl font-bold bg-destructive text-white hover:bg-destructive/90 transition-all">
												Delete Forever
											</AlertDialogAction>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialog>
							</div>
						)}
					</div>
				</div>
			</div>

			<div className='container mx-auto px-4 py-8 max-w-7xl'>
				<div className='grid grid-cols-1 lg:grid-cols-12 gap-8'>
					
					{/* Left Column - Main Content (8 cols) */}
					<div className='lg:col-span-8 space-y-8'>
						
						{/* Featured Header Card */}
						<div className='space-y-4'>
							<div className='flex items-center gap-3'>
								<Badge variant="outline" className="rounded-full border-primary/30 text-primary bg-primary/5 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest">
									{issue.category}
								</Badge>
								<div className='flex items-center gap-2 text-xs text-zinc-500 font-medium'>
									<Calendar className='w-4 h-4' />
									{new Date(issue.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })}
								</div>
							</div>
							<h1 className='text-3xl md:text-5xl font-black leading-tight tracking-tight'>
								{issue.title}
							</h1>
						</div>

						{/* Gallery */}
						<ImageGallery images={issue.images} />

						{/* Description */}
						<div className='p-8 rounded-3xl bg-card border border-border shadow-xl shadow-primary/5'>
							<h3 className='text-xs font-black uppercase tracking-[0.2em] text-primary mb-4'>Problem Details</h3>
							<p className='text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium'>
								{issue.description}
							</p>
						</div>

						{/* Location Map */}
						{hasLocation && (
							<div className='space-y-4'>
								<h3 className='text-xs font-black uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2'>
									<MapPin className='w-4 h-4' /> Precise Location
								</h3>
								<div className='rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-2xl'>
									<MapView 
										latitude={issue.latitude ? parseFloat(issue.latitude) : null} 
										longitude={issue.longitude ? parseFloat(issue.longitude) : null} 
									/>
									<div className='p-6 bg-card border-t border-border'>
										<div className='flex items-start gap-4'>
											<div className='p-3 rounded-2xl bg-primary/10'>
												<MapPin className='w-6 h-6 text-primary' />
											</div>
											<div>
												<p className='text-xs font-black uppercase tracking-wider text-zinc-400 mb-1'>Reported Address</p>
												<p className='text-base font-bold text-zinc-800 dark:text-zinc-200'>{issue.address}</p>
											</div>
										</div>
									</div>
								</div>
							</div>
						)}

						{/* User Engagement (Comments) */}
						<div className='space-y-6'>
							<div className='flex items-center justify-between'>
								<h3 className='text-xs font-black uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2'>
									<MessageSquare className='w-4 h-4' /> Discussion ({issue.comments?.length || 0})
								</h3>
							</div>
							
							<div className='space-y-4'>
								{issue.comments?.map((c) => (
									<div key={c.id} className='flex gap-4 p-5 rounded-3xl bg-card border border-border hover:border-primary/20 transition-all'>
										<Avatar className='w-10 h-10 border-2 border-zinc-100 dark:border-zinc-800'>
											<AvatarFallback className='bg-primary/5 text-primary text-xs font-bold'>
												{c.user?.[0]?.toUpperCase()}
											</AvatarFallback>
										</Avatar>
										<div className='flex-1 space-y-1.5'>
											<div className='flex items-center justify-between'>
												<span className='text-sm font-black'>{c.user}</span>
												<span className='text-[10px] text-zinc-400 font-bold uppercase'>{formatDistanceToNow(new Date(c.created_at), { addSuffix: true })}</span>
											</div>
											<p className='text-sm text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed'>{c.text}</p>
										</div>
									</div>
								))}
							</div>

							{/* Add Comment */}
							<div className='p-6 rounded-3xl bg-muted/30 border border-transparent focus-within:border-primary/30 transition-all'>
								<Textarea 
									placeholder='Share your thoughts or update on this issue...'
									value={comment}
									onChange={(e) => setComment(e.target.value)}
									className='bg-transparent border-0 focus-visible:ring-0 resize-none min-h-[100px] text-base placeholder:font-bold'
								/>
								<div className='flex justify-end mt-4'>
									<Button 
										onClick={handleSubmitComment}
										disabled={isSubmitting || !comment.trim()}
										className='rounded-xl px-8 font-black shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95'
									>
										<Send className='w-4 h-4 mr-2' /> Post Comment
									</Button>
								</div>
							</div>
						</div>
					</div>

					{/* Right Column - Sidebar Stats & Timeline (4 cols) */}
					<div className='lg:col-span-4 space-y-8'>
						
						{/* Quick Action Card - Improved to not invert logic but stay premium */}
						<Card className='rounded-3xl border-0 bg-zinc-900 dark:bg-zinc-800 shadow-2xl shadow-primary/20 overflow-hidden'>
							<CardContent className='p-8 space-y-6 text-white'>
								<div className='flex items-center justify-between'>
									<div className='space-y-1'>
										<p className='text-[10px] font-black uppercase tracking-widest opacity-70'>Community Pulse</p>
										<h4 className='text-3xl font-black'>{issue.likes_count} Likes</h4>
									</div>
									<div className='p-4 rounded-2xl bg-primary-foreground/20 backdrop-blur-xl'>
										<ThumbsUp className='w-8 h-8' />
									</div>
								</div>
								<Button 
									variant='secondary' 
									onClick={onToggleLike}
									className='w-full h-14 rounded-2xl font-black text-lg bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-xl transition-all hover:-translate-y-1 active:translate-y-0'
								>
									Support this report
								</Button>
								<p className='text-center text-[11px] font-bold opacity-60'>Voting helps prioritize local issues</p>
							</CardContent>
						</Card>

						{/* Author Card */}
						<Card className='rounded-3xl border border-border bg-card/50'>
							<CardHeader>
								<CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">Reporter Info</CardTitle>
							</CardHeader>
							<CardContent className='flex items-center gap-4 border-t border-border pt-6'>
								<Avatar className='w-14 h-14 border-2 border-background shadow-xl'>
									<AvatarFallback className='bg-muted text-muted-foreground font-black text-lg'>{issue.reported_by?.[0]?.toUpperCase()}</AvatarFallback>
								</Avatar>
								<div>
									<h4 className='font-black text-base'>{issue.reported_by?.split('@')[0]}</h4>
									<p className='text-xs text-zinc-500 font-bold'>{issue.reported_by}</p>
								</div>
							</CardContent>
						</Card>

						{/* Progress Timeline Sidebar */}
						<div className='space-y-6'>
							<div className='flex items-center justify-between px-2'>
								<h3 className='text-xs font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2'>
									<Clock className='w-4 h-4' /> Progress Path
								</h3>
								<Badge variant="secondary" className="rounded-full px-3 py-1 text-[10px] font-bold tracking-tighter">
									{issue.progress_updates?.length || 0} stages
								</Badge>
							</div>

							<div className='space-y-2'>
								{hasProgressUpdates ? (
									issue.progress_updates.map((update, index) => (
										<ProgressTimelineItem 
											key={update.id} 
											update={update} 
											isLast={index === issue.progress_updates.length - 1} 
										/>
									))
								) : (
									<div className='p-8 text-center rounded-3xl bg-muted/20 border-2 border-dashed border-border'>
										<Clock className='w-8 h-8 text-muted-foreground mx-auto mb-3 opacity-50' />
										<p className='text-xs font-bold text-muted-foreground uppercase tracking-widest'>No updates yet</p>
										<p className='text-[10px] text-muted-foreground mt-2 font-medium leading-relaxed italic'>Once the authority begins acting, timeline will appear here.</p>
									</div>
								)}
							</div>
						</div>

					</div>
				</div>
			</div>
		</div>
	);
}

