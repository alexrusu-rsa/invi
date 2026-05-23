import { GOOGLE_FORM_CONFIG } from './google-form.config';

export interface RSVPPayload {
  attendance: 'yes' | 'no';
  mainName: string;
  partnerName?: string;
  childCount?: number;
  guests: Array<{
    name: string;
    type: 'principal' | 'partener' | 'copil';
    menuType: 'normal' | 'vegetarian' | 'vegan';
    allergies: string;
  }>;
}

export async function submitToGoogleForm(data: RSVPPayload): Promise<void> {
  const config = GOOGLE_FORM_CONFIG;

  if (!config.formUrl) {
    console.warn('Google Form submission bypassed (no formUrl provided).');
    return;
  }

  if (config.submissionMode === 'single-row-per-guest') {
    const fields = config.guestFields;
    if (!fields) {
      throw new Error('Google Form fields for guest mode are not configured.');
    }

    // In guest mode, we submit one request per guest.
    // If the guest declines ('no'), we only make a single submission for the main user.
    if (data.attendance === 'no') {
      const formData = new URLSearchParams();
      if (fields.groupName) {
        formData.append(fields.groupName, data.mainName);
      }
      formData.append(fields.guestName, data.mainName);
      formData.append(fields.menuType, '-');
      formData.append(fields.allergies, '-');
      formData.append(fields.attendance, 'Nu');

      await sendRequest(config.formUrl, formData);
      return;
    }

    // Otherwise, submit a row for each guest in the party.
    const promises = data.guests.map(guest => {
      const formData = new URLSearchParams();
      if (fields.groupName) {
        formData.append(fields.groupName, data.mainName);
      }
      formData.append(fields.guestName, guest.name);
      formData.append(fields.menuType, formatMenuType(guest.menuType));
      formData.append(fields.allergies, guest.allergies || '-');
      formData.append(fields.attendance, 'Da');

      return sendRequest(config.formUrl, formData);
    });

    await Promise.all(promises);

  } else {
    // Group mode: Send exactly one request representing the entire group.
    const fields = config.groupFields;
    if (!fields) {
      throw new Error('Google Form fields for group mode are not configured.');
    }

    const formData = new URLSearchParams();
    formData.append(fields.mainName, data.mainName);
    formData.append(fields.attendance, data.attendance === 'yes' ? 'Da' : 'Nu');

    if (data.attendance === 'yes') {
      formData.append(fields.partnerName, data.partnerName || '-');
      formData.append(fields.childCount, String(data.childCount || 0));

      const dietSummary = data.guests
        .map(g => `${g.name} (${formatGuestType(g.type)}): Meniu ${formatMenuType(g.menuType)}${g.allergies ? ` [Mentions: ${g.allergies}]` : ''}`)
        .join('; ');
      formData.append(fields.dietSummary, dietSummary);
    } else {
      formData.append(fields.partnerName, '-');
      formData.append(fields.childCount, '0');
      formData.append(fields.dietSummary, '-');
    }

    await sendRequest(config.formUrl, formData);
  }
}

async function sendRequest(url: string, body: URLSearchParams): Promise<void> {
  try {
    // Mode 'no-cors' allows submission despite Google Forms not responding with CORS headers.
    await fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: body.toString()
    });
  } catch (error) {
    console.error('Error submitting response to Google Forms:', error);
    throw new Error('A apărut o problemă la trimiterea răspunsului. Te rugăm să încerci din nou.');
  }
}

function formatGuestType(type: string): string {
  switch (type) {
    case 'principal': return 'Principal';
    case 'partener': return 'Partener';
    case 'copil': return 'Copil';
    default: return type;
  }
}

function formatMenuType(menu: string): string {
  switch (menu) {
    case 'normal': return 'Normal';
    case 'vegetarian': return 'Vegetarian';
    case 'vegan': return 'Vegan';
    default: return menu;
  }
}
