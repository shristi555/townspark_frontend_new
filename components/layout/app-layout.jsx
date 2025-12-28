"use client";

import { usePathname } from "next/navigation";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppNavbar } from "@/components/layout/app-navbar";
import { BottomNav } from "@/components/layout/bottom-nav";

// Pages where layout should not appear
const NO_LAYOUT_PAGES = ["/login", "/signup", "/", "/error"];

export function AppLayout({ children }) {
	const pathname = usePathname();
	const showLayout = !NO_LAYOUT_PAGES.includes(pathname);

	if (!showLayout) {
		return <>{children}</>;
	}

	return (
		<SidebarProvider>
			<div className='flex min-h-screen w-full'>
				{/* Desktop Sidebar */}
				<AppSidebar />

				{/* Main Content */}
				<div className='flex-1 flex flex-col'>
					{/* Top Navbar */}
					<AppNavbar />

					{/* Page Content */}
					<main className='flex-1 pb-20 md:pb-0'>{children}</main>
				</div>
			</div>

			{/* Mobile Bottom Navigation */}
			<BottomNav />
		</SidebarProvider>
	);
}
