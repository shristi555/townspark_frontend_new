"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/services/api";

/**
 * Simple hook to check if server is reachable
 * Used only in error page for retry functionality
 */
export function useServerCheck() {
	const [isChecking, setIsChecking] = useState(false);

	const checkServer = useCallback(async () => {
		setIsChecking(true);
		try {
			await api.get("/health/", { timeout: 5000 });
			return true;
		} catch (error) {
			return false;
		} finally {
			setIsChecking(false);
		}
	}, []);

	return { checkServer, isChecking };
}

/**
 * Hook for error page with auto-retry functionality
 */
export function useServerRetry() {
	const [retryCount, setRetryCount] = useState(0);
	const [isRetrying, setIsRetrying] = useState(false);
	const [nextRetryIn, setNextRetryIn] = useState(null);
	const { checkServer } = useServerCheck();

	const RETRY_DELAYS = [2000, 5000, 10000, 30000]; // 2s, 5s, 10s, 30s

	const manualRetry = useCallback(async () => {
		setIsRetrying(true);
		setRetryCount((prev) => prev + 1);

		const isOnline = await checkServer();
		setIsRetrying(false);

		return isOnline;
	}, [checkServer]);

	const startAutoRetry = useCallback(() => {
		let attempt = 0;

		const retry = async () => {
			if (attempt >= RETRY_DELAYS.length) {
				// Max retries reached, use last delay
				attempt = RETRY_DELAYS.length - 1;
			}

			const delay = RETRY_DELAYS[attempt];
			setNextRetryIn(delay);
			setIsRetrying(true);

			// Countdown
			const startTime = Date.now();
			const countdown = setInterval(() => {
				const elapsed = Date.now() - startTime;
				const remaining = Math.max(0, delay - elapsed);
				setNextRetryIn(remaining);

				if (remaining === 0) {
					clearInterval(countdown);
				}
			}, 100);

			// Wait for delay
			await new Promise((resolve) => setTimeout(resolve, delay));

			// Check server
			setRetryCount(attempt + 1);
			const isOnline = await checkServer();
			setIsRetrying(false);

			if (!isOnline) {
				attempt++;
				retry();
			}

			return isOnline;
		};

		retry();
	}, [checkServer, RETRY_DELAYS]);

	return {
		retryCount,
		isRetrying,
		nextRetryIn,
		manualRetry,
		startAutoRetry,
	};
}
