import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeRegistry from '../components/ThemeRegistry/ThemeRegistry';
import DateProvider from '../components/Providers/DateProvider';
import { LanguageProvider } from '../contexts/LanguageContext';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lifetime - Visualize Your Life Journey",
  description: "Track and visualize your life journey week by week, with important events and milestones.",
  openGraph: {
    title: "Lifetime - Visualize Your Life Journey",
    description: "Track and visualize your life journey week by week, with important events and milestones.",
    locale: "en_US",
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
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeRegistry>
          <LanguageProvider>
            <DateProvider>
              {children}
            </DateProvider>
          </LanguageProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
