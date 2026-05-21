'use client';

import { motion } from 'framer-motion';
import { useLang } from '@/components/providers';
import { t } from '@/lib/i18n';
import { TrendingUp, TrendingDown, Minus, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import {
  BarChart, Bar, ResponsiveContainer, ReferenceLine, Cell, Tooltip
} from 'recharts';
import type { StockAnalysis } from '@/lib/api';

function formatPrice(p: number) {
  return (p * 1000).toLocaleString('vi-VN') + 'đ';
}

function formatPercent(p: number) {
  return (p >= 0 ? '+' : '') + p.toFixed(2) + '%';
}

function RSIGauge({ value }: { value: number }) {
  const { lang } = useLang();
  const clamp = Math.max(0, Math.min(100, value));
  const color = value < 30 ? '#10b981' : value > 70 ? '#f43f5e' : '#f59e0b';
  const zone = value < 30 ? t(lang, 'rsi_oversold') : value > 70 ? t(lang, 'rsi_overbought') : t(lang, 'rsi_neutral');

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-xs text-muted-foreground">RSI(14)</span>
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-medium" style={{ color }}>{zone}</span>
          <span className="text-xs font-bold tabular-nums" style={{ color }}>{value.toFixed(1)}</span>
        </div>
      </div>
      <div className="relative h-2 rounded-full bg-muted overflow-hidden">
        <div className="absolute inset-0 flex">
          <div className="h-full bg-emerald-500/20" style={{ width: '30%' }} />
          <div className="h-full bg-amber-500/15" style={{ width: '40%' }} />
          <div className="h-full bg-rose-500/20" style={{ width: '30%' }} />
        </div>
        <motion.div
          className="absolute top-0 left-0 h-full rounded-full"
          style={{ background: color }}
          initial={{ width: '0%' }}
          animate={{ width: `${clamp}%` }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-muted-foreground">
        <span>0</span>
        <span className="text-emerald-500">30</span>
        <span className="text-rose-500">70</span>
        <span>100</span>
      </div>
    </div>
  );
}

function BBBar({ percentB }: { percentB: number }) {
  const { lang } = useLang();
  const clamp = Math.max(0, Math.min(100, percentB));
  const color = percentB < 20 ? '#10b981' : percentB > 80 ? '#f43f5e' : '#3b82f6';
  const zone = percentB < 0 ? t(lang, 'bb_below') : percentB > 100 ? t(lang, 'bb_above') : `%B ${percentB.toFixed(0)}%`;

  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs text-muted-foreground">{t(lang, 'bb_band')}</span>
        <span className="text-xs font-medium" style={{ color }}>{zone}</span>
      </div>
      <div className="relative h-2 rounded-full bg-muted overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 h-full rounded-full opacity-90"
          style={{ background: `linear-gradient(90deg, #10b981 0%, #3b82f6 50%, #f43f5e 100%)` }}
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 0.5 }}
        />
        {/* Indicator thumb */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-background shadow-sm bg-white"
          initial={{ left: 0 }}
          animate={{ left: `calc(${clamp}% - 6px)` }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
        <span>{t(lang, 'below_lower')}</span>
        <span>50%</span>
        <span>{t(lang, 'above_upper')}</span>
      </div>
    </div>
  );
}

