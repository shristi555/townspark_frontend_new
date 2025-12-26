"use client";

import AuthService from "@/services/auth_service";
import React, { useEffect } from "react";

function MyInfoPage() {
	useEffect(() => {
		AuthService.getMyInfo()
			.then((data) => {
				console.log(data);
			})
			.catch((err) => {
				console.error(err);
			});
	}, []);

	return <div>MyInfo</div>;
}

export default MyInfoPage;
