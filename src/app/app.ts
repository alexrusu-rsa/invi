import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import confetti from 'canvas-confetti';

interface Guest {
  name: string;
  type: 'principal' | 'partener' | 'copil';
  menuType: 'normal' | 'vegetarian' | 'vegan';
  allergies: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {
  currentStep = signal(1);
  attendance = signal<'yes' | 'no' | null>(null);

  mainName = signal('');
  partnerName = signal('');
  childCount = signal(0);
  isAccompanied = signal<'yes' | 'no' | null>(null);
  step1Error = signal('');

  guests = signal<Guest[]>([]);
  activeAllergyGuestIndex = signal<number | null>(null);

  days = signal('00');
  hours = signal('00');
  minutes = signal('00');
  seconds = signal('00');
  private timer: any;

  ngOnInit() {
    const targetDate = new Date('2026-09-20T18:00:00').getTime();
    this.timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      if (distance < 0) {
        clearInterval(this.timer);
        return;
      }
      const d = Math.floor(distance / (1000 * 60 * 60 * 24));
      const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((distance % (1000 * 60)) / 1000);
      this.days.set(String(d).padStart(2, '0'));
      this.hours.set(String(h).padStart(2, '0'));
      this.minutes.set(String(m).padStart(2, '0'));
      this.seconds.set(String(s).padStart(2, '0'));
    }, 1000);
  }

  ngOnDestroy() {
    if (this.timer) clearInterval(this.timer);
  }

  // Step 1 Actions
  handleMainAttendance(choice: 'yes' | 'no', nameInput: string) {
    if (!nameInput.trim()) {
      this.step1Error.set('Introdu numele și prenumele');
      return;
    }
    this.step1Error.set('');
    this.mainName.set(nameInput);
    this.attendance.set(choice);
    if (choice === 'no') {
      this.currentStep.set(4);
    } else {
      this.currentStep.set(2);
    }
  }

  // Step 2 Actions
  setAccompanied(choice: 'yes' | 'no') {
    this.isAccompanied.set(choice);
    if (choice === 'no') {
      this.goToStep3();
    }
  }

  goToStep3() {
    const list: Guest[] = [];
    list.push({ name: this.mainName(), type: 'principal', menuType: 'normal', allergies: '' });

    if (this.isAccompanied() === 'yes') {
      if (this.partnerName().trim()) {
        list.push({ name: this.partnerName(), type: 'partener', menuType: 'normal', allergies: '' });
      }
      for (let i = 0; i < this.childCount(); i++) {
        list.push({ name: `Copil ${i + 1}`, type: 'copil', menuType: 'normal', allergies: '' });
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

  finalConfirm() {
    console.log('Final RSVP Data:', {
      attendance: this.attendance(),
      guests: this.guests()
    });
    if (this.attendance() === 'yes') {
      this.triggerConfetti();
    }
    this.currentStep.set(4);
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
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  }
}
