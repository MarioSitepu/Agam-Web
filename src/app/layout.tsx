import type { Metadata } from "next";
import { Playball, Montserrat } from "next/font/google";
import "./globals.css";

const playball = Playball({
  weight: "400",
  variable: "--font-playball",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Warkop Agam | Authentic Medan Taste",
  description: "Experience the soul of Medan streets at Warkop Agam. Specializing in Indomie Bangladesh, Signature Teh Tarek, and authentic Mie Sop Medan.",
};

import { CartProvider } from "@/context/CartContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playball.variable} ${montserrat.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
