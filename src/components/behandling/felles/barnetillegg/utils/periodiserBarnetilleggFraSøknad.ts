import { finn16årsdag, forrigeDag, nesteDag } from '~/utils/date';
import { Periode } from '~/types/Periode';
import { erDatoIPeriode } from '~/utils/periode';
import { removeDuplicates } from '~/utils/array';
import { kunPerioderMedBarn } from '~/components/behandling/felles/barnetillegg/utils/barnetilleggUtils';
import { SøknadBarn } from '~/types/Søknad';
import { Nullable } from '~/types/UtilTypes';
import { BarnetilleggPeriodeFormData } from './hentBarnetilleggFraBehandling';

export const periodiserBarnetilleggFraSøknad = (
    barnFraSøknad: SøknadBarn[],
    virkningsperiode: Nullable<Periode>,
): BarnetilleggPeriodeFormData[] => {
    if (!virkningsperiode) {
        return [
            {
                antallBarn: barnFraSøknad.length,
                periode: { fraOgMed: null, tilOgMed: null },
            },
        ];
    }

    // Periodene med rett til barnetillegg for hvert barn, innenfor virkningsperioden
    const perioderPerBarn = barnFraSøknad.reduce<Periode[]>((acc, barn) => {
        const { fødselsdato, oppholderSegIEØS } = barn;

        if (!oppholderSegIEØS) {
            return acc;
        }

        const sisteDagFør16År = forrigeDag(finn16årsdag(fødselsdato));

        const kanFåBarnetillegg =
            fødselsdato <= virkningsperiode.tilOgMed &&
            sisteDagFør16År >= virkningsperiode.fraOgMed;

        if (kanFåBarnetillegg) {
            acc.push({
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
            ...(periode.tilOgMed === virkningsperiode?.tilOgMed
                ? []
                : [nesteDag(periode.tilOgMed)]),
        ])
        .filter(removeDuplicates)
        .toSorted();

    return avgrensningsdatoer
        .map((fraOgMed, index) => {
            const antallBarn = perioderPerBarn.filter((periode) =>
                erDatoIPeriode(fraOgMed, periode),
            ).length;
            const nesteDato = avgrensningsdatoer.at(index + 1);

            return {
                antallBarn,
                periode: {
                    fraOgMed,
                    tilOgMed: nesteDato ? forrigeDag(nesteDato) : virkningsperiode.tilOgMed,
                },
            };
        })
        .filter(kunPerioderMedBarn);
};
