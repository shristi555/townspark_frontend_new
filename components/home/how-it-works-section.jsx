"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Camera, Send, Eye, CheckCircle } from "lucide-react";

const steps = [
	{
		number: "01",
		icon: Camera,
		title: "Capture the Issue",
		description:
			"Spot a problem? Take a photo and add details about the issue in your neighborhood.",
		color: "from-blue-500 to-cyan-500",
	},
	{
		number: "02",
		icon: Send,
		title: "Submit Report",
		description:
			"Send your report instantly to the relevant local authorities with location data.",
		color: "from-purple-500 to-pink-500",
	},
	{
		number: "03",
		icon: Eye,
		title: "Track Progress",
		description:
			"Monitor the status of your report in real-time as authorities work on it.",
		color: "from-orange-500 to-red-500",
	},
	{
		number: "04",
		icon: CheckCircle,
		title: "See Results",
		description:
			"Get notified when the issue is resolved and see the positive impact on your community.",
		color: "from-green-500 to-emerald-500",
	},
];

function StepCard({ step, index }) {
	const Icon = step.icon;
	const isLast = index === steps.length - 1;

	return (
		<div className='relative'>
			<Card className='h-full border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl group'>
				<CardContent className='pt-8 space-y-4'>
					<div
						className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}
					>
						<Icon className='w-8 h-8 text-white' />
					</div>
					<div
						className={`text-6xl font-bold bg-gradient-to-br ${step.color} bg-clip-text text-transparent opacity-20`}
					>
						{step.number}
					</div>
					<div>
						<h3 className='text-xl font-semibold mb-2'>
							{step.title}
						</h3>
						<p className='text-muted-foreground leading-relaxed'>
							{step.description}
						</p>
					</div>
				</CardContent>
			</Card>

			{/* Connection Arrow */}
			{!isLast && (
				<div className='hidden lg:block absolute top-1/2 -right-8 transform -translate-y-1/2'>
					<div className='w-16 h-0.5 bg-gradient-to-r from-primary/50 to-transparent' />
					<div className='absolute right-0 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-8 border-l-primary/50 border-t-4 border-t-transparent border-b-4 border-b-transparent' />
				</div>
			)}
		</div>
	);
}

export default function HowItWorksSection() {
	return (
		<section
			id='how-it-works'
			className='py-20 px-4 sm:px-6 lg:px-8 bg-muted/30'
		>
			<div className='container mx-auto'>
				{/* Header */}
				<div className='text-center max-w-3xl mx-auto mb-16 space-y-4'>
					<h2 className='text-4xl lg:text-5xl font-bold'>
						How It Works
					</h2>
					<p className='text-xl text-muted-foreground'>
						Simple, fast, and effective. Report issues in just four
						easy steps.
					</p>
				</div>

				{/* Steps Grid */}
				<div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4'>
					{steps.map((step, index) => (
						<StepCard key={index} step={step} index={index} />
					))}
				</div>
			</div>
		</section>
	);
}
