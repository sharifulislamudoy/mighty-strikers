// components/ClientLayout.jsx
'use client';

import Footer from "@/Components/Footer";
import Navbar from "@/Components/Navbar";
import { SessionProvider } from "next-auth/react";


export default function ClientLayout({ children }) {
  return (
    <SessionProvider>
      <Navbar />
      {children}
      <Footer />
    </SessionProvider>
  );
}
