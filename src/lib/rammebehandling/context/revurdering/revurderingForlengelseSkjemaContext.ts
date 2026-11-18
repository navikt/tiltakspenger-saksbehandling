import { Dato } from '~/types/DatoTid';
import { Reducer } from 'react';
import {
    RevurderingForlengelse,
    RevurderingResultat,
} from '~/lib/rammebehandling/typer/Revurdering';
import { ReducerSuperAction } from '~/types/ReducerAction';
import {
    InnvilgelseActions,
    innvilgelseReducer,
    InnvilgelseState,
} from '~/lib/rammebehandling/context/innvilgelse/innvilgelseContext';
import {
    BehandlingSkjemaContextBase,
    useBehandlingSkjema,
    useBehandlingSkjemaDispatch,
} from '~/lib/rammebehandling/context/BehandlingSkjemaContext';
import { BehandlingSkjemaType } from '~/lib/rammebehandling/context/behandlingSkjemaUtils';
import { SakProps } from '~/lib/sak/SakTyper';
import { Innvilgelsesperioder } from '~/lib/rammebehandling/typer/Innvilgelsesperiode';
import {
    antallDagerForTiltak,
    tilInnvilgelsesperioderSkjema,
} from '~/lib/rammebehandling/felles/innvilgelsesperiode/innvilgelseForTiltakUtils';
import { Nullable } from '~/types/UtilTypes';
import { hentRammevedtak } from '~/lib/sak/sakUtils';
import {
    BarnetilleggSkjemaState,
    lagBarnetilleggSkjemaState,
    tilpassBarnTilInnvilgelsesperiodene,
} from '~/lib/rammebehandling/felles/barnetillegg/utils/barnetilleggSkjemaUtils';
import { erDatoIPeriode } from '~/utils/periode';
import { Periode } from '~/types/Periode';
import { useRevurderingBehandling } from '~/lib/rammebehandling/context/BehandlingContext';

// Innvilgelsen holdes synkron med valgt til og med-dato og tiltaksdeltakelse, slik at felles komponenter for barnetillegg,
// validering og forhåndsvisning kan gjenbrukes. Backend utleder selv innvilgelsesperioden fra disse.
// Inntil begge er valgt, er ingen tiltak valgt i innvilgelsen.
export type RevurderingForlengelseState = {
    resultat: RevurderingResultat.FORLENGELSE;
    forlengesFraOgMed: Dato;
    tilOgMed?: Dato;
    internDeltakelseId?: string;
    // Om saksbehandler har valgt barnetillegget selv.
    // Ellers utleder og lagrer backend barnetillegget fra vedtaket som forlenges hver gang behandlingen lagres.
    harEndretBarnetillegg: boolean;
    innvilgelse: InnvilgelseState;
};

type ForlengelseActions =
    | {
          type: 'settForlengelseTilOgMed';
          payload: {
              tilOgMed: Dato;
              behandling: RevurderingForlengelse;
              sak: SakProps;
          };
      }
    | {
          type: 'settForlengelseTiltaksdeltakelse';
          payload: {
              internDeltakelseId: string;
              behandling: RevurderingForlengelse;
              sak: SakProps;
          };
      }
    | {
          type: 'settHarValgtBarnetillegg';
          payload: {
              harEndretBarnetillegg: boolean;
              behandling: RevurderingForlengelse;
          };
      };

export type RevurderingForlengelseActions = ReducerSuperAction<
    ForlengelseActions | InnvilgelseActions,
    BehandlingSkjemaType.RevurderingForlengelse
>;

export const revurderingForlengelseReducer: Reducer<
    RevurderingForlengelseState,
    RevurderingForlengelseActions
