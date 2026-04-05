import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Providers from "@/components/providers";
import { GoogleAnalytics } from "@next/third-parties/google";

const tanker = localFont({
  src: "../../public/fonts/Tanker-Regular.woff",
  variable: "--font-display",
});

const firaSans = localFont({
  src: "../../public/fonts/FiraSans-Regular.woff",
  variable: "--font-subheading",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SaaS Starter Kit",
  description: "Ship your AI SaaS in days, not months.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${tanker.variable} ${firaSans.variable} h-full antialiased`}
    >
      <body>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
