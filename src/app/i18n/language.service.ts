import { DOCUMENT, Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { TranslocoService } from '@jsverse/transloco';
import { firstValueFrom } from 'rxjs';
import { setUserProperty } from '../analytics/analytics';
import { LANG_QUERY_PARAM, RTL_LANGS, detectLanguage } from './languages';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly transloco = inject(TranslocoService);
  private readonly document = inject(DOCUMENT);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  /**
   * Runs once at startup: activates the visitor's browser language and resolves when its
   * translations are loaded, so the page never flashes untranslated keys.
   */
  async init(): Promise<void> {
    const navigator = this.document.defaultView?.navigator;
    const lang = detectLanguage({
      query: new URLSearchParams(this.document.location.search).get(LANG_QUERY_PARAM),
      browser: [...(navigator?.languages ?? []), navigator?.language ?? ''],
    });

    this.transloco.setActiveLang(lang);
    this.document.documentElement.lang = lang;
    this.document.documentElement.dir = RTL_LANGS.includes(lang) ? 'rtl' : 'ltr';
    setUserProperty('invite_language', lang);

    await firstValueFrom(this.transloco.load(lang));
    this.title.setTitle(this.transloco.translate<string>('meta.title'));
    this.meta.updateTag({
      name: 'description',
      content: this.transloco.translate<string>('meta.description'),
    });
  }
}