> = (state, action) => {
    switch (action.type) {
        case 'settForlengelseTilOgMed': {
            const { tilOgMed, behandling, sak } = action.payload;

            return medInnvilgelsesperiode(
                state,
                { tilOgMed, internDeltakelseId: state.internDeltakelseId },
                behandling,
                sak,
            );
        }

        case 'settForlengelseTiltaksdeltakelse': {
            const { internDeltakelseId, behandling, sak } = action.payload;

            return medInnvilgelsesperiode(
                state,
                { tilOgMed: state.tilOgMed, internDeltakelseId },
                behandling,
                sak,
            );
        }

        case 'settHarValgtBarnetillegg': {
            const { harEndretBarnetillegg, behandling } = action.payload;
            const { innvilgelse, tilOgMed } = state;

            if (harEndretBarnetillegg || !innvilgelse.harValgtPeriode || !tilOgMed) {
                return { ...state, harEndretBarnetillegg };
            }

            return {
                ...state,
                harEndretBarnetillegg,
                innvilgelse: {
                    ...innvilgelse,
                    ...lagBarnetilleggSkjemaState(behandling, innvilgelse.innvilgelsesperioder),
                },
            };
        }

        case 'setHarSøktBarnetillegg':
        case 'velgBarnetilleggBarn':
        case 'settBarnetilleggPeriodevalg':
        case 'oppdaterBarnetilleggBarnPeriode':
        case 'leggTilBarnetilleggBarnPeriode':
        case 'fjernBarnetilleggBarnPeriode':
        case 'leggTilManueltBarnetilleggBarn':
        case 'fjernManueltBarnetilleggBarn': {
            return {
                ...state,
                harEndretBarnetillegg: true,
                innvilgelse: innvilgelseReducer(state.innvilgelse, action),
            };
        }

        case 'velgTiltak':
        case 'oppdaterTiltakPeriode':
        case 'settAntallDager':
        case 'leggTilTiltakPeriode':
        case 'fjernTiltakPeriode': {
            throw Error(`Innvilgelsesperioden kan ikke endres direkte ved forlengelse`);
        }
    }

    throw Error(`Ugyldig action for forlengelse: ${action satisfies never}`);
};

export const forlengelseInitialState = (
    behandling: RevurderingForlengelse,
): RevurderingForlengelseState => {
    const { innvilgelsesperioder, forlengesFraOgMed, harEndretBarnetillegg } = behandling;

    if (!innvilgelsesperioder) {
        const { tiltaksdeltakelserSomKanForlenges } = behandling;

        return {
            resultat: RevurderingResultat.FORLENGELSE,
            forlengesFraOgMed,
            harEndretBarnetillegg,
            // Saksbehandler må velge selv når vedtaket kan forlenges for flere tiltak.
            internDeltakelseId:
                tiltaksdeltakelserSomKanForlenges.length === 1
                    ? tiltaksdeltakelserSomKanForlenges[0]
                    : undefined,
            innvilgelse: {
                harValgtPeriode: false,
                innvilgelsesperioder: { tiltak: [], antallDagerPerMeldeperiode: [] },
            },
        };
    }

    // Det lagrede barnetillegget er enten valgt av saksbehandler eller utledet av backend.
    const skjemaperioder = tilInnvilgelsesperioderSkjema(innvilgelsesperioder);
    const lagret = hentLagretForlengelse(innvilgelsesperioder);

    return {
        resultat: RevurderingResultat.FORLENGELSE,
        forlengesFraOgMed,
        harEndretBarnetillegg,
        tilOgMed: lagret?.tilOgMed,
        internDeltakelseId: lagret?.internDeltakelseId,
        innvilgelse: {
            harValgtPeriode: true,
            innvilgelsesperioder: skjemaperioder,
            ...lagBarnetilleggSkjemaState(behandling, skjemaperioder),
        },
    };
};

// En forlengelse innvilges for ett tiltak, fra dagen etter vedtaket som forlenges slutter
const hentLagretForlengelse = (
    innvilgelsesperioder: Nullable<Innvilgelsesperioder>,
): { tilOgMed: Dato; internDeltakelseId: string } | undefined => {
    const tiltak = innvilgelsesperioder?.tiltak.at(0);
    const sistePeriode = tiltak?.perioder.at(-1);

    return tiltak && sistePeriode
        ? { tilOgMed: sistePeriode.periode.tilOgMed, internDeltakelseId: tiltak.internDeltakelseId }
        : undefined;
};

export const hentForlengelseTilOgMed = (state: RevurderingForlengelseState): Dato | undefined =>
    state.tilOgMed;

export const hentForlengelseTiltaksdeltakelse = (
    state: RevurderingForlengelseState,
): string | undefined => state.internDeltakelseId;

// Det lagrede barnetillegget gjelder bare så lenge verken til og med-datoen eller tiltaksdeltakelsen er endret siden behandlingen ble lagret.
const erLagretMedSammePeriodeOgTiltak = (
    state: RevurderingForlengelseState,
    behandling: RevurderingForlengelse,
): boolean => {
    const lagret = hentLagretForlengelse(behandling.innvilgelsesperioder);
    return (
        state.tilOgMed !== undefined &&
        state.tilOgMed === lagret?.tilOgMed &&
        state.internDeltakelseId === lagret.internDeltakelseId
    );
};

// Sann når skjemaet viser barnetillegget backend utledet sist behandlingen ble lagret, og som videreføres hvis saksbehandler ikke endrer det.
// Var barnetillegget valgt av saksbehandler da behandlingen ble lagret, utleder backend det på nytt neste gang.
export const visesUtledetBarnetillegg = (
    state: RevurderingForlengelseState,
    behandling: RevurderingForlengelse,
): boolean =>
    !state.harEndretBarnetillegg &&
    !behandling.harEndretBarnetillegg &&
    erLagretMedSammePeriodeOgTiltak(state, behandling);

