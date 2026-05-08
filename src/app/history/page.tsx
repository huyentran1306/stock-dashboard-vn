'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLang } from '@/components/providers';
import { t } from '@/lib/i18n';
import { getHistory, type HistoryEntry } from '@/lib/api';
import { TrendingUp, TrendingDown, Minus, Clock, History } from 'lucide-react';

function SignalBadge({ type }: { type: string }) {
  if (type === 'BUY') return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/15 text-emerald-500 border border-emerald-500/25">
      <TrendingUp className="w-2.5 h-2.5" />BUY
    </span>
  );
  if (type === 'SELL') return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-500/15 text-rose-500 border border-rose-500/25">
      <TrendingDown className="w-2.5 h-2.5" />SELL
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/15 text-amber-500 border border-amber-500/25">
      <Minus className="w-2.5 h-2.5" />WATCH
    </span>
  );
}

function formatVNTime(isoStr: string) {
  return new Date(isoStr).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', hour: '2-digit', minute: '2-digit' });
}

export default function HistoryPage() {
  const { lang } = useLang();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHistory().then(d => { setHistory(d); setLoading(false); });
  }, []);

  const grouped = history.reduce<Record<string, HistoryEntry[]>>((acc, entry) => {
    const date = new Date(entry.timestamp).toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' });
    if (!acc[date]) acc[date] = [];
    acc[date].push(entry);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
          {t(lang, 'signal_history')}
        </h1>
        <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          7 ngày gần nhất · tối đa 200 tín hiệu
        </p>
      </motion.div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-2xl border border-border/60 bg-card p-5 animate-pulse">
              <div className="h-3 bg-muted rounded w-1/4 mb-4" />
              {[...Array(3)].map((_, j) => (
                <div key={j} className="flex gap-3 items-center mb-3">
                  <div className="w-12 h-4 bg-muted rounded" />
                  <div className="flex-1 h-3 bg-muted rounded" />
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : history.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-muted/60 flex items-center justify-center mb-4">
            <History className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-base font-semibold mb-1">{t(lang, 'no_history')}</h3>
          <p className="text-sm text-muted-foreground">{t(lang, 'no_history_desc')}</p>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([date, entries], gi) => (
            <motion.div key={date} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: gi * 0.07 }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{date}</div>
                <div className="flex-1 h-px bg-border/60" />
                <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{entries.length} tín hiệu</span>
              </div>
              <div className="space-y-2">
                {entries.map((entry, i) => {
                  const hasBuy = entry.signals.some(s => s.type === 'BUY');
                  const hasSell = entry.signals.some(s => s.type === 'SELL');
                  return (
                    <div
                      key={i}
                      className={`rounded-xl border bg-card px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3 hover:border-border transition-colors
                        ${hasBuy ? 'border-emerald-500/20' : hasSell ? 'border-rose-500/20' : 'border-border/50'}`}
                    >
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-base font-black tracking-tight text-foreground w-12">{entry.symbol}</span>
                        <span className="text-sm font-bold tabular-nums text-foreground">
                          {(entry.price * 1000).toLocaleString('vi-VN')}đ
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />{formatVNTime(entry.timestamp)}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 sm:ml-auto">
                        {entry.signals.map((sig, j) => (
                          <div key={j} className="flex items-center gap-1.5">
                            <SignalBadge type={sig.type} />
                            <span className="text-[10px] text-muted-foreground max-w-[200px] truncate">{sig.reason}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}