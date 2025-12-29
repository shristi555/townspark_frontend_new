"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { formatDistanceToNow } from "date-fns";

import { Button } from "@/components/ui/button";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import { Textarea } from "@/components/ui/textarea";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import {
	ArrowLeft,
	CheckCircle2,
	Clock,
	Pencil,
	Trash2,
	Calendar,
	User,
	ThumbsUp,
	Map,
	MapPin,
	MessageSquare,
	Send,
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

export function DeleteButton({ onConfirm, onCancel, issueId, issueTitle }) {
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant='destructive'>Delete issue</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						Are you sure you want to delete Issue #{issueId}?
					</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently
						delete the issue "{issueTitle}" (ID: {issueId}) from our
						database.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel onClick={onCancel}>
						Cancel
					</AlertDialogCancel>
					<AlertDialogAction onClick={onConfirm}>
						Continue
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

export default function IssueDetails({
	issue,
	requesting_user_id,
	onBack,
	onAddComment,
	onToggleLike,
	onDeleteIssue,
	onDeleteCancel,
	onUpdateIssue,
}) {
	const [comment, setComment] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmitComment = async () => {
		if (!comment.trim()) return;

		setIsSubmitting(true);
		await onAddComment(comment);
		setComment("");
		setIsSubmitting(false);
	};

	const hasLocation = issue.latitude && issue.longitude;
	// we can have requesting_user_id passed as prop for better accuracy or fallback to issue.requesting_user_id
	const canModifyIssue =
		(requesting_user_id || issue.requesting_user_id) === issue.user_id;

	return (
		<div className='min-h-screen bg-gradient-to-br from-background via-background to-muted/20'>
			<div className='container mx-auto px-4 py-8 max-w-5xl'>
				{/* Header */}
				<div className='flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6'>
					<Button
						variant='ghost'
						size='icon'
						onClick={onBack}
						className='rounded-full'
					>
						<ArrowLeft className='w-5 h-5' />
					</Button>
					<div className='flex-1'>
						<h1 className='text-2xl font-bold'>
							Issue #{issue.id}
						</h1>
						<p className='text-sm text-muted-foreground'>
							Reported{" "}
							{formatDistanceToNow(new Date(issue.created_at), {
								addSuffix: true,
							})}
						</p>
					</div>
					<div className='flex items-center gap-2 flex-wrap'>
						<Badge
							variant='outline'
							className={
								issue.is_resolved
									? "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20"
									: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20"
							}
						>
							{issue.is_resolved ? (
								<CheckCircle2 className='w-3 h-3 mr-1' />
							) : (
								<Clock className='w-3 h-3 mr-1' />
							)}
							{issue.is_resolved ? "Resolved" : "Pending Review"}
						</Badge>
						{canModifyIssue && (
							<>
								<Button
									variant='outline'
									size='sm'
									onClick={onUpdateIssue}
									className='gap-1'
								>
									<Pencil className='w-3 h-3' />
									Edit
								</Button>
								<DeleteButton
									issueId={issue.id}
									issueTitle={issue.title}
									onCancel={onDeleteCancel}
									onConfirm={onDeleteIssue}
								/>
							</>
						)}
					</div>
				</div>

				{/* Mobile Meta Info - Show on small screens */}
				<div className='lg:hidden mb-6'>
					<IssueMetaInfo issue={issue} onToggleLike={onToggleLike} />
				</div>

				{/* Main Content */}
				<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
					{/* Left Column - Details */}
					<div className='lg:col-span-2 space-y-6'>
						{/* Images */}
						{issue.images && issue.images.length > 0 && (
							<Card className='shadow-lg'>
								<CardContent className='pt-6'>
									<ImageGallery images={issue.images} />
								</CardContent>
							</Card>
						)}

						{/* Mobile Progress Timeline - Show on small screens */}
						{issue.progress_updates &&
							issue.progress_updates.length > 0 && (
								<div className='lg:hidden'>
									<Card className='shadow-lg'>
										<CardHeader>
											<CardTitle>
												Progress Updates
											</CardTitle>
										</CardHeader>
										<CardContent>
											<ProgressTimeline
												updates={issue.progress_updates}
											/>
										</CardContent>
									</Card>
								</div>
							)}

						{/* Title & Description */}
						<Card className='shadow-lg'>
							<CardHeader>
								<CardTitle className='flex flex-col sm:flex-row items-start sm:items-center gap-2'>
									<span className='flex-1'>
										{issue.title}
									</span>
									<Badge variant='secondary'>
										{issue.category}
									</Badge>
								</CardTitle>
							</CardHeader>
							<CardContent>
								<h4 className='text-sm font-semibold mb-2'>
									DESCRIPTION
								</h4>
								<p className='text-muted-foreground leading-relaxed'>
									{issue.description}
								</p>
							</CardContent>
						</Card>

						{/* Location */}
						{hasLocation && (
							<IssueLocation
								latitude={parseFloat(issue.latitude)}
								longitude={parseFloat(issue.longitude)}
								address={issue.address}
							/>
						)}

						{/* Comments */}
						<CommentSection
							comments={issue.comments}
							comment={comment}
							setComment={setComment}
							isSubmitting={isSubmitting}
							onSubmitComment={handleSubmitComment}
						/>
					</div>

					{/* Right Column - Info (Desktop only) */}
					<div className='hidden lg:block space-y-6'>
						<IssueMetaInfo
							issue={issue}
							onToggleLike={onToggleLike}
						/>

						{/* Progress Timeline */}
						{issue.progress_updates &&
							issue.progress_updates.length > 0 && (
								<Card className='shadow-lg'>
									<CardHeader>
										<CardTitle>Progress Updates</CardTitle>
									</CardHeader>
									<CardContent>
										<ProgressTimeline
											updates={issue.progress_updates}
										/>
									</CardContent>
								</Card>
							)}
					</div>
				</div>
			</div>
		</div>
	);
}

export function ImageGallery({ images }) {
	const [selectedImage, setSelectedImage] = useState(0);

	if (!images || images.length === 0) return null;

	return (
		<div className='space-y-4'>
			{/* Main Image */}
			<div className='relative w-full h-[400px] rounded-lg overflow-hidden bg-muted'>
				<Image
					src={`${process.env.NEXT_PUBLIC_API_URL}${images[selectedImage].image}`}
					alt='Issue evidence'
					fill
					className='object-contain'
					unoptimized
				/>
			</div>

			{/* Thumbnails */}
			{images.length > 1 && (
				<div className='grid grid-cols-3 sm:grid-cols-5 gap-2'>
					{images.map((img, index) => (
						<button
							key={img.id}
							onClick={() => setSelectedImage(index)}
							className={`relative h-20 rounded-lg overflow-hidden border-2 transition-all ${
								selectedImage === index
									? "border-primary ring-2 ring-primary/20"
									: "border-border hover:border-primary/50"
							}`}
						>
							<Image
								src={`${process.env.NEXT_PUBLIC_API_URL}${img.image}`}
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

export function IssueMetaInfo({ issue, onToggleLike }) {
	return (
		<div className='space-y-6'>
			{/* Meta Info */}
			<Card className='shadow-lg'>
				<CardHeader>
					<CardTitle>Details</CardTitle>
				</CardHeader>
				<CardContent className='space-y-4'>
					<div className='flex items-center gap-3'>
						<Calendar className='w-5 h-5 text-muted-foreground' />
						<div>
							<p className='text-xs font-medium text-muted-foreground'>
								DATE
							</p>
							<p className='text-sm'>
								{new Date(
									issue.created_at
								).toLocaleDateString()}
							</p>
						</div>
					</div>

					<div className='flex items-center gap-3'>
						<User className='w-5 h-5 text-muted-foreground' />
						<div>
							<p className='text-xs font-medium text-muted-foreground'>
								AUTHOR
							</p>
							<p className='text-sm'>{issue.reported_by}</p>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Actions */}
			<Card className='shadow-lg'>
				<CardContent className='pt-6'>
					<Button
						variant='outline'
						className='w-full justify-start'
						onClick={onToggleLike}
					>
						<ThumbsUp className='w-4 h-4 mr-2' />
						{issue.likes_count || 0} Likes
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}

const MapView = dynamic(() => import("./map-view"), {
	ssr: false,
	loading: () => (
		<div className='w-full h-[300px] bg-muted rounded-lg flex items-center justify-center'>
			<p className='text-muted-foreground'>Loading map...</p>
		</div>
	),
});

export function IssueLocation({ latitude, longitude, address }) {
	return (
		<Card className='shadow-lg'>
			<CardHeader>
				<CardTitle className='flex items-center gap-2'>
					<Map className='w-5 h-5' />
					LOCATION
				</CardTitle>
			</CardHeader>
			<CardContent className='space-y-4'>
				<MapView latitude={latitude} longitude={longitude} />
				{address && (
					<div className='flex items-start gap-3 p-4 bg-muted/50 rounded-lg'>
						<MapPin className='w-5 h-5 text-primary mt-0.5' />
						<div>
							<p className='text-sm font-medium'>ADDRESS</p>
							<p className='text-sm text-muted-foreground mt-1'>
								{address}
							</p>
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}

function CommentItem({ comment }) {
	return (
		<div className='flex gap-3 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors'>
			<Avatar className='w-10 h-10'>
				<AvatarFallback className='bg-primary/10 text-primary'>
					<User className='w-5 h-5' />
				</AvatarFallback>
			</Avatar>
			<div className='flex-1 space-y-1'>
				<div className='flex items-center gap-2'>
					<span className='font-medium text-sm'>
						{comment.user || "Anonymous"}
					</span>
					<span className='text-xs text-muted-foreground'>
						{formatDistanceToNow(new Date(comment.created_at), {
							addSuffix: true,
						})}
					</span>
				</div>
				<p className='text-sm text-muted-foreground'>{comment.text}</p>
			</div>
		</div>
	);
}

export function CommentSection({
	comments,
	comment,
	setComment,
	isSubmitting,
	onSubmitComment,
}) {
	return (
		<Card className='shadow-lg'>
			<CardHeader>
				<CardTitle className='flex items-center gap-2'>
					<MessageSquare className='w-5 h-5' />
					Comments ({comments?.length || 0})
				</CardTitle>
			</CardHeader>
			<CardContent className='space-y-4'>
				{/* Comment List */}
				<div className='space-y-3 max-h-[400px] overflow-y-auto'>
					{comments && comments.length > 0 ? (
						comments.map((comment) => (
							<CommentItem key={comment.id} comment={comment} />
						))
					) : (
						<p className='text-center text-muted-foreground py-8'>
							No comments yet. Be the first to comment!
						</p>
					)}
				</div>

				{/* Add Comment */}
				<div className='flex gap-2 pt-4 border-t'>
					<Textarea
						placeholder='Add a comment...'
						value={comment}
						onChange={(e) => setComment(e.target.value)}
						rows={2}
						className='resize-none'
					/>
					<Button
						onClick={onSubmitComment}
						disabled={isSubmitting || !comment.trim()}
						size='icon'
						className='h-auto'
					>
						<Send className='w-4 h-4' />
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}

export function ProgressTimeline({ updates }) {
	if (!updates || updates.length === 0) return null;

	// Sort updates by date (newest first)
	const sortedUpdates = [...updates].sort(
		(a, b) => new Date(b.created_at) - new Date(a.created_at)
	);

	return (
		<div className='relative space-y-6'>
			{sortedUpdates.map((update, index) => (
				<div key={update.id} className='relative pl-8'>
					{/* Timeline line */}
					{index !== sortedUpdates.length - 1 && (
						<div className='absolute left-[11px] top-6 bottom-0 w-0.5 bg-border' />
					)}

					{/* Timeline dot */}
					<div className='absolute left-0 top-1 w-6 h-6 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center'>
						<CheckCircle2 className='w-3 h-3 text-primary' />
					</div>

					{/* Content */}
					<div className='space-y-1'>
						<div className='flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2'>
							<h4 className='font-semibold text-sm'>
								{update.title}
							</h4>
							<span className='text-xs text-muted-foreground'>
								{formatDistanceToNow(
									new Date(update.created_at),
									{
										addSuffix: true,
									}
								)}
							</span>
						</div>
						<p className='text-sm text-muted-foreground'>
							{update.description}
						</p>
						{update.updated_by && (
							<p className='text-xs text-muted-foreground'>
								by {update.updated_by.first_name}{" "}
								{update.updated_by.last_name}
							</p>
						)}
					</div>
				</div>
			))}
		</div>
	);
}
