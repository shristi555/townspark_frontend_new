import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function IssueListSkeleton() {
	return (
		<div className='min-h-screen bg-gradient-to-br from-background via-background to-muted/20'>
			<div className='container mx-auto px-4 py-8 max-w-6xl'>
				{/* Header Skeleton */}
				<div className='flex items-center justify-between mb-8'>
					<div className='space-y-2'>
						<Skeleton className='h-9 w-64' />
						<Skeleton className='h-4 w-48' />
					</div>
					<Skeleton className='h-10 w-32' />
				</div>

				{/* Stats Skeleton */}
				<div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6'>
					{[1, 2, 3].map((i) => (
						<Card key={i} className='border-2'>
							<CardContent className='pt-6'>
								<Skeleton className='h-16 w-full' />
							</CardContent>
						</Card>
					))}
				</div>

				{/* Filters Skeleton */}
				<Card className='mb-6'>
					<CardContent className='pt-6'>
						<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
							<Skeleton className='h-10 w-full' />
							<Skeleton className='h-10 w-full' />
							<Skeleton className='h-10 w-full' />
						</div>
					</CardContent>
				</Card>

				{/* Issues List Skeleton */}
				<div className='space-y-4'>
					{[1, 2, 3, 4].map((i) => (
						<Card key={i} className='border-2'>
							<CardContent className='p-4'>
								<div className='flex gap-4'>
									<Skeleton className='w-20 h-20 rounded-lg flex-shrink-0' />
									<div className='flex-1 space-y-2'>
										<Skeleton className='h-6 w-3/4' />
										<Skeleton className='h-4 w-full' />
										<Skeleton className='h-4 w-2/3' />
										<div className='flex gap-3'>
											<Skeleton className='h-6 w-20' />
											<Skeleton className='h-6 w-24' />
											<Skeleton className='h-6 w-16' />
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</div>
	);
}
