import api from "../api.js";

const issue_urls = {
	create: "/issues/create/",
	mine: "/issues/mine/",
	detail: (issue_id) => `/issues/of/${issue_id}/`,
	update: (id) => `/issues/update/${id}/`,
	delete: (id) => `/issues/delete/${id}/`,
	archive: (issue_id) => `/issues/archive/${issue_id}/`,
	unarchive: (issue_id) => `/issues/unarchive/${issue_id}/`,
};

const CoreIssueService = {
	urls: issue_urls,

	/**
	 * Create a new issue with images
	 * @param {FormData} formData - Must include: title, description, category, uploaded_images (1-10 files)
	 * @returns {Promise} Created issue object
	 */
	async createIssue(formData) {
		return api.post(issue_urls.create, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
	},

	/**
	 * Get all issues reported by the authenticated user
	 * @returns {Promise} List of user's issues
	 * 
	 * @example
	 * // Success response example
	 * {
    "success": true,
    "response": [
        {
            "id": 4,
            "title": "Plothole issue",
            "description": "Serious issue of plothole in our area",
            "category": "road",
            "address": "belbari",
            "is_resolved": false,
            "reported_by": "strela500@gmail.com",
            "images": [
                {
                    "id": 5,
                    "image": "/media/issue_images/4/d93db9bf0a244c07a2ad03aa0704b7bf.jpg"
                },
                {
                    "id": 6,
                    "image": "/media/issue_images/4/8534c4577fdc46e98d9ddf99bcf3d200.jpg"
                },
                {
                    "id": 7,
                    "image": "/media/issue_images/4/7d853d1a72f04022b9718273241349af.jpg"
                }
            ],
            "comments_count": 1,
            "likes_count": 0,
            "progress_updates": [
                {
                    "id": 3,
                    "title": "Inspection done",
                    "description": "Some municipal officer have came and done inspections",
                    "updated_by": {
                        "id": 8,
                        "email": "strela500@gmail.com",
                        "first_name": "Shristi",
                        "last_name": "Poudel"
                    },
                    "created_at": "2025-12-29T16:15:45.329087Z"
                },
                {
                    "id": 2,
                    "title": "Inspection done",
                    "description": "Some municipal officer have came and done inspections",
                    "updated_by": {
                        "id": 8,
                        "email": "strela500@gmail.com",
                        "first_name": "Shristi",
                        "last_name": "Poudel"
                    },
                    "created_at": "2025-12-29T16:11:19.659268Z"
                },
                {
                    "id": 1,
                    "title": "Inspection done",
                    "description": "Some municipal officer have came and done inspections",
                    "updated_by": {
                        "id": 8,
                        "email": "strela500@gmail.com",
                        "first_name": "Shristi",
                        "last_name": "Poudel"
                    },
                    "created_at": "2025-12-29T16:07:46.616489Z"
                }
            ],
            "created_at": "2025-12-29T15:54:24.485317Z"
        }
    ],
    "error": null
}
	 * 
	 * @response_description
	 * success {boolean} - Indicates operation status
	 * response {Array} - List of issue objects reported by the user
	 * error {null} - No error occurred
	 * 
	 * @note
	 * inside the response array, each issue object contains:
	 * - id {number} - Issue ID
	 * - title {string} - Issue title
	 * - description {string} - Issue description
	 * - category {string} - Issue category
	 * - address {string} - Issue address
	 * - is_resolved {boolean} - Issue status
	 * - reported_by {string} - User who reported the issue
	 * - images {Array} - List of image objects associated with the issue
	 * - comments_count {number} - Number of comments on the issue
	 * - likes_count {number} - Number of likes on the issue
	 * - progress_updates {Array} - List of progress update objects associated with the issue
	 * - created_at {string} - Date and time when the issue was created
	 * 
	 * for details of comments and likes we should refer to their respective services.
	 * 
	 */
	async getMyIssues() {
		return api.get(issue_urls.mine);
	},

	/**
	 * Get detailed information about a specific issue
	 * @param {number} issue_id - Issue ID
	 * @returns {Promise} Detailed issue object
	 */
	async getIssueDetails(issue_id) {
		return api.get(issue_urls.detail(issue_id));
	},

	/**
	 * Update an existing issue
	 * @param {number} issue_id - Issue ID
	 * @param {FormData|Object} data - Fields to update (title, description, category, address, is_resolved)
	 * @returns {Promise} Updated issue object
	 */
	async updateIssue(issue_id, data) {
		const isFormData = data instanceof FormData;
		return api.put(issue_urls.update(issue_id), data, {
			headers: {
				"Content-Type": isFormData
					? "multipart/form-data"
					: "application/json",
			},
		});
	},

	/**
	 * Delete an issue (owner or staff only)
	 * @param {number} issue_id - Issue ID
	 * @returns {Promise} 204 No Content on success
	 *
	 *
	 *
	 */
	async deleteIssue(issue_id) {
		return api.delete(issue_urls.delete(issue_id));
	},

	/**
	 * Archive an issue (admin or creator only)
	 * @param {number} issue_id - Issue ID
	 * @returns {Promise} Success message with issue_id
	 */
	async archiveIssue(issue_id) {
		return api.post(issue_urls.archive(issue_id));
	},

	/**
	 * Unarchive an issue (admin or creator only)
	 * @param {number} issue_id - Issue ID
	 * @returns {Promise} Success message with issue_id
	 */
	async unarchiveIssue(issue_id) {
		return api.post(issue_urls.unarchive(issue_id));
	},

	async fetchCategories() {
		return api.get("/issues/category/list/");
	},
};

export default CoreIssueService;
