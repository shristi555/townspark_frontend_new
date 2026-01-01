import { AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CATEGORY_COLORS, STATUS_CONFIG } from "./constants";

export function ErrorMessage({ message }) {
	if (!message) return null;
	return (
		<div className='flex items-center gap-2 text-destructive text-sm mt-1'>
			<AlertCircle className='w-4 h-4' />
			<span>{message}</span>
		</div>
	);
}

export function CategoryBadge({ category }) {
	const categoryColor = CATEGORY_COLORS[category] || CATEGORY_COLORS.other;
	return (
		<Badge variant='secondary' className={categoryColor}>
			{category}
		</Badge>
	);
}

export function StatusBadge({ isResolved, isArchived, className }) {
	if (isArchived) {
		return (
			<Badge
				variant='outline'
				className={`text-zinc-500 border-zinc-500 bg-zinc-500/10 flex items-center gap-1 text-xs ${className || ""}`}
			>
				{/* Archive icon is not imported here, but we can standardise or just use text */}
				Archived
			</Badge>
		);
	}
	const statusConfig = STATUS_CONFIG[isResolved ? "resolved" : "pending"];
	const StatusIcon = statusConfig.icon;

	return (
		<Badge
			variant='outline'
			className={`${statusConfig.color} flex items-center gap-1 text-xs ${className || ""}`}
		>
			<StatusIcon className='w-3 h-3' />
			{statusConfig.label}
		</Badge>
	);
}

export function EmptyState({ title, description, icon: Icon }) {
	return (
		<div className='text-center text-muted-foreground'>
			<Icon className='w-12 h-12 mx-auto mb-4 opacity-50' />
			<p className='text-lg font-medium'>{title}</p>
			<p className='text-sm mt-1'>{description}</p>
		</div>
	);
}

export function LoadingState({ message = "Loading..." }) {
	return (
		<div className='text-center text-muted-foreground py-8'>
			<p>{message}</p>
		</div>
	);
}
