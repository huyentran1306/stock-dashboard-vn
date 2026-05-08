'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '@/components/providers';
import { t } from '@/lib/i18n';
import { getPositions, closePosition, addPosition, type Position } from '@/lib/api';
import { TrendingUp, TrendingDown, Plus, X, ChevronDown, Wallet, Target, ShieldOff } from 'lucide-react';

function PnLChip({ pos }: { pos: Position }) {
  const pct = 0; // No real-time price in positions store
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold
      ${pct >= 0 ? 'bg-emerald-500/15 text-emerald-500' : 'bg-rose-500/15 text-rose-500'}`}>
      {pct >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
      {pct >= 0 ? '+' : ''}{pct.toFixed(2)}%
    </span>
  );
}

const FORM_INIT = { symbol: '', buyPrice: '', quantity: '', stopLossPercent: '7', takeProfitPercent: '10', note: '' };

export default function PositionsPage() {
  const { lang } = useLang();
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(FORM_INIT);

  async function load() {
    setLoading(true);
    const data = await getPositions();
    setPositions(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleClose(id: string) {
    await closePosition(id);
    await load();
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    await addPosition({
      symbol: form.symbol.toUpperCase(),
      buyPrice: parseFloat(form.buyPrice),
      quantity: parseInt(form.quantity),
      stopLossPercent: parseFloat(form.stopLossPercent),
      takeProfitPercent: parseFloat(form.takeProfitPercent),
      note: form.note || undefined,
    });
    setForm(FORM_INIT);
    setShowForm(false);
    setSubmitting(false);
    await load();
  }

  const open = positions.filter(p => p.status === 'OPEN');
  const closed = positions.filter(p => p.status === 'CLOSED');

  const inputCls = "w-full bg-muted/50 dark:bg-white/[0.04] rounded-xl px-3.5 py-2.5 text-sm border border-border/60 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/50 transition-all placeholder:text-muted-foreground/50";

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{t(lang, 'manage_positions')}</h1>
          <p className="text-sm text-muted-foreground mt-1">{open.length} đang mở · {closed.length} đã đóng</p>
        </div>
        <button
          onClick={() => setShowForm(v => !v)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all
            ${showForm
              ? 'bg-muted text-muted-foreground hover:bg-muted/80'
              : 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-500/25'
            }`}
        >
          {showForm ? <><X className="w-4 h-4" />{t(lang, 'cancel')}</> : <><Plus className="w-4 h-4" />{t(lang, 'add_position')}</>}
        </button>
      </motion.div>

      {/* Add position form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl border border-emerald-500/20 bg-card p-6 shadow-xl shadow-emerald-500/5"
          >
            <h2 className="text-base font-bold mb-5 flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                <Plus className="w-3.5 h-3.5 text-emerald-500" />
              </div>
              {t(lang, 'add_new_position')}
            </h2>
            <form onSubmit={handleAdd} className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {([
                { key: 'symbol', label: t(lang, 'symbol'), placeholder: 'VNM', required: true },
                { key: 'buyPrice', label: t(lang, 'buy_price'), placeholder: '60.5', required: true },
                { key: 'quantity', label: t(lang, 'quantity'), placeholder: '1000', required: true },
                { key: 'stopLossPercent', label: t(lang, 'stop_loss'), placeholder: '7', required: true },
                { key: 'takeProfitPercent', label: t(lang, 'take_profit'), placeholder: '10', required: true },
                { key: 'note', label: t(lang, 'note_opt'), placeholder: '', required: false },
              ] as const).map(({ key, label, placeholder, required }) => (
                <div key={key}>
                  <label className="text-xs text-muted-foreground block mb-1.5 font-medium">{label}</label>
                  <input
                    className={inputCls}
                    value={form[key]}
                    onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                    placeholder={placeholder}
                    required={required}
                    autoComplete="off"
                  />
                </div>
              ))}
              <div className="col-span-2 md:col-span-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-sm transition-all disabled:opacity-60"
                >
                  {submitting ? '...' : t(lang, 'add_btn')}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-2xl border border-border/60 bg-card p-4 animate-pulse">
              <div className="flex gap-3 items-center">
                <div className="w-16 h-5 bg-muted rounded" />
                <div className="flex-1 h-4 bg-muted rounded" />
                <div className="w-20 h-8 bg-muted rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Open positions */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Wallet className="w-4 h-4 text-emerald-500" />
              <h2 className="text-sm font-bold text-foreground">{t(lang, 'open_positions')} ({open.length})</h2>
            </div>
            {open.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border/60 py-12 text-center">
                <div className="text-3xl mb-2">📊</div>
                <p className="text-sm text-muted-foreground">{t(lang, 'no_open')}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {open.map((pos, i) => (
                  <motion.div
                    key={pos.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="rounded-2xl border border-emerald-500/20 bg-card p-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="text-lg font-black text-foreground">{pos.symbol}</span>
                        <PnLChip pos={pos} />
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Target className="w-3 h-3 text-emerald-500" />
                          {(pos.buyPrice * 1000).toLocaleString('vi-VN')}đ
                        </span>
                        <span className="flex items-center gap-1">
                          <ShieldOff className="w-3 h-3 text-rose-500" />
                          SL -{pos.stopLossPercent}%
                        </span>
                        <span className="flex items-center gap-1">
                          <TrendingUp className="w-3 h-3 text-emerald-500" />
                          TP +{pos.takeProfitPercent}%
                        </span>
                        <span>{pos.quantity.toLocaleString('vi-VN')} cp</span>
                      </div>
                      <button
                        onClick={() => handleClose(pos.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/15 text-rose-500 hover:bg-rose-500/25 text-xs font-medium transition-colors border border-rose-500/20"
                      >
                        <X className="w-3 h-3" />
                        {t(lang, 'close_btn')}
                      </button>
                    </div>
                    {pos.note && (
                      <p className="text-xs text-muted-foreground mt-2 pt-2 border-t border-border/40">
                        📝 {pos.note}
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Closed positions */}
          {closed.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
                <h2 className="text-sm font-bold text-muted-foreground">{t(lang, 'closed_positions')} ({closed.length})</h2>
              </div>
              <div className="space-y-2 opacity-60">
                {closed.slice(0, 10).map((pos, i) => (
                  <div key={pos.id} className="rounded-xl border border-border/40 bg-card px-4 py-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <span className="font-bold text-foreground/70">{pos.symbol}</span>
                    <span>{(pos.buyPrice * 1000).toLocaleString('vi-VN')}đ</span>
                    <span>{pos.quantity.toLocaleString('vi-VN')} cp</span>
                    <span className="ml-auto px-2 py-0.5 rounded-md text-[10px] bg-muted text-muted-foreground">CLOSED</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
