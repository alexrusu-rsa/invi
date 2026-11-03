/**
 * Describes where a visitor came from, e.g. "linkedin / post / launch" for
 * `?utm_source=linkedin&utm_medium=post&utm_campaign=launch`, so every lead can be
 * attributed to the channel that brought it. Falls back to the referrer's host, then "direct".
 */
export function getTrafficSource(search: string, referrer: string): string {
  const params = new URLSearchParams(search);
  const utm = ['utm_source', 'utm_medium', 'utm_campaign']
    .map((name) => params.get(name)?.trim())
    .filter(Boolean);
  if (utm.length) return utm.join(' / ');

  try {
    return new URL(referrer).hostname.replace(/^www\./, '');
  } catch {
    return 'direct';
  }
}
