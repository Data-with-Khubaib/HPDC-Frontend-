import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "HPDC ESG Certificate Platform",
  description: "Halal Development Corporation ESG Certification Management Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full font-sans antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
