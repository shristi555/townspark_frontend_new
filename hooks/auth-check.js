"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import AuthService from "@/services/auth_service";

/**
 * Hook for pages that require NO authentication (login, signup, etc.)
 * Redirects to home if user is already authenticated
 * Redirects to /error if server is offline
 */
export function useNoAuth() {
	const router = useRouter();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function checkAuth() {
			try {
				const response = await AuthService.verifyToken();

				// User is authenticated, redirect to home
				if (response.success) {
					toast.warning("You are already logged in");
					router.push("/");
				}
			} catch (error) {
				// the error we get is refined from the interceptors
				// so we cannot expect that there will be status in error directly
				// but luckily the backend provides status in error so we can use that
				// backend never sends backend key in error
				// so using .response is a bug here
				// but backend gives a key called reached_server to indicate if server was reached or not
				// so that is a better way to check for server errors
				// final plan
				// if error.reached_server is false or null or undefined, then it's a server/network error
				// else it's a client error (401, 403, etc.)

				// Check if it's a server/network error

				console.log(`GOt error in useNoAuth: `, error);

				if (!error.reached_server || error.status >= 500) {
					// Server is offline or erroring
					router.push("/error");
					return;
				}

				// 401 or other client errors mean user is not authenticated (expected)
				// Do nothing, let them stay on the page
			} finally {
				setLoading(false);
			}
		}

		checkAuth();
	}, [router]);

	return { loading };
}

/**
 * Hook for pages that REQUIRE authentication (dashboard, profile, etc.)
 * Redirects to login if user is not authenticated
 * Redirects to /error if server is offline
 */
export function useNeedAuth() {
	const router = useRouter();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function checkAuth() {
			try {
				const response = await AuthService.verifyToken();

				// User is not authenticated
				if (!response.success) {
					toast.warning("Please login to continue");
					router.push("/login");
				}
			} catch (error) {
				console.log(`GOt error in useNeedAuth: `, error);

				// Check if it's a server/network error
				if (!error.reached_server || error.status >= 500) {
					router.push("/error");
					return;
				}

				// 401 means not authenticated, redirect to login
				if (error.status === 401) {
					toast.warning("Please login to continue");
					router.push("/login");
				}
			} finally {
				setLoading(false);
			}
		}

		checkAuth();
	}, [router]);

	return { loading };
}
