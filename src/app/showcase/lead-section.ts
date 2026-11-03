import { Component, inject, signal } from '@angular/core';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { Reveal } from '../motion/reveal';
import { LeadInterest, submitLead } from './lead-form';
import { LEAD_SECTION_ID, SHOWCASE_CONFIG } from './showcase.config';
import { getTrafficSource } from './traffic-source';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type LeadStatus = 'idle' | 'invalid' | 'sending' | 'sent' | 'mailto' | 'error';

@Component({
  selector: 'app-lead-section',
  imports: [TranslocoPipe, Reveal],
  templateUrl: './lead-section.html',
  styleUrl: './lead-section.css',
})
export class LeadSection {
  private readonly transloco = inject(TranslocoService);

  protected readonly config = SHOWCASE_CONFIG;
  protected readonly sectionId = LEAD_SECTION_ID;
  protected readonly websiteHost = new URL(SHOWCASE_CONFIG.websiteUrl).hostname.replace(/^www\./, '');
  protected readonly features = [
    'lead.feature1',
    'lead.feature2',
    'lead.feature3',
    'lead.feature4',
    'lead.feature5',
  ];
  protected readonly interests: LeadInterest[] = ['invite', 'webapp', 'other'];
  protected readonly status = signal<LeadStatus>('idle');

  // Captured on load: the URL still carries the UTM params the visitor arrived with.
  private readonly source = getTrafficSource(location.search, document.referrer);

  async submit(event: SubmitEvent) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const data = new FormData(form);
    const field = (name: string) => String(data.get(name) ?? '').trim();

    const lead = {
      name: field('name'),
      email: field('email'),
      interest: field('interest') as LeadInterest,
      eventDate: field('eventDate'),
      message: field('message'),
      language: this.transloco.getActiveLang(),
      source: this.source,
    };
    if (!lead.name || !EMAIL_PATTERN.test(lead.email)) {
      this.status.set('invalid');
      return;
    }

    this.status.set('sending');
    try {
      this.status.set(await submitLead(lead, this.transloco.translate('lead.mailSubject')));
    } catch {
      this.status.set('error');
    }
  }
}
