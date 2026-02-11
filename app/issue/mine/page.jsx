"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import IssueService from "@/services/issue_service";
import IssueList from "@/components/issue/issue-list";
import IssueListSkeleton from "@/components/issue/issue-list-skeleton";

export default function IssueMinePage() {
	const router = useRouter();
	const [issues, setIssues] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchIssues = async () => {
			try {
				const response = await IssueService.getMyIssues();
				if (response.success) {
					setIssues(response.response || []);
				}
			} catch (error) {
				console.error("Error fetching issues:", error);
				toast.error("Failed to load issues");
			} finally {
				setLoading(false);
			}
		};

		fetchIssues();
	}, []);

	const handleIssueClick = (issueId) => {
		router.push(`/issue/details/${issueId}`);
	};

	const handleCreateNew = () => {
		router.push("/issue/create");
	};

	if (loading) {
		return <IssueListSkeleton />;
	}

	return (
		<IssueList
			issues={issues}
			onIssueClick={handleIssueClick}
			onCreateNew={handleCreateNew}
		/>
	);
}
