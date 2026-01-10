"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, MessageSquareHeart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

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
                    "{testimonial.feedback}"
                </p>
                <div className="flex items-center gap-3 pt-4 border-t">
                    <Avatar>
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                            {testimonial.user_initials}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold">{testimonial.user_name}</p>
                        <p className="text-sm text-muted-foreground">
                            {testimonial.designation || "Community Member"}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default function TestimonialsSection({ testimonials, isLoading }) {
    if (isLoading) {
        return (
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="container mx-auto">
                    <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        {[...Array(3)].map((_, i) => (
                            <Skeleton key={i} className="h-64 w-full rounded-xl" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    const hasTestimonials = testimonials && testimonials.length > 0;

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

                {hasTestimonials ? (
                    /* Testimonials Grid */
                    <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        {testimonials.map((testimonial) => (
                            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
                        ))}
                    </div>
                ) : (
                    /* Positive Message for No Testimonials */
                    <div className="max-w-2xl mx-auto text-center py-12 px-6 rounded-2xl bg-primary/5 border-2 border-dashed border-primary/20">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6">
                            <MessageSquareHeart className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-bold mb-4 text-primary">Be the First to Share Your Story!</h3>
                        <p className="text-muted-foreground text-lg mb-8">
                            We're excited to hear how Townspark is helping you improve your neighborhood. 
                            Your feedback inspires us and helps our community grow stronger together.
                        </p>
                        <div className="flex justify-center gap-4">
                            <div className="flex items-center gap-1 text-yellow-500">
                                <Star className="w-5 h-5 fill-current" />
                                <Star className="w-5 h-5 fill-current" />
                                <Star className="w-5 h-5 fill-current" />
                                <Star className="w-5 h-5 fill-current" />
                                <Star className="w-5 h-5 fill-current" />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}