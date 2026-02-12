"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import DiscoveryService from "@/services/discovery_service";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import {
    Calendar,
    MessageSquare,
    ThumbsUp,
    Mail,
    AlertCircle,
    Activity,
    FileText,
    MapPin,
    Clock,
    Award,
    ShieldCheck,
    ArrowLeft,
    ExternalLink,
    UserCheck,
    Trophy,
    Target
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { CATEGORY_COLORS } from "@/components/issue/constants";
import { cn } from "@/lib/utils";

export default function UserProfilePage() {
    const params = useParams();
    const router = useRouter();
    const userId = Array.isArray(params?.id) ? params.id[0] : params?.id;

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (!userId) return;

        const fetchProfile = async () => {
            try {
                setLoading(true);
                const response = await DiscoveryService.getUserProfile(userId);

                // The API client wraps non-SRE responses in { success: true, response: data, error: null }
                const profileData = response.success ? response.response : response;

                if (!profileData?.user) {
                    throw new Error("User not found");
                }

                setProfile(profileData);
            } catch (err) {
                console.error("Error fetching user profile:", err);
                setError("Failed to load user profile. The user may not exist.");
                toast.error("Could not load profile");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [userId]);

    if (loading) return <ProfileSkeleton />;

    if (error || !profile?.user) {
        return (
            <div className='container mx-auto py-24 px-4 text-center'>
                <Card className='max-w-md mx-auto p-12 border-dashed bg-card/60 backdrop-blur-md rounded-[2.5rem] shadow-2xl'>
                    <div className='flex justify-center mb-6'>
                        <div className='p-6 rounded-full bg-red-500/10 animate-pulse'>
                            <AlertCircle className='h-12 w-12 text-red-500' />
                        </div>
                    </div>
                    <h2 className='text-3xl font-black mb-3'>Citizen Not Found</h2>
                    <p className='text-muted-foreground mb-8 text-sm font-medium leading-relaxed'>
                        {error || "We couldn't find the requested citizen's information in our database."}
                    </p>
                    <Button asChild size="lg" className="rounded-2xl px-10 font-black shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95">
                        <Link href='/issue/explore'>Explore Other Citizens</Link>
                    </Button>
                </Card>
            </div>
        );
    }

    const { user, reported_issues, recent_comments, stats } = profile;
    const fullName = `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim() || user.username || "Citizen";
    const initials = `${user.first_name?.[0] ?? ""}${user.last_name?.[0] ?? ""}`.toUpperCase() || "C";

    return (
        <div className='min-h-screen bg-slate-50/10 dark:bg-slate-950/10 pb-20'>
            {/* Modern Header Section */}
            <div className='h-52 md:h-64 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent relative overflow-hidden group'>
                <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,var(--primary-color),transparent)] opacity-20" style={{ '--primary-color': 'hsl(var(--primary))' }} />

                <div className='container mx-auto px-4 py-8 relative z-20 flex items-start justify-between'>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.back()}
                        className="bg-background/20 backdrop-blur-xl border border-white/10 text-foreground rounded-xl hover:bg-background/40 transition-all shadow-lg"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>

                    <div className="hidden md:flex gap-4">
                        <div className="bg-background/30 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-2xl flex items-center gap-3">
                            <ShieldCheck className="w-5 h-5 text-emerald-500" />
                            <span className="text-xs font-black uppercase tracking-wider">Secured Link</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className='container mx-auto px-4 -mt-24 relative z-30 max-w-7xl'>

                {/* Top Profile Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <Card className='rounded-3xl shadow-2xl border-0 bg-card/70 backdrop-blur-2xl overflow-hidden mb-8'>
                        <CardContent className='pt-8 pb-10 p-6 md:p-10'>
                            <div className='flex flex-col md:flex-row items-center md:items-start gap-8'>
                                {/* Avatar Side */}
                                <div className='relative'>
                                    <div className="absolute -inset-4 bg-primary/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <Avatar className='h-40 w-40 border-8 border-background shadow-2xl ring-2 ring-primary/10'>
                                        <AvatarImage
                                            src={user.profile_pic?.startsWith('http') ? user.profile_pic : (user.profile_pic ? `${process.env.NEXT_PUBLIC_API_URL}${user.profile_pic}` : undefined)}
                                            alt={fullName}
                                            className='object-cover'
                                        />
                                        <AvatarFallback className='text-5xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-black'>
                                            {initials}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className='absolute bottom-3 right-3 w-10 h-10 bg-emerald-500 rounded-full border-4 border-background flex items-center justify-center shadow-lg'>
                                        <UserCheck className="w-5 h-5 text-white" />
                                    </div>
                                </div>

                                {/* Info Side */}
                                <div className='flex-1 text-center md:text-left space-y-4'>
                                    <div className="space-y-1">
                                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                                            <h1 className='text-4xl font-black tracking-tight leading-none'>
                                                {fullName}
                                            </h1>
                                            {stats.impact_rank === "#1" && (
                                                <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 border-0 text-white font-black px-3 py-1 shadow-lg shadow-orange-500/20">
                                                    <Trophy className="w-4 h-4 mr-1.5" /> Rank #1
                                                </Badge>
                                            )}
                                        </div>
                                        <p className='text-lg text-muted-foreground font-semibold flex items-center justify-center md:justify-start gap-2'>
                                            <Mail className="w-4 h-4 opacity-50" />
                                            {user.email || "No public email"}
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap gap-2 justify-center md:justify-start pt-2">
                                        <Badge variant="secondary" className="rounded-xl px-4 py-1.5 bg-background shadow-sm border-0 font-bold flex items-center gap-2">
                                            <Calendar className="w-3.5 h-3.5 text-primary" />
                                            Joined {mounted && user.date_joined ? format(new Date(user.date_joined), "MMMM yyyy") : "..."}
                                        </Badge>
                                        <Badge variant="secondary" className="rounded-xl px-4 py-1.5 bg-background shadow-sm border-0 font-bold flex items-center gap-2">
                                            <Target className="w-3.5 h-3.5 text-emerald-500" />
                                            Impact {stats.impact_rank || "-"}
                                        </Badge>
                                        <Badge variant="secondary" className="rounded-xl px-4 py-1.5 bg-background shadow-sm border-0 font-bold flex items-center gap-2">
                                            <UserCheck className="w-3.5 h-3.5 text-blue-500" />
                                            Verified Account
                                        </Badge>
                                    </div>
                                </div>

                                {/* Quick CTA - Right Side */}
                                <div className="hidden lg:flex flex-col gap-3 justify-center">
                                    <Button size="lg" className="rounded-2xl font-black shadow-lg shadow-primary/20 px-8">
                                        Follow Updates
                                    </Button>
                                    <Button variant="outline" className="rounded-2xl font-black border-2">
                                        Message
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Impact Dashboard Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10"
                >
                    <MetricCard title="Contributions" value={stats.total_issues_reported || 0} icon={FileText} color="text-emerald-500" bg="bg-emerald-500/10" description="Issues reported" />
                    <MetricCard title="Actions" value={stats.total_comments_made || 0} icon={Activity} color="text-blue-500" bg="bg-blue-500/10" description="Community feed" />
                    <MetricCard title="Resolved" value={stats.total_resolved || 0} icon={ThumbsUp} color="text-amber-500" bg="bg-amber-500/10" description="Problems fixed" />
                    <MetricCard title="Rank" value={stats.impact_rank?.replace('#', '') || '-'} icon={Award} color="text-purple-500" bg="bg-purple-500/10" description="Overall impact" />
                </motion.div>

                {/* Activity Tabs */}
                <Tabs defaultValue='issues' className='w-full'>
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4 px-2">
                        <TabsList className='bg-background/50 backdrop-blur-md p-1.5 rounded-2xl border border-border/50 w-full md:w-auto h-auto'>
                            <TabsTrigger value='issues' className="rounded-xl px-8 py-3 data-[state=active]:bg-background data-[state=active]:shadow-xl font-black transition-all flex-1 md:flex-initial">
                                Public Reports
                                <span className="ml-3 bg-emerald-500/10 text-emerald-600 rounded-lg px-2 py-0.5 text-xs">{reported_issues.length}</span>
                            </TabsTrigger>
                            <TabsTrigger value='activity' className="rounded-xl px-8 py-3 data-[state=active]:bg-background data-[state=active]:shadow-xl font-black transition-all flex-1 md:flex-initial">
                                Citizen Feed
                                <span className="ml-3 bg-blue-500/10 text-blue-600 rounded-lg px-2 py-0.5 text-xs">{recent_comments.length}</span>
                            </TabsTrigger>
                        </TabsList>

                        <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest bg-muted/30 px-4 py-2 rounded-full">
                            <Clock className="w-3.5 h-3.5" />
                            Last active {recent_comments[0]?.created_at ? format(new Date(recent_comments[0].created_at), "MMM d") : "recently"}
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        {/* Reports Content */}
                        <TabsContent value='issues' className='space-y-8 focus-visible:outline-none'>
                            {reported_issues.length === 0 ? (
                                <EmptyState
                                    icon={FileText}
                                    title='No public reports'
                                    description={`${user.first_name ?? "This citizen"} hasn't shared any public reports with the community yet.`}
                                />
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
                                >
                                    {reported_issues.map((issue, idx) => (
                                        <motion.div
                                            key={issue.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.4, delay: idx * 0.05 }}
                                        >
                                            <Link href={`/issue/details/${issue.id}`}>
                                                <Card className='group h-full overflow-hidden rounded-[2rem] border-0 bg-card/60 backdrop-blur-md hover:shadow-2xl transition-all hover:-translate-y-2 relative'>
                                                    {/* Card Header Colorized Strip */}
                                                    <div className={cn("h-3 w-full", CATEGORY_COLORS[issue.category.toLowerCase()]?.split(' ')[0] || "bg-primary/20")} />

                                                    <CardContent className='p-8'>
                                                        <div className="flex justify-between items-start gap-4 mb-4">
                                                            <Badge variant="secondary" className={cn("border-0 rounded-lg px-3 py-1 font-bold text-[10px] uppercase tracking-wider shadow-sm", CATEGORY_COLORS[issue.category.toLowerCase()] || "bg-muted text-foreground")}>
                                                                {issue.category}
                                                            </Badge>
                                                            {issue.is_resolved && (
                                                                <Badge className="bg-emerald-500/10 text-emerald-600 border-0 rounded-lg px-3 py-1 font-black text-[10px] uppercase shadow-inner">
                                                                    Fixed
                                                                </Badge>
                                                            )}
                                                        </div>

                                                        <h3 className='font-black text-2xl mb-3 leading-tight group-hover:text-primary transition-colors line-clamp-2'>
                                                            {issue.title}
                                                        </h3>

                                                        <p className="text-sm text-muted-foreground line-clamp-3 mb-8 font-medium leading-relaxed opacity-80">
                                                            {issue.description}
                                                        </p>

                                                        <div className="flex flex-col gap-3 pt-6 border-t border-border/50">
                                                            <div className="flex items-center justify-between text-[10px] font-black text-muted-foreground/50 uppercase tracking-widest">
                                                                <span className="flex items-center gap-2 max-w-[180px] truncate">
                                                                    <MapPin className="w-3 h-3 text-red-400" />
                                                                    {issue.address?.split(',')[0] || "Location N/A"}
                                                                </span>
                                                                <span className="flex items-center gap-2">
                                                                    <Clock className="w-3 h-3" />
                                                                    {mounted && issue.created_at ? format(new Date(issue.created_at), "MMM d, yyyy") : "..."}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </Link>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            )}
                        </TabsContent>

                        {/* Activity Feed Content */}
                        <TabsContent value='activity' className='focus-visible:outline-none'>
                            {recent_comments.length === 0 ? (
                                <EmptyState
                                    icon={Activity}
                                    title='Quiet Neighborhood'
                                    description='No public comments or feed interactions found for this profile.'
                                />
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className='max-w-4xl mx-auto space-y-6'
                                >
                                    {recent_comments.map((comment, i) => (
                                        <motion.div
                                            key={comment.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                        >
                                            <Card className="rounded-[2rem] border-0 bg-card/60 backdrop-blur-xl hover:shadow-xl transition-all group overflow-hidden">
                                                <CardContent className="p-0">
                                                    <div className='flex gap-0'>
                                                        <div className='w-2 bg-primary/20 group-hover:bg-primary transition-colors' />
                                                        <div className='flex-1 p-8 space-y-5'>
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-3">
                                                                    <div className='p-2.5 rounded-xl bg-primary/10 text-primary'>
                                                                        <MessageSquare className='h-5 w-5' />
                                                                    </div>
                                                                    <div>
                                                                        <p className='text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest mb-1'>
                                                                            Citizen Discussion
                                                                        </p>
                                                                        <Link
                                                                            href={`/issue/details/${comment.issue_id}`}
                                                                            className='text-sm font-black hover:text-primary transition-colors flex items-center gap-2 group/link'
                                                                        >
                                                                            {comment.issue_title}
                                                                            <ExternalLink className="w-3 h-3 opacity-30 group-hover/link:opacity-100" />
                                                                        </Link>
                                                                    </div>
                                                                </div>
                                                                <span className='text-[10px] text-muted-foreground/40 font-black h-fit bg-muted px-3 py-1 rounded-full'>
                                                                    {mounted && comment.created_at ? format(new Date(comment.created_at), "MMM d, yyyy") : ""}
                                                                </span>
                                                            </div>
                                                            <div className='bg-muted/30 p-6 rounded-3xl border border-border/20'>
                                                                <p className='text-lg text-foreground italic font-medium leading-relaxed'>
                                                                    "{comment.text}"
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            )}
                        </TabsContent>
                    </AnimatePresence>
                </Tabs>
            </div>
        </div>
    );
}

/* ---------------- Components ---------------- */

function MetricCard({ title, value, icon: Icon, color, bg, description }) {
    return (
        <Card className="rounded-3xl border-0 bg-card/60 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all group overflow-hidden border-b-4 border-b-transparent hover:border-b-primary/40">
            <CardContent className="flex flex-col items-center justify-center p-8 text-center space-y-3">
                <div className={cn("p-4 rounded-2xl transition-transform group-hover:scale-110 group-hover:rotate-12", bg)}>
                    <Icon className={cn("w-6 h-6", color)} />
                </div>
                <div>
                    <p className="text-3xl font-black tracking-tighter mb-1">{value}</p>
                    <p className="text-sm font-black uppercase tracking-widest text-foreground/80">{title}</p>
                    <p className="text-[10px] text-muted-foreground font-semibold mt-1 opacity-60">{description}</p>
                </div>
            </CardContent>
        </Card>
    );
}

function EmptyState({ icon: Icon, title, description }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto"
        >
            <Card className='border-4 border-dashed border-muted/50 bg-transparent shadow-none rounded-[3rem]'>
                <CardContent className='flex flex-col items-center justify-center py-20 text-center'>
                    <div className='p-10 bg-muted/20 rounded-full shadow-inner mb-8 transform transition-transform hover:rotate-12'>
                        <Icon className='h-12 w-12 text-muted-foreground/20' />
                    </div>
                    <h3 className='font-black text-3xl mb-3 tracking-tight'>{title}</h3>
                    <p className='text-base text-muted-foreground max-w-xs font-medium leading-relaxed'>
                        {description}
                    </p>
                </CardContent>
            </Card>
        </motion.div>
    );
}

function ProfileSkeleton() {
    return (
        <div className='min-h-screen bg-slate-50/50 dark:bg-slate-950/50 pb-20'>
            <div className='h-64 bg-muted/20 animate-pulse' />
            <div className='container mx-auto px-4 -mt-24 relative z-10 max-w-7xl'>
                <Card className='rounded-3xl shadow-lg border-muted h-64 mb-8 overflow-hidden'>
                    <CardContent className='p-10 flex gap-10 items-center'>
                        <Skeleton className='h-40 w-40 rounded-full border-8 border-background' />
                        <div className="space-y-4 flex-1">
                            <Skeleton className='h-12 w-1/3 rounded-2xl' />
                            <Skeleton className='h-6 w-1/4 rounded-2xl' />
                            <div className="flex gap-2">
                                <Skeleton className="h-8 w-32 rounded-xl" />
                                <Skeleton className="h-8 w-32 rounded-xl" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                    {[1, 2, 3, 4].map(i => (
                        <Skeleton key={i} className="h-44 w-full rounded-3xl" />
                    ))}
                </div>

                <Skeleton className='h-16 w-full rounded-2xl mb-8' />

                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                    {[1, 2, 3].map(i => (
                        <Skeleton key={i} className='h-80 w-full rounded-[2rem]' />
                    ))}
                </div>
            </div>
        </div>
    );
}
