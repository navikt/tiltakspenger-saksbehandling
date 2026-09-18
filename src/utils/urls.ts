import { Rammebehandling } from '~/lib/rammebehandling/typer/Rammebehandling';
import { Periode } from '~/types/Periode';
import { BeregningKilde, BeregningKildeType } from '~/lib/beregning-og-simulering/typer/Beregning';
import { SakProps } from '~/lib/sak/SakTyper';
import { MeldekortbehandlingId } from '~/lib/meldekort/typer/Meldekortbehandling';
import type { PersonoversiktTab } from '~/lib/personoversikt/Personoversikt';
import type { MeldeperiodekjedeTab } from '~/lib/meldekort/meldeperiodekjede/høyre-seksjon/MeldeperiodekjedeHøyreSeksjon';
import type { KlageId } from '~/lib/klage/typer/Klage';
import { Saksnummer } from '~/lib/sak/Saksnummer';

export const meldeperiodeUrl = (
    saksnummer: Saksnummer,
    periode: Periode,
    tab?: MeldeperiodekjedeTab,
) =>
    `/sak/${saksnummer}/meldeperiode/${periode.fraOgMed}/${periode.tilOgMed}${tab ? `#${tab}` : ''}`;

export const behandlingUrl = ({ saksnummer, id }: Pick<Rammebehandling, 'saksnummer' | 'id'>) =>
    `/sak/${saksnummer}/behandling/${id}`;

export const registrerSoknadUrl = (saksnummer: Saksnummer) => `/sak/${saksnummer}/registrer-soknad`;

export const personoversiktUrl = (saksnummer: Saksnummer, tab?: PersonoversiktTab) =>
    `/sak/${saksnummer}${tab ? `#${tab}` : ''}`;

export enum KlageStegUrlSegment {
    Formkrav = 'formkrav',
    Vurdering = 'vurdering',
    Brev = 'brev',
    Resultat = 'resultat',
}

export const klagebehandlingUrl = (
    saksnummer: Saksnummer,
    klageId: KlageId,
    steg: KlageStegUrlSegment,
) => `/sak/${saksnummer}/klage/${klageId}/${steg}`;

export const opprettKlageUrl = (saksnummer: Saksnummer) => `/sak/${saksnummer}/klage/opprett`;

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
    saksnummer: Saksnummer,
    meldekortbehandlingId: MeldekortbehandlingId,
    steg?: number,
) => {
    return `/sak/${saksnummer}/meldekortbehandling/${meldekortbehandlingId}${steg !== undefined ? `#steg-${steg}` : ''}`;
};
