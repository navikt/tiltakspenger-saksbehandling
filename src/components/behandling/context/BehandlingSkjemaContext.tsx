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
import { getTextAreaRefValue, TextAreaInput } from '~/utils/textarea';
import { behandlingSkjemaInitialValue } from '~/components/behandling/context/behandlingSkjemaInitialValue';
import {
    BehandlingSkjemaActions,
    BehandlingSkjemaReducer,
    BehandlingSkjemaState,
} from '~/components/behandling/context/BehandlingSkjemaReducer';
import { useSak } from '~/context/sak/SakContext';

type FritekstInput = {
    textAreas: {
        begrunnelse: TextAreaInput;
        brevtekst: TextAreaInput;
        barnetilleggBegrunnelse: TextAreaInput;
    };
};

export type BehandlingSkjemaContext = FritekstInput & BehandlingSkjemaState;

// Separate contexts for å hindre re-renders for komponenter som kun bruker dispatch
const StateContext = createContext({} as BehandlingSkjemaContext);
const DispatchContext = createContext((() => ({})) as Dispatch<BehandlingSkjemaActions>);

export const BehandlingSkjemaProvider = ({ children }: PropsWithChildren) => {
    const { sak } = useSak();
    const { behandling } = useBehandling();

    const [vedtak, dispatch] = useReducer(
        BehandlingSkjemaReducer,
        { behandling, sak },
        behandlingSkjemaInitialValue,
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

export const useBehandlingSkjema = () => {
    return useContext(StateContext);
};

export const useBehandlingSkjemaDispatch = () => {
    return useContext(DispatchContext);
};
