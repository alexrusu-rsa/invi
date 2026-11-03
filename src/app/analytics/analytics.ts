/**
 * Google Analytics 4, shared with rsasoft.ro so a visitor's journey across both sites shows up
 * in one property (GA4 puts its cookie on the parent domain, .rsasoft.ro).
 *
 * Consent Mode: everything starts denied, exactly like rsasoft.ro. Until the visitor accepts in
 * the consent banner, Google sets no cookies and only receives anonymous, cookie-free pings.
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

/** Loads gtag.js with Consent Mode defaults. Runs once at startup. */
export function initAnalytics() {
  if (!isLiveSite()) return;

  window.dataLayer = window.dataLayer ?? [];
  window.gtag = function () {
    // gtag.js expects the `arguments` object itself, not an array.
    window.dataLayer!.push(arguments);
  };

  window.gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: readConsent() === 'accepted' ? 'granted' : 'denied',
  });
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID);

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);
}

export function readConsent(): ConsentChoice | null {
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${CONSENT_COOKIE}=(accepted|rejected)`));
  return (match?.[1] as ConsentChoice) ?? null;
}

/** Remembers the visitor's choice and applies it immediately. We only ask for analytics, never ads. */
export function saveConsent(choice: ConsentChoice) {
  const domain = isLiveSite() ? '; Domain=rsasoft.ro' : '';
  const secure = location.protocol === 'https:' ? '; Secure' : '';
  document.cookie =
    `${CONSENT_COOKIE}=${choice}; Max-Age=${CONSENT_MAX_AGE}; Path=/; SameSite=Lax${domain}${secure}`;

  window.gtag?.('consent', 'update', {
    analytics_storage: choice === 'accepted' ? 'granted' : 'denied',
  });
}

/** Sends a GA4 event; a no-op on local development. */
export function track(event: string, params: Record<string, string | number> = {}) {
  window.gtag?.('event', event, params);
}

export function setUserProperty(name: string, value: string) {
  window.gtag?.('set', 'user_properties', { [name]: value });
}
