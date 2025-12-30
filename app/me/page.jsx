import { useRouter } from "next/navigation";
import React from "react";

export default function MePage() {
	// SImply redirect to /profile page
	const router = useRouter();
	React.useEffect(() => {
		router.push("/profile");
	}, [router]);
}
