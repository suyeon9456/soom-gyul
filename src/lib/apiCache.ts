/** 서버 메모리 캐시 — 동일 파라미터는 TTL 내 재호출 없음 */

interface CacheEntry {
  value: string;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry>();

const TTL_MS = 30 * 60 * 1000; // 30분

export function getCached(key: string): string | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.value;
}

export function setCached(key: string, value: string): void {
  cache.set(key, { value, expiresAt: Date.now() + TTL_MS });
}
