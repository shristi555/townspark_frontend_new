"use client";

import { TrendingUp, Users, MapPin, Clock } from "lucide-react";

const stats = [
    {
        icon: TrendingUp,
        value: "10,000+",
        label: "Issues Resolved",
        color: "text-green-600 dark:text-green-400",
    },
    {
        icon: Users,
        value: "50,000+",
        label: "Active Users",
        color: "text-blue-600 dark:text-blue-400",
    },
    {
        icon: MapPin,
        value: "50+",
        label: "Cities Connected",
        color: "text-purple-600 dark:text-purple-400",
    },
    {
        icon: Clock,
        value: "48hrs",
        label: "Avg Response Time",
        color: "text-orange-600 dark:text-orange-400",
    },
];

export default function StatsSection() {
    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary/5">
            <div className="container mx-auto">
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, index) => {
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