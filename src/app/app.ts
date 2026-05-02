import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import confetti from 'canvas-confetti';

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  rsvpForm: FormGroup;
  isSubmitted = signal(false);

  constructor(private fb: FormBuilder) {
    this.rsvpForm = this.fb.group({
      name: ['', Validators.required],
      attendance: ['', Validators.required],
      guests: ['1', Validators.required],
      message: ['']
    });
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
