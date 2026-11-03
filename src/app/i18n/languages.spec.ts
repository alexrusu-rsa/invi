import { describe, it, expect } from 'vitest';
import { detectLanguage, toSupportedLang } from './languages';

describe('detectLanguage', () => {
  it('uses the first supported browser language', () => {
    expect(detectLanguage({ browser: ['ja-JP', 'pl-PL', 'en-US'] })).toBe('pl');
  });

  it('lets the ?lang= param override the browser', () => {
    expect(detectLanguage({ query: 'en', browser: ['ro-RO'] })).toBe('en');
  });

  it('ignores unsupported values and falls back to English', () => {
    expect(detectLanguage({ query: 'xx', browser: ['ja', 'zh-CN'] })).toBe('en');
  });
});

describe('toSupportedLang', () => {
  it('normalises region and case variants', () => {
    expect(toSupportedLang('nl-BE')).toBe('nl');
    expect(toSupportedLang('PT_br')).toBe('pt');
    expect(toSupportedLang(' de-CH ')).toBe('de');
    expect(toSupportedLang('mo')).toBe('ro');
    expect(toSupportedLang(undefined)).toBeNull();
  });
});
