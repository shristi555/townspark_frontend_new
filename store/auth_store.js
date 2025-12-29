import { create } from "zustand";
import { persist } from "zustand/middleware";
import AuthService from "@/services/auth_service";

const useAuthStore = create(
	persist(
		(set, get) => {
			return {
				// State
				user: null,
				isAuthenticated: false,
				isLoading: false,

				// Actions
				setUser: (userData) =>
					set({
						user: userData,
						isAuthenticated: !!userData,
					}),

				clearUser: () =>
					set({
						user: null,
						isAuthenticated: false,
					}),

				checkAuth: async () => {
					set({ isLoading: true });
					try {
						const response = await AuthService.getMyInfo();
						if (response.data) {
							set({
								user: response.data,
								isAuthenticated: true,
								isLoading: false,
							});
							return true;
						}
					} catch (error) {
						set({
							user: null,
							isAuthenticated: false,
							isLoading: false,
						});
						return false;
					}
				},

				logout: async () => {
					try {
						await AuthService.logout();
					} catch (error) {
						console.error("Logout error:", error);
					} finally {
						set({
							user: null,
							isAuthenticated: false,
						});
					}
				},

				// Helper getters
				getUserId: () => get().user?.id,
				getUserEmail: () => get().user?.email,
				getUserFullName: () => get().user?.full_name,
			};
		},

		{
			name: "auth-storage", // localStorage key
			partialize: (state) => ({
				user: state.user,
				isAuthenticated: state.isAuthenticated,
			}),
		}
	)
);

export default useAuthStore;
