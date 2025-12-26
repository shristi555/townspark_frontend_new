"use client";

import AuthService from "@/services/auth_service";
import React, { useEffect } from "react";

function VerifyPage() {
	useEffect(() => {
		const resp = AuthService.verifyToken();
		resp.then((data) => {
			console.log("Token verification successful:", data);
		}).catch((err) => {
			console.error("Token verification failed:", err);
		});
	}, []); // Add this to prevent infinite loop

	return <div>VerifyPage</div>;
}

export default VerifyPage;
