import { FørstegangsVedtakContext } from './context/FørstegangsVedtakContext';
import { ValideringResultat } from '../send-og-godkjenn/BehandlingSendTilBeslutning';
import { Behandlingsutfall, FørstegangsbehandlingData } from '../../../types/BehandlingTypes';
import {
    deltarPaFlereTiltakMedStartOgSluttdato,
    hentTiltaksdeltakelser,
    hentTiltaksperiode,
} from '../../../utils/behandling';
import { joinPerioder, validerPeriodisering } from '../../../utils/periode';
import dayjs from 'dayjs';

export const førstegangsVedtakValidering = (
    behandling: FørstegangsbehandlingData,
    vedtak: FørstegangsVedtakContext,
): ValideringResultat => {
    const { behandlingsperiode, utfall } = vedtak;

    const tiltaksperiode = hentTiltaksperiode(behandling);

    const errors: string[] = [];
    const warnings: string[] = [];

    if (!utfall) {
        errors.push('Behandlingsutfall for vilkårsvurdering mangler');
    }

    if (tiltaksperiode.fraOgMed > behandlingsperiode.fraOgMed) {
        errors.push('Behandlingsperioden starter før tiltaksperioden');
    }

    if (tiltaksperiode.tilOgMed < behandlingsperiode.tilOgMed) {
        errors.push('Behandlingsperioden slutter etter tiltaksperioden');
    }

    if (utfall === Behandlingsutfall.AVSLAG) {
        validerUtfallAvslag(behandling, vedtak, errors);
    }
    if (utfall === Behandlingsutfall.INNVILGELSE) {
        validerUtfallInnvilgelse(behandling, vedtak, errors);
    }

    return {
        errors,
        warnings,
    };
};

const validerUtfallAvslag = (
    behandling: FørstegangsbehandlingData,
    vedtak: FørstegangsVedtakContext,
    errors: string[],
) => {
    if (vedtak.avslagsgrunner === null) {
        errors.push('Avslagsgrunn må velges');
    }
};

const validerUtfallInnvilgelse = (
    behandling: FørstegangsbehandlingData,
    vedtak: FørstegangsVedtakContext,
    errors: string[],
) => {
    const {
        behandlingsperiode,
        barnetilleggPerioder,
        harBarnetillegg,
        valgteTiltaksdeltakelser,
        antallDagerPerMeldeperiode,
    } = vedtak;

    const flereTiltak = deltarPaFlereTiltakMedStartOgSluttdato(behandling);

    if (harBarnetillegg) {
        const perioder = barnetilleggPerioder.map((bt) => bt.periode);

        if (perioder.length === 0) {
            errors.push('Minst en periode må spesifiseres når barnetillegg er valgt');
        } else {
            const perioderErUtenBarn = barnetilleggPerioder.every((bt) => bt.antallBarn === 0);
            const helePerioden = joinPerioder(perioder);

            if (!validerPeriodisering(perioder, true)) {
                errors.push('Periodene for barnetillegg kan ikke ha overlapp');
            }
            if (perioderErUtenBarn) {
                errors.push('Minst en periode må ha barn når barnetillegg er valgt');
            }
            if (helePerioden.fraOgMed < behandlingsperiode.fraOgMed) {
                errors.push('Barnetillegg-perioden kan ikke starte før innvilgelsesperioden');
            }
            if (helePerioden.tilOgMed > behandlingsperiode.tilOgMed) {
                errors.push('Barnetillegg-perioden kan ikke slutte etter innvilgelsesperioden');
            }
        }
    }

    if (flereTiltak) {
        const perioder = valgteTiltaksdeltakelser.map((td) => td.periode);
        const tiltaksdeltakelserFraSaksopplysninger = hentTiltaksdeltakelser(behandling);

        if (perioder.length === 0) {
            errors.push(
                'Minst en tiltaksperiode må spesifiseres når bruker deltar på flere tiltak',
            );
        } else {
            const helePerioden = joinPerioder(perioder);

            if (!validerPeriodisering(perioder, false)) {
                errors.push(
                    'Periodene for tiltaksdeltakelse må være sammenhengende og uten overlapp',
                );
            }
            if (helePerioden.fraOgMed !== behandlingsperiode.fraOgMed) {
                errors.push(
                    'Tiltaksdeltakelse-perioden må ha samme startdato som innvilgelsesperioden',
                );
            }
            if (helePerioden.tilOgMed !== behandlingsperiode.tilOgMed) {
                errors.push(
                    'Tiltaksdeltakelse-perioden må ha samme sluttdato som innvilgelsesperioden',
                );
            }
            valgteTiltaksdeltakelser.forEach((valgtDeltakelsePeriode) => {
                const deltakelse = tiltaksdeltakelserFraSaksopplysninger.find(
                    (td) => td.eksternDeltagelseId === valgtDeltakelsePeriode.eksternDeltagelseId,
                );
                if (!deltakelse) {
                    errors.push(
                        'Valgt tiltaksdeltakelse finnes ikke i saksopplysningene, skal ikke kunne skje!',
                    );
                }
                if (
                    deltakelse &&
                    !deltakelse.deltagelseFraOgMed &&
                    !deltakelse.deltagelseTilOgMed
                ) {
                    errors.push(
                        'Kan ikke velge tiltaksdeltakelse som mangler start- eller sluttdato',
                    );
                }
                if (deltakelse && deltakelse.deltagelseFraOgMed && deltakelse.deltagelseTilOgMed) {
                    if (
                        dayjs(valgtDeltakelsePeriode.periode.fraOgMed).isBefore(
                            dayjs(deltakelse.deltagelseFraOgMed),
                        )
                    ) {
                        errors.push(
                            'Valgt periode for tiltaksdeltakelse kan ikke starte før tiltaksdeltakelsens startdato',
                        );
                    }
                    if (
                        dayjs(valgtDeltakelsePeriode.periode.tilOgMed).isAfter(
                            dayjs(deltakelse.deltagelseTilOgMed),
                        )
                    ) {
                        errors.push(
                            'Valgt periode for tiltaksdeltakelse kan ikke slutte etter tiltaksdeltakelsens sluttdato',
                        );
                    }
                }
            });
        }
    }

    if (
        antallDagerPerMeldeperiode &&
        (antallDagerPerMeldeperiode < 1 || antallDagerPerMeldeperiode > 14)
    ) {
        errors.push('Antall dager per meldeperiode må være mellom 1 og 14');
    }
};
