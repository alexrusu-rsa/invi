import { Component } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { LEAD_SECTION_ID, SHOWCASE_CONFIG, scrollToLead } from './showcase.config';

@Component({
  selector: 'app-showcase-banner',
  imports: [TranslocoPipe],
  template: `
    <aside class="showcase-banner">
      <span class="badge">{{ 'demo.badge' | transloco }}</span>
      <span class="text">{{ 'demo.builtBy' | transloco: { author: config.author } }}</span>
      <a class="cta" [href]="'#' + leadId" (click)="scrollToLead($event, 'banner')">
        {{ 'demo.cta' | transloco }} <span class="arrow" aria-hidden="true">→</span>
      </a>
    </aside>
  `,
  styles: `
    .showcase-banner {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      gap: 0.35rem 0.75rem;
      padding: 0.6rem 1rem;
      background: var(--color-primary);
      color: #f5f5f5;
      font-family: var(--font-serif);
      font-size: 0.9rem;
      text-align: center;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.7rem;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: #bdbdbd;
    }

    .badge::before {
      content: '';
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #ff5a5f;
      animation: pulse 2s ease-in-out infinite;
    }

    .cta {
      color: #fff;
      font-weight: 600;
      letter-spacing: 0.05em;
      text-decoration: underline;
      text-underline-offset: 3px;
      white-space: nowrap;
    }

    .arrow {
      display: inline-block;
    }

    :host-context([dir='rtl']) .arrow {
      transform: scaleX(-1);
    }

    @keyframes pulse {
      50% {
        opacity: 0.35;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .badge::before {
        animation: none;
      }
    }
  `,
})
export class ShowcaseBanner {
  protected readonly config = SHOWCASE_CONFIG;
  protected readonly leadId = LEAD_SECTION_ID;
  protected readonly scrollToLead = scrollToLead;
}
