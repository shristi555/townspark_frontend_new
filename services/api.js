import axios from "axios";

// The auth is cookie based, so we need to ensure that
// withCredentials is set to true for cross-origin requests.
const api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL,
	timeout: 10000,
	withCredentials: true,
	headers: {
		"Content-Type": "application/json",
	},
});

function handleSuccessResponse(response) {
	const gotData = response.data;
	console.log("API Response:", gotData);

	if (typeof gotData?.success !== "boolean") {
		return Promise.reject("Invalid response format");
	}

	if (gotData.success === false) {
		return Promise.reject(gotData.error || "Something went wrong");
	}

	return gotData;
}

async function handleErrorResponse(error) {
	const originalRequest = error.config;
	const response = error?.response;

	console.error("API Error Response:", response);

	if (!response || !response.data) {
		return Promise.reject("Network error or server not reachable");
	}

	const data = response.data;

	if (typeof data.success !== "boolean") {
		return Promise.reject("Invalid error response format");
	}

	if (data.error) {
		if (typeof data.error === "string") {
			return Promise.reject(data.error);
		}

		if (typeof data.error === "object") {
			if (data.error.message) {
				return Promise.reject(data.error.message);
			}

			return Promise.reject(JSON.stringify(data.error));
		}
	}

	return Promise.reject("Unexpected server error");
}

api.interceptors.response.use(handleSuccessResponse, handleErrorResponse);

export default api;
