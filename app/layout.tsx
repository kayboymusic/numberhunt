import type { Metadata } from "next";
import { JetBrains_Mono, Syne } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-jetbrains",
});

const syne = Syne({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-syne",
});

export const metadata: Metadata = {
  title: "NumberHunt — Daily Math Puzzle",
  description: "Guess the hidden equation. One puzzle per day.",
};

const themeBootstrap = `(function(){try{var s=localStorage.getItem('numberhunt-state');var t='dark';if(s){var p=JSON.parse(s);if(p&&p.state&&p.state.theme==='light')t='light';}if(t==='dark')document.documentElement.classList.add('dark');}catch(e){document.documentElement.classList.add('dark');}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jetbrainsMono.variable} ${syne.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body className="min-h-full flex flex-col bg-[var(--bg)] text-[var(--text)] font-mono" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
