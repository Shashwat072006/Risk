import type { Metadata } from "next";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";

export const metadata: Metadata = {
  title: "TransactionGuard — Real-Time Transaction Risk & Chargeback Defense",
  description:
    "The intelligence layer between your payment flow and financial loss. Real-time fraud detection, explainable decisions, and chargeback defense.",
  keywords: ["fraud detection", "transaction risk", "chargeback defense", "payment security", "fintech"],
  openGraph: {
    title: "TransactionGuard",
    description: "Real-Time Transaction Risk & Chargeback Defense",
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
      <body>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
