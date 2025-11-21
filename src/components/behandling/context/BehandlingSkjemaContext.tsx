import {
    createContext,
    Dispatch,
    PropsWithChildren,
    useCallback,
    useContext,
    useReducer,
    useRef,
} from 'react';
import { useBehandling } from '~/components/behandling/context/BehandlingContext';
import {
    BehandlingSkjemaActions,
    behandlingSkjemaReducer,
    BehandlingSkjemaState,
} from '~/components/behandling/context/behandlingSkjemaReducer';
import { Rammebehandling, Rammebehandlingstype } from '~/types/Rammebehandling';
import { useSak } from '~/context/sak/SakContext';
import { SakProps } from '~/types/Sak';
import { getTextAreaRefValue, TextAreaInput } from '~/utils/textarea';
import { rammebehandlingMedInnvilgelseEllerNull } from '~/utils/behandling';
import { søknadsbehandlingInitialState } from '~/components/behandling/context/søknadsbehandling/søknadsbehandlingInitialState';
import { revurderingInitialState } from '~/components/behandling/context/revurdering/revurderingInitialState';

export type BehandlingSkjemaMedFritekst<T> = T & {
    textAreas: {
        begrunnelse: TextAreaInput;
        brevtekst: TextAreaInput;
        barnetilleggBegrunnelse: TextAreaInput;
    };
};

export type BehandlingSkjemaContext = BehandlingSkjemaMedFritekst<BehandlingSkjemaState>;

// Separate contexts for å hindre re-renders for komponenter som kun bruker dispatch
const StateContext = createContext({} as BehandlingSkjemaContext);
const DispatchContext = createContext((() => ({})) as Dispatch<BehandlingSkjemaActions>);

export const BehandlingSkjemaProvider = ({ children }: PropsWithChildren) => {
    const { sak } = useSak();
    const { behandling } = useBehandling();

    const [skjema, dispatch] = useReducer(
        behandlingSkjemaReducer,
        { behandling, sak },
        initialState,
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
        () =>
            getTextAreaRefValue(
                barnetilleggBegrunnelseRef,
                rammebehandlingMedInnvilgelseEllerNull(behandling)?.barnetillegg?.begrunnelse,
            ),
        [barnetilleggBegrunnelseRef, behandling],
    );

    return (
        <DispatchContext.Provider value={dispatch}>
            <StateContext.Provider
                value={{
                    ...skjema,
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

const initialState = ({
    behandling,
    sak,
}: {
    behandling: Rammebehandling;
    sak: SakProps;
}): BehandlingSkjemaState => {
    return behandling.type === Rammebehandlingstype.SØKNADSBEHANDLING
        ? søknadsbehandlingInitialState(behandling)
        : revurderingInitialState(behandling, sak);
};

export const useBehandlingSkjema = () => {
    return useContext(StateContext);
};

export const useBehandlingSkjemaDispatch = () => {
    return useContext(DispatchContext);
};
