"use client";
import AuthService from "@/services/auth_service";
import React, { useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function ValidatePage() {
	const router = useRouter();

	async function verifyToken() {
		const token = await AuthService.verifyToken();
		console.log("Token verification result:", token);
		if (token.success) {
			toast.success("You are already logged in");
			setIsLoggedIn(true);
		}
	}

	useEffect(() => {
		setIsLoading(true);
		verifyToken();
		setIsLoading(false);
	}, []);

	const [isLoading, setIsLoading] = React.useState(true);
	const [isLoggedIn, setIsLoggedIn] = React.useState(false);

	if (isLoading) {
		return <div>Loading...</div>;
	}
	return (
		<div>
			{isLoggedIn ? (
				<div>You are logged in.</div>
			) : (
				<div>You are not logged in.</div>
			)}
		</div>
	);
}
