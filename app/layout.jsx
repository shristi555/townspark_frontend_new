import { Geist, Geist_Mono, Public_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const publicSans = Public_Sans({ subsets: ["latin"], variable: "--font-sans" });

export default function RootLayout({ children }) {
	return (
		<html lang='en' className={publicSans.variable} data-theme='dark'>
			<body className='dark'>
				{children}
				<Toaster />
			</body>
		</html>
	);
}
