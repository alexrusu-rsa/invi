/** True when the visitor asked the OS for less motion; every animation then jumps to its end state. */
export function prefersReducedMotion(): boolean {
  return typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
}
