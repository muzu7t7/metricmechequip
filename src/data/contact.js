// Shared contact details used by the Contact section, the footer and the
// floating WhatsApp button. Edit here to update them everywhere.

export const BRANCHES = [
  { label: 'Ajman',     tel: '+971589013804', display: '+971 58 901 3804' },
  { label: 'Dubai',     tel: '+971523659736', display: '+971 52 365 9736' },
  { label: 'Abu Dhabi', tel: '+971555312201', display: '+971 55 531 2201' },
  { label: 'Admin',     tel: '+971522957739', display: '+971 52 295 7739' },
];

// Country code + number, no "+" and no leading 0 (the format wa.me expects).
export const WHATSAPP_NUMBER = '971523659736';
export const WHATSAPP_DISPLAY = '+971 52 365 9736';
export const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`;
