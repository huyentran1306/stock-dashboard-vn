import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Header } from "@/components/header";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "StockAI — Vietnam Market Dashboard",
  description: "Premium Vietnam Stock Market Technical Analysis Dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `try{const t=localStorage.getItem('theme')||'dark';document.documentElement.classList.toggle('dark',t==='dark')}catch(e){}`
        }} />
      </head>
      <body className={`${geist.className} min-h-screen bg-background text-foreground antialiased`}>
        {/* Ambient orbs */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/5 dark:bg-emerald-500/[0.07] rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-500/5 dark:bg-cyan-500/[0.05] rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/[0.03] dark:bg-indigo-500/[0.04] rounded-full blur-3xl" />
        </div>
        <Providers>
          <Header />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
          <footer className="border-t border-border mt-16 py-6 text-center">
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              ⚠️ Chỉ là phân tích kỹ thuật tự động, không phải khuyến nghị đầu tư.
            </p>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
