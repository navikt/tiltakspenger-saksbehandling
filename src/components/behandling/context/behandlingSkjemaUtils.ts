import {
    erRammebehandlingInnvilgelseResultat,
    erSøknadsbehandlingResultat,
    hentTiltaksdeltagelserFraPeriode,
} from '~/utils/behandling';
import {
    InnvilgelseMedPerioderState,
    BehandlingInnvilgelseState,
    BehandlingInnvilgelseMedPerioderState,
} from '~/components/behandling/context/innvilgelse/innvilgelseContext';
import { SøknadsbehandlingState } from '~/components/behandling/context/søknadsbehandling/søknadsbehandlingSkjemaContext';
import { BehandlingSkjemaState } from '~/components/behandling/context/behandlingSkjemaReducer';
import { inneholderHelePerioden } from '~/utils/periode';
import { datoMax, datoMin, forrigeDag, nesteDag } from '~/utils/date';
import { MedPeriode, Periode } from '~/types/Periode';
import { Rammebehandling } from '~/types/Rammebehandling';
import { ANTALL_DAGER_DEFAULT } from '~/components/behandling/felles/dager-per-meldeperiode/BehandlingDagerPerMeldeperiode';
import { SakProps } from '~/types/Sak';
import { Innvilgelsesperiode } from '~/types/Innvilgelsesperiode';
import { BarnetilleggPeriode } from '~/types/Barnetillegg';

export const erRammebehandlingInnvilgelseContext = (
    context: BehandlingSkjemaState,
): context is BehandlingInnvilgelseState => {
    return erRammebehandlingInnvilgelseResultat(context.resultat);
};

export const erRammebehandlingInnvilgelseMedPerioderContext = (
    context: BehandlingSkjemaState,
): context is BehandlingInnvilgelseMedPerioderState => {
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

// Forhåndsutfyller andre perioder for en innvilgelse ut fra valgt innvilgelsesperiode
export const hentForhåndsutfyltInnvilgelse = (
    behandling: Rammebehandling,
    innvilgelsesperioder: Innvilgelsesperiode[],
    sak: SakProps,
): InnvilgelseMedPerioderState => {
    const barnetilleggPerioder: BarnetilleggPeriode[] = []
    //     hentBarnetilleggForBehandling(
    //     behandling,
    //     innvilgelsesperiode,
    //     sak,
    // );

    return {
        harValgtPeriode: true,
        innvilgelsesperioder,
        harBarnetillegg: barnetilleggPerioder.length > 0,
        barnetilleggPerioder,
    };
};

// Henter det høyeste antall dager for en tiltaksdeltagelse fra saksopplysninger, eller default
// antall dager dersom ingen tiltak har satt antall dager
export const antallDagerPerMeldeperiodeForPeriode = (
    behandling: Rammebehandling,
    periode: Periode,
): number => {
    const dagerPerUke = hentTiltaksdeltagelserFraPeriode(behandling, periode).reduce((acc, td) => {
        const { antallDagerPerUke } = td;

        return antallDagerPerUke ? Math.max(antallDagerPerUke, acc) : acc;
    }, 0);

    return dagerPerUke === 0 ? ANTALL_DAGER_DEFAULT : dagerPerUke * 2;
};
