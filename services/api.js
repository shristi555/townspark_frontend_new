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
	// console.log("API Response:", gotData);

	if (typeof gotData?.success !== "boolean") {
		return Promise.reject("Invalid response format");
	}

	if (gotData.success === false) {
		return Promise.reject(gotData.error || "Something went wrong");
	}

	return gotData;
}

async function handleErrorResponse(error) {
	/*
	The backend is consistent in sending the error responses in the format:
	{
		success: false,
		error: {
			type : <error type like 'validation_error' but dont rely on it just yet>,	
			message: <the error message can be string or object>,
			message_type : <especifies what type of message it is like 'string' or 'list' or 'object' this is quite reliable then the 'type' field it was extracted using pythons type() function so string maybe called 'str' or 'string' etc be aware>,
		}
	}

	We now have a consistent format for error responses too, so we can parse them accordingly.

	*/

	const response = error?.response;
	console.log("API Error Response:", response);

	if (!response || !response.data) {
		return Promise.reject("Network error or server not reachable");
	}

	const recieveeData = response.data;

	if (typeof recieveeData.success !== "boolean") {
		return Promise.reject("Invalid error response format");
	}

	// it will always be a object here
	let extractedError;
	if (recieveeData.success === false) {
		extractedError = recieveeData.error;
	}

	// let errorMessage = "An error occurred";
	// if (extractedError) {
	// 	if (typeof extractedError.message === "string") {
	// 		errorMessage = extractedError.message;
	// 	} else if (typeof extractedError.message === "object") {
	// 		// dont hassle anything just stringify it and return
	// 		errorMessage = JSON.stringify(extractedError.message);
	// 	}
	// }

	return Promise.reject({
		type: extractedError?.type,
		message: extractedError?.message,
		message_type: extractedError?.message_type,
	});
}

api.interceptors.response.use(handleSuccessResponse, handleErrorResponse);

export default api;
