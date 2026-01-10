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
import { useEffect, useState } from "react";
import LandingService from "@/services/landing_service";

export default function HomePage() {
	const { isAuthenticated } = useAuthStore();
	const router = useRouter();
	const [landingData, setLandingData] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (isAuthenticated) {
			router.push("/issue/explore");
		} else {
			const fetchData = async () => {
				const data = await LandingService.getLandingData();
				setLandingData(data);
				setIsLoading(false);
			};
			fetchData();
		}
	}, [isAuthenticated, router]);

	if (isAuthenticated) {
		return null; // or a loading spinner
	}

	return (
		<div className='min-h-screen bg-gradient-to-b from-background via-background to-muted/20'>
			<HomeHeader />
			<main>
				<HeroSection stats={landingData?.stats} isLoading={isLoading} />
				<FeaturesSection />
				<HowItWorksSection />
				<WhoIsItForSection />
				<StatsSection stats={landingData?.stats} isLoading={isLoading} />
				<TestimonialsSection testimonials={landingData?.testimonials} isLoading={isLoading} />
				<CTASection />
			</main>
			<Footer />
		</div>
	);
}
