import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Header } from "@/components/layout/header";
import { Navigation } from "@/components/layout/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Footer } from "@/components/layout/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "토토픽 (TOTOPICK) - 현명한 선택",
  description: "스포츠 분석 및 정보 공유 커뮤니티",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Header />
            <Navigation />
            <div className="container flex-1 py-6">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <main className="lg:col-span-3">{children}</main>
                <div className="lg:col-span-1">
                  <Sidebar />
                </div>
              </div>
            </div>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}

