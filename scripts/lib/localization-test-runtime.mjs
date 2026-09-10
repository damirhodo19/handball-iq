import { readFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { createRequire } from 'node:module';
import vm from 'node:vm';
import ts from 'typescript';

// Execute the actual TypeScript modules. Storage and cloud access are isolated;
// no user data, scenario files, or external services can be written by tests.
export function createRuntime(root = process.cwd(), overrides = {}) {
  const cache = new Map();
  const memory = new Map();
  const require = createRequire(resolve(root, 'package.json'));
  const storage = {
    getItem: (key) => memory.get(key) ?? null,
    setItem: (key, value) => memory.set(key, String(value)),
    removeItem: (key) => memory.delete(key),
  };
  const mocks = {
    'expo-constants': { default: { expoConfig: { version: 'test' } }, __esModule: true },
    'react-native': { Platform: { OS: 'web', select: (values) => values.web ?? values.default }, NativeModules: {} },
    '@/lib/supabase': { supabase: null, isSupabaseConfigured: false },
    ...overrides,
  };
  function load(specifier, parent = resolve(root, 'entry.ts')) {
    if (Object.hasOwn(mocks, specifier)) return mocks[specifier];
    if (!specifier.startsWith('.') && !specifier.startsWith('@/') && !specifier.startsWith('/')) {
      try { return require(specifier); } catch (error) { throw new Error(`External module ${specifier} in ${parent}: ${error.message}`); }
    }
    const base = specifier.startsWith('@/') ? resolve(root, specifier.slice(2)) : resolve(dirname(parent), specifier);
    for (const [name, value] of Object.entries(mocks)) {
      if (name.startsWith('@/') && resolve(root, name.slice(2)) === base) return value;
    }
    const file = [base + '.ts', base + '.tsx', base + '/index.ts', base + '/index.tsx', base].find(existsSync);
    if (!file) throw new Error(`Cannot resolve ${specifier} from ${parent}`);
    if (cache.has(file)) return cache.get(file).exports;
    if (file.endsWith('.json')) return JSON.parse(readFileSync(file, 'utf8'));
    const module = { exports: {} };
    cache.set(file, module);
    const source = ts.transpileModule(readFileSync(file, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
      fileName: file,
    }).outputText;
    vm.runInNewContext(source, {
      module, exports: module.exports, require: (name) => load(name, file),
      console, __DEV__: false, process: { env: {} },
      window: { localStorage: storage }, localStorage: storage,
      setTimeout, clearTimeout, Date, URL,
    }, { filename: file });
    return module.exports;
  }
  return { load, storage, mocks };
}
