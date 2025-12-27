"use client";

import Link from "next/link";
import Image from "next/image";
import logo from "@public/logo.png";
import { Facebook, Twitter, Instagram, Linkedin, Mail } from "lucide-react";

const footerLinks = {
	Product: [
		{ name: "Features", href: "#features" },
		{ name: "How It Works", href: "#how-it-works" },
		{ name: "Pricing", href: "#" },
		{ name: "FAQ", href: "#" },
	],
	Company: [
		{ name: "About Us", href: "#about" },
		{ name: "Careers", href: "#" },
		{ name: "Blog", href: "#" },
		{ name: "Press Kit", href: "#" },
	],
	Resources: [
		{ name: "Documentation", href: "#" },
		{ name: "Help Center", href: "#" },
		{ name: "Community", href: "#" },
		{ name: "Contact", href: "#" },
	],
	Legal: [
		{ name: "Privacy Policy", href: "#" },
		{ name: "Terms of Service", href: "#" },
		{ name: "Cookie Policy", href: "#" },
		{ name: "Disclaimer", href: "#" },
	],
};

const socialLinks = [
	{ icon: Facebook, href: "#", label: "Facebook" },
	{ icon: Twitter, href: "#", label: "Twitter" },
	{ icon: Instagram, href: "#", label: "Instagram" },
	{ icon: Linkedin, href: "#", label: "LinkedIn" },
	{ icon: Mail, href: "mailto:hello@townspark.com", label: "Email" },
];

export default function Footer() {
	return (
		<footer id='about' className='bg-muted/30 border-t'>
			<div className='container mx-auto px-4 sm:px-6 lg:px-8 py-12'>
				<div className='grid grid-cols-2 md:grid-cols-6 gap-8 mb-12'>
					{/* Logo & Description */}
					<div className='col-span-2'>
						<Link href='/' className='flex items-center gap-2 mb-4'>
							<div className='w-10 h-10 relative'>
								<Image
									src={logo}
									alt='Townspark'
									fill
									className='object-contain'
								/>
							</div>
							<span className='text-xl font-bold'>Townspark</span>
						</Link>
						<p className='text-sm text-muted-foreground mb-4 max-w-sm'>
							Bridging the gap between residents and local
							authorities to build better communities together.
						</p>
						<div className='flex gap-3'>
							{socialLinks.map((social) => {
								const Icon = social.icon;
								return (
									<a
										key={social.label}
										href={social.href}
										aria-label={social.label}
										className='w-10 h-10 rounded-full bg-background border hover:border-primary hover:text-primary transition-all flex items-center justify-center'
									>
										<Icon className='w-5 h-5' />
									</a>
								);
							})}
						</div>
					</div>

					{/* Links */}
					{Object.entries(footerLinks).map(([category, links]) => (
						<div key={category}>
							<h3 className='font-semibold mb-4'>{category}</h3>
							<ul className='space-y-2'>
								{links.map((link) => (
									<li key={link.name}>
										<Link
											href={link.href}
											className='text-sm text-muted-foreground hover:text-primary transition-colors'
										>
											{link.name}
										</Link>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>

				{/* Bottom Bar */}
				<div className='pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4'>
					<p className='text-sm text-muted-foreground'>
						© {new Date().getFullYear()} Townspark. All rights
						reserved.
					</p>
					<p className='text-sm text-muted-foreground'>
						Made with ❤️ for better communities
					</p>
				</div>
			</div>
		</footer>
	);
}
