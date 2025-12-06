export function escapeCsvValue(value: string | null): string {
  if (value === null) {
    return '';
  }
  if (typeof value === 'string') {
    // escape " เป็น ""
    value = value.replace(/"/g, '""');
    // ถ้ามี , หรือ " หรือ \n ให้ครอบด้วย "
    if (value.search(/("|,|\n)/g) >= 0) {
      value = `"${value}"`;
    }
  }
  return value;
}