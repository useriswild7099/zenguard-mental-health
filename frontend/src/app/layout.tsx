import type { Metadata } from "next";
import { Inter, Space_Grotesk, Courier_Prime } from "next/font/google";
import "./globals.css";
import { DYNAMIC_CLASSES } from '@/lib/safelist';

// Ensure Tailwind sees these classes
const _safelist = DYNAMIC_CLASSES;

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["300", "400", "500", "600", "700"],
});

const courierPrime = Courier_Prime({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "ZenGuard AI - Your Safe Space",
  description: "Anonymous, privacy-first mental health support. Express yourself freely - nothing is stored.",
  keywords: ["mental health", "student wellness", "anonymous journaling", "stress relief", "privacy-first"],
  authors: [{ name: "ZenGuard AI" }],
  openGraph: {
    title: "ZenGuard AI - Your Safe Space",
    description: "Express yourself freely. We analyze, support, and never store.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${courierPrime.variable}`}>
      <body className="antialiased">
        {/* Privacy Notice - Always visible */}
        <div className="fixed bottom-4 left-4 z-50">
          <div className="privacy-badge">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <span>100% Private</span>
          </div>
        </div>
        
        {/* Main Content */}
        <main className="min-h-screen">
          {children}
        </main>
        
        {/* Footer */}
        <footer className="text-center py-6 text-sm text-gray-500">
          <p>Your thoughts are safe. Nothing is stored. Ever.</p>
        </footer>
      </body>
    </html>
  );
}
