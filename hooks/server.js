import api from "@/services/api";
import { useRouter } from "next/navigation";
import React from "react";
export function useEnsureServerOnline() {
	const router = useRouter();

	React.useEffect(() => {
		async function check() {
			try {
				const response = await api.get("/ping/");
				if (!response.success) {
					router.push(
						"/error?from=" +
							encodeURIComponent(window.location.pathname)
					);
				}
			} catch {
				router.push(
					"/error?from=" +
						encodeURIComponent(window.location.pathname)
				);
			}
		}
		check();
	}, [router]);
}
