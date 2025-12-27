"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CTASection() {
    const router = useRouter();

    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto">
                <div className="relative rounded-3xl bg-gradient-to-r from-primary to-blue-600 p-12 overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
                        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
                    </div>

                    {/* Content */}
                    <div className="relative z-10 text-center max-w-3xl mx-auto space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white text-sm font-medium">
                            <Sparkles className="w-4 h-4" />
                            Ready to make a difference?
                        </div>

                        <h2 className="text-4xl lg:text-5xl font-bold text-white">
                            Join Thousands of Citizens Building Better Communities
                        </h2>

                        <p className="text-xl text-white/90">
                            Start reporting issues, tracking progress, and connecting with
                            local authorities today.
                        </p>

                        <div className="flex flex-wrap gap-4 justify-center pt-4">
                            <Button
                                size="lg"
                                variant="secondary"
                                onClick={() => router.push("/signup")}
                                className="group shadow-xl hover:shadow-2xl"
                            >
                                Get Started Free
                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                onClick={() => router.push("/login")}
                                className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                            >
                                Already have an account? Log In
                            </Button>
                        </div>

                        <p className="text-sm text-white/70 pt-4">
                            No credit card required • Free forever • Get started in 2
                            minutes
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}