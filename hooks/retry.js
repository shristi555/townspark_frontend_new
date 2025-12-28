"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import BackendService from "@/services/backend_service";

export function useRetryUntilOnline() {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const router = useRouter();

	const [retryCount, setRetryCount] = useState(0);
	const [intervalId, setIntervalId] = useState(null);
	const [status, setStatus] = useState("unsuccessful");

	const [fromRoute, setFromRoute] = useState("/");

	useEffect(() => {
		console.log("From Route:", fromRoute);
	}, [fromRoute]);

	useEffect(() => {
		// Only run on /error page
		if (pathname !== "/error") return;

		const from = searchParams.get("from");
		if (from) {
			setFromRoute(from);
		}

		const interval = setInterval(pingToServer, 2000);
		setIntervalId(interval);

		return () => clearInterval(interval); // cleanup
	}, [pathname, searchParams, router]);

	async function pingToServer() {
		setStatus("Retrying...");
		setRetryCount((prev) => prev + 1);

		try {
			const isOnline = await BackendService.isServerOnline();

			if (isOnline) {
				setStatus("successful");
				router.replace(
					(fromRoute == "/error" ? "/" : fromRoute) || "/"
				); // go back to original route
				clearInterval(interval); // stop retrying
			}
		} catch (err) {
			setStatus("unsuccessful");
			console.error("Error checking server status:", err);
		}
	}

	function handleRetry() {
		startRetry();
	}

	function stopRetry() {
		if (intervalId) {
			clearInterval(intervalId);
		}
	}

	function startRetry() {
		const interval = setInterval(pingToServer, 2000);
		setIntervalId(interval);
	}

	return { retryCount, handleRetry, stopRetry, startRetry };
}
