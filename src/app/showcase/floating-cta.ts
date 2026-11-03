import { Component, DestroyRef, afterNextRender, inject, input, signal } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { LEAD_SECTION_ID, scrollToLead } from './showcase.config';

/**
 * A small "want one like this?" pill that follows the visitor while they read the invitation.
 * It hides whenever one of the `hideOver` sections is on screen (the hero, the RSVP form, the
 * lead form) so it never covers the photo or a button.
 */
@Component({
  selector: 'app-floating-cta',
  imports: [TranslocoPipe],
  template: `
    <a
      class="floating-cta"
      [class.visible]="visible()"
      [attr.aria-hidden]="!visible()"
      [attr.tabindex]="visible() ? null : -1"
      [href]="'#' + leadId"
      (click)="scrollToLead($event, 'floating')"
    >
      <span aria-hidden="true">✦</span> {{ 'demo.floatingCta' | transloco }}
    </a>
  `,
  styles: `
    .floating-cta {
      position: fixed;
      left: 50%;
      bottom: max(1.25rem, env(safe-area-inset-bottom));
      z-index: 900;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.8rem 1.4rem;
      border-radius: 50px;
      background: rgba(31, 31, 31, 0.92);
      backdrop-filter: blur(6px);
      color: #fff;
      font-family: var(--font-serif);
      font-size: 1rem;
      letter-spacing: 0.03em;
      text-decoration: none;
      white-space: nowrap;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
      opacity: 0;
      pointer-events: none;
      transform: translate(-50%, 1rem);
      transition: opacity 0.4s ease, transform 0.4s ease;
    }

    .floating-cta.visible {
      opacity: 1;
      pointer-events: auto;
      transform: translate(-50%, 0);
    }
  `,
})
export class FloatingCta {
  /** CSS selectors of sections the pill should never cover. */
  readonly hideOver = input<string[]>([]);

  protected readonly visible = signal(false);
  protected readonly leadId = LEAD_SECTION_ID;
  protected readonly scrollToLead = scrollToLead;

  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      const onScreen = new Set<Element>();
      const observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) onScreen.add(entry.target);
          else onScreen.delete(entry.target);
        }
        this.visible.set(onScreen.size === 0);
      });

      for (const selector of this.hideOver()) {
        const element = document.querySelector(selector);
        if (element) observer.observe(element);
      }
      destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}
