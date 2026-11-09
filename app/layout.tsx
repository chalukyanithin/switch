import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import AppLayoutShell from "@/components/ui/AppLayoutShell";

export const metadata: Metadata = {
  title: "Switch — Every Interest Deserves Its Own World",
  description: "A multi-domain social discovery platform connecting Technology, Meme, and Cricket worlds.",
  icons: {
    icon: "/switch-logo-blue.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased bg-background text-foreground transition-colors duration-200">
        <AuthProvider>
          <AppLayoutShell>
            {children}
          </AppLayoutShell>
        </AuthProvider>
      </body>
    </html>
  );
}
