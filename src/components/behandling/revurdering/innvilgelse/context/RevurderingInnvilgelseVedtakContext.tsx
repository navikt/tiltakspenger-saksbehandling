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
import { hentTiltaksdeltakelserMedStartOgSluttdato } from '~/utils/behandling';

type TextAreaInputs = {
    begrunnelseRef: RefObject<HTMLTextAreaElement>;
    brevtekstRef: RefObject<HTMLTextAreaElement>;
    getBegrunnelse: () => string;
    getBrevtekst: () => string;
};

export type RevurderingInnvilgelseVedtakContext = TextAreaInputs &
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
    const tiltaksdeltagelse = behandling.saksopplysninger.tiltaksdeltagelse;
    const tiltaksperiode: Periode = {
        fraOgMed: tiltaksdeltagelse.at(0)!.deltagelseFraOgMed!,
        tilOgMed: tiltaksdeltagelse.at(-1)!.deltagelseTilOgMed!,
    };

    return {
        harBarnetillegg: false,
        barnetilleggPerioder: [],
        behandlingsperiode: behandling.virkningsperiode ?? tiltaksperiode,
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

    const getBegrunnelse = useCallback(
        () => begrunnelseRef.current?.value.trim() ?? '',
        [begrunnelseRef],
    );
    const getBrevtekst = useCallback(
        () => brevtekstRef.current?.value.trim() ?? '',
        [brevtekstRef],
    );

    return (
        <DispatchContext.Provider value={dispatch}>
            <StateContext.Provider
                value={{
                    ...vedtak,
                    begrunnelseRef,
                    brevtekstRef,
                    getBegrunnelse,
                    getBrevtekst,
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
