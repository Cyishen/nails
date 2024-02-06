import { Inter } from "next/font/google";
import "../globals.css";
import AuthProvider from "@components/auth/AuthProvider";
import ToasterContext from "@components/auth/ToasterContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Auth Nails",
  description: "Auth Next-Nails",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} mt-8 h-[100vh]`}>
        <AuthProvider>
          <ToasterContext />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
