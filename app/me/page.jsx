"use client";

import AuthService from "@/services/auth_service";
import React, { useEffect, useState } from "react";
import {
	User,
	Mail,
	Phone,
	Loader2,
	AlertCircle,
	Camera,
	Moon,
	Sun,
} from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "next-themes";

function MyInfoPage() {
	const [userInfo, setUserInfo] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		fetchUserInfo();
	}, []);

	const fetchUserInfo = async () => {
		try {
			setLoading(true);
			const data = await AuthService.getMyInfo();

			if (data.success) {
				setUserInfo(data.response);
				setError(null);
			} else {
				const errorMsg =
					typeof data.error === "string"
						? data.error
						: "Failed to fetch user info";
				setError(errorMsg);
				toast.error(errorMsg);
			}
		} catch (err) {
			const errorMsg = err.message || "An unexpected error occurred";
			setError(errorMsg);
			toast.error(errorMsg);
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return <LoadingState />;
	}

	if (error) {
		return <ErrorState error={error} onRetry={fetchUserInfo} />;
	}

	return (
		<div className='min-h-screen bg-gradient-to-br from-background-light via-neutral-bg to-background-light dark:from-background-dark dark:via-gray-900 dark:to-background-dark py-8 sm:py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300'>
			<div className='max-w-6xl mx-auto'>
				<div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8'>
					<div>
						<h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-text-primary-light dark:text-text-primary-dark'>
							My Profile
						</h1>
						<p className='text-sm sm:text-base text-text-secondary-light dark:text-text-secondary-dark mt-1'>
							Manage your personal information
						</p>
					</div>
					<ThemeToggle />
				</div>
				<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
					<div className='lg:col-span-1'>
						<ProfileHeader userInfo={userInfo} />
					</div>
					<div className='lg:col-span-2'>
						<ProfileDetails userInfo={userInfo} />
					</div>
				</div>
			</div>
		</div>
	);
}

function ThemeToggle() {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return (
			<div className='w-10 h-10 rounded-lg bg-card-light dark:bg-card-dark' />
		);
	}

	return (
		<button
			onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
			className='p-2.5 rounded-lg bg-card-light dark:bg-card-dark shadow-card dark:shadow-card-dark border border-border-light dark:border-border-dark hover:scale-105 active:scale-95 transition-all duration-200'
			aria-label='Toggle theme'
		>
			{theme === "dark" ? (
				<Sun className='w-5 h-5 text-primary' />
			) : (
				<Moon className='w-5 h-5 text-primary' />
			)}
		</button>
	);
}

function LoadingState() {
	return (
		<div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-background-light via-neutral-bg to-background-light dark:from-background-dark dark:via-gray-900 dark:to-background-dark transition-colors duration-300'>
			<div className='text-center space-y-4 animate-fade-in px-4'>
				<div className='relative'>
					<div className='absolute inset-0 bg-primary/20 dark:bg-primary/30 blur-xl rounded-full animate-pulse' />
					<Loader2 className='w-12 h-12 sm:w-16 sm:h-16 animate-spin text-primary mx-auto relative z-10' />
				</div>
				<p className='text-sm sm:text-base text-text-secondary-light dark:text-text-secondary-dark font-medium'>
					Loading your profile...
				</p>
			</div>
		</div>
	);
}

function ErrorState({ error, onRetry }) {
	return (
		<div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-background-light via-neutral-bg to-background-light dark:from-background-dark dark:via-gray-900 dark:to-background-dark px-4 transition-colors duration-300'>
			<div className='max-w-md w-full bg-card-light dark:bg-card-dark rounded-xl sm:rounded-2xl shadow-card dark:shadow-card-dark border border-border-light dark:border-border-dark p-6 sm:p-8 text-center space-y-4 sm:space-y-6 animate-slide-up'>
				<div className='w-14 h-14 sm:w-16 sm:h-16 bg-destructive/10 dark:bg-destructive/20 rounded-full flex items-center justify-center mx-auto'>
					<AlertCircle className='w-7 h-7 sm:w-8 sm:h-8 text-destructive' />
				</div>
				<div className='space-y-2'>
					<h3 className='text-lg sm:text-xl font-semibold text-text-primary-light dark:text-text-primary-dark'>
						Something went wrong
					</h3>
					<p className='text-sm sm:text-base text-text-secondary-light dark:text-text-secondary-dark'>
						{error}
					</p>
				</div>
				<button
					onClick={onRetry}
					className='w-full bg-primary hover:bg-primary-dark text-white font-medium py-2.5 sm:py-3 px-4 rounded-lg transition-all duration-200 hover:shadow-lg active:scale-95'
				>
					Try Again
				</button>
			</div>
		</div>
	);
}

