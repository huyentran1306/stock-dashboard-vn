// src/lib/api.ts
// Client to fetch data from the stock-alert-worker

const BASE = process.env.NEXT_PUBLIC_WORKER_API_URL ?? 'https://stock-alert-worker.trann46698.workers.dev';

export interface Signal {
  type: 'BUY' | 'SELL' | 'WATCH';
  reason: string;
  strength: 'STRONG' | 'MODERATE' | 'WEAK';
}

export interface StockAnalysis {
  symbol: string;
  currentPrice: number;
  priceChange1D: number;
  priceChange5D: number;
  rsi14: number;
  macdLine: number;
  macdSignal: number;
  macdHistogram: number;
  bbUpper: number;
  bbMiddle: number;
  bbLower: number;
  bbPercentB: number;
  bbBandwidth: number;
  signals: Signal[];
}

export interface Position {
  id: string;
  symbol: string;
  buyPrice: number;
  quantity: number;
  stopLossPercent: number;
  takeProfitPercent: number;
  createdAt: string;
  note?: string;
  status: 'OPEN' | 'CLOSED';
}

export interface HistoryEntry {
  symbol: string;
  price: number;
  signals: Signal[];
  timestamp: string;
}

export async function getAnalysis(): Promise<StockAnalysis[]> {
  const res = await fetch(`${BASE}/analysis`, { next: { revalidate: 900 } });
  if (!res.ok) return [];
  return res.json();
}

export async function getHistory(): Promise<HistoryEntry[]> {
  const res = await fetch(`${BASE}/history`, { next: { revalidate: 300 } });
  if (!res.ok) return [];
  return res.json();
}

export async function getPositions(): Promise<Position[]> {
  const res = await fetch(`${BASE}/positions`, { cache: 'no-store' });
  if (!res.ok) return [];
  return res.json();
}

export async function addPosition(data: Omit<Position, 'id' | 'createdAt' | 'status'>): Promise<Position> {
  const res = await fetch(`${BASE}/positions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json() as { position: Position };
  return json.position;
}

export async function closePosition(id: string): Promise<void> {
  await fetch(`${BASE}/positions/${id}`, { method: 'DELETE' });
}

export async function triggerAnalysis(): Promise<{ results: StockAnalysis[] }> {
  const res = await fetch(`${BASE}/run`, { method: 'POST' });
  return res.json();
}

export function formatPrice(price: number): string {
  return (price * 1000).toLocaleString('vi-VN') + ' đ';
}

export function formatPercent(pct: number): string {
  return `${pct >= 0 ? '+' : ''}${pct.toFixed(2)}%`;
}
