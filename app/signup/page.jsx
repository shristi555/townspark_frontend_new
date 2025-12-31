"use client";

import Image from "next/image";
import logo from "@public/logo.png";
import React, { Suspense } from "react";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import SignupForm from "@/components/signup-form";
import { useNoAuth } from "@/hooks/auth-check";
import useAuthStore from "@/store/auth_store";

function SignupContent() {
	const { loading } = useNoAuth();
	const { register, isLoading, error: storeError, clearError } = useAuthStore();
	const router = useRouter();
	const searchParams = useSearchParams();
	const redirectPath = searchParams.get("from") || "/me";

	async function handleSubmit(event) {
		event.preventDefault();
		clearError();
		
		const formData = new FormData(event.target);
		const result = await register(formData);

		if (result.success) {
			toast.success("Welcome to Townspark!");
			router.push(redirectPath);
		} else {
			console.error("Signup failed:", result.error);
			if (typeof result.error === 'string') {
				toast.error(result.error);
			}
		}
	}

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
				<span className="ml-2 font-medium">Checking authentication...</span>
			</div>
		);
	}

	return (
		<div className='grid min-h-svh lg:grid-cols-2'>
			<div className='flex flex-col gap-4 p-6 md:p-10'>
				<div className='flex justify-center gap-2 md:justify-start'>
					<a href='/' className='flex items-center gap-2 font-medium'>
						<div className='flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground p-1'>
							<Image src={logo} alt='Logo' width={24} height={24} />
						</div>
						<span className='font-bold text-xl tracking-tight'>Townspark</span>
					</a>
				</div>
				<div className='flex flex-1 items-center justify-center'>
					<div className='w-full max-w-xs'>
						<SignupForm
							onSubmit={handleSubmit}
							validationError={storeError}
							disabled={isLoading}
						/>
					</div>
				</div>
			</div>
			<div className='relative hidden bg-muted lg:block'>
				<img
					src='https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=1920'
					alt='Community'
					className='absolute inset-0 h-full w-full object-cover dark:brightness-[0.4]'
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
				<div className="absolute bottom-10 left-10 right-10 z-10">
					<h2 className="text-3xl font-bold text-white mb-2">Join Your Neighbors</h2>
					<p className="text-white/80 text-lg">Create an account to start contributing to your city's growth and development.</p>
				</div>
			</div>
		</div>
	);
}

export default function SignupPage() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<SignupContent />
		</Suspense>
	);
}
