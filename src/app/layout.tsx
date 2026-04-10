import type { Metadata } from "next";
import { Playball, Montserrat } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { OrderProvider } from "@/context/OrderContext";

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
        <OrderProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </OrderProvider>
      </body>
    </html>
  );
}
