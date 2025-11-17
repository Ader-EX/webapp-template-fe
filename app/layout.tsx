import type React from "react";
import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import {Toaster} from "react-hot-toast";
import {ClientAuthSetup} from "@/components/ClientAuthSetup";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter", // Add this
    display: "swap", // Add this to prevent FOUT
});

export const metadata: Metadata = {
    title: "Data Management",
    description: "Sistem manajemen yang powerful dan mudah digunakan",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="id">
        <head>
            <link rel="icon" href="/logo.png" sizes="any"/>
        </head>
        <body className={inter.className} suppressHydrationWarning>
            <ClientAuthSetup/>
            <Toaster/>
            {children}
        </body>
        </html>
    );
}