import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Setup luxury serif font using your local file
const cinzel = localFont({
  src: "../public/assets/fonts/Cinzel/Cinzel-VariableFont_wght.ttf",
  variable: "--font-cinzel",
});

// Setup elegant cursive font using your local file
const greatVibes = localFont({
  src: "../public/assets/fonts/Great_Vibes/GreatVibes-Regular.ttf",
  variable: "--font-great-vibes",
});

export const metadata: Metadata = {
  title: "A Royal Farewell",
  description: "Cinematic Senior Farewell Invitation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${cinzel.variable} ${greatVibes.variable} font-serif bg-[#FFF8E7] text-[#D4AF37] overflow-x-hidden`}>
        {children}
      </body>
    </html>
  );
}