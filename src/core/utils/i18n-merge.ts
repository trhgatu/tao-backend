// src/core/utils/i18n-merge.ts
import type { LocaleCode } from '@core';
import type { LocaleText } from '@modules/blog/blog.model';

type PartialLocaleText = Partial<LocaleText>;

export function mergeLocaleText(
  current: LocaleText | undefined,
  patch: PartialLocaleText
): LocaleText {
  const text = patch.text ?? current?.text;
  if (!text) {
    throw new Error('LocaleText.text is required for this locale');
  }

  return {
    text,
    auto: patch.auto ?? current?.auto,
    updatedAt: patch.updatedAt ?? current?.updatedAt ?? new Date(),
    updatedBy: patch.updatedBy ?? current?.updatedBy,
  };
}

/** Merge Map<LocaleCode, LocaleText> với payload partial per-locale */
export function mergeLocaleMap(
  map: Map<LocaleCode, LocaleText>,
  payload?: Partial<Record<LocaleCode, PartialLocaleText>>
) {
  if (!payload) return;

  (['vi', 'en'] as const).forEach((k) => {
    const patch = payload[k];
    if (!patch) return;

    const current = map.get(k);
    const next = mergeLocaleText(current, patch);
    map.set(k, next);
  });
}
