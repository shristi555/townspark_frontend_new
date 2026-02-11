import IssueDataValidator from "./validators/issue-data-validator.js";
import CoreIssueService from "./modules/core_issue_service.js";
import CommentService from "./modules/comment_service.js";
import LikeService from "./modules/like_service.js";
import ProgressService from "./modules/progress_service.js";

// Combined URLs object for easy access
const urls = {
	// Issue URLs
	...CoreIssueService.urls,

	// Comment URLs
	comments: CommentService.urls.list,
	createComment: CommentService.urls.create,
	deleteComment: CommentService.urls.delete,

	// Like URLs
	createLike: LikeService.urls.create,
	toggleLike: LikeService.urls.toggle,
	likes: LikeService.urls.list,

	// Progress URLs
	createProgress: ProgressService.urls.create,
	progressList: ProgressService.urls.list,
	issueProgress: ProgressService.urls.detail,
	deleteProgress: ProgressService.urls.delete,

	// Organized by resource type
	get_for: {
		issue: CoreIssueService.urls,
		comment: CommentService.urls,
		like: LikeService.urls,
		progress: ProgressService.urls,
	},
};

console.log("IssueService URLs:", JSON.stringify(urls, null, 5));

/**
 * Unified Issue Service - handles all issue-related operations
 * Includes: Issues, Comments, Likes, and Progress Updates
 */
const IssueService = {
	// Expose URLs for external usage
	urls: urls,

	// Expose validator for convenience
	validator: IssueDataValidator,

	// Expose modular services
	modules: {
		issue: CoreIssueService,
		comment: CommentService,
		like: LikeService,
		progress: ProgressService,
	},

	//  ISSUE METHODS

	/**
	 * Create a new issue with images
	 * @param {FormData} formData - Must include: title, description, category, uploaded_images (1-10 files)
	 */
	async createIssue(formData) {
		return CoreIssueService.createIssue(formData);
	},

	/**
	 * Get all issues reported by the authenticated user
	 */
	async getMyIssues() {
		return CoreIssueService.getMyIssues();
	},

	/**
	 * Get detailed information about a specific issue
	 * @param {number} issue_id - Issue ID
	 */
	async getIssueDetails(issue_id) {
		return CoreIssueService.getIssueDetails(issue_id);
	},

	/**
	 * Get issue by ID (basic info)
	 * @param {number} issue_id - Issue ID
	 */
	async getIssueById(issue_id) {
		return CoreIssueService.getIssueById(issue_id);
	},

	/**
	 * Update an existing issue
	 * @param {number} issue_id - Issue ID
	 * @param {FormData|Object} data - Fields to update
	 */
	async updateIssue(issue_id, data) {
		return CoreIssueService.updateIssue(issue_id, data);
	},

	/**
	 * Delete an issue (owner or staff only)
	 * @param {number} issue_id - Issue ID
	 */
	async deleteIssue(issue_id) {
		return CoreIssueService.deleteIssue(issue_id);
	},

	/**
	 * Archive an issue (admin or creator only)
	 * @param {number} issue_id - Issue ID
	 */
	async archiveIssue(issue_id) {
		return CoreIssueService.archiveIssue(issue_id);
	},

	/**
	 * Unarchive an issue (admin or creator only)
	 * @param {number} issue_id - Issue ID
	 */
	async unarchiveIssue(issue_id) {
		return CoreIssueService.unarchiveIssue(issue_id);
	},

	// COMMENT METHODS

	/**
	 * Get all comments for an issue
	 * @param {number} issue_id - Issue ID
	 */
	async getIssueComments(issue_id) {
		return CommentService.listComments(issue_id);
	},

	/**
	 * Create a new comment on an issue
	 * @param {Object|FormData} data - { issue_id: number, text: string }
	 */
	async postIssueComment(data) {
		// Support both FormData and plain objects
		const commentData =
			data instanceof FormData
				? Object.fromEntries(data.entries())
				: data;
		return CommentService.createComment(commentData);
	},

	/**
	 * Delete a comment
	 * @param {number} comment_id - Comment ID
	 */
	async deleteIssueComment(comment_id) {
		return CommentService.deleteComment(comment_id);
	},

	//  LIKE METHODS

	/**
	 * Get all likes for an issue
	 * @param {number} issue_id - Issue ID
	 */
	async getIssueLikes(issue_id) {
		return LikeService.listLikes(issue_id);
	},

	/**
	 * Like an issue (one-time only)
	 * @param {Object|FormData} data - { issue_id: number }
	 */
	async createIssueLike(data) {
		const likeData =
			data instanceof FormData
				? Object.fromEntries(data.entries())
				: data;
		return LikeService.createLike(likeData);
	},

	/**
	 * Toggle like status on an issue
	 * @param {Object|FormData} data - { issue_id: number }
	 */
	async toggleIssueLike(data) {
		const likeData =
			data instanceof FormData
				? Object.fromEntries(data.entries())
				: data;
		return LikeService.toggleLike(likeData);
	},

	//  PROGRESS METHODS

	/**
	 * Create a new progress update for an issue
	 * @param {Object} data - { issue_id: number, title: string, description: string }
	 *
	 * @requestformat
	 *
	 *  **Request Format (multipart/form-data):**
	 *	- issue_id: integer (required)
	 *	- title: string (required)
	 *	- description: string (required)
	 *	- uploaded_images: file[] (optional, max 10)
	 *
	 *
	 */
	async createIssueProgress(data) {
		return ProgressService.createProgress(data);
	},

	/**
	 * Get all progress updates for an issue
	 * @param {number} issue_id - Issue ID
	 */
	async listIssueProgress(issue_id) {
		return ProgressService.listProgress(issue_id);
	},

	/**
	 * Get a specific progress update
	 * @param {number} progress_id - Progress ID
	 */
	async getIssueProgress(progress_id) {
		return ProgressService.getProgress(progress_id);
	},

	/**
	 * Delete a progress update
	 * @param {number} progress_id - Progress ID
	 */
	async deleteIssueProgress(progress_id) {
		return ProgressService.deleteProgress(progress_id);
	},

	async fetchCategories() {
		return CoreIssueService.fetchCategories();
	}


};

export default IssueService;
