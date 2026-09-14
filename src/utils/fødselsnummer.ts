// Domenesjekken er 11 siffer, uten kontrollsiffer eller dato.
export const erFødselsnummer = (verdi: string): boolean => /^\d{11}$/.test(verdi);
