// Simple i18n translations for vi/en
export type Lang = 'vi' | 'en';

const translations = {
  vi: {
    // Nav
    nav_analysis: 'Phân tích',
    nav_history: 'Lịch sử',
    nav_positions: 'Vị thế',
    nav_market_live: 'Thị trường mở cửa',
    nav_market_closed: 'Thị trường đóng cửa',
    // Header
    logo_title: 'StockAI',
    logo_subtitle: 'Phân tích kỹ thuật tự động',
    // Stats
    buy_signals: 'Tín hiệu Mua',
    sell_signals: 'Tín hiệu Bán',
    neutral: 'Trung tính',
    total_stocks: 'Cổ phiếu theo dõi',
    // Analysis
    market_analysis: 'Phân tích thị trường',
    updated_every_15: 'Cập nhật mỗi 15 phút',
    no_data: 'Chưa có dữ liệu',
    no_data_desc: 'Worker chạy tự động mỗi 15 phút trong giờ giao dịch T2–T6.',
    trigger_analysis: 'Phân tích ngay',
    analyzing: 'Đang phân tích...',
    // Stock card
    today: 'hôm nay',
    five_days: '5 ngày',
    rsi_oversold: 'Quá bán',
    rsi_overbought: 'Quá mua',
    rsi_neutral: 'Trung tính',
    bb_below: 'Dưới dải thấp',
    bb_above: 'Trên dải cao',
    macd_label: 'MACD',
    signal_label: 'Tín hiệu',
    histogram: 'Histogram',
    buy_strong: 'MUA MẠNH',
    buy_moderate: 'MUA',
    buy_weak: 'Chú ý Mua',
    sell_strong: 'BÁN MẠNH',
    sell_moderate: 'BÁN',
    sell_weak: 'Chú ý Bán',
    watch: 'THEO DÕI',
    // History
    signal_history: 'Lịch sử tín hiệu',
    no_history: 'Chưa có lịch sử.',
    no_history_desc: 'Dữ liệu sẽ được lưu sau khi worker chạy.',
    // Positions
    manage_positions: 'Quản lý vị thế',
    add_position: '+ Thêm vị thế',
    cancel: 'Hủy',
    add_new_position: 'Thêm vị thế mới',
    symbol: 'Mã CK',
    buy_price: 'Giá mua (nghìn đ)',
    quantity: 'Số lượng (CP)',
    stop_loss: 'Stop-loss %',
    take_profit: 'Take-profit %',
    note_opt: 'Ghi chú (tuỳ chọn)',
    add_btn: 'Thêm',
    open_positions: 'Vị thế đang mở',
    closed_positions: 'Vị thế đã đóng',
    no_open: 'Chưa có vị thế nào đang mở.',
    no_closed: 'Chưa có vị thế đã đóng.',
    close_btn: 'Đóng vị thế',
    loading: 'Đang tải...',
    // Theme
    dark_mode: 'Tối',
    light_mode: 'Sáng',
    // Footer
    disclaimer: 'Chỉ là phân tích kỹ thuật tự động, không phải khuyến nghị đầu tư.',
    // Indicators
    bb_band: 'Bollinger Band',
    below_lower: 'Dưới dải',
    above_upper: 'Trên dải',
  },
  en: {
    // Nav
    nav_analysis: 'Analytics',
    nav_history: 'History',
    nav_positions: 'Positions',
    nav_market_live: 'Market Open',
    nav_market_closed: 'Market Closed',
    // Header
    logo_title: 'StockAI',
    logo_subtitle: 'Automated Technical Analysis',
    // Stats
    buy_signals: 'Buy Signals',
    sell_signals: 'Sell Signals',
    neutral: 'Neutral',
    total_stocks: 'Tracked Stocks',
    // Analysis
    market_analysis: 'Market Analysis',
    updated_every_15: 'Updated every 15 mins',
    no_data: 'No data available',
    no_data_desc: 'Worker runs automatically every 15 minutes during trading hours Mon–Fri.',
    trigger_analysis: 'Run Analysis',
    analyzing: 'Analyzing...',
    // Stock card
    today: 'today',
    five_days: '5 days',
    rsi_oversold: 'Oversold',
    rsi_overbought: 'Overbought',
    rsi_neutral: 'Neutral',
    bb_below: 'Below lower band',
    bb_above: 'Above upper band',
    macd_label: 'MACD',
    signal_label: 'Signal',
    histogram: 'Histogram',
    buy_strong: 'STRONG BUY',
    buy_moderate: 'BUY',
    buy_weak: 'Weak Buy',
    sell_strong: 'STRONG SELL',
    sell_moderate: 'SELL',
    sell_weak: 'Weak Sell',
    watch: 'WATCH',
    // History
    signal_history: 'Signal History',
    no_history: 'No history yet.',
    no_history_desc: 'Data will be saved after the worker runs.',
    // Positions
    manage_positions: 'Manage Positions',
    add_position: '+ Add Position',
    cancel: 'Cancel',
    add_new_position: 'Add New Position',
    symbol: 'Ticker',
    buy_price: 'Buy Price (k VND)',
    quantity: 'Quantity (shares)',
    stop_loss: 'Stop-loss %',
    take_profit: 'Take-profit %',
    note_opt: 'Note (optional)',
    add_btn: 'Add',
    open_positions: 'Open Positions',
    closed_positions: 'Closed Positions',
    no_open: 'No open positions.',
    no_closed: 'No closed positions.',
    close_btn: 'Close Position',
    loading: 'Loading...',
    // Theme
    dark_mode: 'Dark',
    light_mode: 'Light',
    // Footer
    disclaimer: 'For informational purposes only. Not investment advice.',
    // Indicators
    bb_band: 'Bollinger Band',
    below_lower: 'Below band',
    above_upper: 'Above band',
  },
};

export type TranslationKey = keyof typeof translations.vi;

export function t(lang: Lang, key: TranslationKey): string {
  return translations[lang][key] ?? translations.vi[key] ?? key;
}
