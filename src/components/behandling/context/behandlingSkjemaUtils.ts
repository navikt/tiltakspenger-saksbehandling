import {
    erRammebehandlingInnvilgelseResultat,
    erSøknadsbehandlingResultat,
} from '~/utils/behandling';
import { BehandlingInnvilgelseState } from '~/components/behandling/context/innvilgelse/behandlingInnvilgelseContext';
import { SøknadsbehandlingState } from '~/components/behandling/context/søknadsbehandling/søknadsbehandlingSkjemaContext';
import { BehandlingSkjemaState } from '~/components/behandling/context/behandlingSkjemaReducer';
import { inneholderHelePerioden } from '~/utils/periode';
import { datoMax, datoMin, forrigeDag, nesteDag } from '~/utils/date';
import { MedPeriode } from '~/types/Periode';

export const erRammebehandlingInnvilgelseContext = (
    context: BehandlingSkjemaState,
): context is BehandlingInnvilgelseState => {
    return erRammebehandlingInnvilgelseResultat(context.resultat);
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