function MACDChart({ macdLine, macdSignal, macdHistogram }: {
  macdLine: number; macdSignal: number; macdHistogram: number;
}) {
  const { lang } = useLang();
  // Simple 3-bar mini chart  
  const data = [
    { name: 'MACD', value: macdLine },
    { name: 'Signal', value: macdSignal },
    { name: 'Hist', value: macdHistogram },
  ];

  return (
    <div className="rounded-xl bg-muted/40 dark:bg-white/[0.03] border border-border/50 p-3">
      <div className="text-[10px] text-muted-foreground mb-2 font-medium">MACD(12,26,9)</div>
      <div className="flex gap-2 items-end">
        <div className="flex-1 h-14">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
              <ReferenceLine y={0} stroke="currentColor" strokeOpacity={0.15} strokeDasharray="2 2" />
              <Tooltip
                contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '10px', padding: '4px 8px' }}
                cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                formatter={(v) => [typeof v === 'number' ? v.toFixed(3) : String(v), '']}
              />
              <Bar dataKey="value" radius={[3, 3, 0, 0]}>
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.value >= 0 ? '#10b981' : '#f43f5e'} fillOpacity={0.85} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-col gap-1 text-right shrink-0">
          <div>
            <div className="text-[9px] text-muted-foreground">{t(lang, 'macd_label')}</div>
            <div className={`text-xs font-bold tabular-nums ${macdLine >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>{macdLine.toFixed(3)}</div>
          </div>
          <div>
            <div className="text-[9px] text-muted-foreground">{t(lang, 'signal_label')}</div>
            <div className="text-xs font-medium tabular-nums text-muted-foreground">{macdSignal.toFixed(3)}</div>
          </div>
          <div>
            <div className="text-[9px] text-muted-foreground">{t(lang, 'histogram')}</div>
            <div className={`text-xs font-bold tabular-nums ${macdHistogram >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
              {macdHistogram >= 0 ? '▲' : '▼'} {Math.abs(macdHistogram).toFixed(3)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SignalPill({ type, strength, reason }: { type: string; strength: string; reason: string }) {
  const { lang } = useLang();
  let label: string;
  let cls: string;
  let Icon: typeof TrendingUp;
  if (type === 'BUY') {
    Icon = TrendingUp;
    cls = 'bg-emerald-500/10 border-emerald-500/25 text-emerald-600 dark:text-emerald-400';
    label = strength === 'STRONG' ? t(lang, 'buy_strong') : strength === 'MODERATE' ? t(lang, 'buy_moderate') : t(lang, 'buy_weak');
  } else if (type === 'SELL') {
    Icon = TrendingDown;
    cls = 'bg-rose-500/10 border-rose-500/25 text-rose-600 dark:text-rose-400';
    label = strength === 'STRONG' ? t(lang, 'sell_strong') : strength === 'MODERATE' ? t(lang, 'sell_moderate') : t(lang, 'sell_weak');
  } else {
    Icon = Minus;
    cls = 'bg-amber-500/10 border-amber-500/25 text-amber-600 dark:text-amber-400';
    label = t(lang, 'watch');
  }

  return (
    <div className={`flex items-start gap-2 rounded-lg border px-3 py-2 ${cls}`}>
      <div className="shrink-0 mt-0.5">
        <Icon className="w-3.5 h-3.5" strokeWidth={2.5} />
      </div>
      <div className="min-w-0">
        <div className="text-[10px] font-bold tracking-wide">{label}</div>
        <div className="text-[10px] opacity-75 leading-relaxed">{reason}</div>
      </div>
    </div>
  );
}

export function StockCard({ stock, index = 0 }: { stock: StockAnalysis; index?: number }) {
  const lang = useLang().lang;

  const hasBuy = stock.signals.some(s => s.type === 'BUY' && (s.strength === 'STRONG' || s.strength === 'MODERATE'));
  const hasSell = stock.signals.some(s => s.type === 'SELL' && (s.strength === 'STRONG' || s.strength === 'MODERATE'));

  let cardGlow = '';
  let borderAccent = 'border-border/60';
  let priceGradient = 'from-zinc-500/10 to-zinc-500/5';

  if (hasBuy) {
    cardGlow = 'shadow-emerald-500/10';
    borderAccent = 'border-emerald-500/25';
    priceGradient = 'from-emerald-500/10 to-emerald-500/5';
  } else if (hasSell) {
    cardGlow = 'shadow-rose-500/10';
    borderAccent = 'border-rose-500/25';
    priceGradient = 'from-rose-500/10 to-rose-500/5';
  }

  const pos1D = stock.priceChange1D >= 0;
  const pos5D = stock.priceChange5D >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: 'easeOut' }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className={`group relative rounded-2xl border ${borderAccent} bg-card shadow-xl ${cardGlow}
        hover:shadow-2xl transition-shadow duration-300 overflow-hidden`}
    >
      {/* Top gradient accent */}
      {(hasBuy || hasSell) && (
        <div className={`absolute top-0 left-0 right-0 h-0.5 ${hasBuy ? 'bg-gradient-to-r from-emerald-500/80 via-emerald-400 to-emerald-500/80' : 'bg-gradient-to-r from-rose-500/80 via-rose-400 to-rose-500/80'}`} />
      )}

      {/* Header */}
      <div className={`px-5 pt-5 pb-4 bg-gradient-to-br ${priceGradient}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl font-black tracking-tight text-foreground">{stock.symbol}</span>
              {stock.signals.length > 0 && (
                <div className={`px-1.5 py-0.5 rounded-md text-[9px] font-bold tracking-wide
                  ${hasBuy ? 'bg-emerald-500/15 text-emerald-500' : hasSell ? 'bg-rose-500/15 text-rose-500' : 'bg-amber-500/15 text-amber-500'}`}>
                  {hasBuy ? 'BUY' : hasSell ? 'SELL' : 'WATCH'}
                </div>
              )}
              {/* Rebound Score badge */}
              {stock.reboundScore >= 40 && (
                <div className={`px-1.5 py-0.5 rounded-md text-[9px] font-bold tracking-wide flex items-center gap-0.5
                  ${stock.reboundScore >= 70 ? 'bg-purple-500/15 text-purple-400' : stock.reboundScore >= 55 ? 'bg-indigo-500/15 text-indigo-400' : 'bg-sky-500/15 text-sky-400'}`}>
                  🎯 {stock.reboundScore}
                </div>
              )}
              {/* Consecutive decline badge */}
              {stock.consecutiveDeclineDays >= 3 && (
                <div className="px-1.5 py-0.5 rounded-md text-[9px] font-bold tracking-wide bg-orange-500/15 text-orange-400">
                  🔴×{stock.consecutiveDeclineDays}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className={`flex items-center gap-0.5 text-xs font-semibold ${pos1D ? 'text-emerald-500' : 'text-rose-500'}`}>
                {pos1D ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                {formatPercent(stock.priceChange1D)} {t(lang, 'today')}
              </div>
              <span className="text-muted-foreground/40">·</span>
              <div className={`text-xs ${pos5D ? 'text-emerald-500/70' : 'text-rose-500/70'}`}>
                {formatPercent(stock.priceChange5D)} {t(lang, 'five_days')}
              </div>
              {stock.priceChange10D !== undefined && (
                <>
                  <span className="text-muted-foreground/40">·</span>
                  <div className={`text-xs ${stock.priceChange10D >= 0 ? 'text-emerald-500/50' : 'text-rose-500/50'}`}>
                    {formatPercent(stock.priceChange10D)} 10D
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-2xl font-black tabular-nums tracking-tight text-foreground">
              {stock.currentPrice.toFixed(1)}
            </div>
            <div className="text-[10px] text-muted-foreground">nghìn đồng</div>
          </div>
        </div>
      </div>

      {/* Indicators */}
      <div className="px-5 pb-5 space-y-4">
        <RSIGauge value={stock.rsi14} />
        <BBBar percentB={stock.bbPercentB} />
        <MACDChart
          macdLine={stock.macdLine}
          macdSignal={stock.macdSignal}
          macdHistogram={stock.macdHistogram}
        />

        {/* Rebound Score bar */}
        {stock.reboundScore > 0 && (
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">🎯 Rebound Score</span>
              <div className="flex items-center gap-1.5">
                <span className={`text-xs font-bold tabular-nums
                  ${stock.reboundScore >= 70 ? 'text-purple-400' : stock.reboundScore >= 50 ? 'text-indigo-400' : stock.reboundScore >= 30 ? 'text-sky-400' : 'text-muted-foreground'}`}>
                  {stock.reboundScore}/100
                </span>
                {stock.consecutiveDeclineDays > 0 && (
                  <span className="text-[10px] text-orange-400 font-medium">
                    {stock.consecutiveDeclineDays} ngày đỏ
                  </span>
                )}
              </div>
            </div>
            <div className="relative h-2 rounded-full bg-muted overflow-hidden">
              <motion.div
                className="absolute top-0 left-0 h-full rounded-full"
                style={{
                  background: stock.reboundScore >= 70
                    ? 'linear-gradient(90deg, #8b5cf6, #a78bfa)'
                    : stock.reboundScore >= 50
                    ? 'linear-gradient(90deg, #6366f1, #818cf8)'
                    : 'linear-gradient(90deg, #0ea5e9, #38bdf8)',
                }}
                initial={{ width: '0%' }}
                animate={{ width: `${stock.reboundScore}%` }}
                transition={{ duration: 0.9, ease: 'easeOut', delay: 0.15 }}
              />
            </div>
          </div>
        )}

        {/* Signals */}
        {stock.signals.length > 0 && (
          <div className="space-y-1.5 pt-1">
            <div className="w-full h-px bg-border/50" />
            <div className="pt-1 space-y-1.5">
              {stock.signals.map((sig, i) => (
                <SignalPill key={i} type={sig.type} strength={sig.strength} reason={sig.reason} />
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
