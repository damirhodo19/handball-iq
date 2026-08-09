import { Platform } from 'react-native';
import {
  getNativeAsyncStorage,
  getPersistenceMode,
  isNativePersistenceAvailable,
  probeNativeAsyncStorage,
} from '@/lib/async-storage-safe';

export { getPersistenceMode, isNativePersistenceAvailable };

const memory = new Map<string, string>();
let hydrated = false;
let hydratePromise: Promise<void> | null = null;

function webGet(key: string): string | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(key);
    }
  } catch {}
  return null;
}

function webSet(key: string, value: string): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, value);
    }
  } catch {}
}

function webRemove(key: string): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(key);
    }
  } catch {}
}

export async function hydratePlatformStorage(): Promise<void> {
  if (hydrated) return;
  if (hydratePromise) return hydratePromise;

  hydratePromise = (async () => {
    try {
      if (Platform.OS === 'web') {
        return;
      }

      const ok = await probeNativeAsyncStorage();
      if (!ok) return;

      const AsyncStorage = getNativeAsyncStorage();
      if (!AsyncStorage) return;

      const keys = await AsyncStorage.getAllKeys();
      if (keys.length > 0) {
        const pairs = await AsyncStorage.multiGet(keys);
        for (const [key, value] of pairs) {
          if (key && value != null) memory.set(key, value);
        }
      }
    } catch (err) {
      console.warn(
        '[Storage] hydratePlatformStorage failed — continuing with in-memory cache:',
        err instanceof Error ? err.message : err,
      );
    } finally {
      hydrated = true;
    }
  })();

  return hydratePromise;
}

export function isPlatformStorageHydrated(): boolean {
  return Platform.OS === 'web' || hydrated;
}

export function readStorageJson<T>(key: string, fallback: T): T {
  try {
    const raw = Platform.OS === 'web' ? webGet(key) : memory.get(key) ?? null;
    if (raw) return JSON.parse(raw) as T;
  } catch {}
  return fallback;
}

export function writeStorageJson<T>(key: string, value: T): void {
  const raw = JSON.stringify(value);
  if (Platform.OS === 'web') {
    webSet(key, raw);
    return;
  }
  memory.set(key, raw);
  const native = getNativeAsyncStorage();
  native?.setItem(key, raw).catch(() => {});
}

export function removeStorageKey(key: string): void {
  if (Platform.OS === 'web') {
    webRemove(key);
    return;
  }
  memory.delete(key);
  const native = getNativeAsyncStorage();
  native?.removeItem(key).catch(() => {});
}

export function readStorageRaw(key: string): string | null {
  if (Platform.OS === 'web') return webGet(key);
  return memory.get(key) ?? null;
}

export function writeStorageRaw(key: string, value: string): void {
  if (Platform.OS === 'web') {
    webSet(key, value);
    return;
  }
  memory.set(key, value);
  const native = getNativeAsyncStorage();
  native?.setItem(key, value).catch(() => {});
}
