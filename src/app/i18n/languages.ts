// Also listed in the translation preload script in src/index.html: keep both in sync.
export const AVAILABLE_LANGS = [
  'ro', 'en', 'de', 'fr', 'it', 'es', 'pt', 'nl', 'da', 'sv', 'pl', 'cs', 'sk', 'uk', 'ru', 'ar',
] as const;
export type Lang = (typeof AVAILABLE_LANGS)[number];

/** Languages written right to left. */
export const RTL_LANGS: readonly Lang[] = ['ar'];

/** Used when none of the visitor's preferred languages is supported. */
export const FALLBACK_LANG: Lang = 'en';

/** `?lang=de` forces a language: an invisible override, handy for sharing a link with a given audience. */
export const LANG_QUERY_PARAM = 'lang';

export interface LanguageSources {
  query?: string | null;
  browser?: readonly string[];
}

/**
 * Picks the first supported language from the `?lang=` query param, then the browser's
 * preferred languages (`navigator.languages`, in the visitor's order of preference).
 */
export function detectLanguage({ query, browser = [] }: LanguageSources): Lang {
  for (const candidate of [query, ...browser]) {
    const lang = toSupportedLang(candidate);
    if (lang) return lang;
  }
  return FALLBACK_LANG;
}

/**
 * Maps a BCP 47 tag such as `de-AT`, `nl-BE` (Flemish) or `pt_BR` to a supported language, or null.
 * `mo` (Moldovan) is Romanian.
 */
export function toSupportedLang(tag: string | null | undefined): Lang | null {
  const base = tag?.trim().toLowerCase().split(/[-_]/)[0];
  const normalized = base === 'mo' ? 'ro' : base;
  return AVAILABLE_LANGS.find((lang) => lang === normalized) ?? null;
}
