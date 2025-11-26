import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from 'react-hot-toast';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { prisma } from '@/lib/prisma';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await prisma.storeSetting.findMany({
    where: {
      key: {
        in: ['seo_meta_title', 'seo_meta_description', 'seo_og_title', 'seo_og_description', 'seo_og_image', 'seo_twitter_handle']
      }
    }
  });

  const settingsMap = settings.reduce((acc, setting) => {
    acc[setting.key] = setting.value;
    return acc;
  }, {} as Record<string, string>);

  const title = settingsMap.seo_meta_title || "E-Commerce Platform";
  const description = settingsMap.seo_meta_description || "Modern e-commerce platform built with Next.js";
  const ogImage = settingsMap.seo_og_image || "/og-image.jpg";

  return {
    title: {
      default: title,
      template: `%s | ${title}`,
    },
    description,
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
    openGraph: {
      title: settingsMap.seo_og_title || title,
      description: settingsMap.seo_og_description || description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: settingsMap.seo_og_title || title,
      description: settingsMap.seo_og_description || description,
      images: [ogImage],
      creator: settingsMap.seo_twitter_handle,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

/**
 * Root layout - Required by Next.js
 * All routes (localized and non-localized) must go through this layout
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
