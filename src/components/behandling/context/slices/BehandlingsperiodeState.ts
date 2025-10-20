import { Periode } from '~/types/Periode';
import { BehandlingSkjemaActionHandlers } from '~/components/behandling/context/BehandlingSkjemaReducer';
import { Nullable } from '~/types/UtilTypes';
import { BehandlingResultat } from '~/types/BehandlingTypes';

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
            ),
        };
    },
} as const satisfies BehandlingSkjemaActionHandlers<BehandlingsperiodeActions>;

type MedPeriode = {
    periode: Periode;
};

const oppdaterPeriodisering = <T extends MedPeriode>(
    periodisering: T[],
    behandlingsperiode: Periode,
): T[] => {
    const perioderInnenforBehandlingsperiode = periodisering.filter(
        (p) =>
            p.periode.fraOgMed <= behandlingsperiode.tilOgMed &&
            p.periode.tilOgMed >= behandlingsperiode.fraOgMed,
    );

    if (perioderInnenforBehandlingsperiode.length === 0) {
        return [];
    }

    const førstePeriode = perioderInnenforBehandlingsperiode.at(0)!;
    const sistePeriode = perioderInnenforBehandlingsperiode.at(-1)!;

    return perioderInnenforBehandlingsperiode
        .with(0, {
            ...førstePeriode,
            periode: { ...førstePeriode.periode, fraOgMed: behandlingsperiode.fraOgMed },
        })
        .with(-1, {
            ...sistePeriode,
            periode: { ...sistePeriode.periode, tilOgMed: behandlingsperiode.tilOgMed },
        });
};
