import { Rammebehandling } from '~/lib/rammebehandling/typer/Rammebehandling';
import { Periode } from '~/types/Periode';
import { BeregningKilde, BeregningKildeType } from '~/lib/beregning-og-simulering/typer/Beregning';
import { SakProps } from '~/lib/sak/SakTyper';
import { MeldekortbehandlingId } from '~/lib/meldekort/typer/Meldekortbehandling';
import type { PersonoversiktTab } from '~/lib/personoversikt/Personoversikt';

export const meldeperiodeUrl = (saksnummer: string, periode: Periode) =>
    `/sak/${saksnummer}/meldeperiode/${periode.fraOgMed}/${periode.tilOgMed}`;

export const behandlingUrl = ({ saksnummer, id }: Pick<Rammebehandling, 'saksnummer' | 'id'>) =>
    `/sak/${saksnummer}/behandling/${id}`;

export const registrerSoknadUrl = (saksnummer: string) => `/sak/${saksnummer}/registrer-soknad`;

export const personoversiktUrl = (saksnummer: string, tab?: PersonoversiktTab) =>
    `/sak/${saksnummer}${tab ? `#${tab}` : ''}`;

export const beregningKildeUrl = (beregningKilde: BeregningKilde, sak: SakProps) => {
    const { saksnummer } = sak;

    switch (beregningKilde.type) {
        case BeregningKildeType.MELDEKORT: {
            return meldekortbehandlingUrl(saksnummer, beregningKilde.id);
        }
        case BeregningKildeType.RAMMEBEHANDLING:
            return behandlingUrl({ saksnummer, id: beregningKilde.id });
    }
};

export const meldekortbehandlingUrl = (
    saksnummer: string,
    meldekortbehandlingId: MeldekortbehandlingId,
) => {
    return `/sak/${saksnummer}/meldekortbehandling/${meldekortbehandlingId}`;
};
