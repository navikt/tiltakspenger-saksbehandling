import { BehandlingData, RevurderingData } from '~/types/BehandlingTypes';
import {
    createContext,
    Dispatch,
    PropsWithChildren,
    useCallback,
    useContext,
    useReducer,
    useRef,
} from 'react';
import {
    RevurderingInnvilgelseReducer,
    RevurderingInnvilgelseSkjemaActions,
    RevurderingInnvilgelseSkjemaState,
} from './RevurderingInnvilgelseReducer';
import { useRevurderingBehandling } from '~/components/behandling/BehandlingContext';
import { Periode } from '~/types/Periode';
import { VedtakTiltaksdeltakelsePeriode } from '~/types/VedtakTyper';
import { harSøktBarnetillegg, hentTiltaksdeltakelserMedStartOgSluttdato } from '~/utils/behandling';
import { getTextAreaRefValue } from '~/utils/textarea';
import { BarnetilleggBegrunnelseInput } from '~/components/behandling/felles/state/BarnetilleggState';
import { BegrunnelseOgBrevInput } from '~/components/behandling/felles/state/BegrunnelseOgBrev';
import { joinPerioder } from '~/utils/periode';

export type RevurderingInnvilgelseVedtakContext = BegrunnelseOgBrevInput &
    BarnetilleggBegrunnelseInput &
    RevurderingInnvilgelseSkjemaState;

// Separate contexts for å hindre re-renders for komponenter som kun bruker dispatch
const StateContext = createContext({} as RevurderingInnvilgelseVedtakContext);
const DispatchContext = createContext(
    (() => ({})) as Dispatch<RevurderingInnvilgelseSkjemaActions>,
);

const tilValgteTiltaksdeltakelser = (
    behandling: BehandlingData,
): VedtakTiltaksdeltakelsePeriode[] =>
    hentTiltaksdeltakelserMedStartOgSluttdato(behandling).map((tiltaksdeltagelse) => ({
        eksternDeltagelseId: tiltaksdeltagelse.eksternDeltagelseId,
        periode: {
            fraOgMed: tiltaksdeltagelse.deltagelseFraOgMed,
            tilOgMed: tiltaksdeltagelse.deltagelseTilOgMed,
        },
    }));

const initieltVedtakSkjema = (behandling: RevurderingData): RevurderingInnvilgelseSkjemaState => {
    const tiltaksdeltagelser: Periode[] = hentTiltaksdeltakelserMedStartOgSluttdato(behandling).map(
        (tiltaksdeltagelse) => ({
            fraOgMed: tiltaksdeltagelse.deltagelseFraOgMed,
            tilOgMed: tiltaksdeltagelse.deltagelseTilOgMed,
        }),
    );
    const tiltaksperiode: Periode = joinPerioder(tiltaksdeltagelser);

    return {
        behandlingsperiode: behandling.virkningsperiode ?? tiltaksperiode,
        antallDagerPerMeldeperiode: behandling.antallDagerPerMeldeperiode ?? [
            {
                antallDagerPerMeldeperiode: 10,
                periode: {
                    fraOgMed: behandling.virkningsperiode?.fraOgMed ?? tiltaksperiode.fraOgMed,
                    tilOgMed: behandling.virkningsperiode?.tilOgMed ?? tiltaksperiode.tilOgMed,
                },
            },
        ],
        harBarnetillegg: harSøktBarnetillegg(behandling),
        barnetilleggPerioder: behandling.barnetillegg?.perioder ?? [],
        valgteTiltaksdeltakelser:
            behandling.valgteTiltaksdeltakelser ?? tilValgteTiltaksdeltakelser(behandling),
    };
};

export const RevurderingInnvilgelseVedtakProvider = ({ children }: PropsWithChildren) => {
    const { behandling } = useRevurderingBehandling();

    const [vedtak, dispatch] = useReducer(
        RevurderingInnvilgelseReducer,
        behandling,
        initieltVedtakSkjema,
    );

    const begrunnelseRef = useRef<HTMLTextAreaElement>(null);
    const brevtekstRef = useRef<HTMLTextAreaElement>(null);
    const barnetilleggBegrunnelseRef = useRef<HTMLTextAreaElement>(null);

    const getBegrunnelse = useCallback(
        () => getTextAreaRefValue(begrunnelseRef, behandling.begrunnelseVilkårsvurdering),
        [begrunnelseRef, behandling.begrunnelseVilkårsvurdering],
    );
    const getBrevtekst = useCallback(
        () => getTextAreaRefValue(brevtekstRef, behandling.fritekstTilVedtaksbrev),
        [brevtekstRef, behandling.fritekstTilVedtaksbrev],
    );
    const getBarnetilleggBegrunnelse = useCallback(
        () => getTextAreaRefValue(barnetilleggBegrunnelseRef, behandling.barnetillegg?.begrunnelse),
        [barnetilleggBegrunnelseRef, behandling.barnetillegg],
    );

    return (
        <DispatchContext.Provider value={dispatch}>
            <StateContext.Provider
                value={{
                    ...vedtak,
                    textAreas: {
                        begrunnelse: {
                            ref: begrunnelseRef,
                            getValue: getBegrunnelse,
                        },
                        brevtekst: {
                            ref: brevtekstRef,
                            getValue: getBrevtekst,
                        },
                        barnetilleggBegrunnelse: {
                            ref: barnetilleggBegrunnelseRef,
                            getValue: getBarnetilleggBegrunnelse,
                        },
                    },
                }}
            >
                {children}
            </StateContext.Provider>
        </DispatchContext.Provider>
    );
};

export const useRevurderingInnvilgelseSkjema = () => {
    return useContext(StateContext);
};

export const useRevurderingInnvilgelseSkjemaDispatch = () => {
    return useContext(DispatchContext);
};
