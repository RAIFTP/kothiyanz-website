import "./globals.css";
import { Playfair_Display, Inter } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading"
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body"
});

export const metadata = {
  title: "Kothiyanz",
  description: "Premium Restaurant Experience"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
