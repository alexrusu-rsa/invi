# Promotion kit: the wedding invitation as a lead magnet

**Positioning in one line:** *"We built our own wedding invitation as a small web app. Try it, then get one for your event, or let's build your product with the same care."*

The demo does the selling: people try the RSVP (it's harmless in showcase mode), see it in their own
language (16 supported, picked from their phone's settings), and land on the "Behind the invitation"
section with the lead form. Each lead records the channel it
came from (the `source` column), so you can see which post or page works.

---

## 1. Before you share it (checklist)

- [x] **Lead form:** leads go to the "Lead Magnet Contact Form" Google Form (https://forms.gle/aU964et2usL9C2XRA),
      configured in `src/app/showcase/showcase.config.ts`. Link it to a Sheet from its Responses tab.
- [x] **LinkedIn link:** https://www.linkedin.com/in/alexrusu-rsa/
- [x] **Credits:** "Designed & built by Alex & Bianca Rusu · RSA SOFT".
- [ ] **Send yourself a test lead** from the live site and check it lands in the Sheet.
- [x] **Deploy** (push to `master`, the branch Render builds from).
- [ ] **Refresh LinkedIn's cache:** paste the link into https://www.linkedin.com/post-inspector/ so the new preview card shows up.

## 2. Links to use (one per channel)

| Where | Link |
| --- | --- |
| LinkedIn post (personal) | `https://www.invitatie.rsasoft.ro/?utm_source=linkedin&utm_medium=post&utm_campaign=wedding-invite` |
| LinkedIn company page (Featured) | `https://www.invitatie.rsasoft.ro/?utm_source=linkedin&utm_medium=company-page&utm_campaign=wedding-invite` |
| rsasoft.ro portfolio | `https://www.invitatie.rsasoft.ro/?utm_source=rsasoft.ro&utm_medium=portfolio&utm_campaign=wedding-invite` |
| Romanian-language post | add `&lang=ro` so it opens in Romanian even on English-set phones |
| German-speaking audience | add `&lang=de` |

Tip: LinkedIn shows links in the post body with less reach for some accounts. A common workaround is
"link in the first comment"; the preview card still renders there.

---

## 3. LinkedIn launch post (EN)

> Bianca and I got married in September. Naturally, we also built the invitation ourselves. 💍
>
> Instead of a printed card, our guests got a link. In under a minute they could:
> → confirm attendance, step by step, including partners and kids
> → pick a menu for each person and flag allergies
> → add the day to their calendar
> → see everything in their own language (16 of them, from Romanian to Arabic, picked automatically)
>
> Every answer landed straight in a Google Sheet. No back-office, no chasing people on WhatsApp.
>
> The wedding is over, so we turned it into a live demo. Try the RSVP (nothing gets sent). It opens in
> your phone's language, so ask a friend abroad to open it too:
> 👉 [link]
>
> Planning an event? We'll build yours. Building a product? That's what we do every day at RSA SOFT,
> with the same attention to detail.
>
> #Angular #WebDevelopment #SideProject #Wedding

## 4. LinkedIn launch post (RO)

> Bianca și cu mine ne-am căsătorit în septembrie. Și, bineînțeles, invitația am construit-o noi. 💍
>
> În loc de o invitație tipărită, invitații noștri au primit un link. În mai puțin de un minut puteau:
> → să confirme prezența, pas cu pas, cu însoțitori și copii
> → să aleagă meniul pentru fiecare persoană și să menționeze alergiile
> → să salveze ziua în calendar
> → să vadă totul în limba lor (16 limbi, de la română la arabă, alese automat)
>
> Toate răspunsurile ajungeau direct într-un Google Sheet. Fără liste pe hârtie, fără mesaje de urmărit.
>
> Nunta a trecut, așa că am transformat-o într-un demo live. Încearcă confirmarea (nu se trimite nimic).
> Se deschide în limba telefonului tău, așa că trimite-o și unui prieten din străinătate:
> 👉 [link]
>
> Organizezi un eveniment? Îți construim invitația. Ai nevoie de o aplicație? Asta facem zilnic la
> RSA SOFT, cu aceeași atenție la detalii.

## 5. Follow-up posts (one a week keeps the link alive)

1. **"One link, 16 languages, zero language buttons."** The page reads the phone's language settings
   and picks the first one it supports, Arabic included, with the whole layout mirrored right to left.
   Show a 10-second screen recording: the same link on phones set to German, Polish and Arabic.
2. **"What should a countdown do after the wedding?"** Most stop at 00:00:00. Ours flips to
   *"Since we said I do, it's been 44 days"*. Small edge cases are where products feel finished.
3. **"13 MB → 0.6 MB."** The first version shipped camera originals and illustrations with huge embedded
   bitmaps. Resizing to what phones actually display cut ~95% of the page weight, with no visible difference.
   Great hook for a before/after Lighthouse screenshot.
4. **"No backend, still a real database."** RSVPs go straight into Google Forms → Sheets: zero hosting
   cost, and the couple can filter guests and menus themselves.
5. **Client angle (for the company page):** "We treat a wedding invitation like a product: user flow,
   edge cases, localisation, performance. Imagine what we do with yours."

## 6. LinkedIn company page: Featured item

- **Title:** Digital wedding invitation (live demo)
- **Description:** Multilingual RSVP app with menu choices, calendar invite and Google Sheets integration. Built with Angular by RSA SOFT.
- **Link:** the company-page URL from section 2

## 7. Portfolio card for rsasoft.ro

- **Title:** Digital Wedding Invitation
- **Subtitle:** A tiny product, built like a big one
- **Description:** Mobile-first invitation with step-by-step RSVP, per-guest menus and allergies, calendar
  invite, shown automatically in 16 languages (including right-to-left Arabic). Answers go straight to Google Sheets, so there's no backend to run.
- **Tags:** Angular · Signals · i18n (Transloco) · Google Forms API · Performance
- **Buttons:** "Try the live demo" (portfolio link) · "View the code" (if the GitHub repo is public)

## 8. Measuring

- Leads: the Google Sheet behind the lead form, with `source` (e.g. `linkedin / post / wedding-invite`) and `language`.
- Visits: the site has no analytics yet. A privacy-friendly, cookie-free option (Plausible, Umami, Cloudflare Web
  Analytics) needs no consent banner and will show which UTM links bring traffic.
