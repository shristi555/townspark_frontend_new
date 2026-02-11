"use client";

import { useEffect, useState } from "react";
import { WifiOff, Wifi } from "lucide-react";

export default function ErrorAnimation() {
	const [isAnimating, setIsAnimating] = useState(true);

	useEffect(() => {
		const interval = setInterval(() => {
			setIsAnimating((prev) => !prev);
		}, 2000);

		return () => clearInterval(interval);
	}, []);

	return (
		<div className='relative w-64 h-64 mx-auto'>
			{/* Main Circle */}
			<div className='absolute inset-0 flex items-center justify-center'>
				<div
					className={`w-48 h-48 rounded-3xl bg-gradient-to-br from-orange-400 to-orange-600 shadow-2xl transition-all duration-700 ${
						isAnimating
							? "scale-100 rotate-0"
							: "scale-95 rotate-12"
					}`}
				>
					<div className='w-full h-full flex items-center justify-center'>
						{isAnimating ? (
							<WifiOff className='w-20 h-20 text-white animate-pulse' />
						) : (
							<Wifi className='w-20 h-20 text-white animate-pulse' />
						)}
					</div>
				</div>
			</div>

			{/* Floating Orbs */}
			<div className='absolute top-0 left-0 w-12 h-12 bg-orange-300 rounded-full animate-float-slow blur-sm' />
			<div className='absolute top-4 right-4 w-8 h-8 bg-orange-400 rounded-full animate-float-medium blur-sm' />
			<div className='absolute bottom-8 left-8 w-10 h-10 bg-orange-500 rounded-full animate-float-fast blur-sm' />
			<div className='absolute bottom-4 right-12 w-6 h-6 bg-orange-300 rounded-full animate-float-medium blur-sm' />

			{/* Pulse Rings */}
			<div className='absolute inset-0 flex items-center justify-center'>
				<div className='absolute w-56 h-56 border-4 border-orange-300/30 rounded-full animate-ping' />
				<div className='absolute w-64 h-64 border-4 border-orange-300/20 rounded-full animate-ping delay-700' />
			</div>
		</div>
	);
}
