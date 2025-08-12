// src/core/utils/i18n.ts

export type LocaleCode = 'vi' | 'en';
export type Localized<T> = Partial<Record<LocaleCode, T>>;
export type LocaleMap<T> = Map<LocaleCode, T>;

export function pickLocaleEntry<T>(
  map: Localized<T> | LocaleMap<T> | undefined,
  lang: LocaleCode,
  fallback: LocaleCode = 'vi'
): T | undefined {
  if (!map) return undefined;
  if (map instanceof Map) {
    return map.get(lang) ?? map.get(fallback);
  }
  return (map as Localized<T>)?.[lang] ?? (map as Localized<T>)?.[fallback];
}

export function pickLocaleText(
  map: Localized<{ text: string }> | LocaleMap<{ text: string }> | undefined,
  lang: LocaleCode,
  fallback: LocaleCode = 'vi'
): string {
  const entry = pickLocaleEntry<{ text: string }>(map, lang, fallback);
  const txt = entry?.text?.trim();
  if (txt) return txt;

  const fb = pickLocaleEntry<{ text: string }>(map, fallback, fallback);
  return fb?.text ?? '';
}
