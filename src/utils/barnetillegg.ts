import { SøknadBarn } from '../types/SøknadTypes';
import { VedtakBarnetilleggPeriode } from '../types/VedtakTyper';
import { finn16årsdag, forrigeDag, nesteDag } from './date';
import { Periode } from '../types/Periode';
import { erDatoIPeriode } from './periode';

export const periodiserBarnetillegg = (
    barnFraSøknad: SøknadBarn[],
    virkningsperiode: Periode,
): VedtakBarnetilleggPeriode[] => {
    const sorterteBarn = barnFraSøknad.toSorted((a, b) => (a.fødselsdato > b.fødselsdato ? 1 : -1));

    const periodePerBarn = sorterteBarn.reduce<Array<Periode & { navn: string }>>((acc, barn) => {
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

    const datoer = periodePerBarn
        .flatMap((periode) => [
            periode.fraOgMed,
            ...(periode.tilOgMed === virkningsperiode.tilOgMed ? [] : [nesteDag(periode.tilOgMed)]),
        ])
        .filter((dato, index, array) => array.indexOf(dato) === index)
        .toSorted();

    return datoer
        .map((fraOgMed, index) => {
            const perioder = periodePerBarn.filter((periode) => erDatoIPeriode(fraOgMed, periode));
            const nesteDato = datoer.at(index + 1);

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
