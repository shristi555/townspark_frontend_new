"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
	ArrowLeft, 
	Calendar, 
	User, 
	ExternalLink, 
	Clock,
	CheckCircle2
} from "lucide-react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import api from "@/services/api";
import { useNeedAuth } from "@/hooks/auth-check";
import { motion } from "framer-motion";

export default function ProgressDetailPage() {
	const { loading: authLoading } = useNeedAuth();
	const params = useParams();
	const router = useRouter();
	const [progress, setProgress] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchProgressDetails = async () => {
			try {
				const response = await api.get(`/issues/progress/${params.id}/`);
				if (response.success) {
					setProgress(response.response);
				}
			} catch (error) {
				console.error("Error fetching progress details:", error);
			} finally {
				setLoading(false);
			}
		};

		if (params.id) {
			fetchProgressDetails();
		}
	}, [params.id]);

	if (authLoading || loading) {
		return (
			<div className='flex items-center justify-center min-h-screen bg-zinc-50 dark:bg-zinc-950'>
				<motion.div 
					animate={{ rotate: 360 }}
					transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
					className='w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full'
				/>
			</div>
		);
	}

	if (!progress) {
		return (
			<div className='flex flex-col items-center justify-center min-h-screen p-4 text-center'>
				<h1 className='text-2xl font-black mb-4'>Progress update not found</h1>
				<Button onClick={() => router.back()} className='rounded-xl font-bold'>
					Go Back
				</Button>
			</div>
		);
	}

	const baseUrl = process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, '');

	return (
		<div className='min-h-screen bg-background text-foreground transition-colors duration-500'>
			{/* Top Bar Navigation */}
			<div className='sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border'>
				<div className='container mx-auto px-4 h-16 flex items-center gap-4'>
					<Button variant='ghost' size='icon' onClick={() => router.back()} className='rounded-xl'>
						<ArrowLeft className='w-5 h-5' />
					</Button>
					<div>
						<h2 className='text-sm font-black uppercase tracking-widest'>Progress Detail</h2>
						<p className='text-[10px] text-zinc-500 font-bold'>Timeline Stage Update</p>
					</div>
				</div>
			</div>

			<div className='container mx-auto px-4 py-12 max-w-4xl'>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className='space-y-8'
				>
					{/* Header Section */}
					<div className='space-y-4'>
						<div className='flex items-center gap-3'>
							<Badge className="bg-emerald-500 text-white border-0 px-4 py-1 text-[10px] font-black uppercase tracking-widest">
								<CheckCircle2 className='w-3 h-3 mr-2' /> Stage Reached
							</Badge>
							<span className='text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2'>
								<Calendar className='w-4 h-4' />
								{new Date(progress.created_at).toLocaleDateString(undefined, { dateStyle: 'full' })}
							</span>
						</div>
						<h1 className='text-4xl md:text-5xl font-black tracking-tight leading-tight'>
							{progress.title}
						</h1>
					</div>

					{/* Author Infographic */}
					<Card className='rounded-3xl border-border bg-card shadow-xl overflow-hidden'>
						<div className='flex flex-col sm:flex-row items-center gap-6 p-8 border-l-8 border-primary'>
							<Avatar className='w-20 h-20 border-4 border-zinc-100 dark:border-zinc-800 shadow-2xl'>
								<AvatarFallback className='bg-primary/5 text-primary text-2xl font-black'>
									{progress.updated_by?.first_name?.[0]}
								</AvatarFallback>
							</Avatar>
							<div className='flex-1 text-center sm:text-left space-y-1'>
								<p className='text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground'>Authorized Personnel</p>
								<h3 className='text-xl font-bold'>{progress.updated_by?.first_name} {progress.updated_by?.last_name}</h3>
								<div className='flex items-center justify-center sm:justify-start gap-4 pt-2'>
									<Badge variant='outline' className='text-[10px] font-bold py-1 border-border uppercase'>
										<Clock className='w-3 h-3 mr-1.5' />
										{formatDistanceToNow(new Date(progress.created_at), { addSuffix: true })}
									</Badge>
								</div>
							</div>
						</div>
					</Card>

					{/* Detailed Description */}
					<div className='prose prose-lg dark:prose-invert max-w-none'>
						<div className='p-8 md:p-12 rounded-3xl bg-card border border-border shadow-2xl shadow-primary/5'>
							<h4 className='text-xs font-black uppercase tracking-[0.3em] text-primary mb-6'>Operational Update</h4>
							<p className='text-xl text-foreground font-medium leading-relaxed italic'>
								"{progress.description}"
							</p>
						</div>
					</div>

					{/* Progress Images */}
					{progress.images && progress.images.length > 0 && (
						<div className='space-y-6'>
							<h3 className='text-xs font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2'>
								Visual Evidence ({progress.images.length})
							</h3>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								{progress.images.map((img, idx) => (
									<div key={idx} className='group relative aspect-square rounded-3xl overflow-hidden bg-muted shadow-lg'>
										<Image 
											src={`${baseUrl}${img.image}`}
											alt={`Evidence ${idx + 1}`}
											fill
											className='object-cover transition-transform duration-700 group-hover:scale-110'
											unoptimized
										/>
									</div>
								))}
							</div>
						</div>
					)}

					{/* Navigation Back */}
					<div className='pt-8 flex flex-col items-center gap-6'>
						<div className='h-[1px] w-full bg-gradient-to-r from-transparent via-border to-transparent' />
						<Button 
							size='lg' 
							onClick={() => router.back()}
							className='rounded-2xl px-12 h-16 font-black text-lg bg-primary text-primary-foreground shadow-2xl transition-all hover:-translate-y-1'
						>
							<ArrowLeft className='w-6 h-6 mr-3' /> Back to Issue
						</Button>
						<p className='text-[11px] font-bold uppercase tracking-widest text-muted-foreground'>
							Viewing update ID: {progress.id}
						</p>
					</div>
				</motion.div>
			</div>
		</div>
	);
}
