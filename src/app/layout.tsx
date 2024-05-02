import type { Metadata } from "next";
import "./globals.css";

import { Footer } from "@/app/components/Footer";
import { Header } from "@/app/components/Header";

export const metadata: Metadata = {
  title: "ethWallet",
  description: "Personalising your finances",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex flex-col h-screen gap-4 px-2 bg-brand-blue w-full mx-auto  max-w-screen-xl">
        <Header />
        <div className="grow">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
