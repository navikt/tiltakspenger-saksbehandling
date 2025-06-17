import { SøknadsbehandlingVedtakContext } from './context/SøknadsbehandlingVedtakContext';
import { ValideringResultat } from '../send-og-godkjenn/BehandlingSendTilBeslutning';
import { SøknadsbehandlingData, SøknadsbehandlingResultat } from '~/types/BehandlingTypes';
import {
    deltarPaFlereTiltakMedStartOgSluttdato,
    hentTiltaksdeltakelser,
    hentTiltaksperiode,
    hentTiltaksperiodeFraSøknad,
} from '~/utils/behandling';
import { joinPerioder, validerPeriodisering } from '~/utils/periode';
import dayjs from 'dayjs';

export const søknadsbehandlingValidering = (
    behandling: SøknadsbehandlingData,
    vedtak: SøknadsbehandlingVedtakContext,
): ValideringResultat => {
    const { behandlingsperiode, resultat } = vedtak;

    const tiltaksperiode = hentTiltaksperiode(behandling);

    const errors: string[] = [];
    const warnings: string[] = [];

    if (!resultat) {
        errors.push('Behandlingsresultat for vilkårsvurdering mangler');
    }

    if (behandlingsperiode.fraOgMed > behandlingsperiode.tilOgMed) {
        errors.push('Til og med-dato må være etter fra og med-dato');
    }

    if (tiltaksperiode.fraOgMed > behandlingsperiode.fraOgMed) {
        errors.push('Behandlingsperioden starter før tiltaksperioden');
    }

    if (tiltaksperiode.tilOgMed < behandlingsperiode.tilOgMed) {
        errors.push('Behandlingsperioden slutter etter tiltaksperioden');
    }

    if (resultat === SøknadsbehandlingResultat.AVSLAG) {
        validerUtfallAvslag(behandling, vedtak, errors, warnings);
    } else if (resultat === SøknadsbehandlingResultat.INNVILGELSE) {
        validerUtfallInnvilgelse(behandling, vedtak, errors);
    }

    return { errors, warnings };
};

const validerUtfallAvslag = (
    behandling: SøknadsbehandlingData,
    vedtak: SøknadsbehandlingVedtakContext,
    errors: string[],
    warnings: string[],
) => {
    const tiltaksperiode = hentTiltaksperiodeFraSøknad(behandling);

    if (vedtak.avslagsgrunner === null) {
        errors.push('Avslagsgrunn må velges');
    }

    if (
        tiltaksperiode.fraOgMed !== vedtak.behandlingsperiode.fraOgMed ||
        tiltaksperiode.tilOgMed !== vedtak.behandlingsperiode.tilOgMed
    ) {
        warnings.push(
            'Avslagsdatoene er endret. De samsvarer ikke lenger med perioden det er søkt for. Vil du fortsette?',
        );
    }
};

const validerUtfallInnvilgelse = (
    behandling: SøknadsbehandlingData,
    vedtak: SøknadsbehandlingVedtakContext,
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
