import { deltarPaFlereTiltakMedStartOgSluttdato, hentTiltaksdeltakelser } from '~/utils/behandling';
import { ValideringResultat } from '~/types/Validering';
import dayjs from 'dayjs';
import { Rammebehandling } from '~/types/Rammebehandling';
import { Innvilgelsesperiode } from '~/types/Innvilgelsesperiode';

export const validerTiltaksdeltakelser = (
    behandling: Rammebehandling,
    innvilgelsesperioder: Innvilgelsesperiode[],
): ValideringResultat => {
    const validering: ValideringResultat = {
        errors: [],
        warnings: [],
    };

    const harFlereTiltak = deltarPaFlereTiltakMedStartOgSluttdato(behandling);

    if (!harFlereTiltak) {
        return validering;
    }

    const tiltaksdeltakelserFraSaksopplysninger = hentTiltaksdeltakelser(behandling);

    innvilgelsesperioder.forEach((it) => {
        const deltakelse = tiltaksdeltakelserFraSaksopplysninger.find(
            (td) => td.internDeltakelseId === it.internDeltakelseId,
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
            if (dayjs(it.periode.fraOgMed).isBefore(dayjs(deltakelse.deltagelseFraOgMed))) {
                validering.errors.push(
                    'Valgt innvilgelsesperiode kan ikke starte før tiltaksdeltakelsens startdato',
                );
            }

            if (dayjs(it.periode.tilOgMed).isAfter(dayjs(deltakelse.deltagelseTilOgMed))) {
                validering.errors.push(
                    'Valgt innvilgelsesperiode kan ikke slutte etter tiltaksdeltakelsens sluttdato',
                );
            }
        }
    });

    return validering;
};
