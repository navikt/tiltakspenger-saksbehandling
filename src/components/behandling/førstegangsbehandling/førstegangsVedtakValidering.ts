import { FørstegangsVedtakContext } from './context/FørstegangsVedtakContext';
import { ValideringResultat } from '../send-og-godkjenn/BehandlingSendTilBeslutning';
import { FørstegangsbehandlingData } from '../../../types/BehandlingTypes';
import { hentTiltaksperiode } from '../../../utils/behandling';
import { joinPerioder, validerPeriodisering } from '../../../utils/periode';

export const førstegangsVedtakValidering = (
    behandling: FørstegangsbehandlingData,
    vedtak: FørstegangsVedtakContext,
): ValideringResultat => {
    const { innvilgelsesPeriode, resultat, barnetilleggPerioder, harBarnetillegg } = vedtak;

    const tiltaksperiode = hentTiltaksperiode(behandling);

    const errors: string[] = [];
    const warnings: string[] = [];

    if (!resultat) {
        errors.push('Resultat for vilkårsvurdering mangler');
    }

    if (harBarnetillegg) {
        const perioder = barnetilleggPerioder.map((bt) => bt.periode);

        if (perioder.length === 0) {
            errors.push('Minst en periode må spesifiseres når barnetillegg er valgt');
        } else {
            const perioderErUtenBarn = barnetilleggPerioder.every((bt) => bt.antallBarn === 0);
            const helePerioden = joinPerioder(perioder);

            if (!validerPeriodisering(perioder)) {
                errors.push('Periodene for barnetillegg må være sammenhengende og uten overlapp');
            }
            if (perioderErUtenBarn) {
                errors.push('Minst en periode må ha barn når barnetillegg er valgt');
            }
            if (helePerioden.fraOgMed < innvilgelsesPeriode.fraOgMed) {
                errors.push('Barnetillegg-perioden kan ikke starte før innvilgelsesperioden');
            }
            if (helePerioden.tilOgMed > innvilgelsesPeriode.tilOgMed) {
                errors.push('Barnetillegg-perioden kan ikke slutte etter innvilgelsesperioden');
            }
        }
    }

    if (tiltaksperiode.fraOgMed > innvilgelsesPeriode.fraOgMed) {
        warnings.push('Innvilgelsesperioden starter før tiltaksperioden');
    }

    if (tiltaksperiode.tilOgMed < innvilgelsesPeriode.tilOgMed) {
        warnings.push('Innvilgelsesperioden slutter etter tiltaksperioden');
    }

    return {
        errors,
        warnings,
    };
};
