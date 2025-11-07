// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Sidebar from "./components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const meta: Metadata = {
  title: "Inventory Management System",
  description: "Simple inventory management system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex min-h-screen`}>
        <Sidebar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
