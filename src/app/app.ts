import { Component, signal, computed, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import confetti from 'canvas-confetti';
import { track } from './analytics/analytics';
import { ConsentBanner } from './analytics/consent-banner';
import { RSVPPayload, submitToGoogleForm } from './google-form';
import { prefersReducedMotion } from './motion/reduced-motion';
import { Reveal } from './motion/reveal';
import { ScrollCues } from './motion/scroll-cues';
import { FloatingCta } from './showcase/floating-cta';
import { LeadSection } from './showcase/lead-section';
import { ShowcaseBanner } from './showcase/showcase-banner';
import { LEAD_SECTION_ID, SHOWCASE_CONFIG, scrollToLead } from './showcase/showcase.config';

// Ceremony start in Romanian time, so the countdown is right for guests in any time zone.
const WEDDING_START = new Date('2026-09-20T13:00:00+03:00').getTime();

interface Guest {
  name: string;
  type: 'principal' | 'partener' | 'copil';
  menuType: 'normal' | 'vegetarian' | 'vegan';
  allergies: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    TranslocoPipe,
    Reveal,
    ScrollCues,
    ConsentBanner,
    ShowcaseBanner,
    FloatingCta,
    LeadSection,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit, OnDestroy {
  private readonly transloco = inject(TranslocoService);
  protected readonly showcase = SHOWCASE_CONFIG;
  protected readonly leadId = LEAD_SECTION_ID;
  protected readonly scrollToLead = scrollToLead;

  // Names are revealed letter by letter.
  protected readonly brideLetters = [...'BIANCA'];
  protected readonly groomLetters = [...'ALEX'];

  // Hearts that float up from the heart divider: position, size, drift, spin, delay.
  protected readonly floatingHearts = [
    { x: '30%', size: '1rem', drift: '-24px', spin: '-20deg', delay: '0.7s' },
    { x: '42%', size: '1.5rem', drift: '10px', spin: '12deg', delay: '1s' },
    { x: '55%', size: '0.85rem', drift: '-8px', spin: '-8deg', delay: '1.3s' },
    { x: '64%', size: '1.25rem', drift: '26px', spin: '18deg', delay: '0.85s' },
    { x: '74%', size: '0.95rem', drift: '6px', spin: '-14deg', delay: '1.5s' },
  ];

  currentStep = signal(1);
  attendance = signal<'yes' | 'no' | null>(null);

  mainName = signal('');
  partnerName = signal('');
  childCount = signal(0);
  isAccompanied = signal<'yes' | 'no' | null>(null);
  // Errors hold translation keys; the template translates them.
  step1Error = signal('');
  isSubmitting = signal(false);
  submissionError = signal('');

  guests = signal<Guest[]>([]);
  activeAllergyGuestIndex = signal<number | null>(null);

  days = signal('00');
  hours = signal('00');
  minutes = signal('00');
  seconds = signal('00');
  // Once the big day has passed, the countdown turns into "since we said I do".
  isPast = signal(false);
  private timer: any;

  // 0 → 1 while the countdown "rolls up" from zero the first time it scrolls into view.
  protected readonly countIntro = signal(1);
  protected readonly countdownView = computed(() => {
    const progress = this.countIntro();
    const roll = (value: string) => String(Math.round(Number(value) * progress)).padStart(2, '0');
    return {
      days: roll(this.days()),
      hours: roll(this.hours()),
      minutes: roll(this.minutes()),
      seconds: roll(this.seconds()),
    };
  });

  ngOnInit() {
    this.updateCountdown();
    this.timer = setInterval(() => this.updateCountdown(), 1000);
  }

  startCountdownIntro() {
    if (prefersReducedMotion()) return;
    const duration = 1800;
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      this.countIntro.set(1 - Math.pow(1 - t, 4));
      if (t < 1) requestAnimationFrame(step);
    };
    this.countIntro.set(0);
    requestAnimationFrame(step);
  }

  private updateCountdown() {
    const diff = WEDDING_START - Date.now();
    const distance = Math.abs(diff);
    const d = Math.floor(distance / (1000 * 60 * 60 * 24));
    const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((distance % (1000 * 60)) / 1000);
    this.isPast.set(diff < 0);
    this.days.set(String(d).padStart(2, '0'));
    this.hours.set(String(h).padStart(2, '0'));
    this.minutes.set(String(m).padStart(2, '0'));
    this.seconds.set(String(s).padStart(2, '0'));
  }

  ngOnDestroy() {
    if (this.timer) clearInterval(this.timer);
  }

  // Step 1 Actions
  async handleMainAttendance(choice: 'yes' | 'no', nameInput: string) {
    if (!nameInput.trim()) {
      this.step1Error.set('rsvp.nameRequired');
      return;
    }
    this.step1Error.set('');
    this.mainName.set(nameInput);
    this.attendance.set(choice);
    track('rsvp_start', { attendance: choice });
    if (choice === 'no') {
      this.isSubmitting.set(true);
      this.submissionError.set('');
      try {
        await this.submitRsvp({
          attendance: 'no',
          mainName: nameInput,
          guests: [],
        });
        track('rsvp_complete', { attendance: 'no' });
        this.currentStep.set(4);
      } catch {
        this.submissionError.set('rsvp.error');
      } finally {
        this.isSubmitting.set(false);
      }
    } else {
      this.currentStep.set(2);
    }
  }

  // Step 2 Actions
  setAccompanied(choice: 'yes' | 'no') {
    this.isAccompanied.set(choice);
    if (choice === 'no') {
      this.goToStep3();
    } else {
      setTimeout(() => {
        document
          .querySelector('.companion-setup')
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }
  }

  goToStep3() {
    const list: Guest[] = [];
    list.push({ name: this.mainName(), type: 'principal', menuType: 'normal', allergies: '' });

    if (this.isAccompanied() === 'yes') {
      if (this.partnerName().trim()) {
        list.push({
          name: this.partnerName(),
          type: 'partener',
          menuType: 'normal',
          allergies: '',
        });
      }
      for (let i = 0; i < this.childCount(); i++) {
        list.push({
          name: this.transloco.translate('guest.childName', { n: i + 1 }),
          type: 'copil',
          menuType: 'normal',
          allergies: '',
        });
      }
    }

    this.guests.set(list);
    this.currentStep.set(3);
  }

  // Step 3 Actions
  openAllergyPopup(index: number) {
    this.activeAllergyGuestIndex.set(index);
  }

  closeAllergyPopup() {
    this.activeAllergyGuestIndex.set(null);
  }

  updateGuestDetails(index: number, menuType: any, allergies: string) {
    const updated = [...this.guests()];
    updated[index].menuType = menuType;
    updated[index].allergies = allergies;
    this.guests.set(updated);
  }

  async finalConfirm() {
    console.log('Final RSVP Data:', {
      attendance: this.attendance(),
      guests: this.guests(),
    });
    this.isSubmitting.set(true);
    this.submissionError.set('');
    try {
      await this.submitRsvp({
        attendance: this.attendance() || 'yes',
        mainName: this.mainName(),
        partnerName: this.partnerName(),
        childCount: this.childCount(),
        guests: this.guests(),
      });
      if (this.attendance() === 'yes') {
        this.triggerConfetti();
      }
      track('rsvp_complete', { attendance: this.attendance() || 'yes', guests: this.guests().length });
      this.currentStep.set(4);
    } catch {
      this.submissionError.set('rsvp.error');
    } finally {
      this.isSubmitting.set(false);
    }
  }

  // In showcase mode visitors only try the flow: nothing reaches the wedding's Google Form.
  private submitRsvp(payload: RSVPPayload): Promise<void> {
    if (this.showcase.enabled) {
      return new Promise((resolve) => setTimeout(resolve, 600));
    }
    return submitToGoogleForm(payload);
  }

  // Utility
  updatePartnerName(val: string) {
    this.partnerName.set(val);
  }

  updateChildCount(val: number) {
    this.childCount.set(val);
  }

  triggerConfetti() {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };
    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  }
}