function ProfileHeader({ userInfo }) {
	const getInitials = () => {
		const first = userInfo?.first_name?.[0] || "";
		const last = userInfo?.last_name?.[0] || "";
		return `${first}${last}`.toUpperCase() || "U";
	};

	return (
		<div className='bg-card-light dark:bg-card-dark rounded-xl sm:rounded-2xl shadow-card dark:shadow-card-dark border border-border-light dark:border-border-dark p-6 sm:p-8 animate-slide-up transition-colors duration-300'>
			<div className='flex flex-col items-center text-center space-y-4 sm:space-y-6'>
				<div className='relative group'>
					<div className='absolute -inset-1 bg-gradient-to-br from-primary to-primary-light rounded-full blur opacity-25 group-hover:opacity-40 transition duration-300' />
					<div className='relative w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white text-3xl sm:text-4xl font-bold shadow-lg ring-4 ring-card-light dark:ring-card-dark transition-transform duration-300 group-hover:scale-105'>
						{userInfo?.profile_pic ? (
							<img
								src={userInfo.profile_pic}
								alt={userInfo.full_name}
								className='w-full h-full rounded-full object-cover'
							/>
						) : (
							<span>{getInitials()}</span>
						)}
					</div>
					<button
						className='absolute bottom-0 right-0 bg-primary hover:bg-primary-dark text-white p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110 active:scale-95 border-2 border-card-light dark:border-card-dark'
						aria-label='Change profile picture'
					>
						<Camera className='w-3.5 h-3.5 sm:w-4 sm:h-4' />
					</button>
				</div>

				<div className='space-y-2 w-full'>
					<h2 className='text-xl sm:text-2xl font-bold text-text-primary-light dark:text-text-primary-dark break-words'>
						{userInfo?.full_name || "User Name"}
					</h2>
					<p className='text-xs sm:text-sm text-text-secondary-light dark:text-text-secondary-dark'>
						Member since {new Date().getFullYear()}
					</p>
				</div>

				<div className='w-full pt-4 border-t border-border-light dark:border-border-dark space-y-3'>
					<StatItem label='Posts' value='12' />
					<StatItem label='Contributions' value='45' />
					<StatItem label='Reputation' value='★ 4.8' />
				</div>
			</div>
		</div>
	);
}

function StatItem({ label, value }) {
	return (
		<div className='flex justify-between items-center py-2 px-3 rounded-lg hover:bg-neutral-bg dark:hover:bg-gray-800/50 transition-all duration-200'>
			<span className='text-sm text-text-secondary-light dark:text-text-secondary-dark'>
				{label}
			</span>
			<span className='text-sm font-semibold text-text-primary-light dark:text-text-primary-dark'>
				{value}
			</span>
		</div>
	);
}

function ProfileDetails({ userInfo }) {
	const details = [
		{
			icon: User,
			label: "Full Name",
			value: userInfo?.full_name,
			color: "text-primary",
			bgColor: "bg-primary/10 dark:bg-primary/20",
		},
		{
			icon: Mail,
			label: "Email Address",
			value: userInfo?.email,
			color: "text-blue-500 dark:text-blue-400",
			bgColor: "bg-blue-500/10 dark:bg-blue-500/20",
		},
		{
			icon: Phone,
			label: "Phone Number",
			value: userInfo?.phone_number,
			color: "text-green-500 dark:text-green-400",
			bgColor: "bg-green-500/10 dark:bg-green-500/20",
		},
	];

	return (
		<div
			className='bg-card-light dark:bg-card-dark rounded-xl sm:rounded-2xl shadow-card dark:shadow-card-dark border border-border-light dark:border-border-dark p-6 sm:p-8 animate-slide-up transition-colors duration-300'
			style={{ animationDelay: "0.1s" }}
		>
			<h2 className='text-xl sm:text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4 sm:mb-6'>
				Profile Information
			</h2>
			<div className='space-y-3 sm:space-y-4'>
				{details.map((detail, index) => (
					<ProfileDetailItem key={index} {...detail} />
				))}
			</div>
			<div className='mt-6 sm:mt-8 pt-6 border-t border-border-light dark:border-border-dark flex flex-col sm:flex-row gap-3'>
				<button className='flex-1 bg-primary hover:bg-primary-dark text-white font-medium py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg transition-all duration-200 hover:shadow-lg active:scale-95'>
					Edit Profile
				</button>
				<button className='flex-1 bg-neutral-bg dark:bg-gray-800 hover:bg-neutral-border dark:hover:bg-gray-700 text-text-primary-light dark:text-text-primary-dark font-medium py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg transition-all duration-200 hover:shadow-lg active:scale-95 border border-border-light dark:border-border-dark'>
					Settings
				</button>
			</div>
		</div>
	);
}

function ProfileDetailItem({ icon: Icon, label, value, color, bgColor }) {
	return (
		<div className='group flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg hover:bg-neutral-bg dark:hover:bg-gray-800/50 transition-all duration-200 border border-transparent hover:border-border-light dark:hover:border-border-dark'>
			<div
				className={`${bgColor} p-2.5 sm:p-3 rounded-lg group-hover:scale-110 transition-transform duration-200 flex-shrink-0`}
			>
				<Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${color}`} />
			</div>
			<div className='flex-1 min-w-0'>
				<p className='text-xs sm:text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1'>
					{label}
				</p>
				<p className='text-sm sm:text-base font-semibold text-text-primary-light dark:text-text-primary-dark break-words'>
					{value || "Not provided"}
				</p>
			</div>
		</div>
	);
}

export default MyInfoPage;
