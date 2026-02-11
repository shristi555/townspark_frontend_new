"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import useAuthStore from "@/store/auth_store";
import AdminService from "@/services/admin_service";
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarTrigger } from "@/components/ui/sidebar";
import { 
    LayoutDashboard, 
    Users, 
    AlertCircle, 
    MessageSquare, 
    Settings, 
    LogOut, 
    ShieldCheck,
    ChevronRight,
    Search,
    Bell,
    User
} from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/theme-toggle";

const adminNavItems = [
    { title: "Dashboard", icon: LayoutDashboard, url: "/admin" },
    { title: "Users", icon: Users, url: "/admin/users" },
    { title: "Issues", icon: AlertCircle, url: "/admin/issues" },
    { title: "Testimonials", icon: MessageSquare, url: "/admin/testimonials" },
];

export default function AdminLayout({ children }) {
    const { user, isAuthenticated, logout } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);
    const [isVerifying, setIsVerifying] = useState(true);

    useEffect(() => {
        setMounted(true);
        
        async function verifyAccess() {
            if (!isAuthenticated) {
                router.push("/login?redirect=" + pathname);
                return;
            }

            // Internal check
            if (!user?.is_staff && !user?.is_superuser) {
                toast.error("Access Denied: Admin privileges required");
                router.push("/dashboard");
                return;
            }

            // Second-step verification with backend
            try {
                const response = await AdminService.verifyAdmin();
                if (response.is_admin) {
                    setIsVerifying(false);
                } else {
                    throw new Error("Invalid admin response");
                }
            } catch (error) {
                toast.error("Security Check Failed: Admin verification denied");
                router.push("/dashboard");
            }
        }

        verifyAccess();
    }, [isAuthenticated, user, router, pathname]);

    if (!mounted || !isAuthenticated || isVerifying || (user && !user.is_staff && !user.is_superuser)) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-muted/20 gap-4">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="font-bold text-muted-foreground animate-pulse uppercase tracking-widest text-[10px]">Verifying Security Clearances...</p>
            </div>
        );
    }

    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full bg-muted/20">
                {/* Admin Sidebar */}
                <Sidebar className="border-r shadow-xl">
                    <SidebarHeader className="p-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="font-black tracking-tight">ADMIN PANEL</h2>
                                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Townspark Control</p>
                            </div>
                        </div>
                    </SidebarHeader>

                    <SidebarContent className="p-4">
                        <SidebarGroup>
                            <SidebarGroupLabel className="text-[10px] uppercase tracking-widest font-bold mb-4 px-2">Management</SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu className="gap-2">
                                    {adminNavItems.map((item) => {
                                        const isActive = pathname === item.url;
                                        return (
                                            <SidebarMenuItem key={item.url}>
                                                <SidebarMenuButton 
                                                    asChild 
                                                    isActive={isActive}
                                                    className={`h-12 rounded-xl px-4 transition-all duration-300 ${isActive ? 'bg-primary text-primary-foreground shadow-md scale-105' : 'hover:bg-primary/10'}`}
                                                >
                                                    <Link href={item.url} className="flex items-center gap-3">
                                                        <item.icon className="w-5 h-5" />
                                                        <span className="font-semibold">{item.title}</span>
                                                        {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                                                    </Link>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        );
                                    })}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    </SidebarContent>

                    <div className="mt-auto p-4 space-y-4">
                        <Separator className="bg-primary/10" />
                        <div className="flex items-center gap-3 px-2">
                            <Avatar className="w-10 h-10 border-2 border-primary/20">
                                <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                    {user?.first_name?.[0] || <User className="w-4 h-4" />}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold truncate uppercase">{user?.first_name} Admin</p>
                                <p className="text-[10px] text-muted-foreground truncate">{user?.email}</p>
                            </div>
                        </div>
                        <Button 
                            variant="destructive" 
                            className="w-full justify-start h-11 rounded-xl shadow-lg shadow-red-500/10"
                            onClick={() => {
                                logout();
                                router.push("/");
                            }}
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Logout Session
                        </Button>
                    </div>
                </Sidebar>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col">
                    <header className="h-20 border-b bg-background/50 backdrop-blur-xl flex items-center justify-between px-8 sticky top-0 z-30">
                        <div className="flex items-center gap-4">
                            <SidebarTrigger className="md:hidden" />
                            <h1 className="text-xl font-bold tracking-tight">
                                {adminNavItems.find(i => i.url === pathname)?.title || "Administration"}
                            </h1>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="hidden md:flex items-center gap-2 bg-muted/50 border rounded-full px-4 py-2 w-80 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                                <Search className="w-4 h-4 text-muted-foreground" />
                                <input placeholder="Global search..." className="bg-transparent border-none outline-none text-sm w-full" />
                            </div>
                            <div className="flex items-center gap-3 border-l pl-6">
                                <ThemeToggle />
                                <Button variant="ghost" size="icon" className="relative">
                                    <Bell className="w-5 h-5" />
                                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-background" />
                                </Button>
                            </div>
                        </div>
                    </header>
                    <main className="p-8">
                        {children}
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
}
