import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import confetti from 'canvas-confetti';

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {
  rsvpForm: FormGroup;
  isSubmitted = signal(false);
  hasPartner = signal(false);
  hasChild = signal(false);

  days = signal('00');
  hours = signal('00');
  minutes = signal('00');
  seconds = signal('00');
  private timer: any;

  constructor(private fb: FormBuilder) {
    this.rsvpForm = this.fb.group({
      name: ['', Validators.required],
      partnerName: [''],
      childCount: [1],
      attendance: ['', Validators.required],
      guests: ['1', Validators.required],
      message: ['']
    });
  }

  togglePartner() {
    this.hasPartner.set(!this.hasPartner());
    this.updateGuestsAndValidators();
  }

  toggleChild() {
    this.hasChild.set(!this.hasChild());
    if (this.hasChild()) {
      this.rsvpForm.patchValue({ childCount: 0 });
    } else {
      this.rsvpForm.patchValue({ childCount: 0 });
    }
    this.updateGuestsAndValidators();
  }

  updateGuestsAndValidators() {
    const partnerCtrl = this.rsvpForm.get('partnerName');
    const childCtrl = this.rsvpForm.get('childCount');

    let totalAdults = 1;
    let kids = 0;

    if (this.hasPartner()) {
      partnerCtrl?.setValidators([Validators.required]);
      totalAdults++;
    } else {
      partnerCtrl?.clearValidators();
      partnerCtrl?.setValue('');
    }

    if (this.hasChild()) {
      kids = Number(childCtrl?.value) || 0;
    }

    this.rsvpForm.patchValue({ guests: String(totalAdults + kids) });
    partnerCtrl?.updateValueAndValidity();
    childCtrl?.updateValueAndValidity();
  }

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
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  submitRsvp() {
    if (this.rsvpForm.valid) {
      // Typically we'd call an API here
      console.log('RSVP:', this.rsvpForm.value);
      this.isSubmitted.set(true);
      this.triggerConfetti();
    } else {
      this.rsvpForm.markAllAsTouched();
    }
  }

  triggerConfetti() {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults, particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults, particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
  }
}
