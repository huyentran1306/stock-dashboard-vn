'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLang } from '@/components/providers';
import { t } from '@/lib/i18n';
import { getAnalysis, triggerAnalysis, type StockAnalysis } from '@/lib/api';
import { StockCard } from '@/components/stock-card';
import { TrendingUp, TrendingDown, Minus, BarChart3, RefreshCw, Zap } from 'lucide-react';

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
  const [loading, setLoading] = useState(true);
  const [triggering, setTriggering] = useState(false);

  async function load() {
    setLoading(true);
    const data = await getAnalysis();
    setAnalysis(data);
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