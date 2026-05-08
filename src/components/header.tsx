'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme, useLang } from '@/components/providers';
import { t } from '@/lib/i18n';
import { Sun, Moon, TrendingUp, Globe, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function isMarketOpen(): boolean {
  const now = new Date();
  const vnNow = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }));
  const day = vnNow.getDay(); // 0=Sun, 6=Sat
  const hour = vnNow.getHours();
  const min = vnNow.getMinutes();
  const time = hour * 60 + min;
  if (day === 0 || day === 6) return false;
  // HOSE: 9:00–14:45
  return time >= 9 * 60 && time <= 14 * 60 + 45;
}

export function Header() {
  const { theme, toggle } = useTheme();
  const { lang, setLang } = useLang();
  const pathname = usePathname();
  const marketOpen = isMarketOpen();

  const navLinks = [
    { href: '/', label: t(lang, 'nav_analysis') },
    { href: '/history', label: t(lang, 'nav_history') },
    { href: '/positions', label: t(lang, 'nav_positions') },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-background/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="relative w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <TrendingUp className="w-4 h-4 text-white" strokeWidth={2.5} />
              {marketOpen && (
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-background animate-pulse" />
              )}
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-bold tracking-tight text-foreground group-hover:text-emerald-500 transition-colors">
                {t(lang, 'logo_title')}
              </div>
              <div className="text-[10px] text-muted-foreground leading-none">VN Market AI</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
                    ${active
                      ? 'text-foreground bg-white/10 dark:bg-white/[0.08]'
                      : 'text-muted-foreground hover:text-foreground hover:bg-white/[0.05]'
                    }`}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute inset-0 rounded-lg bg-white/10 dark:bg-white/[0.08]"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                  <span className="relative">{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            {/* Market status badge */}
            <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border
              ${marketOpen
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                : 'border-zinc-600/40 bg-zinc-800/40 text-zinc-500 dark:text-zinc-400'
              }`}
            >
              <Activity className="w-3 h-3" />
              <span>{marketOpen ? t(lang, 'nav_market_live') : t(lang, 'nav_market_closed')}</span>
            </div>

            {/* Lang toggle */}
            <button
              onClick={() => setLang(lang === 'vi' ? 'en' : 'vi')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-white/[0.06] transition-all border border-transparent hover:border-white/10"
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="hidden sm:inline uppercase">{lang}</span>
            </button>

            {/* Theme toggle */}
            <button
              onClick={toggle}
              className="relative w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/[0.06] transition-all border border-transparent hover:border-white/10"
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait" initial={false}>
                {theme === 'dark' ? (
                  <motion.span key="sun"
                    initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                    transition={{ duration: 0.2 }}
                    className="absolute"
                  >
                    <Sun className="w-4 h-4" />
                  </motion.span>
                ) : (
                  <motion.span key="moon"
                    initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
                    transition={{ duration: 0.2 }}
                    className="absolute"
                  >
                    <Moon className="w-4 h-4" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        <div className="md:hidden flex gap-1 pb-3 -mt-1">
          {navLinks.map(link => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex-1 text-center px-2 py-1.5 rounded-lg text-xs font-medium transition-all
                  ${active
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                    : 'text-muted-foreground hover:bg-white/[0.05]'
                  }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
