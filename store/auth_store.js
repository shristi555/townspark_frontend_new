import { create } from "zustand";
import { persist } from "zustand/middleware";
import AuthService from "@/services/auth_service";

function getErrorMessage(error, fallback = "Something went wrong") {
	return error?.response?.data?.message || error?.message || fallback;
}

async function runWithLoading(set, fn) {
	set({ isLoading: true, error: null });
	try {
		return await fn();
	} catch (error) {
		throw error;
	} finally {
		set({ isLoading: false });
	}
}

function authStore(set, get) {
	return {
		// STATE
		user: null,
		isAuthenticated: false,
		isLoading: false,
		error: null,
		statusChecked: false,

		// BASIC MUTATORS
		setUser: (user) =>
			set({
				user,
				isAuthenticated: !!user,
				error: null,
			}),

		clearUser: () =>
			set({
				user: null,
				isAuthenticated: false,
				error: null,
			}),

		setError: (error) => set({ error }),

		login: async (email, password) =>
			runWithLoading(set, async function () {
				try {
					const res = await AuthService.login(email, password);
					const user = res.response.user;

					set({
						user,
						isAuthenticated: true,
						error: null,
					});

					return { success: true, data: user };
				} catch (err) {
					const error = getErrorMessage(err, "Login failed");
					set({ user: null, isAuthenticated: false, error });
					return { success: false, error };
				}
			}),

		register: async (rawFormData) =>
			runWithLoading(set, async function () {
				const formData = Object.fromEntries(rawFormData.entries());

				const validationErrors =
					AuthService.validateRegisterData(formData);

				if (validationErrors) {
					set({
						error: validationErrors.general || "Validation failed",
					});
					return { success: false, error: validationErrors };
				}

				try {
					await AuthService.register(formData);
					return await get().login(formData.email, formData.password);
				} catch (err) {
					const error = getErrorMessage(err, "Registration failed");
					set({ error });
					return { success: false, error };
				}
			}),

		checkAuth: async () =>
			runWithLoading(set, async function () {
				try {
					const res = await AuthService.getMyInfo();
					set({
						user: res.data,
						isAuthenticated: true,
					});
					return true;
				} catch {
					set({ user: null, isAuthenticated: false });
					return false;
				}
			}),

		checkAuthStatus: async (forceRecheck = false) => {
			console.log("Checking auth status, forceRecheck:", forceRecheck);
			if (!forceRecheck) {
				if (get().statusChecked) {
					return get().isAuthenticated
						? { ok: true }
						: { ok: false, reason: "unauthenticated" };
				}
			}
			try {
				const res = await AuthService.verifyToken();
				if (res?.response.user) {
					set({
						user: res.response.user,
						isAuthenticated: true,
						error: null,
						statusChecked: true,
					});
					return { ok: true };
				}
			} catch (error) {
				console.log("Auth check failed:", error);
				if (!error?.reached_server) {
					return { ok: false, reason: "server" };
				}
				// 401 or other client error
				set({
					user: null,
					isAuthenticated: false,
					statusChecked: true,
				});
				return { ok: false, reason: "unauthenticated" };
			}
		},

		refreshToken: async () => {
			try {
				const res = await AuthService.refreshToken();
				return { success: true, data: res.data };
			} catch (err) {
				const error = getErrorMessage(err, "Token refresh failed");
				set({ error });
				return { success: false, error };
			}
		},

		verifyToken: async () => {
			try {
				const res = await AuthService.verifyToken();
				return { success: true, data: res.data };
			} catch (err) {
				const error = getErrorMessage(err, "Token verification failed");
				set({ error });
				return { success: false, error };
			}
		},

		updateProfile: async (formData) =>
			runWithLoading(set, async function () {
				try {
					const res = await AuthService.updateProfile(formData);
					set({ user: res.data });
					return { success: true, data: res.data };
				} catch (err) {
					const error = getErrorMessage(err, "Profile update failed");
					set({ error });
					return { success: false, error };
				}
			}),

		logout: async function () {
			try {
				await AuthService.logout();
			} finally {
				set({
					user: null,
					isAuthenticated: false,
					error: null,
				});
			}
		},

		getUserId: () => get().user?.id,
		getUserEmail: () => get().user?.email,
		getUserFullName: () => get().user?.full_name,
		getUserFirstName: () => get().user?.first_name,
		getUserLastName: () => get().user?.last_name,
		getUserPhoneNumber: () => get().user?.phone_number,
		getUserProfilePic: () => get().user?.profile_pic,
	};
}

const useAuthStore = create(
	persist(authStore, {
		name: "auth-storage",
		partialize: (state) => ({
			user: state.user,
			isAuthenticated: state.isAuthenticated,
		}),
	})
);

export default useAuthStore;
