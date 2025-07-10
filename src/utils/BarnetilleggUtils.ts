import { SøknadBarn } from '../types/SøknadTypes';
import { VedtakBarnetilleggPeriode } from '../types/VedtakTyper';
import { finn16årsdag, forrigeDag, nesteDag } from './date';
import { Periode } from '../types/Periode';
import { erDatoIPeriode } from './periode';
import { removeDuplicates } from './array';
import { OppdaterBarnetilleggRequest } from '~/types/Barnetillegg';
import { SøknadsbehandlingVedtakContext } from '~/components/behandling/søknadsbehandling/context/SøknadsbehandlingVedtakContext';

export const periodiserBarnetillegg = (
    barnFraSøknad: SøknadBarn[],
    virkningsperiode: Periode,
): VedtakBarnetilleggPeriode[] => {
    // Periodene med rett til barnetillegg for hvert barn, innenfor virkningsperioden
    const perioderPerBarn = barnFraSøknad.reduce<Periode[]>((acc, barn) => {
        const { fødselsdato } = barn;
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
            ...(periode.tilOgMed === virkningsperiode.tilOgMed ? [] : [nesteDag(periode.tilOgMed)]),
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
        .filter((bt) => bt.antallBarn > 0);
};

export const tilBarnetilleggRequest = (
    vedtak: SøknadsbehandlingVedtakContext,
): OppdaterBarnetilleggRequest => {
    return {
        innvilgelsesperiode: vedtak.behandlingsperiode,
        barnetillegg: vedtak.harBarnetillegg
            ? {
                  begrunnelse: vedtak.getBarnetilleggBegrunnelse(),
                  perioder: vedtak.barnetilleggPerioder,
              }
            : null,
        valgteTiltaksdeltakelser: vedtak.valgteTiltaksdeltakelser,
        antallDagerPerMeldeperiodeForPerioder: vedtak.antallDagerPerMeldeperiode.map((dager) => ({
            antallDagerPerMeldeperiode: dager.antallDagerPerMeldeperiode!,
            periode: { fraOgMed: dager.periode.fraOgMed!, tilOgMed: dager.periode.tilOgMed! },
        })),
    };
};
