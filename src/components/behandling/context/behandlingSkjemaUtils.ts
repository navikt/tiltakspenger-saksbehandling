import {
    erRammebehandlingInnvilgelseResultat,
    erSøknadsbehandlingResultat,
    hentTiltaksdeltakelserMedStartOgSluttdato,
} from '~/utils/behandling';
import {
    BehandlingInnvilgelseSteg2State,
    BehandlingMedInnvilgelseState,
    BehandlingMedInnvilgelseSteg2State,
} from '~/components/behandling/context/innvilgelse/behandlingInnvilgelseContext';
import { SøknadsbehandlingState } from '~/components/behandling/context/søknadsbehandling/søknadsbehandlingSkjemaContext';
import { BehandlingSkjemaState } from '~/components/behandling/context/behandlingSkjemaReducer';
import { inneholderHelePerioden, perioderOverlapper } from '~/utils/periode';
import { datoMax, datoMin, forrigeDag, nesteDag } from '~/utils/date';
import { MedPeriode, Periode } from '~/types/Periode';
import { Rammebehandling } from '~/types/Rammebehandling';
import { ANTALL_DAGER_DEFAULT } from '~/components/behandling/felles/dager-per-meldeperiode/BehandlingDagerPerMeldeperiode';
import { hentLagredePerioderMedBarn } from '~/components/behandling/felles/barnetillegg/utils/hentBarnetilleggFraBehandling';
import { TiltaksdeltakelsePeriode } from '~/types/TiltakDeltagelseTypes';

export const erRammebehandlingInnvilgelseContext = (
    context: BehandlingSkjemaState,
): context is BehandlingMedInnvilgelseState => {
    return erRammebehandlingInnvilgelseResultat(context.resultat);
};

export const erRammebehandlingInnvilgelseMedPerioderContext = (
    context: BehandlingSkjemaState,
): context is BehandlingMedInnvilgelseSteg2State => {
    return erRammebehandlingInnvilgelseContext(context) && context.innvilgelse.harValgtPeriode;
};

export const erSøknadsbehandlingContext = (
    context: BehandlingSkjemaState,
): context is SøknadsbehandlingState => {
    return erSøknadsbehandlingResultat(context.resultat);
};

export enum BehandlingSkjemaType {
    Søknadsbehandling = 'Søknadsbehandling',
    RevurderingInnvilgelse = 'RevurderingInnvilgelse',
    RevurderingOmgjøring = 'RevurderingOmgjøring',
    RevurderingStans = 'RevurderingStans',
}

export const oppdaterPeriodiseringUtenOverlapp = <T extends MedPeriode>(
    listeMedPerioder: T[],
    oppdatertElement: T,
    oppdatertIndex: number,
): T[] => {
    return listeMedPerioder
        .toSpliced(oppdatertIndex, 1, oppdatertElement)
        .filter((it, index) => {
            if (index === oppdatertIndex) {
                return true;
            }

            return !inneholderHelePerioden(oppdatertElement.periode, it.periode);
        })
        .map((it) => {
            if (it === oppdatertElement) {
                return it;
            }

            const erTidligerePeriode = it.periode.fraOgMed < oppdatertElement.periode.fraOgMed;

            return {
                ...it,
                periode: erTidligerePeriode
                    ? {
                          fraOgMed: it.periode.fraOgMed,
                          tilOgMed: datoMin(
                              it.periode.tilOgMed,
                              forrigeDag(oppdatertElement.periode.fraOgMed),
                          ),
                      }
                    : {
                          fraOgMed: datoMax(
                              it.periode.fraOgMed,
                              nesteDag(oppdatertElement.periode.tilOgMed),
                          ),
                          tilOgMed: it.periode.tilOgMed,
                      },
            };
        });
};

export const innvilgelseDefaultState = (
    behandling: Rammebehandling,
    innvilgelsesperiode: Periode,
): BehandlingInnvilgelseSteg2State => {
    const barnetilleggPerioder = hentLagredePerioderMedBarn(behandling) ?? [];

    return {
        harValgtPeriode: true,
        innvilgelsesperiode: innvilgelsesperiode,
        harBarnetillegg: barnetilleggPerioder.length > 0,
        barnetilleggPerioder,
        valgteTiltaksdeltakelser: tiltaksdeltagelserFraSaksopplysninger(
            behandling,
            innvilgelsesperiode,
        ),
        antallDagerPerMeldeperiode: [
            {
                antallDagerPerMeldeperiode: ANTALL_DAGER_DEFAULT,
                periode: innvilgelsesperiode,
            },
        ],
    };
};

const tiltaksdeltagelserFraSaksopplysninger = (
    behandling: Rammebehandling,
    innvilgelsesperiode: Periode,
): TiltaksdeltakelsePeriode[] => {
    return hentTiltaksdeltakelserMedStartOgSluttdato(behandling).reduce<TiltaksdeltakelsePeriode[]>(
        (acc, td) => {
            const { deltagelseFraOgMed, deltagelseTilOgMed, eksternDeltagelseId } = td;

            const deltagelsesPeriode: Periode = {
                fraOgMed: deltagelseFraOgMed,
                tilOgMed: deltagelseTilOgMed,
            };

            if (!perioderOverlapper(innvilgelsesperiode, deltagelsesPeriode)) {
                return acc;
            }

            return [
                ...acc,
                {
                    eksternDeltagelseId,
                    periode: {
                        fraOgMed: datoMax(
                            deltagelsesPeriode.fraOgMed,
                            innvilgelsesperiode.fraOgMed,
                        ),
                        tilOgMed: datoMin(
                            deltagelsesPeriode.tilOgMed,
                            innvilgelsesperiode.tilOgMed,
                        ),
                    },
                },
            ];
        },
        [],
    );
};
