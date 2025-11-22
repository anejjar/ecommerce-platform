import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { StoreProvider } from '@/lib/redux/StoreProvider';
import { SessionProvider } from '@/components/SessionProvider';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { IntlProvider } from '@/components/IntlProvider';
import { Toaster } from 'react-hot-toast';
import { CustomScripts } from '@/components/CustomScripts';
import { CustomStyles } from '@/components/CustomStyles';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "E-Commerce Platform",
  description: "Modern e-commerce platform built with Next.js",
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
        <SessionProvider>
          <IntlProvider>
            <SettingsProvider>
              <StoreProvider>
                <CustomStyles />
                <CustomScripts />
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
              </StoreProvider>
            </SettingsProvider>
          </IntlProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
