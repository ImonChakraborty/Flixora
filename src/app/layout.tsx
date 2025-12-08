import AnimatedDotsBackground from "@/components/AnimatedDotsBackground";
import LayoutWrapper from "@/components/LayoutWrapper";
import PerformanceOptimizer from "@/components/PerformanceOptimizer";
import "./globals.css";
import { Inter } from "next/font/google";
import type { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Flixora - Stream Movies & Series",
  description:
    "Your ultimate destination for streaming movies and TV series. Discover trending content, top-rated films, and popular shows.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon", type: "image/png", sizes: "32x32" },
    ],
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100 antialiased min-h-screen relative`}>
        <AnimatedDotsBackground />
        <div className="relative z-[1]">
          <PerformanceOptimizer />
          <LayoutWrapper>
            <div className="scroll-container">
              {children}
            </div>
          </LayoutWrapper>
        </div>
      </body>
    </html>
  );
}
