import type { Metadata } from "next";
import { Kanit } from "next/font/google"; 
import "./globals.css";
import AuthProvider from "./components/AuthProvider";
// 2. กำหนดค่าฟอนต์

const kanit = Kanit({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "700"], 
  variable: "--font-kanit", 
  display: "swap",
});

export const metadata: Metadata = {
  title: "FLAS Co-Space | ระบบจองห้องออนไลน์",
  description: "ระบบจองห้อง Co-Working Space คณะศิลปศาสตร์และวิทยาศาสตร์ มก.กพส.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body
        className={`${kanit.className}`} 
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}