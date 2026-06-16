import type { Metadata, Viewport } from "next";
import { Inter, Lora } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
  display: "swap"
});

const lora = Lora({
  subsets: ["latin", "cyrillic"],
  variable: "--font-serif",
  display: "swap"
});

export const metadata: Metadata = {
  title: "Rolea — истории, в которых ты герой",
  description:
    "Rolea помогает создавать миры, персонажей и AI-ролевые истории, в которых пользователь участвует через чат.",
  applicationName: "Rolea",
  authors: [{ name: "Rolea" }],
  keywords: [
    "Rolea",
    "AI ролевые игры",
    "интерактивные истории",
    "ролеплей",
    "AI storytelling",
    "fanfic"
  ],
  openGraph: {
    title: "Rolea — истории, в которых ты герой",
    description:
      "Создавай миры, персонажей и сцены, играй через чат как полноценный участник истории.",
    locale: "ru_RU",
    type: "website"
  }
};

export const viewport: Viewport = {
  themeColor: "#050915",
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      suppressHydrationWarning
      className={`${inter.variable} ${lora.variable}`}
    >
      <head>
        <script
          // Prevents theme flash by applying saved theme before hydration
          dangerouslySetInnerHTML={{
            __html: `(()=>{try{const s=localStorage.getItem('rolea-theme');const m=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';const t=s||m;document.documentElement.dataset.theme=t;}catch(e){document.documentElement.dataset.theme='dark';}})()`
          }}
        />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
