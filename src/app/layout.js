import { Manrope, Inter } from "next/font/google";
import "./globals.css";
import NavbarClient from "@/components/navbar-client";
import Footer from "@/components/footer";


const manrope = Manrope({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata = {
  title: "ImpactHub — Social Development Events Platform",
  description: "Discover, join, and create community service events that make a difference.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <NavbarClient />
        {children}
        <Footer />
      </body>
    </html>
  );
}
