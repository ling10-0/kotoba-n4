import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "Kotoba 日課｜日文 N4 每日單字教練",
  description: "每天 15–20 分鐘，複習單字、完成測驗、記錄造句與學習進度。",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: {
    title: "Kotoba 日課｜日文 N4 每日單字教練",
    description: "每天 15 分鐘，把日文留下來。",
    images: [{ url: "/og.png", width: 1536, height: 1024, alt: "Kotoba 日課" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kotoba 日課",
    description: "每天 15 分鐘，把日文留下來。",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-Hant">
      <body>{children}</body>
    </html>
  );
}
