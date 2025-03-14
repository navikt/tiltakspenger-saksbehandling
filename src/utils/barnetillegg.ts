import { SøknadBarn } from '../types/SøknadTypes';
import { VedtakBarnetilleggPeriode } from '../types/VedtakTyper';
import { finn16årsdag, forrigeDag, nesteDag } from './date';
import { Periode } from '../types/Periode';
import { erDatoIPeriode } from './periode';
import { removeDuplicates } from './array';

export const periodiserBarnetillegg = (
    barnFraSøknad: SøknadBarn[],
    virkningsperiode: Periode,
): VedtakBarnetilleggPeriode[] => {
    const sorterteBarn = barnFraSøknad.toSorted((a, b) => (a.fødselsdato > b.fødselsdato ? 1 : -1));

    const perioderPerBarn = sorterteBarn.reduce<Array<Periode & { navn: string }>>((acc, barn) => {
        const { fødselsdato, fornavn } = barn;
        const sisteDagFør16År = forrigeDag(finn16årsdag(fødselsdato));

        const kanFåBarnetillegg =
            fødselsdato <= virkningsperiode.tilOgMed &&
            sisteDagFør16År >= virkningsperiode.fraOgMed;

        if (kanFåBarnetillegg) {
            acc.push({
                navn: fornavn!,
                fraOgMed:
                    fødselsdato > virkningsperiode.fraOgMed
                        ? fødselsdato
                        : virkningsperiode.fraOgMed,
                tilOgMed:
                    sisteDagFør16År < virkningsperiode.tilOgMed
                        ? sisteDagFør16År
                        : virkningsperiode.tilOgMed,
            });
        }

        return acc;
    }, []);

    const avgrensningsdatoer = perioderPerBarn
        .flatMap((periode) => [
            periode.fraOgMed,
            ...(periode.tilOgMed === virkningsperiode.tilOgMed ? [] : [nesteDag(periode.tilOgMed)]),
        ])
        .filter(removeDuplicates)
        .toSorted();

    return avgrensningsdatoer
        .map((fraOgMed, index) => {
            const perioder = perioderPerBarn.filter((periode) => erDatoIPeriode(fraOgMed, periode));
            const nesteDato = avgrensningsdatoer.at(index + 1);

            return {
                antallBarn: perioder.length,
                periode: {
                    fraOgMed,
                    tilOgMed: nesteDato ? forrigeDag(nesteDato) : virkningsperiode.tilOgMed,
                },
            };
        })
        .filter((bt) => bt.antallBarn > 0);
};
