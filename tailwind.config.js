/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ["class", "class"],
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
    	extend: {
    		colors: {
    			primary: {
    				DEFAULT: 'hsl(var(--primary))',
    				foreground: 'hsl(var(--primary-foreground))'
    			},
    			'primary-dark': '#0b8fd1',
    			'primary-light': '#3eb8f5',
    			accent: {
    				DEFAULT: 'hsl(var(--accent))',
    				foreground: 'hsl(var(--accent-foreground))'
    			},
    			secondary: {
    				DEFAULT: 'hsl(var(--secondary))',
    				foreground: 'hsl(var(--secondary-foreground))'
    			},
    			'background-light': '#f5f7f8',
    			'background-dark': '#101c22',
    			'card-light': '#ffffff',
    			'card-dark': '#1a2831',
    			'text-primary-light': '#0d171c',
    			'text-primary-dark': '#f5f7f8',
    			'text-secondary-light': '#6C757D',
    			'text-secondary-dark': '#A8B5C0',
    			'border-light': '#cee0e8',
    			'border-dark': '#334155',
    			'status-reported': '#DC3545',
    			'status-acknowledged': '#3A86FF',
    			'status-progress': '#FFC107',
    			'status-resolved': '#28A745',
    			'urgency-low': '#50E3C2',
    			'urgency-medium': '#F5A623',
    			'urgency-high': '#D0021B',
    			'neutral-text': '#424242',
    			'neutral-bg': '#F7FAFC',
    			'neutral-border': '#E2E8F0',
    			background: 'hsl(var(--background))',
    			foreground: 'hsl(var(--foreground))',
    			card: {
    				DEFAULT: 'hsl(var(--card))',
    				foreground: 'hsl(var(--card-foreground))'
    			},
    			popover: {
    				DEFAULT: 'hsl(var(--popover))',
    				foreground: 'hsl(var(--popover-foreground))'
    			},
    			muted: {
    				DEFAULT: 'hsl(var(--muted))',
    				foreground: 'hsl(var(--muted-foreground))'
    			},
    			destructive: {
    				DEFAULT: 'hsl(var(--destructive))',
    				foreground: 'hsl(var(--destructive-foreground))'
    			},
    			border: 'hsl(var(--border))',
    			input: 'hsl(var(--input))',
    			ring: 'hsl(var(--ring))',
    			chart: {
    				'1': 'hsl(var(--chart-1))',
    				'2': 'hsl(var(--chart-2))',
    				'3': 'hsl(var(--chart-3))',
    				'4': 'hsl(var(--chart-4))',
    				'5': 'hsl(var(--chart-5))'
    			}
    		},
    		fontFamily: {
    			display: [
    				'Public Sans',
    				'sans-serif'
    			]
    		},
    		borderRadius: {
    			DEFAULT: '0.5rem',
    			lg: 'var(--radius)',
    			xl: '1rem',
    			'2xl': '1.25rem',
    			full: '9999px',
    			md: 'calc(var(--radius) - 2px)',
    			sm: 'calc(var(--radius) - 4px)'
    		},
    		boxShadow: {
    			card: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    			'card-dark': '0 1px 3px 0 rgb(0 0 0 / 0.3), 0 1px 2px -1px rgb(0 0 0 / 0.3)'
    		},
    		animation: {
    			'fade-in': 'fadeIn 0.2s ease-in-out',
    			'slide-in': 'slideIn 0.3s ease-out',
    			'slide-up': 'slideUp 0.3s ease-out'
    		},
    		keyframes: {
    			fadeIn: {
    				'0%': {
    					opacity: '0'
    				},
    				'100%': {
    					opacity: '1'
    				}
    			},
    			slideIn: {
    				'0%': {
    					transform: 'translateX(-100%)'
    				},
    				'100%': {
    					transform: 'translateX(0)'
    				}
    			},
    			slideUp: {
    				'0%': {
    					transform: 'translateY(100%)',
    					opacity: '0'
    				},
    				'100%': {
    					transform: 'translateY(0)',
    					opacity: '1'
    				}
    			}
    		}
    	}
    },
	plugins: [require("tailwindcss-animate")],
};
