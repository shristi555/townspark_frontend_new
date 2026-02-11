"use client";

import { useEffect, useState, useCallback } from "react";
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

	const fetchIssueDetails = useCallback(async () => {
		try {
			const response = await IssueService.getIssueDetails(params.id);
			if (response.success) {
				setIssue(response.response);
			}
		} catch (error) {
			console.error("Error fetching issue details:", error);
			toast.error("Failed to load issue details");
			router.push("/issue/mine");
		} finally {
			setLoading(false);
		}
	}, [params.id, router]);

	useEffect(() => {
		if (params.id) {
			fetchIssueDetails();
		}
	}, [params.id, fetchIssueDetails]);

	const handleBack = () => {
		router.back();
	};

	const handleAddComment = async (comment) => {
		try {
			const formData = new FormData();
			formData.append("issue_id", params.id);
			formData.append("text", comment);

			await IssueService.postIssueComment(formData);
			toast.success("Comment added successfully");
			fetchIssueDetails();
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
			fetchIssueDetails();
		} catch (error) {
			console.error("Error toggling like:", error);
			toast.error("Failed to update like");
		}
	};

	const handleDeleteIssue = async () => {
		try {
			await IssueService.deleteIssue(params.id);
			toast.success("Issue deleted successfully");
			router.push("/issue/mine");
		} catch (error) {
			console.error("Error deleting issue:", error);
			toast.error("Failed to delete issue");
		}
	};
	
	const handleArchiveIssue = async () => {
		try {
			await IssueService.archiveIssue(params.id);
			toast.success("Issue archived successfully");
			router.push("/issue/mine"); // Or stay/refresh? Usually archive removes from list, so redirect or refresh knowing it might disappear from explore
		} catch (error) {
			console.error("Error archiving issue:", error);
			toast.error("Failed to archive issue");
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
			onBack={handleBack}
			onAddComment={handleAddComment}
			onToggleLike={handleToggleLike}
			onDeleteIssue={handleDeleteIssue}
			onArchiveIssue={handleArchiveIssue}
			onIssueUpdated={fetchIssueDetails}
		/>
	);
}
