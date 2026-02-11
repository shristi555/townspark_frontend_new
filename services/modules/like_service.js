import api from "../api.js";

const like_urls = {
	create: "/issues/likes/create/",
	toggle: "/issues/likes/toggle/",
	list: (id) => `/issues/likes/of/${id}/`,
};

const LikeService = {
	urls: like_urls,

	/**
	 * Get all likes for an issue
	 * @param {number} issue_id - Issue ID
	 * @returns {Promise} List of likes with user and timestamp
	 */
	async listLikes(issue_id) {
		return api.get(like_urls.list(issue_id));
	},

	/**
	 * Like an issue (one-time only)
	 * @param {Object} data - { issue_id: number }
	 * @returns {Promise} Success message or error if already liked
	 */
	async createLike(data) {
		return api.post(like_urls.create, data, {
			headers: {
				"Content-Type": "application/json",
			},
		});
	},

	/**
	 * Toggle like status on an issue
	 * @param {Object} data - { issue_id: number }
	 * @returns {Promise} { liked: boolean }
	 */
	async toggleLike(data) {
		return api.post(like_urls.toggle, data, {
			headers: {
				"Content-Type": "application/json",
			},
		});
	},
};

export default LikeService;
