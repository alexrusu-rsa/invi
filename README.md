# Bianca & Alex · Digital Wedding Invitation

**Live demo:** https://www.invitatie.rsasoft.ro

A mobile-first wedding invitation I designed and built for my own wedding. Guests opened it from a
WhatsApp link, confirmed attendance step by step, picked a menu for every person in their party,
flagged allergies and saved the date to their calendar, with every answer landing in a Google Sheet.

After the wedding it became a live portfolio piece: the RSVP is simulated, and visitors can request
an invitation (or a web app) of their own.

## Highlights

- **Multi-step RSVP**: companions and children, per-guest menu (standard / vegetarian / vegan) and allergy notes.
- **Zero-backend data collection**: answers are posted straight to Google Forms → Google Sheets, one row per guest.
- **Speaks the guest's language**: 16 languages (RO, EN, DE, FR, IT, ES, PT, NL/Flemish, DA, SV, PL, CS, SK, UK, RU, AR),
  chosen at runtime from the browser's preferred languages ([Transloco](https://jsverse.gitbook.io/transloco)), with
  right-to-left layout for Arabic and fallback fonts for Cyrillic and Arabic script.
- **Time-zone-safe countdown** that turns into "since we said *I do*" after the big day.
- **Calendar invite** (`.ics`), map links, confetti on confirmation.
- **Lightweight**: ~0.6 MB of images (down from ~13 MB of camera originals), lazy loading, no layout shift.
- **Showcase mode**: demo banner, call-to-action and a lead form that records which channel (UTM) each lead came from.

## Tech

Angular 21 (standalone components, signals, zoneless) · Transloco · Vitest · Google Forms · static hosting on Render.

## Run it

```bash
npm install
npm start          # http://localhost:4200
npm test           # unit tests (language detection, translation files, lead attribution)
npm run build      # production build in dist/invitatie/browser
```

## Configuration

| What | Where |
| --- | --- |
| Texts in every language | `public/i18n/{ro,en,de}.json` (a test fails if a key or `{{param}}` is missing in any language) |
| Add a language | add its JSON file and its code to `AVAILABLE_LANGS` in `src/app/i18n/languages.ts` |
| RSVP Google Form | `src/app/google-form.config.ts` |
| Showcase mode, contact links, lead form | `src/app/showcase/showcase.config.ts` (`enabled: false` turns it back into a real invitation) |
| Link preview (LinkedIn, WhatsApp) | `og:*` tags in `src/index.html`, image `public/og-image.jpg` (1200×627) |

### Language selection

1. `?lang=de` in the URL (useful when sharing a link with a specific audience)
2. the browser's preferred languages (`navigator.languages`), first supported one wins
3. English otherwise

There is no language picker on the page: guests simply see their phone's language.

---

Designed & built by **Alex Rusu · [RSA SOFT](https://www.rsasoft.ro)**. Want something like this? Use the form at the bottom of the
[live demo](https://www.invitatie.rsasoft.ro/#get-yours).
