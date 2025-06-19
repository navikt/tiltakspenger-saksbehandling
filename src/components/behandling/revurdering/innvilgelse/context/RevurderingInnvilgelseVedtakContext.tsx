import { BehandlingData, RevurderingData } from '~/types/BehandlingTypes';
import {
    createContext,
    Dispatch,
    PropsWithChildren,
    RefObject,
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
import { BarnetilleggState } from '~/components/behandling/felles/state/BarnetilleggState';

type TextAreaInputs = {
    begrunnelseRef: RefObject<HTMLTextAreaElement>;
    brevtekstRef: RefObject<HTMLTextAreaElement>;
    barnetilleggBegrunnelseRef: RefObject<HTMLTextAreaElement>;
    getBegrunnelse: () => string;
    getBrevtekst: () => string;
    getBarnetilleggBegrunnelse: () => string;
};

export type RevurderingInnvilgelseVedtakContext = TextAreaInputs &
    RevurderingInnvilgelseSkjemaState &
    BarnetilleggState;

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
    const tiltaksdeltagelse = behandling.saksopplysninger.tiltaksdeltagelse;
    const tiltaksperiode: Periode = {
        fraOgMed: tiltaksdeltagelse.at(0)!.deltagelseFraOgMed!,
        tilOgMed: tiltaksdeltagelse.at(-1)!.deltagelseTilOgMed!,
    };

    return {
        behandlingsperiode: behandling.virkningsperiode ?? tiltaksperiode,
        antallDagerPerMeldeperiode: 10,
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
        () => begrunnelseRef.current?.value.trim() ?? '',
        [begrunnelseRef],
    );
    const getBrevtekst = useCallback(
        () => brevtekstRef.current?.value.trim() ?? '',
        [brevtekstRef],
    );
    const getBarnetilleggBegrunnelse = useCallback(
        () => barnetilleggBegrunnelseRef.current?.value.trim() ?? '',
        [barnetilleggBegrunnelseRef],
    );

    return (
        <DispatchContext.Provider value={dispatch}>
            <StateContext.Provider
                value={{
                    ...vedtak,
                    begrunnelseRef,
                    brevtekstRef,
                    barnetilleggBegrunnelseRef,
                    getBegrunnelse,
                    getBrevtekst,
                    getBarnetilleggBegrunnelse,
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
