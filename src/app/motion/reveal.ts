import { DestroyRef, Directive, ElementRef, afterNextRender, inject, input, output } from '@angular/core';
import { prefersReducedMotion } from './reduced-motion';

/**
 * How an element enters (styles live in src/motion.css):
 * - `up`, `fade`, `zoom`: rise, fade or scale in
 * - `start`, `end`: slide in from the reading start / end side (mirrored for right-to-left)
 * - `grow`: a line that draws itself from the centre
 * - `write`: script text uncovered in reading direction, like ink
 * - `letters`: children with class `letter` (and `--i` index) rise one after another
 */
export type RevealVariant = 'up' | 'fade' | 'zoom' | 'start' | 'end' | 'grow' | 'write' | 'letters';

const pending = new WeakMap<Element, () => void>();
let observer: IntersectionObserver | undefined;

function revealWhenVisible(element: Element, reveal: () => void) {
  if (prefersReducedMotion() || typeof IntersectionObserver === 'undefined') {
    reveal();
    return;
  }
  observer ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer!.unobserve(entry.target);
        pending.get(entry.target)?.();
        pending.delete(entry.target);
      }
    },
    // Trigger a little after the element enters, so the animation is actually seen.
    { rootMargin: '0px 0px -10% 0px', threshold: 0.12 },
  );
  pending.set(element, reveal);
  observer.observe(element);
}

/** Animates an element in, once, the first time it scrolls into view. */
@Directive({
  selector: '[appReveal]',
  host: {
    '[attr.data-reveal]': 'appReveal() || "up"',
    '[style.--reveal-delay]': 'revealDelay() + "ms"',
  },
})
export class Reveal {
  readonly appReveal = input<RevealVariant | ''>('');
  /** Extra delay in ms, to stagger siblings. */
  readonly revealDelay = input(0);
  readonly revealed = output<void>();

  constructor() {
    const element: HTMLElement = inject(ElementRef).nativeElement;

    afterNextRender(() =>
      revealWhenVisible(element, () => {
        element.classList.add('is-revealed');
        this.revealed.emit();
      }),
    );
    inject(DestroyRef).onDestroy(() => {
      observer?.unobserve(element);
      pending.delete(element);
    });
  }
}
