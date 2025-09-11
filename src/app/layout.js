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
  title: "Mighty Strikers | Where Passion Meets Power!",
  description:
    "Official Mighty Strikers Cricket Club website. Get live scores, player stats, match updates, and join our team",
  keywords:
    "Mighty Strikers, cricket club, cricket team, live scores, cricket stats, cricket coaching, youth cricket, cricket academy",
  authors: [{ name: "Mighty Strikers" }],
  openGraph: {
    title: "Mighty Strikers | Where Passion Meets Power!",
    description:
      "Stay updated with Mighty Strikers. Live scores, player profiles, match highlights, and expert coaching for aspiring cricketers.",
    url: "https://mighty-strikers.vercel.app/",
    siteName: "Mighty Strikers",
    images: [
      {
        url: "https://res.cloudinary.com/dohhfubsa/image/upload/v1757486830/file_00000000cdf051f7a0188f4f67246467_cluct7.png",
        width: 1200,
        height: 630,
        alt: "Mighty Strikers",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mighty Strikers | Where Passion Meets Power!",
    description:
      "Follow Mighty Strikers for match updates, live scores, and professional cricket training.",
    images: [
      "https://res.cloudinary.com/dohhfubsa/image/upload/v1757486830/file_00000000cdf051f7a0188f4f67246467_cluct7.png",
    ],
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
  alternates: {
    canonical: "https://mighty-strikers.vercel.app/",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#1a472a" />
        <meta
          name="google-site-verification"
          content="mnxa3sKPJ91f6rAGqbXyyIZYDSJBR1H8s_06QAASItM"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
