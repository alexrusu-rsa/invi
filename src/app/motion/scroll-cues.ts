import { Component, DestroyRef, ElementRef, afterNextRender, inject, signal } from '@angular/core';
import { track } from '../analytics/analytics';

/**
 * Small rewards for scrolling: a rose progress line along the top, a bouncing hint on the first
 * screen, and a heart that pops (with a little burst of confetti) when the guest reaches the end.
 */
@Component({
  selector: 'app-scroll-cues',
  template: `
    <div class="progress" aria-hidden="true">
      <div class="bar"></div>
      <span class="tip" [class.done]="finished()">♥</span>
    </div>
    <div class="hint" [class.gone]="scrolled()" aria-hidden="true">
      <span class="chevron"></span>
    </div>
  `,
  styles: `
    .progress {
      position: fixed;
      inset: 0 0 auto 0;
      height: 3px;
      z-index: 1000;
      pointer-events: none;
    }

    .bar {
      height: 100%;
      background: linear-gradient(90deg, var(--rose-light), var(--rose));
      box-shadow: 0 0 8px rgba(224, 107, 95, 0.45);
      transform: scaleX(var(--progress, 0));
      transform-origin: left;
    }

    :host-context([dir='rtl']) .bar {
      transform-origin: right;
    }

    .tip {
      position: absolute;
      top: 4px;
      inset-inline-end: 8px;
      font-size: 1.1rem;
      line-height: 1;
      color: var(--rose);
      transform: scale(0);
    }

    .tip.done {
      animation:
        tip-pop 0.8s var(--ease-spring) both,
        heartbeat 1.5s ease-in-out 0.8s 3;
    }

    .hint {
      position: fixed;
      left: 50%;
      bottom: max(1.5rem, env(safe-area-inset-bottom));
      z-index: 900;
      width: 34px;
      height: 54px;
      margin-left: -17px;
      border: 1.5px solid rgba(31, 31, 31, 0.45);
      border-radius: 20px;
      background: rgba(237, 237, 237, 0.6);
      backdrop-filter: blur(4px);
      animation: hint-in 1s var(--ease-out-soft) 2.5s both;
      transition: opacity 0.5s ease, transform 0.5s ease;
      pointer-events: none;
    }

    .hint.gone {
      opacity: 0;
      transform: translateY(12px);
    }

    .chevron {
      position: absolute;
      left: 50%;
      top: 10px;
      width: 6px;
      height: 6px;
      margin-left: -3px;
      border-radius: 50%;
      background: var(--color-primary);
      animation: scroll-dot 1.8s ease-in-out infinite;
    }

    @keyframes hint-in {
      from {
        opacity: 0;
        transform: translateY(16px);
      }
    }

    @keyframes scroll-dot {
      0% {
        opacity: 0;
        transform: translateY(0);
      }

      30% {
        opacity: 1;
      }

      100% {
        opacity: 0;
        transform: translateY(22px);
      }
    }

    @keyframes tip-pop {
      from {
        transform: scale(0);
      }

      60% {
        transform: scale(1.6);
      }

      to {
        transform: scale(1);
      }
    }
  `,
})
export class ScrollCues {
  protected readonly scrolled = signal(false);
  protected readonly finished = signal(false);

  constructor() {
    const host: HTMLElement = inject(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      let frame = 0;
      const update = () => {
        frame = 0;
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollable > 0 ? Math.min(1, window.scrollY / scrollable) : 0;
        // Written straight to a CSS variable: no change detection on every scroll frame.
        host.style.setProperty('--progress', String(progress));
        this.scrolled.set(window.scrollY > 40);
        if (progress > 0.99 && !this.finished()) {
          this.finished.set(true);
          this.celebrate();
          track('invitation_end_reached');
        }
      };
      const onScroll = () => (frame ||= requestAnimationFrame(update));

      // No measurement at startup: the page opens at the top (progress 0), and reading the
      // layout this early would force an extra reflow while the page is still loading.
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll, { passive: true });
      destroyRef.onDestroy(() => {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onScroll);
        cancelAnimationFrame(frame);
      });
    });
  }

  /** "You made it to the end": a soft, short burst in the invitation's colours. */
  private async celebrate() {
    // Loaded on demand: most of the page never needs it.
    const { default: confetti } = await import('canvas-confetti');
    confetti({
      particleCount: 70,
      spread: 75,
      startVelocity: 38,
      origin: { x: 0.5, y: 1 },
      angle: 90,
      scalar: 0.85,
      ticks: 160,
      colors: ['#e06b5f', '#f2b5ab', '#ffffff', '#1f1f1f'],
      zIndex: 1000,
      disableForReducedMotion: true,
    });
  }
}
