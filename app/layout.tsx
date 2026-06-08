import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";


export const metadata: Metadata = {
  title: "EPM Pre-Shift Inspection",
  description: "Even Par Mine Pre-Shift Inspection Form",
  icons: {
    icon: [
      { url: "/Black No BG.png", type: "image/png" },
    ],
    apple: [
      { url: "/Black No BG.png", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
