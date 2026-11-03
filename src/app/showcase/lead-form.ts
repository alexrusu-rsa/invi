import { sendRequest } from '../google-form';
import { SHOWCASE_CONFIG } from './showcase.config';

export type LeadInterest = 'invite' | 'webapp' | 'other';

export interface LeadPayload {
  name: string;
  email: string;
  interest: LeadInterest;
  eventDate: string;
  message: string;
  language: string;
  source: string;
}

/**
 * Sends a lead to the configured Google Form. Without a form URL it opens the visitor's
 * email client with the message pre-filled instead.
 */
export async function submitLead(lead: LeadPayload, mailSubject: string): Promise<'sent' | 'mailto'> {
  const { leadForm, email } = SHOWCASE_CONFIG;

  if (!leadForm.formUrl) {
    const details = [`${lead.name} <${lead.email}>`, `Interest: ${lead.interest}`];
    if (lead.eventDate) details.push(`Event date: ${lead.eventDate}`);
    const body = [lead.message, details.join('\n')].filter(Boolean).join('\n\n');
    window.location.href =
      `mailto:${email}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(body)}`;
    return 'mailto';
  }

  const formData = new URLSearchParams();
  for (const [field, entryId] of Object.entries(leadForm.fields)) {
    formData.append(entryId, lead[field as keyof LeadPayload] || '-');
  }
  await sendRequest(leadForm.formUrl, formData);
  return 'sent';
}
