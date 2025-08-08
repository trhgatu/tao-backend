// src/core/utils/i18n.ts
export type LocaleCode = 'vi' | 'en';

export type LocaleMap<T extends { text: string }> = Map<LocaleCode, T>;

export function pickLocale<T extends { text: string }>(
  map: LocaleMap<T> | undefined,
  lang: LocaleCode = 'vi'
): string {
  const v = map?.get(lang)?.text?.trim();
  if (v) return v;
  return map?.get('vi')?.text ?? '';
}
