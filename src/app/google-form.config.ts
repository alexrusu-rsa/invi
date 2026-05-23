export interface GoogleFormConfig {
  formUrl: string;
  submissionMode: 'single-row-per-guest' | 'single-row-per-group';
  
  // Fields for 'single-row-per-guest' mode
  guestFields?: {
    groupName?: string;   // Optional: Maps to entry.XXXX (links companions to the main guest)
    guestName: string;   // Maps to entry.XXXX
    menuType: string;    // Maps to entry.XXXX (Normal, Vegetarian, Vegan)
    allergies: string;   // Maps to entry.XXXX (Allergies or mentions)
    attendance: string;  // Maps to entry.XXXX (Da / Nu)
  };

  // Fields for 'single-row-per-group' mode
  groupFields?: {
    mainName: string;     // Maps to entry.XXXX
    attendance: string;   // Maps to entry.XXXX (Da / Nu)
    partnerName: string;  // Maps to entry.XXXX
    childCount: string;   // Maps to entry.XXXX
    dietSummary: string;  // Maps to entry.XXXX (Summary of all guest diets)
  };
}

export const GOOGLE_FORM_CONFIG: GoogleFormConfig = {
  // Place your Form Response URL here (e.g. https://docs.google.com/forms/u/0/d/e/1FAIpQLSfXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/formResponse)
  formUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSf0LfjogGykOQdzIPFGcnUbG2IdjpnGSijm7tEzx-AVgA6cpg/formResponse',
  
  // Choose your mode
  submissionMode: 'single-row-per-guest',

  // Config for 'single-row-per-guest' mode
  guestFields: {
    guestName: 'entry.643250072',
    menuType: 'entry.117558332',
    allergies: 'entry.1454393000',
    attendance: 'entry.1583387762'
  },

  // Config for 'single-row-per-group' mode
  groupFields: {
    mainName: 'entry.2000001',    // Change to your actual Entry ID
    attendance: 'entry.2000002',  // Change to your actual Entry ID
    partnerName: 'entry.2000003', // Change to your actual Entry ID
    childCount: 'entry.2000004',  // Change to your actual Entry ID
    dietSummary: 'entry.2000005'  // Change to your actual Entry ID
  }
};
