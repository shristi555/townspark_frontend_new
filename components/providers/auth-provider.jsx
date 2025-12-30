"use client";

import { useEffect } from "react";
import useAuthStore from "@/store/auth_store";

export function AuthProvider({ children }) {
	const { checkAuthStatus } = useAuthStore();
	useEffect(() => {
		checkAuthStatus();
	}, []);

	return <>{children}</>;
}
