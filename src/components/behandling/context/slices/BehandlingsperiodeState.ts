import { Periode } from '~/types/Periode';
import { BehandlingSkjemaActionHandlers } from '~/components/behandling/context/BehandlingSkjemaReducer';
import { Nullable } from '~/types/UtilTypes';
import { BehandlingResultat } from '~/types/BehandlingTypes';
import { perioderOverlapper } from '~/utils/periode';
import { datoMax, datoMin } from '~/utils/date';

export type BehandlingsperiodeState = {
    resultat: Nullable<BehandlingResultat>;
    behandlingsperiode: Partial<Periode>;
};

export type BehandlingsperiodeActions =
    | {
          type: 'setResultat';
          payload: { resultat: BehandlingResultat | null };
      }
    | {
          type: 'oppdaterBehandlingsperiode';
          payload: { periode: Partial<Periode> };
      };

export const behandlingsperiodeActionHandlers = {
    setResultat: (state, payload) => {
        return { ...state, resultat: payload.resultat };
    },

    oppdaterBehandlingsperiode: (state, payload) => {
        const nyBehandlingsperiode = { ...state.behandlingsperiode, ...payload.periode } as Periode;

        return {
            ...state,
            behandlingsperiode: nyBehandlingsperiode,
            valgteTiltaksdeltakelser: oppdaterPeriodisering(
                state.valgteTiltaksdeltakelser,
                nyBehandlingsperiode,
                true,
            ),
            antallDagerPerMeldeperiode: oppdaterPeriodisering(
                state.antallDagerPerMeldeperiode,
                nyBehandlingsperiode,
                true,
            ),
            barnetilleggPerioder: oppdaterPeriodisering(
                state.barnetilleggPerioder,
                nyBehandlingsperiode,
                false,
            ),
        };
    },
} as const satisfies BehandlingSkjemaActionHandlers<BehandlingsperiodeActions>;

type MedPeriode = {
    periode: Periode;
};

// Denne må kanskje tweakes litt hvis vi får periodiserte innvilgelser i en behandling
const oppdaterPeriodisering = <T extends MedPeriode>(
    periodisering: T[],
    behandlingsperiode: Periode,
    // Tiltaksdeltagelse og antall dager per meldeperiode skal alltid fylle hele behandlingsperioden ved innvilgelse,
    // men barnetillegg kan omfatte kun deler av innvilgelsesperioden. Vi gjør en best-effort for å tilpasse for dette.
    skalAlltidFylleBehandlingsperioden: boolean,
): T[] => {
    const perioderInnenforBehandlingsperioden = periodisering.filter((p) =>
        perioderOverlapper(behandlingsperiode, p.periode),
    );

    if (perioderInnenforBehandlingsperioden.length === 0) {
        return [];
    }

    const førstePeriode = perioderInnenforBehandlingsperioden.at(0)!;

    if (perioderInnenforBehandlingsperioden.length === 1) {
        return perioderInnenforBehandlingsperioden.with(0, {
            ...førstePeriode,
            periode: skalAlltidFylleBehandlingsperioden
                ? behandlingsperiode
                : {
                      fraOgMed: datoMax(
                          behandlingsperiode.fraOgMed,
                          førstePeriode.periode.fraOgMed,
                      ),
                      tilOgMed: datoMin(
                          behandlingsperiode.tilOgMed,
                          førstePeriode.periode.tilOgMed,
                      ),
                  },
        });
    }

    const sistePeriode = perioderInnenforBehandlingsperioden.at(-1)!;

    return perioderInnenforBehandlingsperioden
        .with(0, {
            ...førstePeriode,
            periode: {
                fraOgMed: skalAlltidFylleBehandlingsperioden
                    ? behandlingsperiode.fraOgMed
                    : datoMax(behandlingsperiode.fraOgMed, førstePeriode.periode.fraOgMed),
                tilOgMed: førstePeriode.periode.tilOgMed,
            },
        })
        .with(-1, {
            ...sistePeriode,
            periode: {
                fraOgMed: sistePeriode.periode.fraOgMed,
                tilOgMed: skalAlltidFylleBehandlingsperioden
                    ? behandlingsperiode.tilOgMed
                    : datoMin(behandlingsperiode.tilOgMed, sistePeriode.periode.tilOgMed),
            },
        });
};
