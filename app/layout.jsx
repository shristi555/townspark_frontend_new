import { Geist, Geist_Mono, Public_Sans } from "next/font/google";
import "./globals.css";

const publicSans = Public_Sans({subsets:['latin'],variable:'--font-sans'});


export default function RootLayout({ children }) {
	return (
		<html lang='en' className={publicSans.variable}>
			<body>{children}</body>
		</html>
	);
}
