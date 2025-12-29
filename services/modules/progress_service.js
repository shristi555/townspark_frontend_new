import api from "../api.js";

const progress_urls = {
	create: "/issues/progress/create/",
	list: (issue_id) => `/issues/progress/list/${issue_id}/`,
	detail: (progress_id) => `/issues/progress/${progress_id}/`,
	delete: (progress_id) => `/issues/progress/delete/${progress_id}/`,
};

/**
 * Service for managing progress updates on issues
 *
 * @description
 * This service handles all progress-related operations including creating, listing,
 * retrieving, and deleting progress updates for issues.
 *
 * All responses follow the SRE (Standard Response Envelope) format:
 * - `success` {boolean} - Indicates if the operation was successful
 * - `response` {*} - Contains the actual data (null if error occurred)
 * - `error` {string|null} - Contains error message if operation failed (null if successful)
 *
 * @example
 * // Example SRE format response
 * {
 *   "success": true,
 *   "response": [
 *     {
 *       "id": 3,
 *       "title": "Inspection done",
 *       "description": "Some municipal officer have came and done inspections",
 *       "updated_by": {
 *         "id": 8,
 *         "email": "strela500@gmail.com",
 *         "first_name": "Shristi",
 *         "last_name": "Poudel"
 *       },
 *       "created_at": "2025-12-29T16:15:45.329087Z"
 *     }
 *   ],
 *   "error": null
 * }
 *
 * @example
 * // Example error response
 * {
 *   "success": false,
 *   "response": null,
 *   "error": "Invalid issue ID provided"
 * }
 */
const ProgressService = {
	urls: progress_urls,

	/**
	 * Create a new progress update for an issue
	 * @param {Object} data - { issue_id: number, title: string, description: string }
	 * @returns {Promise} API response
	 *
	 * @description
	 * If the progress update is created successfully, the response will contain all the progress updates for that issue.
	 *
	 * @example
	 * // Success response example
	 * {
	 *   "success": true,
	 *   "response": [
	 *     {
	 *       "id": 3,
	 *       "title": "Inspection done",
	 *       "description": "Some municipal officer have came and done inspections",
	 *       "updated_by": {
	 *         "id": 8,
	 *         "email": "strela500@gmail.com",
	 *         "first_name": "Shristi",
	 *         "last_name": "Poudel"
	 *       },
	 *       "created_at": "2025-12-29T16:15:45.329087Z"
	 *     },
	 *     {
	 *       "id": 2,
	 *       "title": "Inspection done",
	 *       "description": "Some municipal officer have came and done inspections",
	 *       "updated_by": {
	 *         "id": 8,
	 *         "email": "strela500@gmail.com",
	 *         "first_name": "Shristi",
	 *         "last_name": "Poudel"
	 *       },
	 *       "created_at": "2025-12-29T16:11:19.659268Z"
	 *     }
	 *   ],
	 *   "error": null
	 * }
	 *
	 * @note
	 * This follows the SRE (Standard Response Envelope) format:
	 * - `success` {boolean} - Indicates operation status
	 * - `response` {Array} - List of all progress updates for the issue
	 * - `error` {string|null} - Error message if operation failed (null if successful)
	 */

	async createProgress(data) {
		return api.post(progress_urls.create, data, {
			headers: {
				"Content-Type": "application/json",
			},
		});
	},

	/**
	 * Get all progress updates for an issue
	 * @param {number} issue_id - Issue ID
	 * @returns {Promise} List of progress updates
	 * 	 * @example
	 * // Success response example
	 * {
	 *   "success": true,
	 *   "response": [
	 *     {
	 *       "id": 3,
	 *       "title": "Inspection done",
	 *       "description": "Some municipal officer have came and done inspections",
	 *       "updated_by": {
	 *         "id": 8,
	 *         "email": "strela500@gmail.com",
	 *         "first_name": "Shristi",
	 *         "last_name": "Poudel"
	 *       },
	 *       "created_at": "2025-12-29T16:15:45.329087Z"
	 *     },
	 *     {
	 *       "id": 2,
	 *       "title": "Inspection done",
	 *       "description": "Some municipal officer have came and done inspections",
	 *       "updated_by": {
	 *         "id": 8,
	 *         "email": "strela500@gmail.com",
	 *         "first_name": "Shristi",
	 *         "last_name": "Poudel"
	 *       },
	 *       "created_at": "2025-12-29T16:11:19.659268Z"
	 *     }
	 *   ],
	 *   "error": null
	 * }
	 *
	 * @note
	 * This follows the SRE (Standard Response Envelope) format:
	 * - `success` {boolean} - Indicates operation status
	 * - `response` {Array} - List of all progress updates for the issue
	 * - `error` {string|null} - Error message if operation failed (null if successful)
	 *
	 */
	async listProgress(issue_id) {
		return api.get(progress_urls.list(issue_id));
	},

	/**
	 * Get a specific progress update
	 * @param {number} progress_id - Progress ID
	 * @returns {Promise} Progress update object
	 *
	 * 	 * @example
	 * // Success response example
	 * {
	 *   "success": true,
	 *   "response":
	 *     {
	 *       "id": 3,
	 *       "title": "Inspection done",
	 *       "description": "Some municipal officer have came and done inspections",
	 *       "updated_by": {
	 *         "id": 8,
	 *         "email": "strela500@gmail.com",
	 *         "first_name": "Shristi",
	 *         "last_name": "Poudel"
	 *       },
	 *       "created_at": "2025-12-29T16:15:45.329087Z"
	 *    },
	 *   "error": null
	 * }
	 *
	 * @note
	 * This follows the SRE (Standard Response Envelope) format:
	 * - `success` {boolean} - Indicates operation status
	 * - `response` {Array} - List of all progress updates for the issue
	 * - `error` {string|null} - Error message if operation failed (null if successful)
	 */
	async getProgress(progress_id) {
		return api.get(progress_urls.detail(progress_id));
	},

	/**
	 * Delete a progress update
	 * @param {number} progress_id - Progress ID
	 * @returns {Promise} Success message
	 */
	async deleteProgress(progress_id) {
		return api.delete(progress_urls.delete(progress_id));
	},
};

export default ProgressService;
