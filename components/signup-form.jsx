"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import logo from "@public/townspark_logo.png";
import Image from "next/image";

function Logo(props) {
	return <Image src={logo} alt='Logo' {...props} />;
}

function ErrorBox({ message }) {
	if (!message) return null;

	return (
		<p className='bg-destructive/15 text-destructive text-sm rounded-md'>
			{message}
		</p>
	);
}

export default function SignupForm({ onSubmit, validationError }) {
	const [showPassword, setShowPassword] = useState(false);

	return (
		<div className='flex items-center justify-center min-h-screen'>
			<div className='w-full max-w-md'>
				<Card className='border-3 border-primary shadow-lg pb-0'>
					<CardHeader className='flex flex-col items-center space-y-1.5 pb-4 pt-6'>
						<Logo className='w-12 h-12' />
						<div className='space-y-0.5 flex flex-col items-center'>
							<h2 className='text-2xl font-semibold text-foreground'>
								Create an account
							</h2>
							<p className='text-muted-foreground'>
								Welcome! Create an account to get started.
							</p>
						</div>
					</CardHeader>
					<form onSubmit={onSubmit}>
						<CardContent className='space-y-6 px-8'>
							<div className='errorMessage'>
								{typeof validationError === "string" ? (
									<ErrorBox message={validationError} />
								) : (
									<ErrorBox message={validationError?.general} />
								)}
							</div>

							<div className='grid grid-cols-2 gap-4'>
								<div className='space-y-2'>
									<Label htmlFor='firstName'>
										First name
									</Label>
									<Input
										id='firstName'
										name='first_name'
										placeholder='Gwen'
										className={
											validationError?.first_name
												? "border-destructive"
												: ""
										}
									/>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='lastName'>Last name</Label>
									<Input
										id='lastName'
										name='last_name'
										placeholder='Stacy'
										className={
											validationError?.last_name
												? "border-destructive"
												: ""
										}
									/>
								</div>
							</div>

							<div className='space-y-2'>
								<Label htmlFor='email'>Email address</Label>
								<Input
									id='email'
									name='email'
									type='email'
									placeholder='m@example.com'
									className={
										validationError?.email
											? "border-destructive"
											: ""
									}
								/>
							</div>
							<ErrorBox message={validationError?.email} />

							<div className='space-y-2'>
								<Label htmlFor='phonenumber'>
									Phone number (optional)
								</Label>
								<Input
									id='phonenumber'
									name='phone_number'
									type='tel'
									maxLength={10}
									placeholder='9876543210'
									className={
										validationError?.phone_number
											? "border-destructive"
											: ""
									}
								/>
							</div>
							<ErrorBox message={validationError?.phone_number} />

							<div className='space-y-2'>
								<Label htmlFor='password'>Password</Label>
								<div className='relative'>
									<Input
										id='password'
										name='password'
										type={
											showPassword ? "text" : "password"
										}
										className={`pr-10 ${validationError?.password ? "border-destructive" : ""}`}
									/>
									<Button
										type='button'
										variant='ghost'
										size='icon'
										className='absolute right-0 top-0 h-full px-3 text-muted-foreground hover:bg-transparent'
										onClick={() =>
											setShowPassword(!showPassword)
										}
									>
										{showPassword ? (
											<EyeOff className='h-4 w-4' />
										) : (
											<Eye className='h-4 w-4' />
										)}
									</Button>
								</div>
							</div>
							<ErrorBox message={validationError?.password} />

							<div className='flex items-center space-x-2'>
								<Checkbox id='terms' name='terms' defaultChecked />
								<label
									htmlFor='terms'
									className='text-sm text-muted-foreground'
								>
									I agree to the{" "}
									<Link
										href='#'
										className='text-primary hover:underline'
									>
										Terms
									</Link>{" "}
									and{" "}
									<Link
										href='#'
										className='text-primary hover:underline'
									>
										Conditions
									</Link>
								</label>
							</div>
							<ErrorBox message={validationError?.terms} />

							<Button
								type='submit'
								className='w-full bg-primary text-primary-foreground'
							>
								Create free account
							</Button>
						</CardContent>
					</form>
					<CardFooter className='flex justify-center border-t py-4!'>
						<p className='text-center text-sm text-muted-foreground'>
							Already have an account?{" "}
							<Link
								href='/login'
								className='text-primary hover:underline'
							>
								Sign in
							</Link>
						</p>
					</CardFooter>
				</Card>
			</div>
		</div>
	);
}
