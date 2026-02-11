"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Building2, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

const audiences = [
    {
        icon: User,
        title: "For Residents",
        description:
            "Be the eyes of your community and get heard. Report issues, track progress, and see real change happen in your neighborhood.",
        features: [
            "Easy issue reporting",
            "Real-time status tracking",
            "Direct communication with authorities",
            "Community engagement",
        ],
        color: "from-blue-500 to-cyan-500",
        bgColor: "bg-blue-500/5",
    },
    {
        icon: Building2,
        title: "For Authorities",
        description:
            "Manage infrastructure efficiently. Receive, prioritize, and resolve citizen reports all in one centralized platform.",
        features: [
            "Centralized issue management",
            "Priority-based routing",
            "Performance analytics",
            "Citizen engagement tools",
        ],
        color: "from-purple-500 to-pink-500",
        bgColor: "bg-purple-500/5",
    },
];

function AudienceCard({ audience }) {
    const Icon = audience.icon;
    const router = useRouter();

    return (
        <Card
            className={`group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/50 ${audience.bgColor}`}
        >
            <CardContent className="pt-8 space-y-6">
                <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${audience.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}
                >
                    <Icon className="w-8 h-8 text-white" />
                </div>

                <div>
                    <h3 className="text-2xl font-semibold mb-3">{audience.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                        {audience.description}
                    </p>
                </div>

                <ul className="space-y-3">
                    {audience.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-primary" />
                            <span className="text-sm">{feature}</span>
                        </li>
                    ))}
                </ul>

                <Button
                    className="w-full group/btn"
                    onClick={() => router.push("/signup")}
                >
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
            </CardContent>
        </Card>
    );
}

export default function WhoIsItForSection() {
    return (
        <section id="who-is-it-for" className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                    <h2 className="text-4xl lg:text-5xl font-bold">Who Is It For?</h2>
                    <p className="text-xl text-muted-foreground">
                        Built for both citizens and authorities to create better
                        communities together
                    </p>
                </div>

                {/* Audience Cards */}
                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {audiences.map((audience, index) => (
                        <AudienceCard key={index} audience={audience} />
                    ))}
                </div>
            </div>
        </section>
    );
}