import { Periode } from '~/types/Periode';
import { BehandlingData } from '~/types/BehandlingTypes';

export const meldeperiodeUrl = (saksnummer: string, periode: Periode) =>
    `/sak/${saksnummer}/meldeperiode/${periode.fraOgMed}/${periode.tilOgMed}`;

export const behandlingUrl = ({ saksnummer, id }: Pick<BehandlingData, 'saksnummer' | 'id'>) =>
    `/sak/${saksnummer}/behandling/${id}`;
