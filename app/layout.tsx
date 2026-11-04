import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import AppLayoutShell from "@/components/ui/AppLayoutShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Switch — Every Interest Deserves Its Own World",
  description: "A multi-domain social platform providing specialized experiences for Cooking, Art, Technology, Music, and Fitness.",
  icons: {
    icon: "/switch-logo-blue.png"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground transition-colors duration-200`}>
        <AuthProvider>
          <AppLayoutShell>
            {children}
          </AppLayoutShell>
        </AuthProvider>
      </body>
    </html>
  );
}
