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
	const [searchQuery, setSearchQuery] = useState("");

	const handleSearch = (e) => {
		if (e.key === "Enter" && searchQuery.trim()) {
			router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
		}
	};

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

				{/* Search Bar */}
				<div className='flex-1 max-w-md hidden md:block'>
					<div className='relative'>
						<Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
						<Input
							placeholder='Search issues, people...'
							className='pl-10 pr-4'
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							onKeyDown={handleSearch}
						/>
					</div>
				</div>

				<div className='flex-1 md:hidden' />

				{/* Right Actions */}
				<div className='flex items-center gap-2'>
					{/* Theme Toggle */}
					<ThemeToggle />

					{/* Notifications */}
					<NotificationBell />

					{/* Mobile Search Button */}
					<Button
						variant='ghost'
						size='icon'
						className='md:hidden'
						onClick={() => router.push("/search")}
					>
						<Search className='w-5 h-5' />
					</Button>
				</div>
			</div>
		</header>
	);
}
