"use client";

import { ArrowLeft } from "lucide-react";
import React from "react";
import { useRouter } from "next/navigation";

// A simple back button component
// uses next/navigation to go back to the previous page
// uses back icon from lucide-react

export default function BackButton() {
	const router = useRouter();
	return (
		<button onClick={() => router.back()} className=''>
			<ArrowLeft />
		</button>
	);
}
