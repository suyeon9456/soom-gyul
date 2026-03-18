import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "숨결 - 실시간 대기질",
  description: "페르소나 맞춤형 프리미엄 대기질 관리 앱",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">{children}</body>
    </html>
  );
}
