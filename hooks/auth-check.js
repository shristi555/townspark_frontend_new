"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import useAuthStore from "@stores/auth_store";

/**
 * Pages that should NOT be accessed when logged in
 * Example: login, register
 */
export function useNoAuth() {
	const router = useRouter();
	const { checkAuthStatus } = useAuthStore();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		(async function () {
			const result = await checkAuthStatus();

			if (result?.ok) {
				toast.warning("You are already logged in");
				router.push("/");
			}

			if (result?.reason === "server") {
				router.push("/error");
			}

			setLoading(false);
		})();
	}, [router, checkAuthStatus]);

	return { loading };
}

/**
 * Pages that REQUIRE authentication
 * Example: dashboard, profile
 */
export function useNeedAuth() {
	const router = useRouter();
	const { checkAuthStatus } = useAuthStore();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		(async function () {
			const result = await checkAuthStatus();

			if (!result?.ok) {
				if (result?.reason === "server") {
					router.push("/error");
				} else {
					toast.warning("Please login to continue");
					router.push("/login");
				}
			}

			setLoading(false);
		})();
	}, [router, checkAuthStatus]);

	return { loading };
}
