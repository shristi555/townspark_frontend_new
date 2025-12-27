"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";

const testimonials = [
    {
        name: "Sarah Johnson",
        role: "Resident, Springfield",
        content:
            "Townspark has transformed how we report issues in our neighborhood. The potholes near my house were fixed within days!",
        rating: 5,
        avatar: "SJ",
    },
    {
        name: "Michael Chen",
        role: "City Official",
        content:
            "This platform has streamlined our issue management process. We can now respond to citizens' concerns much faster.",
        rating: 5,
        avatar: "MC",
    },
    {
        name: "Emily Rodriguez",
        role: "Resident, Riverside",
        content:
            "I love being able to track the progress of my reports. It's great to see our community issues being addressed!",
        rating: 5,
        avatar: "ER",
    },
];

function TestimonialCard({ testimonial }) {
    return (
        <Card className="h-full border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl">
            <CardContent className="pt-6 space-y-4">
                <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                            key={i}
                            className="w-5 h-5 fill-yellow-400 text-yellow-400"
                        />
                    ))}
                </div>
                <p className="text-muted-foreground leading-relaxed italic">
                    "{testimonial.content}"
                </p>
                <div className="flex items-center gap-3 pt-4 border-t">
                    <Avatar>
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                            {testimonial.avatar}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">
                            {testimonial.role}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default function TestimonialsSection() {
    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                    <h2 className="text-4xl lg:text-5xl font-bold">
                        What People Say
                    </h2>
                    <p className="text-xl text-muted-foreground">
                        Hear from residents and authorities using Townspark
                    </p>
                </div>

                {/* Testimonials Grid */}
                <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {testimonials.map((testimonial, index) => (
                        <TestimonialCard key={index} testimonial={testimonial} />
                    ))}
                </div>
            </div>
        </section>
    );
}