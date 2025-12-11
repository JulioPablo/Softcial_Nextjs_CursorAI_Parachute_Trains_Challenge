import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Parachute Trains Puzzle",
  description: "A visual simulation of the parachute trains collision puzzle",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
