import useAuthStore from "@/store/auth_store";

/**
 * AuthService is now a wrapper around useAuthStore to maintain backward compatibility.
 * It is recommended to use useAuthStore directly in components.
 */
const AuthService = {
	login: (email, password) => useAuthStore.getState().login(email, password),
	register: (formData) => useAuthStore.getState().register(formData),
	logout: () => useAuthStore.getState().logout(),
	verifyToken: () => useAuthStore.getState().checkAuthStatus(true),
	refreshToken: () => useAuthStore.getState().refreshToken(),
	getMyInfo: async () => {
		const res = await useAuthStore.getState().fetchProfile();
		if (res.success) {
			// ProfilePage expects the SRE structure or something similar
			// Since res.data is the payload (response part of SRE), we wrap it back 
			// if the component does data.response.
			return { success: true, response: res.data };
		}
		throw res.error;
	},
	updateProfile: (formData) => useAuthStore.getState().updateProfile(formData),
	
	// Exposing validation logic if needed, although it's better to let the store/backend handle it
	validateRegisterData: (formData) => {
		const data = Object.fromEntries(formData.entries());
		const errors = {};
		if (!data.first_name) errors.first_name = "First name is required";
		if (!data.email) errors.email = "Email is required";
		if (!data.password) errors.password = "Password is required";
		if (data.terms !== "on" && !data.terms) errors.terms = "You must agree to the terms";
		
		return Object.keys(errors).length > 0 ? errors : null;
	}
};

export default AuthService;
