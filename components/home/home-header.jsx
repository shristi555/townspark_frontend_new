"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import logo from "@public/logo.png";
import { useRouter } from "next/navigation";

const navigation = [
	{ name: "Features", href: "#features" },
	{ name: "How It Works", href: "#how-it-works" },
	{ name: "Who Is It For", href: "#who-is-it-for" },
	{ name: "About", href: "#about" },
];

export default function HomeHeader() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const router = useRouter();

	useEffect(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 20);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const handleNavClick = (href) => {
		setMobileMenuOpen(false);
		const element = document.querySelector(href);
		if (element) {
			element.scrollIntoView({ behavior: "smooth" });
		}
	};

	return (
		<header
			className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
				scrolled
					? "bg-background/80 backdrop-blur-lg border-b border-border shadow-lg"
					: "bg-transparent"
			}`}
		>
			<nav className='container mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='flex items-center justify-between h-16'>
					{/* Logo */}
					<Link href='/' className='flex items-center gap-2'>
						<div className='w-10 h-10 relative'>
							<Image
								src={logo}
								alt='Townspark'
								fill
								className='object-contain'
							/>
						</div>
						<span className='text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent'>
							Townspark
						</span>
					</Link>

					{/* Desktop Navigation */}
					<div className='hidden md:flex items-center gap-8'>
						{navigation.map((item) => (
							<button
								key={item.name}
								onClick={() => handleNavClick(item.href)}
								className='text-sm font-medium text-muted-foreground hover:text-primary transition-colors'
							>
								{item.name}
							</button>
						))}
					</div>

					{/* CTA Buttons */}
					<div className='hidden md:flex items-center gap-3'>
						<Button
							variant='ghost'
							onClick={() => router.push("/login")}
						>
							Log In
						</Button>
						<Button onClick={() => router.push("/signup")}>
							Get Started
						</Button>
					</div>

					{/* Mobile Menu Button */}
					<button
						className='md:hidden'
						onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
					>
						{mobileMenuOpen ? (
							<X className='w-6 h-6' />
						) : (
							<Menu className='w-6 h-6' />
						)}
					</button>
				</div>

				{/* Mobile Menu */}
				{mobileMenuOpen && (
					<div className='md:hidden py-4 border-t border-border'>
						<div className='flex flex-col gap-4'>
							{navigation.map((item) => (
								<button
									key={item.name}
									onClick={() => handleNavClick(item.href)}
									className='text-left text-sm font-medium text-muted-foreground hover:text-primary transition-colors px-2'
								>
									{item.name}
								</button>
							))}
							<div className='flex flex-col gap-2 pt-4 border-t border-border'>
								<Button
									variant='ghost'
									onClick={() => router.push("/login")}
									className='w-full'
								>
									Log In
								</Button>
								<Button
									onClick={() => router.push("/signup")}
									className='w-full'
								>
									Get Started
								</Button>
							</div>
						</div>
					</div>
				)}
			</nav>
		</header>
	);
}
