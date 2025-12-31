"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
	MapPin,
	Calendar,
	Heart,
	MessageSquare,
	Image as ImageIcon,
	Settings,
	Edit,
	Clock,
	CheckCircle2,
} from "lucide-react";
import { useNeedAuth } from "@/hooks/auth-check";
import useAuthStore from "@/store/auth_store";

const ProfilePage = () => {
	const { loading: authLoading } = useNeedAuth();
	const { fetchProfile, profileData, isLoading: storeLoading } = useAuthStore();
	const router = useRouter();

	useEffect(() => {
		fetchProfile();
	}, [fetchProfile]);

	const getCategoryColor = (category) => {
		const colors = {
			garbage: "bg-orange-500",
			drainage: "bg-blue-500",
			streetlight: "bg-yellow-500",
			water: "bg-cyan-500",
			road: "bg-gray-500",
		};
		return colors[category] || "bg-gray-500";
	};

	const formatDate = (dateString) => {
		const date = new Date(dateString);
		const now = new Date();
		const diffTime = Math.abs(now.getTime() - date.getTime());
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

		if (diffDays === 0) return "Today";
		if (diffDays === 1) return "Yesterday";
		if (diffDays < 7) return `${diffDays} days ago`;
		if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
		return date.toLocaleDateString();
	};

	const handleIssueClick = (issueId) => {
		router.push(`/issue/details/${issueId}`);
	};

	const renderIssueCard = (issue, showComments = false) => (
		<Card
			key={issue.id}
			className='overflow-hidden hover:shadow-lg transition-shadow cursor-pointer'
			onClick={() => handleIssueClick(issue.id)}
		>
			<CardContent className='p-6'>
				<div className='flex flex-col md:flex-row gap-4'>
					{/* Issue Image */}
					<div className='w-full md:w-32 h-32 rounded-lg overflow-hidden bg-muted flex-shrink-0'>
						{issue.images.length > 0 ? (
							<img
								src={`${process.env.NEXT_PUBLIC_API_URL}${issue.images[0].image}`}
								alt={issue.title}
								className='w-full h-full object-cover'
							/>
						) : (
							<div className='w-full h-full flex items-center justify-center'>
								<ImageIcon className='w-8 h-8 text-muted-foreground' />
							</div>
						)}
					</div>

					{/* Issue Details */}
					<div className='flex-1 min-w-0'>
						<div className='flex flex-wrap items-start justify-between gap-2 mb-2'>
							<div className='flex-1 min-w-0'>
								<h3 className='text-lg font-semibold mb-1 truncate'>
									{issue.title}
								</h3>
								<div className='flex flex-wrap gap-2 mb-2'>
									<Badge
										className={getCategoryColor(
											issue.category
										)}
									>
										{issue.category}
									</Badge>
									{issue.is_resolved ? (
										<Badge
											variant='outline'
											className='text-green-600 border-green-600'
										>
											<CheckCircle2 className='w-3 h-3 mr-1' />
											Resolved
										</Badge>
									) : (
										<Badge
											variant='outline'
											className='text-orange-600 border-orange-600'
										>
											<Clock className='w-3 h-3 mr-1' />
											In Progress
										</Badge>
									)}
								</div>
							</div>
						</div>

						<p className='text-sm text-muted-foreground mb-3 line-clamp-2'>
							{issue.description}
						</p>

						<div className='flex flex-wrap gap-4 text-sm text-muted-foreground'>
							<div className='flex items-center gap-1'>
								<MapPin className='w-4 h-4' />
								<span className='truncate max-w-[200px]'>
									{issue.address}
								</span>
							</div>
							<div className='flex items-center gap-1'>
								<Calendar className='w-4 h-4' />
								<span>{formatDate(issue.created_at)}</span>
							</div>
						</div>

						{showComments &&
							issue.user_comments &&
							issue.user_comments.length > 0 && (
								<div className='mt-3 p-3 bg-muted rounded-lg'>
									<p className='text-xs font-semibold text-muted-foreground mb-2'>
										Your Comments:
									</p>
									{issue.user_comments.map((comment) => (
										<div
											key={comment.id}
											className='mb-2 last:mb-0'
										>
											<p className='text-sm'>
												{comment.text}
											</p>
											<p className='text-xs text-muted-foreground mt-1'>
												{formatDate(comment.created_at)}
											</p>
										</div>
									))}
								</div>
							)}

						<Separator className='my-3' />

						<div className='flex flex-wrap gap-4 text-sm'>
							<div className='flex items-center gap-1 text-muted-foreground'>
								<Heart className='w-4 h-4' />
								<span>{issue.likes_count} likes</span>
							</div>
							<div className='flex items-center gap-1 text-muted-foreground'>
								<MessageSquare className='w-4 h-4' />
								<span>{issue.comments_count} comments</span>
							</div>
							<div className='flex items-center gap-1 text-muted-foreground'>
								<ImageIcon className='w-4 h-4' />
								<span>{issue.images.length} images</span>
							</div>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);

	if (authLoading || (storeLoading && !profileData) || !profileData) {
		return (
			<div className='flex items-center justify-center min-h-screen'>
				<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
			</div>
		);
	}

	const { user, reported_issues, liked_issues, commented_issues, stats } =
		profileData;

	return (
		<div className='container mx-auto px-4 py-8 max-w-7xl'>
			{/* Profile Header */}
			<Card className='mb-6'>
				<CardContent className='pt-6'>
					<div className='flex flex-col md:flex-row items-center md:items-start gap-6'>
						<div className='relative'>
							<Avatar className='w-32 h-32'>
								<AvatarImage
									src={user.profile_pic || undefined}
									alt={user.full_name}
								/>
								<AvatarFallback className='text-3xl'>
									{user.first_name[0]}
									{user.last_name[0]}
								</AvatarFallback>
							</Avatar>
							<div className='absolute bottom-0 right-0 w-8 h-8 bg-green-500 rounded-full border-4 border-background'></div>
						</div>

						<div className='flex-1 text-center md:text-left'>
							<h1 className='text-3xl font-bold mb-1'>
								{user.full_name}
							</h1>
							<p className='text-muted-foreground mb-2'>
								{user.email}
							</p>
							<p className='text-sm text-muted-foreground mb-4'>
								{user.phone_number}
							</p>

							<div className='flex flex-wrap gap-2 justify-center md:justify-start'>
								<Button size='sm'>
									<Edit className='w-4 h-4 mr-2' />
									Edit Profile
								</Button>
								<Button size='sm' variant='outline'>
									<Settings className='w-4 h-4 mr-2' />
									Settings
								</Button>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Stats Grid */}
			<div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-6'>
				<Card>
					<CardHeader className='pb-3'>
						<CardTitle className='text-sm font-medium text-muted-foreground'>
							Reported
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='text-3xl font-bold text-blue-600 dark:text-blue-400'>
							{stats.total_issues_reported}
						</div>
						<p className='text-xs text-muted-foreground mt-1'>
							Issues
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className='pb-3'>
						<CardTitle className='text-sm font-medium text-muted-foreground'>
							Liked
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='text-3xl font-bold text-red-600 dark:text-red-400'>
							{stats.total_issues_liked}
						</div>
						<p className='text-xs text-muted-foreground mt-1'>
							Issues
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className='pb-3'>
						<CardTitle className='text-sm font-medium text-muted-foreground'>
							Comments
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='text-3xl font-bold text-green-600 dark:text-green-400'>
							{stats.total_comments_made}
						</div>
						<p className='text-xs text-muted-foreground mt-1'>
							Made
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className='pb-3'>
						<CardTitle className='text-sm font-medium text-muted-foreground'>
							Images
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='text-3xl font-bold text-purple-600 dark:text-purple-400'>
							{stats.total_images_added}
						</div>
						<p className='text-xs text-muted-foreground mt-1'>
							Uploaded
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Tabs Section */}
			<Tabs defaultValue='reported' className='w-full'>
				<TabsList className='grid w-full grid-cols-2 md:w-auto md:inline-grid'>
					<TabsTrigger value='reported'>
						My Reports ({reported_issues.count})
					</TabsTrigger>
					<TabsTrigger value='activity'>Activity</TabsTrigger>
				</TabsList>

				<TabsContent value='reported' className='space-y-4 mt-6'>
					{reported_issues.issues.length === 0 ? (
						<Card>
							<CardContent className='flex flex-col items-center justify-center py-12'>
								<p className='text-muted-foreground'>
									No issues reported yet
								</p>
							</CardContent>
						</Card>
					) : (
						reported_issues.issues.map((issue) =>
							renderIssueCard(issue)
						)
					)}
				</TabsContent>

				<TabsContent value='activity' className='mt-6'>
					<div className='space-y-6'>
						{/* My Likes Section */}
						<Card>
							<CardHeader>
								<CardTitle className='flex items-center gap-2'>
									<Heart className='w-5 h-5 text-red-500' />
									My Likes ({liked_issues.count})
								</CardTitle>
							</CardHeader>
							<CardContent>
								{liked_issues.issues.length === 0 ? (
									<p className='text-muted-foreground text-center py-8'>
										No liked issues yet
									</p>
								) : (
									<div className='space-y-4'>
										{liked_issues.issues.map((issue) =>
											renderIssueCard(issue)
										)}
									</div>
								)}
							</CardContent>
						</Card>

						{/* My Comments Section */}
						<Card>
							<CardHeader>
								<CardTitle className='flex items-center gap-2'>
									<MessageSquare className='w-5 h-5 text-blue-500' />
									My Comments ({commented_issues.count})
								</CardTitle>
							</CardHeader>
							<CardContent>
								{commented_issues.issues.length === 0 ? (
									<p className='text-muted-foreground text-center py-8'>
										No comments made yet
									</p>
								) : (
									<div className='space-y-4'>
										{commented_issues.issues.map((issue) =>
											renderIssueCard(issue, true)
										)}
									</div>
								)}
							</CardContent>
						</Card>

						{/* Activity Summary */}
						<Card>
							<CardHeader>
								<CardTitle>Activity Summary</CardTitle>
							</CardHeader>
							<CardContent>
								<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
									<div className='p-4 bg-muted rounded-lg'>
										<div className='flex items-center gap-3'>
											<div className='p-2 bg-blue-500/10 rounded-lg'>
												<MessageSquare className='w-6 h-6 text-blue-500' />
											</div>
											<div>
												<p className='text-2xl font-bold'>
													{stats.total_comments_made}
												</p>
												<p className='text-sm text-muted-foreground'>
													Total Comments
												</p>
											</div>
										</div>
									</div>
									<div className='p-4 bg-muted rounded-lg'>
										<div className='flex items-center gap-3'>
											<div className='p-2 bg-red-500/10 rounded-lg'>
												<Heart className='w-6 h-6 text-red-500' />
											</div>
											<div>
												<p className='text-2xl font-bold'>
													{stats.total_issues_liked}
												</p>
												<p className='text-sm text-muted-foreground'>
													Total Likes
												</p>
											</div>
										</div>
									</div>
									<div className='p-4 bg-muted rounded-lg'>
										<div className='flex items-center gap-3'>
											<div className='p-2 bg-purple-500/10 rounded-lg'>
												<ImageIcon className='w-6 h-6 text-purple-500' />
											</div>
											<div>
												<p className='text-2xl font-bold'>
													{stats.total_images_added}
												</p>
												<p className='text-sm text-muted-foreground'>
													Images Uploaded
												</p>
											</div>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default ProfilePage;
