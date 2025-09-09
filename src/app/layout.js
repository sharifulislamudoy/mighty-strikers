import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientLayout from "./Components/ClientLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Mighty Strikers Cricket Club - Where Passion Meets Power!",
  description: "Join Mighty Strikers Cricket Club for competitive matches, and youth development programs. Elevate your cricket skills with our expert trainers and state-of-the-art facilities.",
  keywords: "cricket club, cricket training, cricket matches, youth cricket, cricket coaching, cricket academy, friendly match",
  authors: [{ name: "Mighty Strikers Cricket Club" }],
  openGraph: {
    title: "Mighty Strikers Cricket Club - Where Passion Meets Power!",
    description: "Join Mighty Strikers Cricket Club for competitive matches, and youth development programs. Elevate your cricket skills with our expert trainers and state-of-the-art facilities.",
    url: "https://www.mighty-strikers.vercl.app",
    siteName: "Mighty Strikers",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Mighty Strikers Cricket Team",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mighty Strikers Cricket Club - Where Passion Meets Power!",
    description: "Join Mighty Strikers Cricket Club for professional coaching and competitive matches.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google0dee5ccf4244c827.html",
  },
  alternates: {
    canonical: "https://www.mighty-strikers.vercel.app",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#1a472a" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}