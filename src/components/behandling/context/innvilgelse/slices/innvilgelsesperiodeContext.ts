import { MedPeriode, Periode } from '~/types/Periode';
import { erFullstendigPeriode, perioderOverlapper } from '~/utils/periode';
import { datoMax, datoMin } from '~/utils/date';
import { InnvilgelseState } from '~/components/behandling/context/innvilgelse/innvilgelseContext';
import { Reducer } from 'react';
import { Rammebehandling } from '~/types/Rammebehandling';
import { SakProps } from '~/types/Sak';
import { hentForhåndsutfyltInnvilgelse } from '~/components/behandling/context/behandlingSkjemaUtils';

export type InnvilgelsesperiodeAction = {
    type: 'oppdaterInnvilgelsesperiode';
    payload: { periode: Partial<Periode>; behandling: Rammebehandling; sak: SakProps };
};

export const innvilgelsesperiodeReducer: Reducer<InnvilgelseState, InnvilgelsesperiodeAction> = (
    state,
    action,
) => {
    const { harValgtPeriode } = state;
    const { periode, behandling, sak } = action.payload;

    if (!harValgtPeriode) {
        const nyInnvilgelsesperiode = { ...state.innvilgelsesperiode, ...periode };

        if (erFullstendigPeriode(nyInnvilgelsesperiode)) {
            return hentForhåndsutfyltInnvilgelse(behandling, nyInnvilgelsesperiode, sak);
        }

        return {
            ...state,
            innvilgelsesperiode: nyInnvilgelsesperiode,
        };
    }

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
};

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
