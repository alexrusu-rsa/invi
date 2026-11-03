import { Component, DestroyRef, afterNextRender, inject, signal } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { COOKIE_POLICY_URL, ConsentChoice, readConsent, saveConsent } from './analytics';

/**
 * Asks once for analytics cookies. It waits a moment so the invitation's opening animation is
 * seen first; nothing is tracked with cookies until the guest accepts. Reject is as easy as accept.
 */
@Component({
  selector: 'app-consent-banner',
  imports: [TranslocoPipe],
  template: `
    @if (visible()) {
      <aside class="consent" role="dialog" aria-modal="false" aria-labelledby="consent-text">
        <p id="consent-text">
          {{ 'consent.text' | transloco }}
          <a [href]="policyUrl" target="_blank" rel="noopener">{{ 'consent.policy' | transloco }}</a>
        </p>
        <div class="actions">
          <button type="button" class="reject" (click)="choose('rejected')">
            {{ 'consent.reject' | transloco }}
          </button>
          <button type="button" class="accept" (click)="choose('accepted')">
            {{ 'consent.accept' | transloco }}
          </button>
        </div>
      </aside>
    }
  `,
  styles: `
    .consent {
      position: fixed;
      left: 50%;
      bottom: max(1rem, env(safe-area-inset-bottom));
      z-index: 1100;
      width: min(460px, calc(100% - 2rem));
      padding: 1.2rem 1.3rem;
      border-radius: 20px;
      background: rgba(255, 255, 255, 0.96);
      backdrop-filter: blur(8px);
      box-shadow: 0 18px 50px rgba(0, 0, 0, 0.18);
      font-family: var(--font-serif);
      color: var(--color-primary);
      transform: translateX(-50%);
      animation: consent-in 0.7s var(--ease-out-soft) both;
    }

    p {
      font-size: 1rem;
      line-height: 1.45;
      margin-bottom: 1rem;
    }

    a {
      color: inherit;
      text-underline-offset: 3px;
    }

    .actions {
      display: flex;
      gap: 0.6rem;
    }

    button {
      flex: 1;
      padding: 0.8rem 1rem;
      border-radius: 50px;
      font-family: var(--font-serif);
      font-size: 0.95rem;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      cursor: pointer;
      transition: background-color 0.3s ease, transform 0.1s ease;
    }

    button:active {
      transform: scale(0.96);
    }

    .reject {
      background: transparent;
      border: 1px solid #bbb;
      color: #555;
    }

    .accept {
      background: #222;
      border: 1px solid #222;
      color: #fff;
    }

    .accept:hover {
      background: #000;
    }

    @keyframes consent-in {
      from {
        opacity: 0;
        transform: translate(-50%, 24px);
      }
    }
  `,
})
export class ConsentBanner {
  protected readonly visible = signal(false);
  protected readonly policyUrl = COOKIE_POLICY_URL;

  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      if (readConsent()) return;
      const timer = setTimeout(() => this.visible.set(true), 1800);
      destroyRef.onDestroy(() => clearTimeout(timer));
    });
  }

  protected choose(choice: ConsentChoice) {
    saveConsent(choice);
    this.visible.set(false);
  }
}
