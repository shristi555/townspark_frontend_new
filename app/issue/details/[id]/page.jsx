"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import IssueService from "@/services/issue_service";
import IssueDetails from "@/components/issue/issue-details";
import IssueDetailsSkeleton from "@/components/issue/issue-details-skeleton";

export default function IssueDetailsPage() {
	const params = useParams();
	const router = useRouter();
	const [issue, setIssue] = useState(null);
	const [loading, setLoading] = useState(true);
	const [myUserId, setMyUserId] = useState(null);

	useEffect(() => {
		const fetchIssueDetails = async () => {
			try {
				const response = await IssueService.getIssueDetails(params.id);
				if (response.success) {
					setIssue(response.response);
					if (response.response.requesting_user_id) {
						setMyUserId(response.response.requesting_user_id);
					}
				}
			} catch (error) {
				console.error("Error fetching issue details:", error);
				toast.error("Failed to load issue details");
				router.push("/issue/mine");
			} finally {
				setLoading(false);
			}
		};

		if (params.id) {
			fetchIssueDetails();
		}
	}, [params.id, router]);

	const handleBack = () => {
		router.back();
	};

	const handleDelete = async () => {
		try {
			await IssueService.deleteIssue(params.id);
			toast.success("Issue deleted successfully");
			router.push("/issue/mine");
		} catch (error) {
			console.error("Error deleting issue:", error);
			toast.error("Failed to delete issue");
		}
	};

	const handleDeleteCancel = () => {
		// No action needed, dialog will close automatically
		toast.info("Issue deletion cancelled");
	};

	const handleAddComment = async (comment) => {
		try {
			const formData = new FormData();
			formData.append("issue_id", params.id);
			formData.append("text", comment);

			await IssueService.postIssueComment(formData);
			toast.success("Comment added successfully");

			// Refresh issue details
			const response = await IssueService.getIssueDetails(params.id);
			if (response.success) {
				setIssue(response.response);
			}
		} catch (error) {
			console.error("Error adding comment:", error);
			toast.error("Failed to add comment");
		}
	};

	const handleToggleLike = async () => {
		try {
			const formData = new FormData();
			formData.append("issue_id", params.id);

			await IssueService.toggleIssueLike(formData);

			// Refresh issue details
			const response = await IssueService.getIssueDetails(params.id);
			if (response.success) {
				setIssue(response.response);
			}
		} catch (error) {
			console.error("Error toggling like:", error);
			toast.error("Failed to update like");
		}
	};

	if (loading) {
		return <IssueDetailsSkeleton />;
	}

	if (!issue) {
		return null;
	}

	return (
		<IssueDetails
			issue={issue}
			requesting_user_id={myUserId}
			onDeleteIssue={handleDelete}
			onDeleteCancel={handleDeleteCancel}
			onBack={handleBack}
			onAddComment={handleAddComment}
			onToggleLike={handleToggleLike}
		/>
	);
}
