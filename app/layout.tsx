import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "SBA Business Valuation Platform — Buy or Sell a Business with an SBA Loan",
    template: "%s | SBA Platform"
  },
  description: "Value any small business for sale, calculate SBA 7(a) loan payments, check eligibility, and browse SBA-eligible businesses — free tools for buyers and sellers.",
  keywords: ["SBA loan calculator", "business valuation", "buy a small business", "SBA 7a loan", "small business for sale", "business acquisition", "DSCR calculator"],
  openGraph: {
    title: "SBA Business Valuation Platform",
    description: "Free SBA loan calculator and business valuation tools for buyers and sellers.",
    url: "https://buywithsba.com",
    siteName: "SBA Platform",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SBA Business Valuation Platform",
    description: "Free SBA loan calculator and business valuation tools.",
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "7ddmBcUai16oicNA-myVh_3rZHiqptlxPx3kBuv-Q6Y",
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={geist.className}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}