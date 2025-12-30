import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { AppLayout } from "@/components/layout/app-layout";
import useAuthStore from "@/store/auth_store";
import { AuthProvider } from "@/components/providers/auth-provider";

const geistSans = localFont({
	src: "../public/fonts/geist/Geist[wght].woff2",
	variable: "--font-geist-sans",
	weight: "100 900",
});

const geistMono = localFont({
	src: "../public/fonts/geist_mono/GeistMono[wght].woff2",
	variable: "--font-geist-mono",
	weight: "100 900",
});

export const metadata = {
	title: "Townspark - Better Neighborhoods Together",
	description:
		"Report issues, track progress, and connect with local authorities",
};

export default function RootLayout({ children }) {
	return (
		<html lang='en' suppressHydrationWarning>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<ThemeProvider
					attribute='class'
					defaultTheme='system'
					enableSystem
					disableTransitionOnChange
				>
					<AuthProvider>
						<AppLayout>{children}</AppLayout>
					</AuthProvider>
					<Toaster />
				</ThemeProvider>
			</body>
		</html>
	);
}
