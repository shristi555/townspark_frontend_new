"use client";

import { Bell, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSidebar } from "@/components/ui/sidebar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { NotificationBell } from "@/components/notification-bell";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function AppNavbar() {
	const { toggleSidebar } = useSidebar();
	const router = useRouter();

	return (
		<header className='sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
			<div className='flex h-16 items-center gap-4 px-4 md:px-6'>
				{/* Mobile Menu Button */}
				<Button
					variant='ghost'
					size='icon'
					className='md:hidden'
					onClick={toggleSidebar}
				>
					<Menu className='w-5 h-5' />
				</Button>

				{/* Logo / Title Area (Optional, currently just space) */}
				<div className='flex-1' />

				{/* Right Actions */}
				<div className='flex items-center gap-2'>
					{/* Search Icon Button - Now on right for all screens */}
					<Button
						variant='ghost'
						size='icon'
						className='rounded-full hover:bg-muted'
						onClick={() => router.push("/search")}
						title="Search"
					>
						<Search className='w-5 h-5' />
					</Button>

					{/* Theme Toggle */}
					<ThemeToggle />

					{/* Notifications */}
					<NotificationBell />
				</div>
			</div>
		</header>
	);
}
