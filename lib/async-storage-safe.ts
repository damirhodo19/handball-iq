import { NativeModules, Platform, TurboModuleRegistry } from 'react-native';
import type { AsyncStorageStatic } from '@react-native-async-storage/async-storage';

export type PersistenceMode = 'web-localStorage' | 'native-async-storage' | 'memory-only';

let cached: AsyncStorageStatic | null | undefined;
let availabilityChecked = false;
let nativeAvailable = false;
let persistenceMode: PersistenceMode =
  Platform.OS === 'web' ? 'web-localStorage' : 'memory-only';

/** Check TurboModule / NativeModules without importing AsyncStorage (import throws if null). */
export function isAsyncStorageNativeModuleLinked(): boolean {
  if (Platform.OS === 'web') return false;
  try {
    return Boolean(
      TurboModuleRegistry?.get?.('RNCAsyncStorage') ??
        NativeModules?.RNCAsyncStorage ??
        TurboModuleRegistry?.get?.('PlatformLocalStorage') ??
        NativeModules?.PlatformLocalStorage,
    );
  } catch {
    return false;
  }
}

export function getPersistenceMode(): PersistenceMode {
  return persistenceMode;
}

/** True only when data survives process restarts (web localStorage or native AsyncStorage). */
export function isNativePersistenceAvailable(): boolean {
  return persistenceMode === 'native-async-storage' || persistenceMode === 'web-localStorage';
}

/**
 * Probe AsyncStorage after confirming the native module is linked.
 * Never imports the package when the native module is missing.
 */
export async function probeNativeAsyncStorage(): Promise<boolean> {
  if (Platform.OS === 'web') {
    persistenceMode = 'web-localStorage';
    nativeAvailable = false;
    availabilityChecked = true;
    return true;
  }

  if (availabilityChecked) return nativeAvailable;

  availabilityChecked = true;

  if (!isAsyncStorageNativeModuleLinked()) {
    console.warn(
      '[Storage] AsyncStorage native module is not linked in this runtime. ' +
        'Using in-memory storage — data will not survive app restarts.',
    );
    persistenceMode = 'memory-only';
    nativeAvailable = false;
    cached = null;
    return false;
  }

  try {
    const AsyncStorage =
      require('@react-native-async-storage/async-storage').default as AsyncStorageStatic;
    const probeKey = '__hbiq_storage_probe__';
    await AsyncStorage.setItem(probeKey, '1');
    const value = await AsyncStorage.getItem(probeKey);
    await AsyncStorage.removeItem(probeKey);
    if (value !== '1') throw new Error('AsyncStorage probe read mismatch');

    cached = AsyncStorage;
    nativeAvailable = true;
    persistenceMode = 'native-async-storage';
    return true;
  } catch (err) {
    console.warn(
      '[Storage] AsyncStorage probe failed — using in-memory storage:',
      err instanceof Error ? err.message : err,
    );
    cached = null;
    nativeAvailable = false;
    persistenceMode = 'memory-only';
    return false;
  }
}

/** Returns the native AsyncStorage instance after a successful probe, otherwise null. */
export function getNativeAsyncStorage(): AsyncStorageStatic | null {
  if (Platform.OS === 'web') return null;
  if (cached !== undefined) return cached;
  if (!isAsyncStorageNativeModuleLinked()) {
    cached = null;
    return null;
  }
  try {
    cached = require('@react-native-async-storage/async-storage').default as AsyncStorageStatic;
    return cached;
  } catch {
    cached = null;
    return null;
  }
}

/** Supabase-compatible auth storage; falls back to in-memory when native is unavailable. */
export function createSupabaseAuthStorage() {
  const memory = new Map<string, string>();

  return {
    getItem: async (key: string): Promise<string | null> => {
      const native = getNativeAsyncStorage();
      if (native) return native.getItem(key);
      return memory.get(key) ?? null;
    },
    setItem: async (key: string, value: string): Promise<void> => {
      const native = getNativeAsyncStorage();
      if (native) {
        await native.setItem(key, value);
        return;
      }
      memory.set(key, value);
    },
    removeItem: async (key: string): Promise<void> => {
      const native = getNativeAsyncStorage();
      if (native) {
        await native.removeItem(key);
        return;
      }
      memory.delete(key);
    },
  };
}
