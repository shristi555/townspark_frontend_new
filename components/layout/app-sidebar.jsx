"use client";

import { usePathname, useRouter } from "next/navigation";
import {
	Home,
	FileText,
	PlusCircle,
	MapPin,
	BarChart3,
	User,
	LogOut,
	Heart,
} from "lucide-react";

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuButton,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarGroupContent,
	SidebarRail,
} from "@/components/ui/sidebar";
import { NotificationBell } from "@/components/notification-bell";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import Image from "next/image";
import logo from "@public/logo.png";
import { toast } from "sonner";
import useAuthStore from "@/store/auth_store";
import { useEffect, useState } from "react";



const mainNavItems = [
	{
		title: "Dashboard",
		icon: Home,
		url: "/dashboard",
	},
	{
		title: "My Issues",
		icon: FileText,
		url: "/issue/mine",
	},
	{
		title: "Report Issue",
		icon: PlusCircle,
		url: "/issue/create",
	},
	{
		title: "Explore Issues",
		icon: MapPin,
		url: "/issue/explore",
	},
];

const secondaryNavItems = [
	{
		title: "Analytics",
		icon: BarChart3,
		url: "/analytics",
	},
	{
		title: "Profile",
		icon: User,
		url: "/profile",
	},
	{
		title: "Rate Townspark",
		icon: Heart,
		url: "/rate",
	},
];

export function AppSidebar() {
	const pathname = usePathname();
	const router = useRouter();
	const { logout, getUserFullName, getUserEmail, getUserId, getUserProfilePic } = useAuthStore();

	async function handleLogout() {
		logout();
	}

	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null;
	}

	return (
		<Sidebar className='border-r'>
			<SidebarHeader className='border-b p-4'>
				<div className='flex items-center gap-3'>
					<div className='w-10 h-10 relative flex-shrink-0'>
						<Image
							src={logo}
							alt='Townspark'
							fill
							className='object-contain'
						/>
					</div>
					<div className='flex-1 min-w-0'>
						<h2 className='font-bold text-lg truncate'>
							Townspark
						</h2>
						<p className='text-xs text-muted-foreground truncate'>
							Community Portal
						</p>
					</div>
				</div>
			</SidebarHeader>

			<SidebarContent className='px-3 py-4'>
				{/* Main Navigation */}
				<SidebarGroup>
					<SidebarGroupLabel>Main Menu</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{mainNavItems.map((item) => {
								const Icon = item.icon;
								const isActive = pathname === item.url;
								return (
									<SidebarMenuItem key={item.url}>
										<SidebarMenuButton
											asChild
											isActive={isActive}
											tooltip={item.title}
										>
											<Link
												href={item.url}
												className='flex items-center gap-3'
											>
												<Icon className='w-5 h-5' />
												<span>{item.title}</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								);
							})}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>

				<Separator className='my-4' />

				{/* Secondary Navigation */}
				<SidebarGroup>
					<SidebarGroupLabel>More</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{secondaryNavItems.map((item) => {
								const Icon = item.icon;
								const isActive = pathname === item.url;
								return (
									<SidebarMenuItem key={item.url}>
										<SidebarMenuButton
											asChild
											isActive={isActive}
											tooltip={item.title}
										>
											<Link
												href={item.url}
												className='flex items-center gap-3'
											>
												<Icon className='w-5 h-5' />
												<span>{item.title}</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								);
							})}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>

			<SidebarFooter className='border-t p-3'>
				<SidebarMenu>
					<SidebarMenuItem>
						<NotificationBell isSidebar />
					</SidebarMenuItem>
				</SidebarMenu>

				<Separator className='my-2' />

				<div className='flex items-center gap-3 mb-3 p-2 rounded-2xl bg-muted/30 border border-border/50'>
					<Avatar className='w-10 h-10 border-2 border-background shadow-sm'>
						<AvatarImage
							src={getUserProfilePic()?.startsWith('http') ? getUserProfilePic() : (getUserProfilePic() ? `${process.env.NEXT_PUBLIC_API_URL}${getUserProfilePic()}` : undefined)}
							alt={getUserFullName()}
						/>
						<AvatarFallback className='bg-primary/10 text-primary font-black uppercase text-xs'>
							{(getUserFullName() || "U")?.[0]}
						</AvatarFallback>
					</Avatar>
					<div className='flex-1 min-w-0'>
						<p className='font-bold text-sm truncate leading-none mb-1'>
							{getUserFullName() || "Citizen"}
						</p>
						<p className='text-[10px] text-muted-foreground truncate font-bold opacity-60'>
							{getUserEmail() || (getUserId() ? `ID: ${getUserId()}` : "Guest Account")}
						</p>
					</div>
				</div>
				<Button
					variant='outline'
					size='sm'
					className='w-full justify-start'
					onClick={handleLogout}
				>
					<LogOut className='w-4 h-4 mr-2' />
					Logout
				</Button>
			</SidebarFooter>

			<SidebarRail />
		</Sidebar>
	);
}
