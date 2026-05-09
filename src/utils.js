export const TIMEFRAMES = ['5m', '15m', '1hr'];

export const TF_SECONDS = {
  '5m': 300,
  '15m': 900,
  '1hr': 3600,
};

export function makeRow(id) {
  return {
    id,
    entryPrice: '',
    exitPrice: '',
    startSec: '',
    stopSec: '',
    enabled: false,
    balance: 100,
    pnl: 0,
    trades: 0,
    wins: 0,
  };
}

export function makeDefaultRows(count = 5) {
  return Array.from({ length: count }, (_, i) => makeRow(i + 1));
}

export function clampSec(val, tf) {
  const max = TF_SECONDS[tf] - 1;
  const n = parseInt(val, 10);
  if (isNaN(n)) return val;
  return Math.min(Math.max(1, n), max).toString();
}