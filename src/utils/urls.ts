import { Periode } from '../types/Periode';

export const meldeperiodeUrl = (saksnummer: string, periode: Periode) =>
    `/sak/${saksnummer}/meldeperiode/${periode.fraOgMed}/${periode.tilOgMed}`;
