import { describe, it, expect } from 'vitest';
import { AVAILABLE_LANGS } from './languages';
import ar from '../../../public/i18n/ar.json';
import cs from '../../../public/i18n/cs.json';
import da from '../../../public/i18n/da.json';
import de from '../../../public/i18n/de.json';
import en from '../../../public/i18n/en.json';
import es from '../../../public/i18n/es.json';
import fr from '../../../public/i18n/fr.json';
import it_ from '../../../public/i18n/it.json';
import nl from '../../../public/i18n/nl.json';
import pl from '../../../public/i18n/pl.json';
import pt from '../../../public/i18n/pt.json';
import ro from '../../../public/i18n/ro.json';
import ru from '../../../public/i18n/ru.json';
import sk from '../../../public/i18n/sk.json';
import sv from '../../../public/i18n/sv.json';
import uk from '../../../public/i18n/uk.json';

type Tree = { [key: string]: string | Tree };

const files: Record<string, Tree> = {
  ro, en, de, fr, it: it_, es, pt, nl, da, sv, pl, cs, sk, uk, ru, ar,
};

function flatten(tree: Tree, prefix = ''): Record<string, string> {
  return Object.entries(tree).reduce<Record<string, string>>((flat, [key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return typeof value === 'string' ? { ...flat, [path]: value } : { ...flat, ...flatten(value, path) };
  }, {});
}

const params = (text: string) => [...text.matchAll(/{{\s*(\w+)\s*}}/g)].map((m) => m[1]).sort();

describe('translation files', () => {
  it('exist for exactly the supported languages', () => {
    expect(Object.keys(files).sort()).toEqual([...AVAILABLE_LANGS].sort());
  });

  const source = flatten(ro);

  for (const [lang, tree] of Object.entries(files).filter(([lang]) => lang !== 'ro')) {
    const translated = flatten(tree);

    it(`${lang} has exactly the same keys as ro`, () => {
      expect(Object.keys(translated).sort()).toEqual(Object.keys(source).sort());
    });

    it(`${lang} has no empty values and keeps every {{param}}`, () => {
      for (const [key, text] of Object.entries(source)) {
        expect(translated[key]?.trim(), key).toBeTruthy();
        expect(params(translated[key]), key).toEqual(params(text));
      }
    });
  }
});
