import { finn16årsdag, forrigeDag, nesteDag } from '~/utils/date';
import { MedPeriode, Periode } from '~/types/Periode';
import { erDatoIPeriode, slåSammenPeriodisering } from '~/utils/periode';
import { removeDuplicatesFilter } from '~/utils/array';
import { kunPerioderMedBarn } from '~/components/behandling/felles/barnetillegg/utils/barnetilleggUtils';
import { SøknadBarn } from '~/types/Søknad';
import { BarnetilleggPeriode } from '~/types/Barnetillegg';

export const periodiserBarnetilleggFraSøknad = (
    barnFraSøknad: SøknadBarn[],
    innvilgelsesperioder: MedPeriode[],
): BarnetilleggPeriode[] => {
    const barnetillegg = innvilgelsesperioder.flatMap((innvilgelsesperiode) => {
        return periodiserBarnetilleggForPeriode(barnFraSøknad, innvilgelsesperiode.periode);
    });

    return slåSammenPeriodisering(barnetillegg, (a, b) => a.antallBarn === b.antallBarn);
};

const periodiserBarnetilleggForPeriode = (
    barnFraSøknad: SøknadBarn[],
    innvilgelsesperiode: Periode,
): BarnetilleggPeriode[] => {
    // Periodene med rett til barnetillegg for hvert barn, innenfor innvilgelsesperioden
    const perioderPerBarn = barnFraSøknad.reduce<Periode[]>((acc, barn) => {
        const { fødselsdato, oppholderSegIEØSSpm } = barn;

        if (oppholderSegIEØSSpm.svar !== 'JA') {
            return acc;
        }

        const sisteDagFør16År = forrigeDag(finn16årsdag(fødselsdato));

        const erFødtOgUnder16 =
            fødselsdato <= innvilgelsesperiode.tilOgMed &&
            sisteDagFør16År >= innvilgelsesperiode.fraOgMed;

        if (erFødtOgUnder16) {
            acc.push({
                fraOgMed:
                    fødselsdato > innvilgelsesperiode.fraOgMed
                        ? fødselsdato
                        : innvilgelsesperiode.fraOgMed,
                tilOgMed:
                    sisteDagFør16År < innvilgelsesperiode.tilOgMed
                        ? sisteDagFør16År
                        : innvilgelsesperiode.tilOgMed,
            });
        }

        return acc;
    }, []);

    const avgrensningsdatoer = perioderPerBarn
        .flatMap((periode) => [
            periode.fraOgMed,
            ...(periode.tilOgMed === innvilgelsesperiode?.tilOgMed
                ? []
                : [nesteDag(periode.tilOgMed)]),
        ])
        .filter(removeDuplicatesFilter())
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
                    tilOgMed: nesteDato ? forrigeDag(nesteDato) : innvilgelsesperiode.tilOgMed,
                },
            };
        })
        .filter(kunPerioderMedBarn);
};
