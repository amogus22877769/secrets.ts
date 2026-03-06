export function shannonEntropy(str: string): number {
  const freq: Record<string, number> = {};
  for (const ch of str) {
    freq[ch] = (freq[ch] || 0) + 1;
  }
  return Object.values(freq).reduce((sum, count) => {
    const p = count / str.length;
    return sum - p * Math.log2(p);
  }, 0);
}

export function isHighEntropy(str: string, threshold = 3.5): boolean {
  if (str.length < 16) return false;
  return shannonEntropy(str) >= threshold;
}
