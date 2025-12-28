"use client";

import { usePathname } from "next/navigation";
import { Home, FileText, PlusCircle, MapPin, User } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const navItems = [
	{
		title: "Home",
		icon: Home,
		url: "/dashboard",
	},
	{
		title: "My Issues",
		icon: FileText,
		url: "/issue/mine",
	},
	{
		title: "Report",
		icon: PlusCircle,
		url: "/issue/create",
		isPrimary: true,
	},
	{
		title: "Explore",
		icon: MapPin,
		url: "/issue/explore",
	},
	{
		title: "Profile",
		icon: User,
		url: "/profile",
	},
];

export function BottomNav() {
	const pathname = usePathname();

	return (
		<nav className='md:hidden fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
			<div className='flex items-center justify-around h-16 px-2'>
				{navItems.map((item) => {
					const Icon = item.icon;
					const isActive = pathname === item.url;

					if (item.isPrimary) {
						return (
							<Link
								key={item.url}
								href={item.url}
								className='flex flex-col items-center justify-center'
							>
								<div className='w-14 h-14 -mt-8 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:scale-110 transition-transform'>
									<Icon className='w-6 h-6' />
								</div>
								<span className='text-[10px] mt-1 font-medium'>
									{item.title}
								</span>
							</Link>
						);
					}

					return (
						<Link
							key={item.url}
							href={item.url}
							className={cn(
								"flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors",
								isActive
									? "text-primary"
									: "text-muted-foreground hover:text-foreground"
							)}
						>
							<Icon className='w-5 h-5' />
							<span className='text-[10px] font-medium'>
								{item.title}
							</span>
						</Link>
					);
				})}
			</div>
		</nav>
	);
}
