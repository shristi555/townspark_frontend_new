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
		return api.post(urls.REGISTER, {
			first_name: formData.first_name,
			last_name: formData.last_name,
			email: formData.email,
			password: formData.password,
		});
	},

	validateRegisterData(formData) {
		const expectedFields = [
			"email",
			"first_name",
			"last_name",
			"password",
			"phone_number",
			"profile_pic",
		];
		const mandatoryFields = ["email", "first_name", "password"];
		const errors = {
			unexpected: [],
		};

		// look for formdata fields and check if mandatory fields are present
		for (const key of Object.keys(formData)) {
			if (!expectedFields.includes(key)) {
				errors["unexpected"].push(key);
			} else {
				// mandatory fields cannot be empty
				if (
					mandatoryFields.includes(key) &&
					(!formData[key] || formData[key].trim() === "")
				) {
					errors[key] = "this field cannot be empty";
				}
			}
		}

		console.warn(
			"these fields were not expected in registration data:",
			errors.unexpected.join(", ")
		);
		return errors;
	},

	validateLoginData(formData) {
		const mandatoryFields = ["email", "password"];
		const errors = {};
		// look for formdata fields and check if mandatory fields are present
		for (const field of mandatoryFields) {
			if (!formData[field] || formData[field].trim() === "") {
				errors[field] = "this field cannot be empty";
			}
		}
		return errors;
	},

	/// tokens are auto generated and sent as cookies during login and register
	/// we just need to refresh them when they expire
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
