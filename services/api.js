import axios from "axios";

/**
 * Townspark API Client
 * 
 * Response Format (SRE Principle):
 * {
 *   success: boolean,
 *   response: data,
 *   error: {
 *     type: string,
 *     message: string | object,
 *     message_type: 'str' | 'dict' | 'list',
 *     reached_server: boolean
 *   }
 * }
 */

const api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL,
	timeout: 15000, // Increased timeout slightly
	withCredentials: true,
	headers: {
		"Content-Type": "application/json",
	},
});

/**
 * Standardizes the error object for the rest of the application
 */
function standardizeError(errorData, status = null, reachedServer = true) {
	return {
		type: errorData?.type || "unknown_error",
		message: errorData?.message || "An unexpected error occurred",
		message_type: errorData?.message_type || "str",
		status: status,
		reached_server: reachedServer,
	};
}

function handleSuccessResponse(response) {
	const data = response.data;

	if (typeof data?.success !== "boolean") {
		return Promise.reject(standardizeError({ message: "Invalid response format" }, response.status, true));
	}

	if (data.success === false) {
		// Even if 200 OK, if success is false, treat as error
		return Promise.reject(standardizeError(data.error, response.status, true));
	}

	// Success! Return the whole data object (which has {success, response, error})
	return data;
}

async function handleErrorResponse(error) {
	const response = error?.response;

	if (!response) {
		// Network error or timeout
		return Promise.reject(standardizeError({ 
			message: "Could not reach the server. Please check your connection." 
		}, null, false));
	}

	const data = response.data;

	if (data && typeof data.success === "boolean" && data.success === false) {
		return Promise.reject(standardizeError(data.error, response.status, true));
	}

	// Fallback for non-SRE compliant error responses (like 404 HTML or 500 error)
	return Promise.reject(standardizeError({ 
		message: `Server responded with status ${response.status}` 
	}, response.status, true));
}

api.interceptors.response.use(handleSuccessResponse, handleErrorResponse);

export default api;
