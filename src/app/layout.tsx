import type { Metadata } from "next";
import { Outfit, Space_Grotesk, Barlow_Condensed, Playfair_Display } from "next/font/google";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import CustomCursor from "@/components/CustomCursor";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "500", "700"],
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  style: ["normal"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Jaison Pradeep | Full Stack Developer • AI Engineer",
  description:
    "Professional portfolio of Jaison Pradeep, building high-performance intelligent systems. Specializing in Next.js 15, FastAPI, LangChain, RAG architectures, and custom MCP integrations.",
  keywords: [
    "Jaison Pradeep",
    "Full Stack Developer",
    "AI Engineer",
    "RAG Integration",
    "Next.js 15 Portfolio",
    "Model Context Protocol",
    "FastAPI Developer",
    "Intelligent Systems",
  ],
  authors: [{ name: "Jaison Pradeep" }],
  creator: "Jaison Pradeep",
  metadataBase: new URL("http://localhost:3000"),
  openGraph: {
    title: "Jaison Pradeep | Full Stack Developer • AI Engineer",
    description: "Building high-performance intelligent systems with modern full-stack tools and agent architectures.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jaison Pradeep | Full Stack Developer • AI Engineer",
    description: "Building high-performance intelligent systems with modern full-stack tools and agent architectures.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${spaceGrotesk.variable} ${barlowCondensed.variable} ${playfairDisplay.variable}`}
    >
      <body className="font-sans antialiased text-slate-900 bg-white min-h-screen">
        {/* Unified Smooth Scrolling Context Wrapper */}
        <SmoothScrollProvider>
          {/* Custom Trail Cursor */}
          <CustomCursor />
          
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
