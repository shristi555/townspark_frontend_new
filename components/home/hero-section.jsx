"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

export default function HeroSection({ stats, isLoading }) {
    const router = useRouter();

    const displayStats = {
        issues: stats?.issues_resolved > 0 ? `${stats.issues_resolved.toLocaleString()}+` : "150+",
        cities: stats?.cities_connected > 0 ? `${stats.cities_connected}+` : "10+",
        users: stats?.total_users > 0 ? `${stats.total_users.toLocaleString()}+` : "100+",
    };

    return (
        <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                            <Sparkles className="w-4 h-4" suppressHydrationWarning/>
                            Better Neighborhoods, Together
                        </div>

                        <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                            Report Issues.{" "}
                            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                                Track Progress.
                            </span>{" "}
                            Connect with Authorities.
                        </h1>

                        <p className="text-xl text-muted-foreground leading-relaxed">
                            Bridge the gap between residents and local authorities. No
                            more paperwork—just snap, send, and see change happen in
                            your community.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <Button
                                size="lg"
                                onClick={() => router.push("/signup")}
                                className="group shadow-lg hover:shadow-xl transition-all"
                            >
                                Get Started
                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="group"
                                onClick={() => {
                                    document
                                        .querySelector("#how-it-works")
                                        ?.scrollIntoView({ behavior: "smooth" });
                                }}
                            >
                                <Play className="w-4 h-4 mr-2" />
                                See How It Works
                            </Button>
                        </div>

                        <div className="flex items-center gap-8 pt-4">
                            <div>
                                {isLoading ? (
                                    <Skeleton className="h-9 w-16 mb-1" />
                                ) : (
                                    <p className="text-3xl font-bold">{displayStats.issues}</p>
                                )}
                                <p className="text-sm text-muted-foreground">
                                    Issues Resolved
                                </p>
                            </div>
                            <div className="w-px h-12 bg-border" />
                            <div>
                                {isLoading ? (
                                    <Skeleton className="h-9 w-12 mb-1" />
                                ) : (
                                    <p className="text-3xl font-bold">{displayStats.cities}</p>
                                )}
                                <p className="text-sm text-muted-foreground">
                                    Cities Connected
                                </p>
                            </div>
                            <div className="w-px h-12 bg-border" />
                            <div>
                                <p className="text-3xl font-bold">4.8★</p> // Static for now as it's a rating
                                <p className="text-sm text-muted-foreground">User Rating</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Content - Hero Image */}
           
                </div>
            </div>
        </section>
    );
}


export function HeroImage(){
    return          <div className="relative">
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-primary/20 to-blue-600/20 p-1">
                            <div className="relative h-[500px] bg-background rounded-xl overflow-hidden">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="relative w-[300px] h-[600px] rounded-3xl overflow-hidden shadow-2xl border-8 border-background">
                                        {/* Mock Phone Screen */}
                                        <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
                                            <div className="p-6 space-y-4">
                                                <div className="h-3 w-32 bg-gray-300 dark:bg-gray-700 rounded-full" />
                                                <div className="h-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg" />
                                                <div className="space-y-2">
                                                    <div className="h-3 w-full bg-gray-300 dark:bg-gray-700 rounded-full" />
                                                    <div className="h-3 w-3/4 bg-gray-300 dark:bg-gray-700 rounded-full" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating Elements */}
                        <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/20 rounded-full blur-2xl animate-pulse" />
                        <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl animate-pulse delay-700" />
                    </div>
}