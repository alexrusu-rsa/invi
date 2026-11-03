/**
 * Google Analytics 4, shared with rsasoft.ro so a visitor's journey across both sites shows up
 * in one property (GA4 puts its cookie on the parent domain, .rsasoft.ro).
 *
 * Nothing from Google loads until the visitor accepts in the consent banner: no cookies, no
 * pings, and no 180 KB gtag.js slowing down the first visit. For returning visitors who already
 * accepted, gtag.js loads once the page has finished loading, so it never competes with the photos.
 * The choice is stored in a cookie on .rsasoft.ro so rsasoft.ro could share it later.
 */
export const GA_MEASUREMENT_ID = 'G-ZY2RCK6GLL';
export const COOKIE_POLICY_URL = 'https://www.rsasoft.ro/cookie-policy';

export type ConsentChoice = 'accepted' | 'rejected';

const CONSENT_COOKIE = 'rsa_consent';
const CONSENT_MAX_AGE = 180 * 24 * 60 * 60; // 6 months, then we ask again

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/** Only the live site reports to GA, so local development never shows up in the statistics. */
function isLiveSite(): boolean {
  const host = location.hostname;
  return host === 'rsasoft.ro' || host.endsWith('.rsasoft.ro');
}

/** Runs once at startup: starts GA only for visitors who accepted on an earlier visit. */
export function initAnalytics() {
  if (!isLiveSite() || readConsent() !== 'accepted') return;
  startGtag();
  if (document.readyState === 'complete') loadGtagScript();
  else window.addEventListener('load', () => setTimeout(loadGtagScript, 0), { once: true });
}

export function readConsent(): ConsentChoice | null {
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${CONSENT_COOKIE}=(accepted|rejected)`));
  return (match?.[1] as ConsentChoice) ?? null;
}

/** Remembers the visitor's choice; accepting starts GA right away. We only ask for analytics, never ads. */
export function saveConsent(choice: ConsentChoice) {
  const domain = isLiveSite() ? '; Domain=rsasoft.ro' : '';
  const secure = location.protocol === 'https:' ? '; Secure' : '';
  document.cookie =
    `${CONSENT_COOKIE}=${choice}; Max-Age=${CONSENT_MAX_AGE}; Path=/; SameSite=Lax${domain}${secure}`;

  if (choice === 'accepted' && isLiveSite()) {
    startGtag();
    setUserProperty('invite_language', document.documentElement.lang);
    loadGtagScript();
  }
}

/** Sends a GA4 event; a no-op until the visitor accepts, and on local development. */
export function track(event: string, params: Record<string, string | number> = {}) {
  window.gtag?.('event', event, params);
}

export function setUserProperty(name: string, value: string) {
  window.gtag?.('set', 'user_properties', { [name]: value });
}

/** Defines the gtag queue; calls made before gtag.js arrives are replayed when it loads. */
function startGtag() {
  if (window.gtag) return;
  window.dataLayer = window.dataLayer ?? [];
  window.gtag = function () {
    // gtag.js expects the `arguments` object itself, not an array.
    window.dataLayer!.push(arguments);
  };
  window.gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'granted',
  });
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID);
}

function loadGtagScript() {
  if (document.querySelector('script[data-gtag]')) return;
  const script = document.createElement('script');
  script.async = true;
  script.dataset['gtag'] = '';
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);
}
