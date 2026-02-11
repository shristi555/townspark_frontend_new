"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
	FileText,
	TrendingUp,
	Users,
	Shield,
	Zap,
	Bell,
	MapPin,
	BarChart3,
} from "lucide-react";

const features = [
	{
		icon: FileText,
		title: "Report",
		description:
			"Snap photos and share in real-time to report community issues instantly.",
		color: "text-blue-600 dark:text-blue-400",
		bgColor: "bg-blue-500/10",
	},
	{
		icon: TrendingUp,
		title: "Track",
		description:
			"Monitor real-time updates on issue status from reporting to resolution.",
		color: "text-green-600 dark:text-green-400",
		bgColor: "bg-green-500/10",
	},
	{
		icon: Users,
		title: "Connect",
		description:
			"Stay engaged and informed with direct communication channels.",
		color: "text-purple-600 dark:text-purple-400",
		bgColor: "bg-purple-500/10",
	},
	{
		icon: Shield,
		title: "Verify",
		description:
			"Get verified updates directly from your city officials and authorities.",
		color: "text-orange-600 dark:text-orange-400",
		bgColor: "bg-orange-500/10",
	},
	{
		icon: Zap,
		title: "Fast Response",
		description:
			"Issues are routed directly to the right department for quick action.",
		color: "text-yellow-600 dark:text-yellow-400",
		bgColor: "bg-yellow-500/10",
	},
	{
		icon: Bell,
		title: "Notifications",
		description:
			"Receive instant alerts when your reported issues are updated or resolved.",
		color: "text-red-600 dark:text-red-400",
		bgColor: "bg-red-500/10",
	},
	{
		icon: MapPin,
		title: "Location-Based",
		description:
			"Automatically pinpoint issue locations for precise tracking and resolution.",
		color: "text-cyan-600 dark:text-cyan-400",
		bgColor: "bg-cyan-500/10",
	},
	{
		icon: BarChart3,
		title: "Analytics",
		description:
			"View community statistics and trends to understand local improvement.",
		color: "text-pink-600 dark:text-pink-400",
		bgColor: "bg-pink-500/10",
	},
];

function FeatureCard({ feature }) {
	const Icon = feature.icon;

	return (
		<Card className='group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/50'>
			<CardContent className='pt-6 space-y-4'>
				<div
					className={`w-14 h-14 rounded-2xl ${feature.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}
				>
					<Icon className={`w-7 h-7 ${feature.color}`} />
				</div>
				<div>
					<h3 className='text-xl font-semibold mb-2'>
						{feature.title}
					</h3>
					<p className='text-muted-foreground leading-relaxed'>
						{feature.description}
					</p>
				</div>
			</CardContent>
		</Card>
	);
}

export default function FeaturesSection() {
	return (
		<section id='features' className='py-20 px-4 sm:px-6 lg:px-8'>
			<div className='container mx-auto'>
				{/* Header */}
				<div className='text-center max-w-3xl mx-auto mb-16 space-y-4'>
					<h2 className='text-4xl lg:text-5xl font-bold'>
						Key Features
					</h2>
					<p className='text-xl text-muted-foreground'>
						Everything you need to make your community better, all
						in one place
					</p>
				</div>

				{/* Features Grid */}
				<div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-6'>
					{features.map((feature, index) => (
						<FeatureCard key={index} feature={feature} />
					))}
				</div>
			</div>
		</section>
	);
}
