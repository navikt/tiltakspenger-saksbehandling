import { MedPeriode, Periode } from '~/types/Periode';
import { perioderOverlapper } from '~/utils/periode';
import { datoMax, datoMin } from '~/utils/date';
import { BehandlingInnvilgelseSteg2State } from '~/components/behandling/context/innvilgelse/behandlingInnvilgelseContext';
import { Reducer } from 'react';
import { Rammebehandling } from '~/types/Rammebehandling';

export type InnvilgelsesperiodeAction = {
    type: 'oppdaterInnvilgelsesperiode';
    payload: { periode: Partial<Periode>; behandling: Rammebehandling };
};

export const innvilgelsesperiodeReducer = (<State extends BehandlingInnvilgelseSteg2State>(
    state: State,
    action: InnvilgelsesperiodeAction,
) => {
    const { periode } = action.payload;

    const nyInnvilgelsesperiode = { ...state.innvilgelsesperiode, ...periode };

    return {
        ...state,
        innvilgelsesperiode: nyInnvilgelsesperiode,

        valgteTiltaksdeltakelser: oppdaterPeriodisering(
            state.valgteTiltaksdeltakelser,
            nyInnvilgelsesperiode,
            true,
        ),

        antallDagerPerMeldeperiode: oppdaterPeriodisering(
            state.antallDagerPerMeldeperiode,
            nyInnvilgelsesperiode,
            true,
        ),

        barnetilleggPerioder: oppdaterPeriodisering(
            state.barnetilleggPerioder,
            nyInnvilgelsesperiode,
            false,
        ),
    };
}) satisfies Reducer<BehandlingInnvilgelseSteg2State, InnvilgelsesperiodeAction>;

// Denne må kanskje tweakes litt hvis vi får periodiserte innvilgelser i en behandling
const oppdaterPeriodisering = <T extends MedPeriode>(
    periodisering: T[],
    innvilgelsesperiode: Periode,
    // Tiltaksdeltagelse og antall dager per meldeperiode skal alltid fylle hele innvilgelsesperioden ved innvilgelse,
    // men barnetillegg kan omfatte kun deler av innvilgelsesperioden. Vi gjør en best-effort for å tilpasse for dette.
    skalAlltidFylleInnvilgelsesperioden: boolean,
): T[] => {
    const perioderInnenforInnvilgelsesperioden = periodisering.filter((p) =>
        perioderOverlapper(innvilgelsesperiode, p.periode),
    );

    if (perioderInnenforInnvilgelsesperioden.length === 0) {
        return [];
    }

    const førstePeriode = perioderInnenforInnvilgelsesperioden.at(0)!;

    if (perioderInnenforInnvilgelsesperioden.length === 1) {
        return perioderInnenforInnvilgelsesperioden.with(0, {
            ...førstePeriode,
            periode: skalAlltidFylleInnvilgelsesperioden
                ? innvilgelsesperiode
                : {
                      fraOgMed: datoMax(
                          innvilgelsesperiode.fraOgMed,
                          førstePeriode.periode.fraOgMed,
                      ),
                      tilOgMed: datoMin(
                          innvilgelsesperiode.tilOgMed,
                          førstePeriode.periode.tilOgMed,
                      ),
                  },
        });
    }

    const sistePeriode = perioderInnenforInnvilgelsesperioden.at(-1)!;

    return perioderInnenforInnvilgelsesperioden
        .with(0, {
            ...førstePeriode,
            periode: {
                fraOgMed: skalAlltidFylleInnvilgelsesperioden
                    ? innvilgelsesperiode.fraOgMed
                    : datoMax(innvilgelsesperiode.fraOgMed, førstePeriode.periode.fraOgMed),
                tilOgMed: førstePeriode.periode.tilOgMed,
            },
        })
        .with(-1, {
            ...sistePeriode,
            periode: {
                fraOgMed: sistePeriode.periode.fraOgMed,
                tilOgMed: skalAlltidFylleInnvilgelsesperioden
                    ? innvilgelsesperiode.tilOgMed
                    : datoMin(innvilgelsesperiode.tilOgMed, sistePeriode.periode.tilOgMed),
            },
        });
};
