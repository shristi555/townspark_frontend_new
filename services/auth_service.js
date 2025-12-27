import api from "./api.js";

const urls = {
	LOGIN: "/auth/login/",
	REGISTER: "/auth/register/",
	MYINFO: "/auth/me/",
	REFRESH: "/auth/token/refresh/",
	VERIFY: "/auth/token/verify/",
	LOGOUT: "/auth/logout/",
};

const AuthService = {
	login(email, password) {
		return api.post(urls.LOGIN, {
			email: email,
			password: password,
		});
	},

	register(formData) {
		// Convert FormData to object
		const data = Object.fromEntries(formData.entries());

		return api.post(urls.REGISTER, {
			first_name: data.first_name,
			last_name: data.last_name,
			email: data.email,
			password: data.password,
			phone_number: data.phone_number || null,
		});
	},

	validateRegisterData(formData) {
		// Convert FormData to plain object
		const data = Object.fromEntries(formData.entries());

		console.log("Validating data:", data);

		const errors = {};

		// Check mandatory fields
		if (!data.first_name || data.first_name.trim() === "") {
			errors.first_name = "First name is required";
		}

		if (!data.email || data.email.trim() === "") {
			errors.email = "Email is required";
		}

		if (!data.password || data.password.trim() === "") {
			errors.password = "Password is required";
		}

		// Check terms acceptance
		if (!data.terms || data.terms !== "on") {
			errors.terms = "You must agree to the terms and conditions";
		}

		const generalMessage = Object.values(errors).join(", and, ");

		// delete individual field errors if there is a general message
		if (generalMessage) {
			errors.general = generalMessage;
			delete errors.first_name;
			delete errors.last_name;
			delete errors.email;
			delete errors.phone_number;
			delete errors.password;
		}

		return Object.keys(errors).length === 0 ? null : errors;
	},

	validateLoginData(formData) {
		const data = Object.fromEntries(formData.entries());
		const errors = {};

		if (!data.email || data.email.trim() === "") {
			errors.email = "Email is required";
		}

		if (!data.password || data.password.trim() === "") {
			errors.password = "Password is required";
		}

		return Object.keys(errors).length === 0 ? null : errors;
	},

	refreshToken() {
		return api.post(urls.REFRESH);
	},

	verifyToken() {
		return api.post(urls.VERIFY);
	},

	getMyInfo() {
		return api.get(urls.MYINFO);
	},

	logout() {
		return api.post(urls.LOGOUT);
	},
};

export default AuthService;
