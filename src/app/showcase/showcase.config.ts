export interface ShowcaseConfig {
  /**
   * Portfolio mode. When true, RSVPs are simulated (nothing reaches the wedding Google Form)
   * and the demo banner, call-to-action and lead form are shown.
   * Set to false to run the app as a real invitation again.
   */
  enabled: boolean;
  author: string;
  company: string;
  websiteUrl: string;
  /** Leave empty to hide the LinkedIn link. */
  linkedinUrl: string;
  email: string;

  /**
   * Google Form that collects leads (same mechanism as the RSVP form).
   * Create a form with short-answer questions for every field below, copy its
   * `formResponse` URL and the `entry.XXXX` ids from "Get pre-filled link".
   * While `formUrl` is empty, the lead form opens a pre-filled email instead.
   */
  leadForm: {
    formUrl: string;
    fields: {
      name: string;
      email: string;
      interest: string;
      eventDate: string;
      message: string;
      language: string;
      source: string;
    };
  };
}

export const SHOWCASE_CONFIG: ShowcaseConfig = {
  enabled: true,
  author: 'Alex & Bianca Rusu',
  company: 'RSA SOFT',
  websiteUrl: 'https://www.rsasoft.ro',
  linkedinUrl: 'https://www.linkedin.com/in/alexrusu-rsa/',
  email: 'alex.rusu@rsasoft.ro',

  // "Lead Magnet Contact Form" (https://forms.gle/aU964et2usL9C2XRA)
  leadForm: {
    formUrl:
      'https://docs.google.com/forms/d/e/1FAIpQLSds3SgSL2mKEXwcMsfsycwxlMDNviyl7rr4HPBA4a2IRkoTxg/formResponse',
    fields: {
      name: 'entry.1558670575',
      email: 'entry.1660695287',
      interest: 'entry.548184225',
      eventDate: 'entry.596202392',
      message: 'entry.772861443',
      language: 'entry.1852819063',
      source: 'entry.1579152959',
    },
  },
};

/** Anchor id of the lead section; every call-to-action scrolls here. */
export const LEAD_SECTION_ID = 'get-yours';

export function scrollToLead(event?: Event) {
  event?.preventDefault();
  document.getElementById(LEAD_SECTION_ID)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
