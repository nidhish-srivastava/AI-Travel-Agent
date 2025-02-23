import { Geist, Geist_Mono } from "next/font/google";
import Head from "next/head";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "AI Travel Planner | Personalized Itineraries Instantly",
  description:
    "Plan your trips effortlessly with AI Travel Planner. Get personalized itineraries, budget-friendly suggestions, and travel tips instantly.",
  keywords: [
    "AI travel planner",
    "personalized itineraries",
    "budget travel suggestions",
    "travel planning app",
    "AI trip planner",
    "vacation planner",
  ],
  author: "Nidhish",
  url: "https://ai-travel-agent-seven.vercel.app", // Include website URL for SEO purposes
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords.join(", ")} />
        <meta name="author" content={metadata.author} />
        <link rel="canonical" href={metadata.url} />
      </Head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
