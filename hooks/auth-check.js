"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import useAuthStore from "@stores/auth_store";

/**
 * Hook for pages that should NOT be accessed when logged in (e.g., login, signup)
 * Logic:
 * 1. If not checked, run checkAuthStatus.
 * 2. If authenticated, redirect to home.
 * 3. Handle server errors by redirecting to error page.
 */
export function useNoAuth() {
	const router = useRouter();
	const { isAuthenticated, statusChecked, checkAuthStatus, isLoading } = useAuthStore();
	const hasCheckedRef = useRef(false);

	useEffect(() => {
		let isMounted = true;

		const init = async () => {
			if (!statusChecked && !hasCheckedRef.current) {
				hasCheckedRef.current = true;
				const res = await checkAuthStatus();
				if (!isMounted) return;

				if (res?.reason === "server") {
					router.push("/error");
					return;
				}
			}

			if (statusChecked && isAuthenticated && isMounted) {
				// No need for toast here as it's standard redirection
				router.replace("/");
			}
		};

		init();

		return () => {
			isMounted = false;
		};
	}, [statusChecked, isAuthenticated, checkAuthStatus, router]);

	return { loading: !statusChecked || isLoading };
}

/**
 * Hook for pages that REQUIRE authentication (e.g., dashboard, profile)
 * Logic:
 * 1. If not checked, run checkAuthStatus.
 * 2. If not authenticated, redirect to login with return path.
 * 3. Handle server errors by redirecting to error page.
 */
export function useNeedAuth() {
	const router = useRouter();
	const pathname = usePathname();
	const { isAuthenticated, statusChecked, checkAuthStatus, isLoading } = useAuthStore();
	const hasCheckedRef = useRef(false);

	useEffect(() => {
		let isMounted = true;

		const init = async () => {
			if (!statusChecked && !hasCheckedRef.current) {
				hasCheckedRef.current = true;
				const res = await checkAuthStatus();
				if (!isMounted) return;

				if (res?.reason === "server") {
					router.push(`/error?from=${encodeURIComponent(pathname)}`);
					return;
				}
			}

			if (statusChecked && !isAuthenticated && isMounted) {
				toast.warning("Please login to access this page");
				router.replace(`/login?from=${encodeURIComponent(pathname)}`);
			}
		};

		init();

		return () => {
			isMounted = false;
		};
	}, [statusChecked, isAuthenticated, checkAuthStatus, router, pathname]);

	return { loading: !statusChecked || isLoading };
}
