import { getAnalysis, formatPrice, formatPercent, type StockAnalysis } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

function RSIBar({ value }: { value: number }) {
  const color = value < 30 ? "bg-green-500" : value > 70 ? "bg-red-500" : "bg-yellow-500";
  const zone = value < 30 ? "Oversold 🟢" : value > 70 ? "Overbought 🔴" : "Neutral";
  return (
    <div>
      <div className="flex justify-between text-xs text-muted-foreground mb-1">
        <span>RSI(14) — {zone}</span>
        <span className={value < 30 ? "text-green-400" : value > 70 ? "text-red-400" : "text-yellow-400"}>{value.toFixed(1)}</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${Math.min(value, 100)}%` }} />
      </div>
      <div className="flex justify-between text-xs text-muted-foreground mt-0.5">
        <span>0</span><span>30</span><span>70</span><span>100</span>
      </div>
    </div>
  );
}

function BBBar({ percentB }: { percentB: number }) {
  const clamped = Math.max(0, Math.min(100, percentB));
  const color = percentB < 20 ? "bg-green-500" : percentB > 80 ? "bg-red-500" : "bg-blue-500";
  const zone = percentB < 0 ? "Dưới dải thấp 🟢" : percentB > 100 ? "Trên dải cao 🔴" : `%B ${percentB.toFixed(0)}%`;
  return (
    <div>
      <div className="flex justify-between text-xs text-muted-foreground mb-1">
        <span>Bollinger Band — {zone}</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${clamped}%` }} />
      </div>
      <div className="flex justify-between text-xs text-muted-foreground mt-0.5">
        <span>Dưới</span><span>Giữa</span><span>Trên</span>
      </div>
    </div>
  );
}

function SignalRow({ type, strength, reason }: { type: string; strength: string; reason: string }) {
  const bg = type === 'BUY' ? 'bg-green-500/10 border-green-500/30 text-green-300' : type === 'SELL' ? 'bg-red-500/10 border-red-500/30 text-red-300' : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300';
  const icon = type === 'BUY' ? '📈' : type === 'SELL' ? '📉' : '👀';
  const label = type === 'BUY' ? (strength === 'STRONG' ? 'MUA MẠNH' : 'MUA') : type === 'SELL' ? (strength === 'STRONG' ? 'BÁN MẠNH' : 'BÁN') : 'THEO DÕI';
  return (
    <div className={`rounded-lg border px-3 py-2 text-xs ${bg}`}>
      <span className="font-semibold mr-2">{icon} {label}</span>
      <span className="opacity-80">{reason}</span>
    </div>
  );
}

function StockCard({ stock }: { stock: StockAnalysis }) {
  const hasBuy = stock.signals.some(s => s.type === 'BUY' && s.strength !== 'WEAK');
  const hasSell = stock.signals.some(s => s.type === 'SELL' && s.strength !== 'WEAK');
  const glow = hasBuy ? 'ring-green-500/40 shadow-green-500/10 shadow-lg' : hasSell ? 'ring-red-500/40 shadow-red-500/10 shadow-lg' : 'ring-border/50';

  return (
    <Card className={`ring-1 ${glow} bg-card/80 backdrop-blur`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl font-extrabold tracking-tight">{stock.symbol}</CardTitle>
            <div className="flex gap-3 mt-1">
              <span className={`text-sm font-medium ${stock.priceChange1D >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {stock.priceChange1D >= 0 ? '▲' : '▼'} {formatPercent(stock.priceChange1D)} hôm nay
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold tabular-nums">{formatPrice(stock.currentPrice)}</div>
            <div className={`text-xs mt-0.5 ${stock.priceChange5D >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              5 ngày: {formatPercent(stock.priceChange5D)}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <RSIBar value={stock.rsi14} />
        <BBBar percentB={stock.bbPercentB} />

        <div className="flex gap-2 text-xs">
          <div className="flex-1 bg-muted rounded-lg p-2 text-center">
            <div className="text-muted-foreground mb-0.5">MACD</div>
            <div className={`font-bold ${stock.macdLine > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {stock.macdLine.toFixed(3)}
            </div>
          </div>
          <div className="flex-1 bg-muted rounded-lg p-2 text-center">
            <div className="text-muted-foreground mb-0.5">Signal</div>
            <div className="font-bold">{stock.macdSignal.toFixed(3)}</div>
          </div>
          <div className="flex-1 bg-muted rounded-lg p-2 text-center">
            <div className="text-muted-foreground mb-0.5">Histogram</div>
            <div className={`font-bold ${stock.macdHistogram > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {stock.macdHistogram > 0 ? '▲' : '▼'} {Math.abs(stock.macdHistogram).toFixed(3)}
            </div>
          </div>
        </div>

        {stock.signals.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              {stock.signals.map((sig, i) => (
                <SignalRow key={i} type={sig.type} strength={sig.strength} reason={sig.reason} />
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default async function HomePage() {
  const analysis = await getAnalysis();
  const buys = analysis.filter(s => s.signals.some(sig => sig.type === 'BUY'));
  const sells = analysis.filter(s => s.signals.some(sig => sig.type === 'SELL'));
  const neutral = analysis.filter(s => !s.signals.some(sig => sig.type === 'BUY' || sig.type === 'SELL'));

  return (
    <div>
      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card className="bg-green-500/10 border-green-500/30">
          <CardContent className="py-4 text-center">
            <div className="text-3xl font-bold text-green-400">{buys.length}</div>
            <div className="text-sm text-muted-foreground mt-1">📈 Tín hiệu Mua</div>
          </CardContent>
        </Card>
        <Card className="bg-red-500/10 border-red-500/30">
          <CardContent className="py-4 text-center">
            <div className="text-3xl font-bold text-red-400">{sells.length}</div>
            <div className="text-sm text-muted-foreground mt-1">📉 Tín hiệu Bán</div>
          </CardContent>
        </Card>
        <Card className="bg-muted/50">
          <CardContent className="py-4 text-center">
            <div className="text-3xl font-bold">{neutral.length}</div>
            <div className="text-sm text-muted-foreground mt-1">➡️ Trung tính</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Phân tích thị trường</h2>
        <Badge variant="outline" className="text-xs">Cập nhật mỗi 15 phút</Badge>
      </div>

      {analysis.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">
            <div className="text-4xl mb-3">📊</div>
            <p>Chưa có dữ liệu.</p>
            <p className="text-xs mt-1">Worker chạy mỗi 15 phút trong giờ giao dịch T2-T6.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {analysis.map(stock => <StockCard key={stock.symbol} stock={stock} />)}
        </div>
      )}
    </div>
  );
}
