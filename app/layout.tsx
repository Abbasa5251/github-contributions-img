import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "GitHub Contributors Image Generator",
	description:
		"Generate beautiful contributor images for your GitHub repositories in PNG and SVG formats",
	keywords: [
		"GitHub",
		"contributors",
		"image",
		"generator",
		"PNG",
		"SVG",
		"README",
	],
	authors: [{ name: "Contributors Image Generator" }],
	openGraph: {
		title: "GitHub Contributors Image Generator",
		description:
			"Generate beautiful contributor images for your GitHub repositories",
		type: "website",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				{children}
				<Toaster />
			</body>
		</html>
	);
}
