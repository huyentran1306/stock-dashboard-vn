import { getHistory, type HistoryEntry } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function SignalTypeLabel({ type }: { type: string }) {
  if (type === 'BUY') return <Badge className="bg-green-700 text-white text-xs">🟢 MUA</Badge>;
  if (type === 'SELL') return <Badge className="bg-red-700 text-white text-xs">🔴 BÁN</Badge>;
  return <Badge variant="outline" className="text-xs">🟡 Theo dõi</Badge>;
}

function formatVNTime(isoStr: string) {
  return new Date(isoStr).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
}

export default async function HistoryPage() {
  const history = await getHistory();

  // Group by date
  const grouped = history.reduce<Record<string, HistoryEntry[]>>((acc, entry) => {
    const date = new Date(entry.timestamp).toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
    if (!acc[date]) acc[date] = [];
    acc[date].push(entry);
    return acc;
  }, {});

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Lịch sử tín hiệu</h2>

      {history.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Chưa có lịch sử. Dữ liệu sẽ được lưu sau khi worker chạy.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([date, entries]) => (
            <div key={date}>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">{date}</h3>
              <div className="space-y-2">
                {entries.map((entry, i) => (
                  <Card key={i} className="border-border">
                    <CardHeader className="py-3 px-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{entry.symbol}</CardTitle>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium">
                            {(entry.price * 1000).toLocaleString('vi-VN')}đ
                          </span>
                          <span className="text-xs text-muted-foreground">{formatVNTime(entry.timestamp)}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0 px-4 pb-3">
                      <div className="flex flex-wrap gap-2">
                        {entry.signals.map((sig, j) => (
                          <div key={j} className="flex items-center gap-1">
                            <SignalTypeLabel type={sig.type} />
                            <span className="text-xs text-muted-foreground">{sig.reason}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
