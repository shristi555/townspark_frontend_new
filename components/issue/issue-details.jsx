"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
	ArrowLeft,
	Calendar,
	MapPin,
	ThumbsUp,
	MessageSquare,
	Send,
	CheckCircle2,
	Clock,
	User,
	Map,
} from "lucide-react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import dynamic from "next/dynamic";

const MapView = dynamic(() => import("./map-view"), {
	ssr: false,
	loading: () => (
		<div className='w-full h-[300px] bg-muted rounded-lg flex items-center justify-center'>
			<p className='text-muted-foreground'>Loading map...</p>
		</div>
	),
});

function ImageGallery({ images }) {
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
				<div className='grid grid-cols-5 gap-2'>
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

export default function IssueDetails({
	issue,
	onBack,
	onAddComment,
	onToggleLike,
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

	return (
		<div className='min-h-screen bg-gradient-to-br from-background via-background to-muted/20'>
			<div className='container mx-auto px-4 py-8 max-w-5xl'>
				{/* Header */}
				<div className='flex items-center gap-4 mb-6'>
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
				</div>

				{/* Main Content */}
				<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
					{/* Left Column - Details */}
					<div className='lg:col-span-2 space-y-6'>
						{/* Images */}
						<Card className='shadow-lg'>
							<CardContent className='pt-6'>
								<ImageGallery images={issue.images} />
							</CardContent>
						</Card>

						{/* Title & Description */}
						<Card className='shadow-lg'>
							<CardHeader>
								<CardTitle className='flex items-center gap-2'>
									{issue.title}
									<Badge
										variant='secondary'
										className='ml-auto'
									>
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
							<Card className='shadow-lg'>
								<CardHeader>
									<CardTitle className='flex items-center gap-2'>
										<Map className='w-5 h-5' />
										LOCATION
									</CardTitle>
								</CardHeader>
								<CardContent className='space-y-4'>
									<MapView
										latitude={parseFloat(issue.latitude)}
										longitude={parseFloat(issue.longitude)}
									/>
									{issue.address && (
										<div className='flex items-start gap-3 p-4 bg-muted/50 rounded-lg'>
											<MapPin className='w-5 h-5 text-primary mt-0.5' />
											<div>
												<p className='text-sm font-medium'>
													ADDRESS
												</p>
												<p className='text-sm text-muted-foreground mt-1'>
													{issue.address}
												</p>
											</div>
										</div>
									)}
								</CardContent>
							</Card>
						)}

						{/* Comments */}
						<Card className='shadow-lg'>
							<CardHeader>
								<CardTitle className='flex items-center gap-2'>
									<MessageSquare className='w-5 h-5' />
									Comments ({issue.comments?.length || 0})
								</CardTitle>
							</CardHeader>
							<CardContent className='space-y-4'>
								{/* Comment List */}
								<div className='space-y-3 max-h-[400px] overflow-y-auto'>
									{issue.comments &&
									issue.comments.length > 0 ? (
										issue.comments.map((comment) => (
											<CommentItem
												key={comment.id}
												comment={comment}
											/>
										))
									) : (
										<p className='text-center text-muted-foreground py-8'>
											No comments yet. Be the first to
											comment!
										</p>
									)}
								</div>

								{/* Add Comment */}
								<div className='flex gap-2 pt-4 border-t'>
									<Textarea
										placeholder='Add a comment...'
										value={comment}
										onChange={(e) =>
											setComment(e.target.value)
										}
										rows={2}
										className='resize-none'
									/>
									<Button
										onClick={handleSubmitComment}
										disabled={
											isSubmitting || !comment.trim()
										}
										size='icon'
										className='h-auto'
									>
										<Send className='w-4 h-4' />
									</Button>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Right Column - Info */}
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
										<p className='text-sm'>
											{issue.reported_by}
										</p>
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
				</div>
			</div>
		</div>
	);
}
