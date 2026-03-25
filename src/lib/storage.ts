/**
 * 네이티브 Storage 어댑터
 * - 앱인토스 WebView: @apps-in-toss/web-framework Storage 사용
 * - 일반 브라우저 / 개발 환경: localStorage 폴백
 */

interface StorageAdapter {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

const localStorageAdapter: StorageAdapter = {
  getItem:    (key)        => Promise.resolve(localStorage.getItem(key)),
  setItem:    (key, value) => Promise.resolve(void localStorage.setItem(key, value)),
  removeItem: (key)        => Promise.resolve(void localStorage.removeItem(key)),
};

async function getNativeAdapter(): Promise<StorageAdapter> {
  try {
    // webpackIgnore: 앱인토스 WebView 런타임에서만 존재하는 모듈
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore — 앱인토스 WebView 런타임에서만 존재하는 모듈
    const { Storage } = await import(/* webpackIgnore: true */ "@apps-in-toss/web-framework");
    return Storage;
  } catch {
    return localStorageAdapter;
  }
}

let adapterPromise: Promise<StorageAdapter> | null = null;
function getAdapter(): Promise<StorageAdapter> {
  if (typeof window === "undefined") return Promise.resolve(localStorageAdapter);
  if (!adapterPromise) adapterPromise = getNativeAdapter();
  return adapterPromise;
}

export const AppStorage: StorageAdapter = {
  getItem:    async (key)        => (await getAdapter()).getItem(key),
  setItem:    async (key, value) => (await getAdapter()).setItem(key, value),
  removeItem: async (key)        => (await getAdapter()).removeItem(key),
};
