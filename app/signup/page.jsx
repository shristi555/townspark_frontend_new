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

export default function SignupPage() {
	const router = useRouter();

	async function handleSubmit(event) {
		event.preventDefault();
		const formData = new FormData(event.target);

		const errors = AuthService.validateRegisterData(formData);
		if (errors) {
			return setErrors(errors);
		}

		const resp = await AuthService.register(formData);
		if (resp.success && resp.status === 201) {
			toast.success("Registration successful! Please log in.");
			router.push("/login");
		} else {
			setErrors(resp.errors);
		}
	}

	const [errors, setErrors] = React.useState(null);

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
