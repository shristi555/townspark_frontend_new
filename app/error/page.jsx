"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	RefreshCw,
	Home,
	Mail,
	AlertCircle,
	Wifi,
	WifiOff,
	Gamepad2,
	X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ErrorAnimation from "@/components/error/error-animation";
import MiniGame from "@/components/error/mini-game";
import BackendService from "@/services/backend_service";
import { useRetryUntilOnline } from "@/hooks/retry";
import { StopCircle } from "lucide-react";

export default function ErrorPage() {
	const router = useRouter();
	const [isRetrying, setIsRetrying] = useState(false);
	const [showGame, setShowGame] = useState(false);
	// const [retryCount, setRetryCount] = useState(0);

	const { retryCount, handleRetry, startRetry, stopRetry } =
		useRetryUntilOnline();

	return (
		<div className='min-h-screen  from-orange-50 via-background to-orange-50/50  dark:via-background flex items-center justify-center p-4'>
			{/* Background Pattern */}
			<div className='absolute inset-0 overflow-hidden pointer-events-none'>
				<div className='absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl animate-pulse' />
				<div className='absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-700' />
			</div>

			<div className='relative z-10 w-full max-w-2xl'>
				<Card className='border-2 shadow-2xl'>
					<CardContent className='pt-12 pb-8 px-8'>
						<div className='space-y-8'>
							{/* Animation */}
							<ErrorAnimation />

							{/* Title */}
							<div className='text-center space-y-3'>
								<div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 text-sm font-medium'>
									<WifiOff className='w-4 h-4' />
									Connection Error
								</div>
								<h1 className='text-4xl font-bold'>
									Oops! Connection Lost.
								</h1>
								<p className='text-muted-foreground text-lg max-w-md mx-auto leading-relaxed'>
									Our servers are currently taking a short
									break.
								</p>
								<p className='text-muted-foreground text-lg max-w-md mx-auto leading-relaxed'>
									We will redirect you automatically once
									server is back online.
								</p>
							</div>

							{/* Retry Stats */}
							{retryCount > 0 && (
								<div className='text-center'>
									<p className='text-sm text-muted-foreground'>
										Retry status:{" "}
										<span className='inline font-mono font-bold'>
											{" "}
											Unsuccessful{" "}
										</span>
									</p>
								</div>
							)}

							{/* Action Buttons */}
							<div className='flex flex-col sm:flex-row gap-3'>
								<Button
									onClick={handleRetry}
									disabled={isRetrying}
									size='lg'
									className='flex-1 group'
								>
									{isRetrying ? (
										<>
											<RefreshCw className='w-5 h-5 mr-2 animate-spin' />
											Retrying...
										</>
									) : (
										<>
											<RefreshCw className='w-5 h-5 mr-2 group-hover:rotate-180 transition-transform duration-500' />
											Retry Connection
										</>
									)}
								</Button>
								<Button
									variant='destructive'
									size='lg'
									onClick={stopRetry}
									className='flex-1'
								>
									<StopCircle className='w-5 h-5 mr-2' />
									Stop Retrying
								</Button>
							</div>

							{/* Mini Game Toggle */}
							<div className='text-center pt-4 border-t'>
								<Button
									variant='ghost'
									onClick={() => setShowGame(!showGame)}
									className='group'
								>
									<Gamepad2 className='w-4 h-4 mr-2 group-hover:scale-110 transition-transform' />
									{showGame
										? "Hide Game"
										: "Play a Game While You Wait"}
								</Button>
							</div>

							{/* Mini Game */}
							{showGame && (
								<div className='animate-in fade-in slide-in-from-top-4 duration-500'>
									<MiniGame />
								</div>
							)}

							{/* Help Section */}
							<div className='grid sm:grid-cols-2 gap-4 pt-4'>
								<Card className='border hover:border-primary/50 transition-colors'>
									<CardContent className='pt-6'>
										<div className='flex items-start gap-3'>
											<div className='w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0'>
												<Mail className='w-5 h-5 text-blue-600 dark:text-blue-400' />
											</div>
											<div className='flex-1'>
												<h3 className='font-semibold mb-1'>
													Contact Support
												</h3>
												<p className='text-sm text-muted-foreground mb-2'>
													Need immediate help?
												</p>
												<Link
													href='mailto:support@townspark.com'
													className='text-sm text-primary hover:underline'
												>
													support@townspark.com
												</Link>
											</div>
										</div>
									</CardContent>
								</Card>

								<Card className='border hover:border-primary/50 transition-colors'>
									<CardContent className='pt-6'>
										<div className='flex items-start gap-3'>
											<div className='w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center flex-shrink-0'>
												<AlertCircle className='w-5 h-5 text-orange-600 dark:text-orange-400' />
											</div>
											<div className='flex-1'>
												<h3 className='font-semibold mb-1'>
													Status Updates
												</h3>
												<p className='text-sm text-muted-foreground mb-2'>
													Check our status page
												</p>
												<Link
													href='#'
													className='text-sm text-primary hover:underline'
												>
													status.townspark.com
												</Link>
											</div>
										</div>
									</CardContent>
								</Card>
							</div>

							{/* Error Code */}
							<div className='text-center pt-4'>
								<p className='text-xs text-muted-foreground flex items-center justify-center gap-2'>
									<AlertCircle className='w-3 h-3' />
									Error Code: 503
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Additional Info */}
				<div className='text-center mt-6 text-sm text-muted-foreground'>
					<p>
						This usually resolves quickly. Thank you for your
						patience! 🙏
					</p>
				</div>
			</div>
		</div>
	);
}
