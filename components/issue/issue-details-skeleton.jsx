import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function IssueDetailsSkeleton() {
	return (
		<div className='min-h-screen bg-gradient-to-br from-background via-background to-muted/20'>
			<div className='container mx-auto px-4 py-8 max-w-5xl'>
				{/* Header Skeleton */}
				<div className='flex items-center gap-4 mb-6'>
					<Skeleton className='w-10 h-10 rounded-full' />
					<div className='flex-1 space-y-2'>
						<Skeleton className='h-7 w-32' />
						<Skeleton className='h-4 w-48' />
					</div>
					<Skeleton className='h-8 w-24' />
				</div>

				{/* Main Content Skeleton */}
				<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
					<div className='lg:col-span-2 space-y-6'>
						<Card>
							<CardContent className='pt-6'>
								<Skeleton className='w-full h-[400px] rounded-lg' />
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<Skeleton className='h-6 w-3/4' />
							</CardHeader>
							<CardContent className='space-y-2'>
								<Skeleton className='h-4 w-full' />
								<Skeleton className='h-4 w-full' />
								<Skeleton className='h-4 w-2/3' />
							</CardContent>
						</Card>
					</div>

					<div className='space-y-6'>
						<Card>
							<CardHeader>
								<Skeleton className='h-6 w-24' />
							</CardHeader>
							<CardContent className='space-y-4'>
								<Skeleton className='h-12 w-full' />
								<Skeleton className='h-12 w-full' />
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}
