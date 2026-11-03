import { Injectable } from '@angular/core';
import { Translation, TranslocoLoader } from '@jsverse/transloco';

/**
 * Loads `public/i18n/{lang}.json` at runtime, so only the active language is downloaded.
 * Plain fetch (no HttpClient) so it reuses the request index.html preloads for the same file.
 */
@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  async getTranslation(lang: string): Promise<Translation> {
    const response = await fetch(`/i18n/${lang}.json`);
    if (!response.ok) throw new Error(`Could not load translations for "${lang}"`);
    return response.json();
  }
}
