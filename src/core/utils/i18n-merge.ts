// src/core/utils/i18n-merge.ts
import type { LocaleCode } from '@core';
import type { LocaleText } from '@shared/i18n/types';

// Merge 1 locale, trả về { next, changed }
export function mergeLocaleText(
  current: LocaleText | undefined,
  patch: Partial<LocaleText>
): { next: LocaleText; changed: boolean } {
  // text mới = patch.text ?? current.text
  const text = patch.text ?? current?.text;
  if (!text) {
    // tạo locale mới mà không có text -> lỗi hợp lý
    throw new Error('LocaleText.text is required for this locale');
  }

  const next: LocaleText = {
    text,
    auto: patch.auto ?? current?.auto,
    // chỉ set updatedAt mới nếu patch cung cấp hoặc có thay đổi thực sự
    updatedAt: current?.updatedAt,
    updatedBy: patch.updatedBy ?? current?.updatedBy,
  };

  // xác định có thay đổi gì không (ngoại trừ updatedAt)
  const changed =
    (current?.text ?? undefined) !== next.text ||
    (current?.auto ?? undefined) !== next.auto ||
    String(current?.updatedBy ?? '') !== String(next.updatedBy ?? '');

  if (patch.updatedAt) {
    next.updatedAt = patch.updatedAt;
  } else if (changed) {
    next.updatedAt = new Date();
  }

  return { next, changed };
}

/**
 * Merge Map<LocaleCode, LocaleText> với payload partial per-locale
 * Trả về true nếu có bất kỳ locale nào thay đổi.
 */
export function mergeLocaleMap(
  map: Map<LocaleCode, LocaleText>,
  payload?: Partial<Record<LocaleCode, Partial<LocaleText>>>
): boolean {
  if (!payload) return false;

  let anyChanged = false;

  for (const [rawKey, patch] of Object.entries(payload)) {
    if (!patch) continue;
    const key = rawKey as LocaleCode;

    const current = map.get(key);
    const { next, changed } = mergeLocaleText(current, patch);
    if (changed || !current) {
      map.set(key, next);
      anyChanged = anyChanged || changed || !current;
    }
  }

  return anyChanged;
}
