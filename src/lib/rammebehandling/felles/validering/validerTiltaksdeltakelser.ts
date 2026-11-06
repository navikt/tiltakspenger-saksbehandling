import { hentTiltaksdeltakelser } from '~/lib/rammebehandling/rammebehandlingUtils';
import { ValideringResultat } from '~/lib/rammebehandling/typer/Validering';
import dayjs from 'dayjs';
import { Rammebehandling } from '~/lib/rammebehandling/typer/Rammebehandling';
import { Innvilgelsesperiode } from '~/lib/rammebehandling/typer/Innvilgelsesperiode';
import {
    InnvilgbarTiltaksdeltakelse,
    Tiltaksdeltakelse,
} from '~/lib/rammebehandling/typer/Tiltaksdeltakelse';

// Tiltaksdeltakelsen kan ha blitt endret etter at innvilgelsen ble fylt ut, uten at innvilgelsen nullstilles.
export type UgyldigInnvilgelsesperiode =
    | { type: 'FinnesIkke' }
    | { type: 'KanIkkeInnvilges' }
    | {
          type: 'DekkerIkkePerioden';
          deltakelse: InnvilgbarTiltaksdeltakelse;
          starterFør: boolean;
          slutterEtter: boolean;
      };

export const finnUgyldigInnvilgelsesperiode = (
    tiltaksdeltakelser: Tiltaksdeltakelse[],
    innvilgelsesperiode: Innvilgelsesperiode,
): UgyldigInnvilgelsesperiode | null => {
    const deltakelse = tiltaksdeltakelser.find(
        (td) => td.internDeltakelseId === innvilgelsesperiode.internDeltakelseId,
    );

    if (!deltakelse) {
        return { type: 'FinnesIkke' };
    }

    if (!deltakelse.kanInnvilges) {
        return { type: 'KanIkkeInnvilges' };
    }

    const { periode } = innvilgelsesperiode;
    const starterFør = dayjs(periode.fraOgMed).isBefore(dayjs(deltakelse.periode.fraOgMed));
    const slutterEtter = dayjs(periode.tilOgMed).isAfter(dayjs(deltakelse.periode.tilOgMed));

    return starterFør || slutterEtter
        ? { type: 'DekkerIkkePerioden', deltakelse, starterFør, slutterEtter }
        : null;
};

export const harUgyldigeInnvilgelsesperioder = (
    behandling: Rammebehandling,
    innvilgelsesperioder: Innvilgelsesperiode[],
): boolean => {
    const tiltaksdeltakelser = hentTiltaksdeltakelser(behandling);

    return innvilgelsesperioder.some(
        (it) => finnUgyldigInnvilgelsesperiode(tiltaksdeltakelser, it) !== null,
    );
};

export const validerTiltaksdeltakelser = (
    behandling: Rammebehandling,
    innvilgelsesperioder: Innvilgelsesperiode[],
): ValideringResultat => {
    const validering: ValideringResultat = {
        errors: [],
        warnings: [],
    };

    const tiltaksdeltakelser = hentTiltaksdeltakelser(behandling);

    innvilgelsesperioder.forEach((it) => {
        const ugyldig = finnUgyldigInnvilgelsesperiode(tiltaksdeltakelser, it);

        switch (ugyldig?.type) {
            case 'FinnesIkke':
                validering.errors.push(
                    'Valgt tiltaksdeltakelse finnes ikke lenger i saksopplysningene',
                );
                break;
            case 'KanIkkeInnvilges':
                validering.errors.push(
                    'Kan ikke velge tiltaksdeltakelse som det ikke kan innvilges for',
                );
                break;
            case 'DekkerIkkePerioden':
                if (ugyldig.starterFør) {
                    validering.errors.push(
                        'Valgt innvilgelsesperiode kan ikke starte før tiltaksdeltakelsens startdato',
                    );
                }
                if (ugyldig.slutterEtter) {
                    validering.errors.push(
                        'Valgt innvilgelsesperiode kan ikke slutte etter tiltaksdeltakelsens sluttdato',
                    );
                }
                break;
        }
    });

    return validering;
};
