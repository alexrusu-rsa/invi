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
  author: 'Alex Rusu',
  company: 'RSA SOFT',
  websiteUrl: 'https://www.rsasoft.ro',
  linkedinUrl: '',
  email: 'alex.rusu@rsasoft.ro',

  leadForm: {
    formUrl: '',
    fields: {
      name: 'entry.1000001',      // Change to your actual Entry ID
      email: 'entry.1000002',     // Change to your actual Entry ID
      interest: 'entry.1000003',  // Change to your actual Entry ID
      eventDate: 'entry.1000004', // Change to your actual Entry ID
      message: 'entry.1000005',   // Change to your actual Entry ID
      language: 'entry.1000006',  // Change to your actual Entry ID
      source: 'entry.1000007',    // Change to your actual Entry ID
    },
  },
};

/** Anchor id of the lead section; every call-to-action scrolls here. */
export const LEAD_SECTION_ID = 'get-yours';

export function scrollToLead(event?: Event) {
  event?.preventDefault();
  document.getElementById(LEAD_SECTION_ID)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
