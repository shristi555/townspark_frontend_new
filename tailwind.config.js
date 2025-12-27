/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ["class", "class"],
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],

	plugins: [require("tailwindcss-animate")],
	theme: {
		extend: {
			colors: {
				// Primary brand colors
				primary: "#0da6f2",
				"primary-dark": "#0b8fd1",
				"primary-light": "#3eb8f5",

				// Secondary/Accent colors
				accent: "#FFA500",
				secondary: "#00A99D",

				// Background colors
				"background-light": "#f5f7f8",
				"background-dark": "#101c22",

				// Card colors
				"card-light": "#ffffff",
				"card-dark": "#1a2831",

				// Text colors
				"text-primary-light": "#0d171c",
				"text-primary-dark": "#f5f7f8",
				"text-secondary-light": "#6C757D",
				"text-secondary-dark": "#A8B5C0",

				// Border colors
				"border-light": "#cee0e8",
				"border-dark": "#334155",

				// Status colors
				"status-reported": "#DC3545",
				"status-acknowledged": "#3A86FF",
				"status-progress": "#FFC107",
				"status-resolved": "#28A745",

				// Urgency colors
				"urgency-low": "#50E3C2",
				"urgency-medium": "#F5A623",
				"urgency-high": "#D0021B",

				// Neutral colors for admin
				"neutral-text": "#424242",
				"neutral-bg": "#F7FAFC",
				"neutral-border": "#E2E8F0",
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			colors: {
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				chart: {
					1: "hsl(var(--chart-1))",
					2: "hsl(var(--chart-2))",
					3: "hsl(var(--chart-3))",
					4: "hsl(var(--chart-4))",
					5: "hsl(var(--chart-5))",
				},
			},
		},
	},
};
