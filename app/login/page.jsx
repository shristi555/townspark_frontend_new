"use client";

import AuthService from "@/services/auth_service";
import React, { use, useEffect } from "react";

function LoginPage() {
	// for now just try to log with dummy hardcoded credentials

	useEffect(() => {
		const resp = AuthService.login("strela500@gmail.com", "Gwen@12345");
		resp.then((data) => {
			console.log("Login successful:", data);
		}).catch((err) => {
			console.error("Login failed:", err);
		});
	}, []);

	return <div>LoginPage</div>;
}

export default LoginPage;
