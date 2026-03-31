import { Rammebehandling } from '~/types/Rammebehandling';
import { Periode } from '~/types/Periode';
import { BeregningKilde, BeregningKildeType } from '~/types/Beregning';
import { SakProps } from '~/types/Sak';

export const meldeperiodeUrl = (saksnummer: string, periode: Periode) =>
    `/sak/${saksnummer}/meldeperiode/${periode.fraOgMed}/${periode.tilOgMed}`;

export const behandlingUrl = ({ saksnummer, id }: Pick<Rammebehandling, 'saksnummer' | 'id'>) =>
    `/sak/${saksnummer}/behandling/${id}`;

export const registrerSoknadUrl = (saksnummer: string) => `/sak/${saksnummer}/registrer-soknad`;

export const personoversiktUrl = ({ saksnummer }: Pick<Rammebehandling, 'saksnummer'>) =>
    `/sak/${saksnummer}`;

export const beregningKildeUrl = (beregningKilde: BeregningKilde, sak: SakProps) => {
    const { saksnummer, meldeperiodeKjeder } = sak;

    switch (beregningKilde.type) {
        case BeregningKildeType.MELDEKORT: {
            const meldeperiodeKjede = meldeperiodeKjeder.find((kjede) =>
                kjede.meldekortbehandlinger.some((mkb) => mkb.id === beregningKilde.id),
            );
            if (!meldeperiodeKjede) {
                throw new Error(`Fant ikke meldeperiodekjede med id ${beregningKilde.id}`);
            }
            return meldeperiodeUrl(saksnummer, meldeperiodeKjede.periode);
        }
        case BeregningKildeType.RAMMEBEHANDLING:
            return behandlingUrl({ saksnummer, id: beregningKilde.id });
    }
};
