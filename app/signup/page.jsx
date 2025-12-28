"use client";

import { GalleryVerticalEnd } from "lucide-react";

import Image from "next/image";
import { LoginForm } from "@/components/login-form";

import logo from "@public/logo.png";
import AuthService from "@/services/auth_service";
import React from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import SignupForm from "@/components/signup-form";
import BackendService from "@/services/backend_service";
import { useEnsureServerOnline } from "@/hooks/server";
import { useNoAuth } from "@/hooks/auth-check";

export default function SignupPage() {
	const { loading } = useNoAuth();

	const router = useRouter();

	async function handleSubmit(event) {
		event.preventDefault();
		const formData = new FormData(event.target);

		const errors = AuthService.validateRegisterData(formData);
		if (errors) {
			return setErrors(errors);
		}

		try {
			const resp = await AuthService.register(formData);
			if (resp.success && resp.status === 201) {
				toast.success("Registration successful! Please log in.");
				router.push("/login");
			}
		} catch (error) {
			console.error("Registration failed:", error);
			setErrors(error.message);
		}
	}

	const [errors, setErrors] = React.useState(null);

	if (loading) {
		return <div> Checking authentication...</div>;
	}

	return (
		<div className='grid min-h-svh lg:grid-cols-2'>
			<div className='flex flex-col gap-4 p-6 md:p-10'>
				<div className='flex justify-center gap-2 md:justify-start'>
					<a href='#' className='flex items-center gap-2 font-medium'>
						<div className='flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground'>
							<Image src={logo} alt='Logo' />
						</div>
						<span className='font-bold text-xl'>Townspark</span>
					</a>
				</div>
				<div className='flex flex-3 items-center justify-center'>
					<div className='w-full max-w-xs'>
						<SignupForm
							onSubmit={handleSubmit}
							validationError={errors}
						/>
					</div>
				</div>
			</div>
			<div className='relative flex-1 hidden bg-muted lg:block'>
				<img
					src='/placeholder.svg'
					alt='Image'
					className='absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale'
				/>
			</div>
		</div>
	);
}
