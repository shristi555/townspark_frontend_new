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

export function AppNavbar() {
	const { toggleSidebar } = useSidebar();

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
							placeholder='Search issues, locations...'
							className='pl-10 pr-4'
						/>
					</div>
				</div>

				<div className='flex-1 md:hidden' />

				{/* Right Actions */}
				<div className='flex items-center gap-2'>
					{/* Theme Toggle */}
					<ThemeToggle />

					{/* Notifications */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant='ghost'
								size='icon'
								className='relative'
							>
								<Bell className='w-5 h-5' />
								<Badge
									variant='destructive'
									className='absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs'
								>
									3
								</Badge>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align='end' className='w-80'>
							<DropdownMenuLabel>Notifications</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem>
								<div className='flex flex-col gap-1'>
									<p className='font-medium text-sm'>
										Issue #123 was resolved
									</p>
									<p className='text-xs text-muted-foreground'>
										2 hours ago
									</p>
								</div>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<div className='flex flex-col gap-1'>
									<p className='font-medium text-sm'>
										New comment on your issue
									</p>
									<p className='text-xs text-muted-foreground'>
										5 hours ago
									</p>
								</div>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<div className='flex flex-col gap-1'>
									<p className='font-medium text-sm'>
										Issue status updated
									</p>
									<p className='text-xs text-muted-foreground'>
										1 day ago
									</p>
								</div>
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem className='justify-center text-primary'>
								View all notifications
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>

					{/* Mobile Search Button */}
					<Button variant='ghost' size='icon' className='md:hidden'>
						<Search className='w-5 h-5' />
					</Button>
				</div>
			</div>
		</header>
	);
}
