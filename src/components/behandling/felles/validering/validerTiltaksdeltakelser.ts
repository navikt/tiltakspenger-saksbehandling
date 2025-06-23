import { deltarPaFlereTiltakMedStartOgSluttdato, hentTiltaksdeltakelser } from '~/utils/behandling';
import { BehandlingData } from '~/types/BehandlingTypes';
import { ValideringResultat } from '~/types/Validering';
import { joinPerioder, validerPeriodisering } from '~/utils/periode';
import dayjs from 'dayjs';
import { VedtakTiltaksdeltakelsePeriode } from '~/types/VedtakTyper';
import { Periode } from '~/types/Periode';

export const validerTiltaksdeltakelser = (
    behandling: BehandlingData,
    valgteTiltaksdeltakelser: VedtakTiltaksdeltakelsePeriode[],
    behandlingsperiode: Periode,
): ValideringResultat => {
    const validering: ValideringResultat = {
        errors: [],
        warnings: [],
    };

    const harFlereTiltak = deltarPaFlereTiltakMedStartOgSluttdato(behandling);

    if (!harFlereTiltak) {
        return validering;
    }

    const perioder = valgteTiltaksdeltakelser.map((td) => td.periode);

    if (perioder.length === 0) {
        validering.errors.push(
            'Minst en tiltaksperiode må spesifiseres når bruker deltar på flere tiltak',
        );

        return validering;
    }

    const tiltaksdeltakelserFraSaksopplysninger = hentTiltaksdeltakelser(behandling);

    const helePerioden = joinPerioder(perioder);

    if (!validerPeriodisering(perioder, false)) {
        validering.errors.push(
            'Periodene for tiltaksdeltakelse må være sammenhengende og uten overlapp',
        );
    }

    if (helePerioden.fraOgMed !== behandlingsperiode.fraOgMed) {
        validering.errors.push(
            'Tiltaksdeltakelse-perioden må ha samme startdato som innvilgelsesperioden',
        );
    }

    if (helePerioden.tilOgMed !== behandlingsperiode.tilOgMed) {
        validering.errors.push(
            'Tiltaksdeltakelse-perioden må ha samme sluttdato som innvilgelsesperioden',
        );
    }

    valgteTiltaksdeltakelser.forEach((valgtDeltakelsePeriode) => {
        const deltakelse = tiltaksdeltakelserFraSaksopplysninger.find(
            (td) => td.eksternDeltagelseId === valgtDeltakelsePeriode.eksternDeltagelseId,
        );
        if (!deltakelse) {
            validering.errors.push(
                'Valgt tiltaksdeltakelse finnes ikke i saksopplysningene, skal ikke kunne skje!',
            );
        }
        if (deltakelse && !deltakelse.deltagelseFraOgMed && !deltakelse.deltagelseTilOgMed) {
            validering.errors.push(
                'Kan ikke velge tiltaksdeltakelse som mangler start- eller sluttdato',
            );
        }
        if (deltakelse && deltakelse.deltagelseFraOgMed && deltakelse.deltagelseTilOgMed) {
            if (
                dayjs(valgtDeltakelsePeriode.periode.fraOgMed).isBefore(
                    dayjs(deltakelse.deltagelseFraOgMed),
                )
            ) {
                validering.errors.push(
                    'Valgt periode for tiltaksdeltakelse kan ikke starte før tiltaksdeltakelsens startdato',
                );
            }
            if (
                dayjs(valgtDeltakelsePeriode.periode.tilOgMed).isAfter(
                    dayjs(deltakelse.deltagelseTilOgMed),
                )
            ) {
                validering.errors.push(
                    'Valgt periode for tiltaksdeltakelse kan ikke slutte etter tiltaksdeltakelsens sluttdato',
                );
            }
        }
    });

    return validering;
};
