"use client";

import { usePathname, useRouter } from "next/navigation";
import {
	Home,
	FileText,
	PlusCircle,
	MapPin,
	BarChart3,
	Settings,
	User,
	LogOut,
	HelpCircle,
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import logo from "@public/logo.png";
import { toast } from "sonner";
import AuthService from "@/services/auth_service";

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
		title: "Settings",
		icon: Settings,
		url: "/settings",
	},
	{
		title: "Help & Support",
		icon: HelpCircle,
		url: "/help",
	},
];

export function AppSidebar() {
	const pathname = usePathname();
	const router = useRouter();

	const handleLogout = async () => {
		try {
			await AuthService.logout();
			toast.success("Logged out successfully");
			router.push("/login");
		} catch (error) {
			toast.error("Failed to logout");
		}
	};

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
											<a
												href={item.url}
												className='flex items-center gap-3'
											>
												<Icon className='w-5 h-5' />
												<span>{item.title}</span>
											</a>
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
											<a
												href={item.url}
												className='flex items-center gap-3'
											>
												<Icon className='w-5 h-5' />
												<span>{item.title}</span>
											</a>
										</SidebarMenuButton>
									</SidebarMenuItem>
								);
							})}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>

			<SidebarFooter className='border-t p-3'>
				<div className='flex items-center gap-3 mb-3 px-2'>
					<Avatar className='w-10 h-10'>
						<AvatarFallback className='bg-primary/10 text-primary font-semibold'>
							<User className='w-5 h-5' />
						</AvatarFallback>
					</Avatar>
					<div className='flex-1 min-w-0'>
						<p className='font-semibold text-sm truncate'>
							John Doe
						</p>
						<p className='text-xs text-muted-foreground truncate'>
							john@example.com
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
