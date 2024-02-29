import { Inter } from "next/font/google";
import "../globals.css";
import AuthProvider from "@components/auth/AuthProvider";
import Navbar from "@components/Navbar";
import ToasterContext from "@components/auth/ToasterContext";
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Nails",
  description: "Next-Nails",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ToasterContext />
          <Navbar />
            {children}
          <Analytics />
          <SpeedInsights />
        </AuthProvider>
      </body>
    </html>
  );
}
