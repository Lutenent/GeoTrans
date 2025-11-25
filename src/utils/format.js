export function fmt(v) {
  if (v === null || v === undefined || Number.isNaN(v)) return '0.00';
  return Number(v).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}
