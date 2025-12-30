"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
	// simply redirect to /analytics page

	const router = useRouter();
	useEffect(() => {
		router.push("/analytics");
	}, [router]);
}
