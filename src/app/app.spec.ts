import { TestBed } from '@angular/core/testing';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { App } from './app';
import en from '../../public/i18n/en.json';
import ro from '../../public/i18n/ro.json';

describe('App', () => {
  beforeEach(async () => {
    // jsdom has no IntersectionObserver (used by the scroll reveals and the floating call-to-action).
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        observe() {}
        unobserve() {}
        disconnect() {}
      },
    );

    await TestBed.configureTestingModule({
      imports: [
        App,
        TranslocoTestingModule.forRoot({
          langs: { ro, en },
          translocoConfig: { availableLangs: ['ro', 'en', 'de'], defaultLang: 'ro' },
          preloadLangs: true,
        }),
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('BIANCA');
  });

  it('should render the invitation in the active language', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.top-announcement')?.textContent).toContain('Sunteți invitați');
  });
});
