"use client";

import HomeHeader from "@/components/home/home-header";
import HeroSection from "@/components/home/hero-section";
import FeaturesSection from "@/components/home/features-section";
import HowItWorksSection from "@/components/home/how-it-works-section";
import WhoIsItForSection from "@/components/home/who-is-it-for-section";
import StatsSection from "@/components/home/stats-section";
import TestimonialsSection from "@/components/home/testimonials-section";
import CTASection from "@/components/home/cta-section";
import Footer from "@/components/home/footer";
import useAuthStore from "@/store/auth_store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
	const { isAuthenticated } = useAuthStore();

	const router = useRouter();

	useEffect(() => {
		if (isAuthenticated) {
			router.push("/issue/explore");
		}
	}, [isAuthenticated, router]);

	if (isAuthenticated) {
		return null; // or a loading spinner
	}

	return (
		<div className='min-h-screen bg-gradient-to-b from-background via-background to-muted/20'>
			<HomeHeader />
			<main>
				<HeroSection />
				<FeaturesSection />
				<HowItWorksSection />
				<WhoIsItForSection />
				<StatsSection />
				<TestimonialsSection />
				<CTASection />
			</main>
			<Footer />
		</div>
	);
}
