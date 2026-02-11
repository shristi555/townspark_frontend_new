"use client";

import api from "./api";
import { useRouter } from "next/navigation";

const urls = {
	PING: "/ping/",
};

const BackendService = {
	async ping() {
		let response;
		try {
			response = await api.get(urls.PING);
			return response;
		} catch (error) {
			return { success: false, error: error };
		}
	},

	isServerOnline: async function () {
		try {
			const response = await this.ping();
			console.log("Ping response:", response.success);
			return response.success;
		} catch (error) {
			return false;
		}
	},
	ensureServerOnline: async function () {
		const isOnline = await this.isServerOnline();
		if (!isOnline) {
			const router = useRouter();
			const currentRoute = window.location.pathname;
			router.push("/error?from=" + encodeURIComponent(currentRoute));
		}
	},
};

export default BackendService;
