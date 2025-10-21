import { Behandling } from '~/types/Behandling';
import { Periode } from '~/types/Periode';

export const meldeperiodeUrl = (saksnummer: string, periode: Periode) =>
    `/sak/${saksnummer}/meldeperiode/${periode.fraOgMed}/${periode.tilOgMed}`;

export const behandlingUrl = ({ saksnummer, id }: Pick<Behandling, 'saksnummer' | 'id'>) =>
    `/sak/${saksnummer}/behandling/${id}`;
