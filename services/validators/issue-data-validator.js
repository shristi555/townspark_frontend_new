const IssueDataValidator = {
	validateIssueCreateData(formData) {
		const errors = {};

		// Get title, description, category, address from formData
		const title = formData.get("title");
		const description = formData.get("description");
		const category = formData.get("category");
		const address = formData.get("address");

		// Get all uploaded images
		const images = formData.getAll("uploaded_images");

		// Validate title
		if (!title || title.trim() === "") {
			errors.title = "Title is required";
		} else if (title.length < 5) {
			errors.title = "Title must be at least 5 characters";
		} else if (title.length > 200) {
			errors.title = "Title must not exceed 200 characters";
		}

		// Validate description
		if (!description || description.trim() === "") {
			errors.description = "Description is required";
		} else if (description.length < 10) {
			errors.description = "Description must be at least 10 characters";
		}

		// Validate category
		if (!category || category.trim() === "") {
			errors.category = "Category is required";
		}

		// Validate images
		if (!images || images.length === 0) {
			errors.uploaded_images = "At least 1 image is required";
		} else if (images.length > 10) {
			errors.uploaded_images = "Maximum 10 images allowed";
		} else {
			// Validate each image
			const validImageTypes = [
				"image/jpeg",
				"image/jpg",
				"image/png",
				"image/webp",
			];
			const maxFileSize = 5 * 1024 * 1024; // 5MB

			for (let i = 0; i < images.length; i++) {
				const image = images[i];

				if (!validImageTypes.includes(image.type)) {
					errors.uploaded_images =
						"Only JPEG, PNG, and WebP images are allowed";
					break;
				}

				if (image.size > maxFileSize) {
					errors.uploaded_images = `Image ${i + 1} exceeds 5MB size limit`;
					break;
				}
			}
		}

		return Object.keys(errors).length === 0 ? null : errors;
	},

	validateIssueUpdateData(formData) {
		const errors = {};

		const title = formData.get("title");
		const description = formData.get("description");
		const category = formData.get("category");
		const images = formData.getAll("uploaded_images");

		// Optional validation - only validate if provided
		if (title !== null && title !== undefined) {
			if (title.trim() === "") {
				errors.title = "Title cannot be empty";
			} else if (title.length < 5) {
				errors.title = "Title must be at least 5 characters";
			} else if (title.length > 200) {
				errors.title = "Title must not exceed 200 characters";
			}
		}

		if (description !== null && description !== undefined) {
			if (description.trim() === "") {
				errors.description = "Description cannot be empty";
			} else if (description.length < 10) {
				errors.description =
					"Description must be at least 10 characters";
			}
		}

		if (
			category !== null &&
			category !== undefined &&
			category.trim() === ""
		) {
			errors.category = "Category cannot be empty";
		}

		if (images && images.length > 0) {
			if (images.length > 10) {
				errors.uploaded_images = "Maximum 10 images allowed";
			} else {
				const validImageTypes = [
					"image/jpeg",
					"image/jpg",
					"image/png",
					"image/webp",
				];
				const maxFileSize = 5 * 1024 * 1024;

				for (let i = 0; i < images.length; i++) {
					const image = images[i];

					if (!validImageTypes.includes(image.type)) {
						errors.uploaded_images =
							"Only JPEG, PNG, and WebP images are allowed";
						break;
					}

					if (image.size > maxFileSize) {
						errors.uploaded_images = `Image ${i + 1} exceeds 5MB size limit`;
						break;
					}
				}
			}
		}

		return Object.keys(errors).length === 0 ? null : errors;
	},

	validateCommentData(formData) {
		const data = Object.fromEntries(formData.entries());
		const errors = {};

		if (!data.issue_id) {
			errors.issue_id = "Issue ID is required";
		}

		if (!data.content || data.content.trim() === "") {
			errors.content = "Comment content is required";
		} else if (data.content.length < 2) {
			errors.content = "Comment must be at least 2 characters";
		}

		return Object.keys(errors).length === 0 ? null : errors;
	},

	validateLikeData(formData) {
		const data = Object.fromEntries(formData.entries());
		const errors = {};

		if (!data.issue_id) {
			errors.issue_id = "Issue ID is required";
		}

		return Object.keys(errors).length === 0 ? null : errors;
	},
};

export default IssueDataValidator;
