import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "@/services/api";

const AUTH_URLS = {
	LOGIN: "/auth/login/",
	REGISTER: "/auth/register/",
	MYINFO: "/profile/",
	REFRESH: "/auth/token/refresh/",
	VERIFY: "/auth/token/verify/",
	LOGOUT: "/auth/logout/",
	UPDATE_PROFILE: "/auth/me/update/",
	DELETE_ACCOUNT: "/auth/me/delete/",
	NOTIFICATIONS: "/notifications/",
	NOTIFICATION_READ: (id) => `/notifications/read/${id}/`,
	NOTIFICATION_UNREAD: (id) => `/notifications/unread/${id}/`,
	NOTIFICATION_MARK_ALL_READ: "/notifications/mark-all-read/",
	NOTIFICATION_DELETE_ALL: "/notifications/delete-all/",
	NOTIFICATION_DELETE: (id) => `/notifications/delete/${id}/`,
};

/**
 * Extracts a human-readable error message or structural errors from the API response
 */
function extractError(err, fallback = "Internal Server Error") {
	console.error("Auth Store Error:", err);

	// The api.js interceptor returns an object like:
	// { type, message, message_type, reached_server, status }
	if (err && typeof err === "object") {
		const { message, message_type } = err;

		if (message_type === "str" || message_type === "string") {
			return message || fallback;
		}

		if (message_type === "dict" || message_type === "object") {
			// It's a validation error object
			return message;
		}

		if (err.message) return err.message;
	}

	return err?.toString() || fallback;
}

const initialState = {
	user: null,
	profileData: null, // Full profile info including stats and issues
	isAuthenticated: false,
	isLoading: false,
	error: null,
	statusChecked: false,
	notifications: [],
};

