"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import IssueService from "@/services/issue_service";
import IssueCreateForm from "@/components/issue/issue-create-form";

export default function CreateIssuePage() {
	const router = useRouter();
	const [errors, setErrors] = useState(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = useCallback(
		async (event, modifiedFormData) => {
			event.preventDefault();
			setIsSubmitting(true);
			setErrors(null);

			// Use the modified FormData passed from the form component
			const formData = modifiedFormData;

			console.log("Form data keys:", [...formData.keys()]);
			console.log(
				"Form data entries:",
				Object.fromEntries(formData.entries())
			);
			console.log(
				"Images in FormData:",
				formData.getAll("uploaded_images")
			);
			console.log(
				"Images count:",
				formData.getAll("uploaded_images").length
			);

			// Validate form data
			const validationErrors =
				IssueService.validator.validateIssueCreateData(formData);
			if (validationErrors) {
				console.log("Validation errors:", validationErrors);
				setErrors(validationErrors);
				setIsSubmitting(false);
				toast.error("Please fix the errors before submitting");
				return;
			}

			try {
				const response = await IssueService.createIssue(formData);
				// console.log("Issue creation response:", response);
				if (response.success) {
					toast.success("Issue reported successfully!");
					router.push("/issue/mine");
				}
			} catch (error) {
				console.error("Issue creation error:", error);

				// Extract error message from different formats
				let errorMessage = "Failed to create issue";
				let errorDetails = error;

				if (typeof error === "object" && error !== null) {
					if (error.message) {
						// Handle API error format
						if (typeof error.message === "string") {
							errorMessage = error.message;
						} else if (typeof error.message === "object") {
							// If message is an object, try to extract useful info
							const messages = Object.values(error.message)
								.flat()
								.filter((msg) => typeof msg === "string");
							if (messages.length > 0) {
								errorMessage = messages[0];
							}
						} else if (Array.isArray(error.message)) {
							errorMessage = error.message[0] || errorMessage;
						}
						errorDetails = error;
					} else if (error.type) {
						// Handle error with type but no message
						errorMessage = error.type.replace(/_/g, " ");
						errorDetails = error;
					}
				} else if (typeof error === "string") {
					errorMessage = error;
					errorDetails = error;
				}

				toast.error(errorMessage);
				setErrors({ general: errorDetails });
			} finally {
				setIsSubmitting(false);
			}
		},
		[router]
	);

	return (
		<div className='min-h-screen bg-gradient-to-br from-background via-background to-muted/20'>
			<div className='container mx-auto px-4 py-8 max-w-4xl'>
				<IssueCreateForm
					onSubmit={handleSubmit}
					validationError={errors}
					isSubmitting={isSubmitting}
				/>
			</div>
		</div>
	);
}
