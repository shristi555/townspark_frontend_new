"use client";

import { TrendingUp, Users, MapPin, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function StatsSection({ stats, isLoading }) {
    if (isLoading) {
        return (
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary/5">
                <div className="container mx-auto">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="flex flex-col items-center space-y-4">
                                <Skeleton className="w-16 h-16 rounded-full" />
                                <Skeleton className="h-8 w-24" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    // Use actual stats if > 0, otherwise use requested fallback values
    const displayStats = [
        {
            icon: TrendingUp,
            value: stats?.issues_resolved > 0 ? `${stats.issues_resolved.toLocaleString()}+` : "150+",
            label: "Issues Resolved",
            color: "text-green-600 dark:text-green-400",
        },
        {
            icon: Users,
            value: stats?.total_users > 0 ? `${stats.total_users.toLocaleString()}+` : "100+",
            label: "Active Users",
            color: "text-blue-600 dark:text-blue-400",
        },
        {
            icon: MapPin,
            value: stats?.cities_connected > 0 ? `${stats.cities_connected}+` : "10+",
            label: "Cities Connected",
            color: "text-purple-600 dark:text-purple-400",
        },
        {
            icon: Clock,
            value: stats?.avg_response_time_hrs > 0 ? `${Math.round(stats.avg_response_time_hrs)}hrs` : "48hrs",
            label: "Avg Response Time",
            color: "text-orange-600 dark:text-orange-400",
        },
    ];

    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary/5">
            <div className="container mx-auto">
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {displayStats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={index}
                                className="text-center space-y-3 group cursor-default"
                            >
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-background shadow-lg group-hover:scale-110 transition-transform">
                                    <Icon className={`w-8 h-8 ${stat.color}`} />
                                </div>
                                <div>
                                    <p className="text-4xl font-bold">{stat.value}</p>
                                    <p className="text-muted-foreground mt-1">{stat.label}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}