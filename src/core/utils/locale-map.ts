// Helper: object <-> Map cho i18n
import type { LocaleCode } from '@core';

export function toLocaleMap<T extends object>(
  obj: Partial<Record<LocaleCode, T>> | undefined
): Map<LocaleCode, T> {
  const m = new Map<LocaleCode, T>();
  if (!obj) return m;
  (['vi', 'en'] as LocaleCode[]).forEach((k) => {
    const v = obj[k];
    if (v) m.set(k, v);
  });
  return m;
}

export function fromLocaleMap<T extends object>(
  map: Map<LocaleCode, T> | undefined
): Partial<Record<LocaleCode, T>> {
  const out: Partial<Record<LocaleCode, T>> = {};
  if (!map) return out;
  map.forEach((v, k) => (out[k] = v));
  return out;
}
