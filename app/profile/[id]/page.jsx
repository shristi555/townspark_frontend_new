"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import DiscoveryService from "@/services/discovery_service";
import { format } from "date-fns";
import {
    MapPin,
    Calendar,
    MessageSquare,
    ThumbsUp,
    User,
    Mail,
    AlertCircle,
    Activity,
    FileText
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import BackButton from "@/components/ui/back-button";

export default function UserProfilePage() {
    const params = useParams();
    const userId = params.id;

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!userId) return;

            try {
                setLoading(true);
                const response = await DiscoveryService.getUserProfile(userId);
                if (response.user) {
                    setProfile(response);
                } else {
                    // Handle API structures where response might be wrapped differently
                    // Assuming my View returns the dict directly 
                    setProfile(response);
                }
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

    if (loading) {
        return <ProfileSkeleton />;
    }

    if (error || !profile) {
        return (
            <div className="container mx-auto py-12 px-4 text-center">
                <Card className="max-w-md mx-auto p-8 border-dashed">
                    <div className="flex justify-center mb-4">
                        <AlertCircle className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <h2 className="text-xl font-bold mb-2">Profile Not Found</h2>
                    <p className="text-muted-foreground mb-6">{error || "The requested user profile could not be found."}</p>
                    <Button asChild>
                        <Link href="/issue/explore">Back to Explore</Link>
                    </Button>
                </Card>
            </div>
        );
    }

    const { user, reported_issues, recent_comments, stats } = profile;
    const fullName = `${user.first_name} ${user.last_name}`;
    const initials = `${user.first_name?.[0] || ""}${user.last_name?.[0] || ""}`.toUpperCase();

    return (
        <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50 pb-20">
            {/* Header / Cover Area */}
            <div className="h-48 md:h-64 bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b relative">
                <div className="container mx-auto px-4 py-6">
                    <BackButton />
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-20 md:-mt-24 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Sidebar Profile Card */}
                    <div className="lg:col-span-4 xl:col-span-3">
                        <Card className="rounded-2xl shadow-lg border-muted overflow-hidden">
                            <CardContent className="pt-0 flex flex-col items-center">
                                <div className="p-1 bg-background rounded-full -mt-16 mb-4">
                                    <Avatar className="h-32 w-32 border-4 border-background shadow-md">
                                        <AvatarImage src={user.profile_pic} alt={fullName} className="object-cover" />
                                        <AvatarFallback className="text-2xl bg-primary text-primary-foreground font-bold">
                                            {initials}
                                        </AvatarFallback>
                                    </Avatar>
                                </div>

                                <h1 className="text-2xl font-black text-center mb-1">{fullName}</h1>
                                {user.email && (
                                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
                                        <Mail className="h-3.5 w-3.5" />
                                        <span>{user.email}</span>
                                    </div>
                                )}

                                <div className="grid grid-cols-3 gap-2 w-full mb-6 text-center">
                                    <div className="p-2 rounded-lg bg-muted/50">
                                        <p className="text-xs font-bold text-muted-foreground uppercase">Rank</p>
                                        <p className="font-black text-primary">{stats.impact_rank || "-"}</p>
                                    </div>
                                    <div className="p-2 rounded-lg bg-muted/50">
                                        <p className="text-xs font-bold text-muted-foreground uppercase">Issues</p>
                                        <p className="font-black">{stats.total_issues_reported || 0}</p>
                                    </div>
                                    <div className="p-2 rounded-lg bg-muted/50">
                                        <p className="text-xs font-bold text-muted-foreground uppercase">Comments</p>
                                        <p className="font-black">{stats.total_comments_made || 0}</p>
                                    </div>
                                </div>

                                <div className="w-full space-y-3">
                                    <div className="flex items-center justify-between text-sm p-3 rounded-xl bg-card border shadow-sm">
                                        <span className="flex items-center gap-2 text-muted-foreground">
                                            <Calendar className="h-4 w-4" /> Joined
                                        </span>
                                        <span className="font-medium">
                                            {format(new Date(user.date_joined), "MMMM yyyy")}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between text-sm p-3 rounded-xl bg-card border shadow-sm">
                                        <span className="flex items-center gap-2 text-muted-foreground">
                                            <ThumbsUp className="h-4 w-4" /> Solved
                                        </span>
                                        <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400">
                                            {stats.total_resolved} Issues
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content Tabs */}
                    <div className="lg:col-span-8 xl:col-span-9">
                        <Tabs defaultValue="issues" className="w-full">
                            <TabsList className="w-full justify-start h-12 p-1 bg-muted/50 rounded-xl mb-6">
                                <TabsTrigger value="issues" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm flex-1 md:flex-none px-6">
                                    Reported Issues
                                    <Badge variant="secondary" className="ml-2 text-[10px] h-5 px-1.5">{stats.total_issues_reported}</Badge>
                                </TabsTrigger>
                                <TabsTrigger value="activity" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm flex-1 md:flex-none px-6">
                                    Recent Activity
                                    <Badge variant="secondary" className="ml-2 text-[10px] h-5 px-1.5">{recent_comments.length}</Badge>
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="issues" className="space-y-6 animate-in fade-in-50 duration-500">
                                {reported_issues.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {reported_issues.map((issue) => (
                                            <Link href={`/issue/details/${issue.id}`} key={issue.id}>
                                                <Card className="h-full hover:shadow-lg transition-all hover:border-primary/50 group cursor-pointer border-muted bg-card/50">
                                                    <CardContent className="p-4 flex gap-4">
                                                        <div className="h-20 w-20 rounded-lg bg-muted flex-shrink-0 overflow-hidden relative">
                                                            {issue.images && issue.images.length > 0 ? (
                                                                <img
                                                                    src={`${process.env.NEXT_PUBLIC_API_URL}${issue.images[0].image}`}
                                                                    alt={issue.title}
                                                                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                                />
                                                            ) : (
                                                                <div className="h-full w-full flex items-center justify-center text-muted-foreground/30">
                                                                    <AlertCircle className="h-8 w-8" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0 py-1">
                                                            <div className="flex items-start justify-between mb-1">
                                                                <Badge variant="outline" className="text-[10px] h-5 px-1.5 font-bold uppercase tracking-wider">{issue.category}</Badge>
                                                                <span className="text-[10px] text-muted-foreground">{format(new Date(issue.created_at), "MMM d, yyyy")}</span>
                                                            </div>
                                                            <h3 className="font-bold text-sm leading-tight line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                                                                {issue.title}
                                                            </h3>
                                                            {issue.is_resolved && (
                                                                <span className="text-[10px] font-bold text-green-600 flex items-center gap-1">
                                                                    <ThumbsUp className="h-3 w-3" /> Resolved
                                                                </span>
                                                            )}
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <EmptyState
                                        icon={FileText}
                                        title="No issues reported"
                                        description={`${user.first_name} hasn't reported any public issues yet.`}
                                    />
                                )}
                            </TabsContent>

                            <TabsContent value="activity" className="space-y-4 animate-in fade-in-50 duration-500">
                                {recent_comments.length > 0 ? (
                                    <Card>
                                        <CardHeader className="pb-3 border-b">
                                            <CardTitle className="text-lg">Recent Comments</CardTitle>
                                            <CardDescription>Latest discussions participated in</CardDescription>
                                        </CardHeader>
                                        <CardContent className="p-0">
                                            <div className="divide-y">
                                                {recent_comments.map((comment, i) => (
                                                    <div key={comment.id} className="p-4 hover:bg-muted/30 transition-colors">
                                                        <div className="flex gap-3">
                                                            <div className="mt-1">
                                                                <MessageSquare className="h-4 w-4 text-primary" />
                                                            </div>
                                                            <div className="flex-1 space-y-1">
                                                                <p className="text-sm">
                                                                    <span className="font-medium text-foreground">Commented on </span>
                                                                    <Link href={`/issue/details/${comment.issue_id}`} className="font-bold text-primary hover:underline">
                                                                        {comment.issue_title}
                                                                    </Link>
                                                                </p>
                                                                <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg border italic">
                                                                    "{comment.text}"
                                                                </p>
                                                                <p className="text-xs text-muted-foreground">
                                                                    {format(new Date(comment.created_at), "MMM d, yyyy • h:mm a")}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    <EmptyState
                                        icon={Activity}
                                        title="No recent activity"
                                        description="No comments or recent actions found."
                                    />
                                )}
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    );
}

function EmptyState({ icon: Icon, title, description }) {
    return (
        <Card className="border-dashed bg-muted/30 shadow-none">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="p-3 bg-background rounded-full shadow-sm mb-4">
                    <Icon className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="font-bold text-lg mb-1">{title}</h3>
                <p className="text-sm text-muted-foreground max-w-xs">{description}</p>
            </CardContent>
        </Card>
    );
}

function ProfileSkeleton() {
    return (
        <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50 pb-20">
            <div className="h-48 md:h-64 bg-muted animate-pulse border-b" />
            <div className="container mx-auto px-4 -mt-20 md:-mt-24 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-4 xl:col-span-3">
                        <Card className="rounded-2xl shadow-lg border-muted h-[400px]">
                            <CardContent className="pt-0 flex flex-col items-center p-6 space-y-4">
                                <Skeleton className="h-32 w-32 rounded-full -mt-20 border-4 border-background" />
                                <Skeleton className="h-8 w-48" />
                                <Skeleton className="h-4 w-32" />
                            </CardContent>
                        </Card>
                    </div>
                    <div className="lg:col-span-8 xl:col-span-9 space-y-6">
                        <Skeleton className="h-12 w-full rounded-xl" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Skeleton className="h-32 w-full rounded-xl" />
                            <Skeleton className="h-32 w-full rounded-xl" />
                            <Skeleton className="h-32 w-full rounded-xl" />
                            <Skeleton className="h-32 w-full rounded-xl" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
