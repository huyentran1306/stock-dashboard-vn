'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLang } from '@/components/providers';
import { t } from '@/lib/i18n';
import { getAnalysis, getRecommendations, triggerAnalysis, type StockAnalysis, type Recommendation } from '@/lib/api';
import { StockCard } from '@/components/stock-card';
import { TrendingUp, TrendingDown, Minus, BarChart3, RefreshCw, Zap, Target, ArrowUpRight, ArrowDownRight } from 'lucide-react';

function StatCard({
  value, label, icon: Icon, color, index,
}: {
  value: number; label: string; icon: typeof TrendingUp; color: string; index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="relative overflow-hidden rounded-2xl border border-border/60 bg-card p-5 shadow-lg"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-muted-foreground mb-1">{label}</p>
          <motion.p
            className="text-3xl font-black tabular-nums"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.08 + 0.2, type: 'spring', stiffness: 200 }}
            style={{ color }}
          >
            {value}
          </motion.p>
        </div>
        <div className="rounded-xl p-2.5" style={{ background: color + '18' }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
      </div>
      <div
        className="absolute bottom-0 left-0 right-0 h-0.5 opacity-60"
        style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
      />
    </motion.div>
  );
}

export default function HomePage() {
  const { lang } = useLang();
  const [analysis, setAnalysis] = useState<StockAnalysis[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [triggering, setTriggering] = useState(false);

  async function load() {
    setLoading(true);
    const [data, recs] = await Promise.all([getAnalysis(), getRecommendations(10)]);
    setAnalysis(data);
    setRecommendations(recs);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleTrigger() {
    setTriggering(true);
    await triggerAnalysis();
    await load();
    setTriggering(false);
  }

  const buys = analysis.filter(s => s.signals.some(sig => sig.type === 'BUY'));
  const sells = analysis.filter(s => s.signals.some(sig => sig.type === 'SELL'));
  const neutral = analysis.filter(s => !s.signals.some(sig => sig.type === 'BUY' || sig.type === 'SELL'));

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
            {t(lang, 'market_analysis')}
          </h1>
          <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" />
            {t(lang, 'updated_every_15')}
          </p>
        </div>
        <button
          onClick={handleTrigger}
          disabled={triggering || loading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-sm shadow-lg shadow-emerald-500/25 transition-all hover:shadow-emerald-500/40 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <Zap className="w-4 h-4" />
          {triggering ? t(lang, 'analyzing') : t(lang, 'trigger_analysis')}
        </button>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard value={buys.length} label={t(lang, 'buy_signals')} icon={TrendingUp} color="#10b981" index={0} />
        <StatCard value={sells.length} label={t(lang, 'sell_signals')} icon={TrendingDown} color="#f43f5e" index={1} />
        <StatCard value={neutral.length} label={t(lang, 'neutral')} icon={Minus} color="#f59e0b" index={2} />
        <StatCard value={analysis.length} label={t(lang, 'total_stocks')} icon={BarChart3} color="#6366f1" index={3} />
      </div>

      {/* Recommendations section */}
      {recommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="rounded-2xl border border-purple-500/25 bg-card overflow-hidden shadow-lg"
        >
          <div className="px-5 py-4 border-b border-border/50 flex items-center gap-2">
            <Target className="w-4 h-4 text-purple-400" />
            <h2 className="font-bold text-sm text-foreground">Top cổ phiếu nên mua — Rebound Score</h2>
            <span className="text-[10px] text-muted-foreground ml-auto">Xếp theo khả năng bật lại</span>
          </div>
          <div className="divide-y divide-border/40">
            {recommendations.map((rec, i) => (
              <motion.div
                key={rec.symbol}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 + 0.25, duration: 0.3 }}
                className="flex items-center gap-4 px-5 py-3 hover:bg-muted/30 transition-colors"
              >
                {/* Rank */}
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shrink-0
                  ${i === 0 ? 'bg-yellow-500/20 text-yellow-400' : i === 1 ? 'bg-zinc-400/20 text-zinc-300' : i === 2 ? 'bg-amber-700/20 text-amber-600' : 'bg-muted text-muted-foreground'}`}>
                  {i + 1}
                </div>
                {/* Symbol */}
                <div className="w-12 font-black text-sm text-foreground shrink-0">{rec.symbol}</div>
                {/* Rebound Score bar */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="relative flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        className="absolute top-0 left-0 h-full rounded-full"
                        style={{ background: rec.reboundScore >= 70 ? 'linear-gradient(90deg, #8b5cf6, #a78bfa)' : 'linear-gradient(90deg, #6366f1, #818cf8)' }}
                        initial={{ width: '0%' }}
                        animate={{ width: `${rec.reboundScore}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut', delay: i * 0.05 + 0.35 }}
                      />
                    </div>
                    <span className="text-xs font-bold text-purple-400 tabular-nums shrink-0">{rec.reboundScore}/100</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground truncate">{rec.topReason}</p>
                </div>
                {/* Stats */}
                <div className="flex items-center gap-3 text-xs shrink-0">
                  <div className="text-right hidden sm:block">
                    <div className="font-bold text-foreground tabular-nums">{rec.currentPrice.toFixed(1)}k</div>
                    <div className={`text-[10px] ${rec.priceChange1D >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {rec.priceChange1D >= 0 ? <ArrowUpRight className="w-3 h-3 inline" /> : <ArrowDownRight className="w-3 h-3 inline" />}
                      {rec.priceChange1D.toFixed(2)}%
                    </div>
                  </div>
                  <div className="text-right hidden md:block">
                    <div className="text-[10px] text-muted-foreground">RSI</div>
                    <div className={`text-xs font-bold tabular-nums ${rec.rsi14 < 35 ? 'text-emerald-500' : rec.rsi14 > 65 ? 'text-rose-500' : 'text-muted-foreground'}`}>
                      {rec.rsi14.toFixed(0)}
                    </div>
                  </div>
                  {/* Entry / TP / SL */}
                  {rec.suggestedEntry && (
                    <div className="text-right hidden lg:block text-[10px] space-y-0.5">
                      <div className="text-sky-400 font-medium">Vào: {rec.suggestedEntry.toFixed(1)}k</div>
                      <div className="text-emerald-400 font-medium">TP: {rec.suggestedTP.toFixed(1)}k</div>
                      <div className="text-rose-400 font-medium">SL: {rec.suggestedSL.toFixed(1)}k</div>
                    </div>
                  )}
                  {rec.riskReward > 0 && (
                    <div className={`hidden lg:flex flex-col items-center justify-center px-2 py-1 rounded-lg text-center
                      ${rec.riskReward >= 1.5 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                      <div className="text-[9px] text-muted-foreground">R:R</div>
                      <div className="text-xs font-black">1:{rec.riskReward}</div>
                    </div>
                  )}
                  {rec.consecutiveDeclineDays >= 2 && (
                    <div className="px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-400 text-[10px] font-bold">
                      🔴×{rec.consecutiveDeclineDays}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="rounded-2xl border border-border/60 bg-card overflow-hidden animate-pulse">
              <div className="h-28 bg-muted/40" />
              <div className="p-5 space-y-3">
                <div className="h-3 bg-muted rounded-full w-2/3" />
                <div className="h-2 bg-muted rounded-full" />
                <div className="h-14 bg-muted/60 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      ) : analysis.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-24 text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-muted/60 flex items-center justify-center mb-4">
            <BarChart3 className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-base font-semibold text-foreground mb-1">{t(lang, 'no_data')}</h3>
          <p className="text-sm text-muted-foreground max-w-xs mb-6">{t(lang, 'no_data_desc')}</p>
          <button
            onClick={handleTrigger}
            disabled={triggering}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-sm transition-all disabled:opacity-60"
          >
            <Zap className="w-4 h-4" />
            {triggering ? t(lang, 'analyzing') : t(lang, 'trigger_analysis')}
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {analysis.map((stock, i) => (
            <StockCard key={stock.symbol} stock={stock} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}