const medInnvilgelsesperiode = (
    state: RevurderingForlengelseState,
    valgt: { tilOgMed?: Dato; internDeltakelseId?: string },
    behandling: RevurderingForlengelse,
    sak: SakProps,
): RevurderingForlengelseState => {
    const { tilOgMed, internDeltakelseId } = valgt;

    if (!tilOgMed || !internDeltakelseId) {
        return {
            ...state,
            tilOgMed,
            internDeltakelseId,
            innvilgelse: {
                harValgtPeriode: false,
                innvilgelsesperioder: { tiltak: [], antallDagerPerMeldeperiode: [] },
            },
        };
    }

    const periode: Periode = { fraOgMed: state.forlengesFraOgMed, tilOgMed };
    const forrige = state.innvilgelse;

    const innvilgelsesperioder: Innvilgelsesperioder = {
        tiltak: [{ internDeltakelseId, erReversertOpphør: false, perioder: [{ periode }] }],
        antallDagerPerMeldeperiode: [
            {
                periode,
                antallDagerPerMeldeperiode: hentAntallDagerPerMeldeperiode(
                    internDeltakelseId,
                    behandling,
                    sak,
                ),
            },
        ],
    };

    // Barnetillegg saksbehandler har valgt, tilpasses den nye perioden.
    // Ellers tas det alltid utgangspunkt i det lagrede, slik at en periode som endres frem og tilbake ikke mister informasjon.
    const barnetillegg: BarnetilleggSkjemaState =
        state.harEndretBarnetillegg && forrige.harValgtPeriode
            ? {
                  harBarnetillegg: forrige.harBarnetillegg,
                  valgteBarn: tilpassBarnTilInnvilgelsesperiodene(
                      forrige.valgteBarn,
                      innvilgelsesperioder,
                  ),
                  manueltLagtTilBarn: forrige.manueltLagtTilBarn,
              }
            : lagBarnetilleggSkjemaState(behandling, innvilgelsesperioder);

    return {
        ...state,
        tilOgMed,
        internDeltakelseId,
        innvilgelse: { harValgtPeriode: true, innvilgelsesperioder, ...barnetillegg },
    };
};

// Antall dager videreføres fra den siste perioden vedtaket som forlenges innvilget for tiltaksdeltakelsen, slik backend gjør.
const hentAntallDagerPerMeldeperiode = (
    internDeltakelseId: string,
    behandling: RevurderingForlengelse,
    sak: SakProps,
): number => {
    const antallDagerForSistePeriode = (innvilgelsesperioder: Nullable<Innvilgelsesperioder>) => {
        const sisteDag = innvilgelsesperioder?.tiltak
            .filter((it) => it.internDeltakelseId === internDeltakelseId)
            .flatMap((it) => it.perioder.map(({ periode }) => periode.tilOgMed))
            .toSorted()
            .at(-1);

        return sisteDag
            ? innvilgelsesperioder?.antallDagerPerMeldeperiode.find((it) =>
                  erDatoIPeriode(sisteDag, it.periode),
              )?.antallDagerPerMeldeperiode
            : undefined;
    };

    return (
        antallDagerForSistePeriode(
            hentRammevedtak(sak, behandling.forlengerRammevedtakId).innvilgelsesperioder,
        ) ??
        antallDagerForSistePeriode(behandling.innvilgelsesperioder) ??
        antallDagerForTiltak(behandling, internDeltakelseId)
    );
};

export type RevurderingForlengelseContext =
    BehandlingSkjemaContextBase<RevurderingForlengelseState>;

export const useRevurderingForlengelseSkjema = (): RevurderingForlengelseContext => {
    const context = useBehandlingSkjema();

    if (context.resultat !== RevurderingResultat.FORLENGELSE) {
        throw Error(`Feil resultat for forlengelse context: ${context.resultat}`);
    }

    return context;
};

export const useRevurderingForlengelseSkjemaDispatch = () => {
    const dispatch = useBehandlingSkjemaDispatch();

    return (action: ForlengelseActions | InnvilgelseActions) =>
        dispatch({ ...action, superType: BehandlingSkjemaType.RevurderingForlengelse });
};

export const useForlengelseBehandling = (): RevurderingForlengelse => {
    const { behandling } = useRevurderingBehandling();

    if (behandling.resultat !== RevurderingResultat.FORLENGELSE) {
        throw Error(`Behandlingen er ikke en forlengelse: ${behandling.resultat}`);
    }

    return behandling;
};
