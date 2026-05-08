import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Stock Dashboard",
  description: "Vietnam Stock Market Analysis Dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className="dark">
      <body className={`${geist.className} min-h-screen bg-background text-foreground`}>
        <header className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-3 flex items-center gap-6">
            <h1 className="text-lg font-bold text-primary">📈 Stock Dashboard</h1>
            <nav className="flex gap-4 text-sm">
              <Link href="/" className="hover:text-primary transition-colors">Phân tích</Link>
              <Link href="/history" className="hover:text-primary transition-colors">Lịch sử</Link>
              <Link href="/positions" className="hover:text-primary transition-colors">Vị thế</Link>
            </nav>
          </div>
        </header>
        <main className="container mx-auto px-4 py-6">
          {children}
        </main>
        <footer className="border-t border-border mt-8 py-4 text-center text-xs text-muted-foreground">
          ⚠️ Chỉ là phân tích kỹ thuật tự động, không phải khuyến nghị đầu tư.
        </footer>
      </body>
    </html>
  );
}
