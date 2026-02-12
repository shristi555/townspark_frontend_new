import { Clock, CheckCircle2, Archive } from "lucide-react";

export const ISSUE_CATEGORIES = [
	{ value: "pothole", label: "Pothole" },
	{ value: "streetlight", label: "Street Light" },
	{ value: "garbage", label: "Garbage" },
	{ value: "water", label: "Water Supply" },
	{ value: "drainage", label: "Drainage" },
	{ value: "road", label: "Road Damage" },
	{ value: "electricity", label: "Electricity" },
	{ value: "other", label: "Other" },
];

export const STATUS_CONFIG = {
	pending: {
		label: "Pending",
		color: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20",
		icon: Clock,
		hex: "#f59e0b",
	},
	in_progress: {
		label: "In Progress",
		color: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
		icon: Clock,
		hex: "#3b82f6",
	},
	resolved: {
		label: "Resolved",
		color: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
		icon: CheckCircle2,
		hex: "#10b981",
	},
	closed: {
		label: "Closed",
		color: "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20",
		icon: Archive,
		hex: "#6b7280",
	},
};

export const CATEGORY_COLORS = {
	pothole: "bg-orange-500/10 text-orange-700 dark:text-orange-400",
	streetlight: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
	garbage: "bg-green-500/10 text-green-700 dark:text-green-400",
	water: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
	drainage: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-400",
	road: "bg-red-500/10 text-red-700 dark:text-red-400",
	electricity: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400",
	other: "bg-purple-500/10 text-purple-700 dark:text-purple-400",
};

export const CATEGORY_HEX = {
	pothole: "#f97316",
	streetlight: "#eab308",
	garbage: "#22c55e",
	water: "#3b82f6",
	drainage: "#06b6d4",
	road: "#ef4444",
	electricity: "#6366f1",
	other: "#a855f7",
};

export const MAX_IMAGES = 10;
