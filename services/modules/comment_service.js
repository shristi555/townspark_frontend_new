import api from "../api.js";

const comment_urls = {
	create: "/issues/comments/create/",
	list: (id) => `/issues/comments/of/${id}/`,
	delete: (id) => `/issues/comments/delete/${id}/`,
};

const CommentService = {
	urls: comment_urls,

	/**
	 * Get all comments for an issue
	 * @param {number} issue_id - Issue ID
	 * @returns {Promise} List of comments
	 */
	async listComments(issue_id) {
		return api.get(comment_urls.list(issue_id));
	},

	/**
	 * Create a new comment on an issue
	 * @param {Object} data - { issue_id: number, text: string }
	 * @returns {Promise} Success message
	 */
	async createComment(data) {
		return api.post(comment_urls.create, data, {
			headers: {
				"Content-Type": "application/json",
			},
		});
	},

	/**
	 * Delete a comment
	 * @param {number} comment_id - Comment ID
	 * @returns {Promise} 204 No Content on success
	 */
	async deleteComment(comment_id) {
		return api.delete(comment_urls.delete(comment_id));
	},
};

export default CommentService;