const useAuthStore = create(
	persist(
		(set, get) => ({
			...initialState,

			// Actions
			setLoading: (isLoading) => set({ isLoading }),
			
			setError: (error) => {
				const processedError = extractError(error);
				set({ error: processedError });
				return processedError;
			},

			clearError: () => set({ error: null }),

			/**
			 * Login action
			 */
			login: async (email, password) => {
				set({ isLoading: true, error: null });
				try {
					const res = await api.post(AUTH_URLS.LOGIN, { email, password });
					// The backend structure is { success: true, response: { user: {...}, ... } }
					const userData = res.response.user || res.response;
					
					set({
						user: userData,
						isAuthenticated: true,
						error: null,
						isLoading: false,
						statusChecked: true,
					});
					return { success: true, user: userData };
				} catch (err) {
					const error = extractError(err, "Login failed. Please check your credentials.");
					set({ 
						user: null, 
						isAuthenticated: false, 
						error, 
						isLoading: false,
						statusChecked: true 
					});
					return { success: false, error };
				}
			},

			/**
			 * Register action
			 */
			register: async (formData) => {
				set({ isLoading: true, error: null });
				
				const data = formData instanceof FormData ? Object.fromEntries(formData.entries()) : formData;
				
				// Client-side validation
				const errors = {};
				if (!data.first_name || data.first_name.trim() === "") errors.first_name = "First name is required";
				if (!data.email || data.email.trim() === "") errors.email = "Email address is required";
				if (!data.password || data.password.trim() === "") errors.password = "Password is required";
				if (data.terms !== "on" && !data.terms) errors.terms = "You must agree to the terms and conditions";

				if (Object.keys(errors).length > 0) {
					set({ error: errors, isLoading: false });
					return { success: false, error: errors };
				}

				try {
					await api.post(AUTH_URLS.REGISTER, {
						first_name: data.first_name,
						last_name: data.last_name || "",
						email: data.email,
						password: data.password,
						phone_number: data.phone_number || null,
					});

					// After registration, we log in automatically
					set({ isLoading: false });
					return await get().login(data.email, data.password);
				} catch (err) {
					const error = extractError(err, "Registration failed.");
					set({ error, isLoading: false });
					return { success: false, error };
				}
			},

			/**
			 * Logout action
			 */
			logout: async () => {
				set({ isLoading: true });
				try {
					await api.post(AUTH_URLS.LOGOUT);
				} catch (err) {
					console.error("Logout error:", err);
				} finally {
					set({
						...initialState,
						statusChecked: true,
					});
					// Optional: clear local storage if persist doesn't handle it
				}
			},

			/**
			 * Check authentication status (usually on app load)
			 */
			checkAuthStatus: async (forceRecheck = false) => {
				if (get().statusChecked && !forceRecheck) {
					return { ok: get().isAuthenticated };
				}

				set({ isLoading: true });
				try {
					const res = await api.post(AUTH_URLS.VERIFY);
					const userData = res.response.user || res.response;
					
					set({
						user: userData,
						isAuthenticated: true,
						statusChecked: true,
						isLoading: false,
						error: null,
					});
					return { ok: true };
				} catch (err) {
					set({
						user: null,
						isAuthenticated: false,
						statusChecked: true,
						isLoading: false,
					});
					return { ok: false, reason: err.reached_server ? "unauthenticated" : "server" };
				}
			},

			/**
			 * Refresh token if needed
			 */
			refreshToken: async () => {
				try {
					const res = await api.post(AUTH_URLS.REFRESH);
					return { success: true, data: res.response };
				} catch (err) {
					return { success: false, error: extractError(err) };
				}
			},

			/**
			 * Update user profile
			 */
			updateProfile: async (formData) => {
				set({ isLoading: true, error: null });
				try {
					const data = formData instanceof FormData ? Object.fromEntries(formData.entries()) : formData;
					const res = await api.put(AUTH_URLS.UPDATE_PROFILE, data , {
						headers: {
							"Content-Type": "multipart/form-data",
						},
					});
					const updatedUser = res.response.user || res.response;

					/// the profile page relies on profile data object not user object
					/// we need to update just the user field in the profile data object
					
					set({ user: updatedUser, isLoading: false });
					
					get().fetchProfile();
					
					return { success: true, user: updatedUser };
				} catch (err) {
					const error = extractError(err, "Profile update failed.");
					set({ error, isLoading: false });
					return { success: false, error };
				}
			},

			/**
			 * Generic fetch user info (limited)
			 */
			fetchUser: async () => {
				set({ isLoading: true });
				try {
					const res = await api.get(AUTH_URLS.MYINFO);
					// Based on sample, response has the user object
					const userData = res.response?.user || res.response;
					set({ user: userData, isAuthenticated: true, isLoading: false });
					return { success: true, user: userData };
				} catch (err) {
					set({ isLoading: false });
					return { success: false, error: extractError(err) };
				}
			},

			/**
			 * Fetch complete profile info (full data)
			 */
			fetchProfile: async () => {
				set({ isLoading: true, error: null });
				try {
					const res = await api.get(AUTH_URLS.MYINFO);
					// res is the SRE object: { success, response, error, ... }
					// response contains: { user, reported_issues, liked_issues, commented_issues, stats }
					const profilePayload = res.response;
					
					set({ 
						profileData: profilePayload, 
						user: profilePayload?.user || get().user,
						isAuthenticated: true, 
						isLoading: false,
						error: null 
					});
					return { success: true, data: profilePayload };
				} catch (err) {
					const error = extractError(err, "Failed to load profile.");
					set({ error, isLoading: false });
					return { success: false, error };
				}
			},

			/**
			 * Notification Actions
			 */
			deleteAccount: async () => {
				set({ isLoading: true });
				try {
					await api.delete(AUTH_URLS.DELETE_ACCOUNT);
					set({
						...initialState,
						statusChecked: true,
					});
					return { success: true };
				} catch (err) {
					console.error("Delete account error:", err);
					set({ isLoading: false });
					return { success: false, error: extractError(err) };
				}
			},

			fetchNotifications: async () => {
				// Don't set global loading state to avoid UI flicker, just fetch background
				try {
					const res = await api.get(AUTH_URLS.NOTIFICATIONS);
					const notifications = res.response || [];
					set({ notifications });
					return { success: true, data: notifications };
				} catch (err) {
					console.error("Failed to fetch notifications:", err);
					return { success: false, error: extractError(err) };
				}
			},

			markNotificationRead: async (id) => {
				try {
					// Optimistic update
					set(state => ({
						notifications: state.notifications.map(n => 
							n.id === id ? { ...n, is_read: true } : n
						)
					}));
					await api.put(AUTH_URLS.NOTIFICATION_READ(id));
					return { success: true };
				} catch (err) {
					// Revert on failure could be added here, but usually overkill for read status
					return { success: false, error: extractError(err) };
				}
			},

			markAllNotificationsRead: async () => {
				try {
					set(state => ({
						notifications: state.notifications.map(n => ({ ...n, is_read: true }))
					}));
					await api.put(AUTH_URLS.NOTIFICATION_MARK_ALL_READ);
					return { success: true };
				} catch (err) {
					return { success: false, error: extractError(err) };
				}
			},

			deleteNotification: async (id) => {
				try {
					set(state => ({
						notifications: state.notifications.filter(n => n.id !== id)
					}));
					await api.delete(AUTH_URLS.NOTIFICATION_DELETE(id));
					return { success: true };
				} catch (err) {
					return { success: false, error: extractError(err) };
				}
			},

			deleteAllNotifications: async () => {
				try {
					set({ notifications: [] });
					await api.delete(AUTH_URLS.NOTIFICATION_DELETE_ALL);
					return { success: true };
				} catch (err) {
					return { success: false, error: extractError(err) };
				}
			},

			/**
			 * Selectors
			 */
			getUserId: () => get().user?.id,
			getUnreadCount: () => get().notifications.filter(n => !n.is_read).length,
			getUserEmail: () => get().user?.email,
			getUserFullName: () => get().user?.full_name || `${get().user?.first_name || ""} ${get().user?.last_name || ""}`.trim(),
			getUserFirstName: () => get().user?.first_name,
			getUserLastName: () => get().user?.last_name,
			getUserPhoneNumber: () => get().user?.phone_number,
			getUserProfilePic: () => get().user?.profile_pic,
		}),
		{
			name: "auth-storage",
			partialize: (state) => ({
				user: state.user,
				isAuthenticated: state.isAuthenticated,
				statusChecked: state.statusChecked,
			}),
		}
	)
);

export default useAuthStore;
