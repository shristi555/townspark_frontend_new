import { AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CATEGORY_COLORS, STATUS_CONFIG } from "./constants";

export function ErrorMessage({ message }) {
	if (!message) return null;

	// Handle different error formats
	const renderMessage = () => {
		// If it's a string, render directly
		if (typeof message === "string") {
			return <span>{message}</span>;
		}

		// If it's an object with a message property
		if (typeof message === "object" && message !== null) {
			// Handle error object from API (with type, message, message_type)
			if (message.message) {
				const errorMessage = message.message;

				// If message is a string
				if (typeof errorMessage === "string") {
					return <span>{errorMessage}</span>;
				}

				// If message is an object (dict)
				if (
					typeof errorMessage === "object" &&
					!Array.isArray(errorMessage)
				) {
					return (
						<div className='space-y-1'>
							{Object.entries(errorMessage).map(
								([key, value]) => (
									<div key={key}>
										<span className='font-semibold'>
											{key}:
										</span>{" "}
										{Array.isArray(value)
											? value.join(", ")
											: String(value)}
									</div>
								)
							)}
						</div>
					);
				}

				// If message is an array
				if (Array.isArray(errorMessage)) {
					return (
						<ul className='list-disc list-inside space-y-1'>
							{errorMessage.map((msg, index) => (
								<li key={index}>{String(msg)}</li>
							))}
						</ul>
					);
				}
			}

			// If it's a plain object without message property
			if (!Array.isArray(message)) {
				return (
					<div className='space-y-1'>
						{Object.entries(message).map(([key, value]) => (
							<div key={key}>
								<span className='font-semibold'>{key}:</span>{" "}
								{Array.isArray(value)
									? value.join(", ")
									: String(value)}
							</div>
						))}
					</div>
				);
			}

			// If it's an array
			if (Array.isArray(message)) {
				return (
					<ul className='list-disc list-inside space-y-1'>
						{message.map((msg, index) => (
							<li key={index}>{String(msg)}</li>
						))}
					</ul>
				);
			}
		}

		// Fallback - convert to string
		return <span>{String(message)}</span>;
	};

	return (
		<div className='flex items-start gap-2 text-destructive text-sm mt-1'>
			<AlertCircle className='w-4 h-4 mt-0.5 flex-shrink-0' />
			<div className='flex-1'>{renderMessage()}</div>
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
