import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Pebbles Dev Build",
  description: "Deep imitation and reinforcement learning with the Proximal Policy Optimization algorithm for Mars sample-return mission rover simulation",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="overflow-hidden">
      <head>
        <link rel="shortcut icon" href="/favicon.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
