import { Inter } from "next/font/google";
import "./globals.css";
import MyProvider from "@/providers/MyProvider";
import React from "react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { DatabaseProvider } from "@/lib/context";
import { AuthContextProvider } from "@/contexts/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Blocklance",
    description: "Decentralised freelancing platform",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <MyProvider>
                    <AuthContextProvider>
                        <DatabaseProvider>
                            <Navbar />
                            {children}
                            <Footer />
                        </DatabaseProvider>
                    </AuthContextProvider>
                </MyProvider>
            </body>
        </html>
    );
}
