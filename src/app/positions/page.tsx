'use client';

import { useState, useEffect } from 'react';
import { getPositions, closePosition, addPosition, type Position } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

function PnLBadge({ pos, currentPrice }: { pos: Position; currentPrice?: number }) {
  if (!currentPrice) return null;
  const pct = ((currentPrice - pos.buyPrice) / pos.buyPrice) * 100;
  return (
    <Badge className={pct >= 0 ? 'bg-green-700 text-white' : 'bg-red-700 text-white'}>
      {pct >= 0 ? '+' : ''}{pct.toFixed(2)}%
    </Badge>
  );
}

export default function PositionsPage() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    symbol: '', buyPrice: '', quantity: '',
    stopLossPercent: '7', takeProfitPercent: '10', note: ''
  });

  async function loadPositions() {
    setLoading(true);
    const data = await getPositions();
    setPositions(data);
    setLoading(false);
  }

  useEffect(() => { loadPositions(); }, []);

  async function handleClose(id: string) {
    await closePosition(id);
    await loadPositions();
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    await addPosition({
      symbol: form.symbol.toUpperCase(),
      buyPrice: parseFloat(form.buyPrice),
      quantity: parseInt(form.quantity),
      stopLossPercent: parseFloat(form.stopLossPercent),
      takeProfitPercent: parseFloat(form.takeProfitPercent),
      note: form.note || undefined,
    });
    setForm({ symbol: '', buyPrice: '', quantity: '', stopLossPercent: '7', takeProfitPercent: '10', note: '' });
    setShowForm(false);
    await loadPositions();
  }

  const open = positions.filter(p => p.status === 'OPEN');
  const closed = positions.filter(p => p.status === 'CLOSED');

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Quản lý vị thế</h2>
        <Button onClick={() => setShowForm(!showForm)} size="sm">
          {showForm ? 'Hủy' : '+ Thêm vị thế'}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6 border-primary/30">
          <CardHeader><CardTitle className="text-base">Thêm vị thế mới</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleAdd} className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { key: 'symbol', label: 'Mã CK (VD: VNM)', placeholder: 'VNM' },
                { key: 'buyPrice', label: 'Giá mua (nghìn đồng)', placeholder: '60.5' },
                { key: 'quantity', label: 'Số lượng (cp)', placeholder: '1000' },
                { key: 'stopLossPercent', label: 'Stop-loss %', placeholder: '7' },
                { key: 'takeProfitPercent', label: 'Take-profit %', placeholder: '10' },
                { key: 'note', label: 'Ghi chú (tuỳ chọn)', placeholder: '' },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="text-xs text-muted-foreground block mb-1">{label}</label>
                  <input
                    className="w-full bg-muted rounded px-3 py-2 text-sm border border-border focus:outline-none focus:border-primary"
                    value={form[key as keyof typeof form]}
                    onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                    placeholder={placeholder}
                    required={key !== 'note'}
                  />
                </div>
              ))}
              <div className="col-span-2 md:col-span-3">
                <Button type="submit" className="w-full">Lưu vị thế</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <h3 className="font-semibold mb-3 text-green-400">Đang nắm giữ ({open.length})</h3>
      {open.length === 0 && !loading && (
        <p className="text-muted-foreground text-sm mb-6">Chưa có vị thế nào.</p>
      )}
      <div className="grid gap-3 mb-8">
        {open.map(pos => (
          <Card key={pos.id} className="border-border">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-lg">{pos.symbol}</span>
                  <PnLBadge pos={pos} />
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>Mua: {(pos.buyPrice * 1000).toLocaleString('vi-VN')}đ</span>
                  <span>SL: -{pos.stopLossPercent}%</span>
                  <span>TP: +{pos.takeProfitPercent}%</span>
                  <span>{pos.quantity.toLocaleString('vi-VN')} cp</span>
                </div>
                <Button size="sm" variant="destructive" onClick={() => handleClose(pos.id)}>
                  Đóng vị thế
                </Button>
              </div>
              {pos.note && <p className="text-xs text-muted-foreground mt-1">📝 {pos.note}</p>}
              <p className="text-xs text-muted-foreground mt-1">
                Mở: {new Date(pos.createdAt).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {closed.length > 0 && (
        <>
          <h3 className="font-semibold mb-3 text-muted-foreground">Đã đóng ({closed.length})</h3>
          <div className="grid gap-2">
            {closed.slice(0, 10).map(pos => (
              <Card key={pos.id} className="border-border opacity-60">
                <CardContent className="py-2 px-4 flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="font-medium">{pos.symbol}</span>
                  <span>Mua: {(pos.buyPrice * 1000).toLocaleString('vi-VN')}đ</span>
                  <span>{pos.quantity.toLocaleString('vi-VN')} cp</span>
                  <Badge variant="outline" className="text-xs">Đã đóng</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
