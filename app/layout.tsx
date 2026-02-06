import type { Metadata } from "next";
import { Inter, IBM_Plex_Sans_Thai } from "next/font/google";
import "./globals.css";
import AuthProvider from "./components/AuthProvider";

// ฟอนต์ภาษาอังกฤษ/ตัวเลข (Inter)
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

// ฟอนต์ภาษาไทย (IBM Plex Sans Thai)
const ibmPlexThai = IBM_Plex_Sans_Thai({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["thai", "latin"],
  variable: "--font-ibm-plex-thai",
  display: 'swap',
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
        className={`${inter.variable} ${ibmPlexThai.variable} font-sans antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}