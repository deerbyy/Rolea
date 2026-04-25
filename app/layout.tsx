import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rolea | Истории, в которых ты герой",
  description:
    "Rolea помогает создавать миры, персонажей и AI-ролевые истории, в которых пользователь участвует через чат."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
