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
    MeldekortbehandlingSkjemaActions,
    MeldekortbehandlingSkjemaContext,
} from '~/lib/meldekort/v2/meldekortbehandling/context/MeldekortbehandlingV2ContextTyper';
import {
    MeldekortbehandlingPropsV2,
    MeldekortbehandlingStatus,
} from '~/lib/meldekort/typer/Meldekortbehandling';
import {
    meldekortbehandlingSkjemaInitialState,
    meldekortbehandlingSkjemaReducer,
} from '~/lib/meldekort/v2/meldekortbehandling/context/meldekortbehandlingSkjemaReducer';
import { useSaksbehandler } from '~/lib/saksbehandler/SaksbehandlerContext';
import { kanBehandle } from '~/lib/saksbehandler/tilganger';
import { getTextAreaRefValue } from '~/utils/textarea';

const MeldekortbehandlingContext = createContext({} as MeldekortbehandlingPropsV2);

// Separate contexts for å hindre re-renders for komponenter som kun bruker dispatch
const SkjemaContext = createContext({} as MeldekortbehandlingSkjemaContext);
const DispatchContext = createContext((() => ({})) as Dispatch<MeldekortbehandlingSkjemaActions>);

type Props = PropsWithChildren<{
    meldekortbehandling: MeldekortbehandlingPropsV2;
}>;

export const MeldekortbehandlingV2Provider = ({ meldekortbehandling, children }: Props) => {
    const { innloggetSaksbehandler } = useSaksbehandler();

    const erReadonly =
        !kanBehandle(innloggetSaksbehandler, meldekortbehandling.saksbehandler) ||
        meldekortbehandling.status !== MeldekortbehandlingStatus.UNDER_BEHANDLING;

    const [skjema, dispatch] = useReducer(
        meldekortbehandlingSkjemaReducer,
        meldekortbehandling,
        meldekortbehandlingSkjemaInitialState,
    );

    const begrunnelseRef = useRef<HTMLTextAreaElement>(null);
    const brevtekstRef = useRef<HTMLTextAreaElement>(null);

    const getBegrunnelse = useCallback(
        () => getTextAreaRefValue(begrunnelseRef, meldekortbehandling.begrunnelse),
        [meldekortbehandling.begrunnelse],
    );
    const getBrevtekst = useCallback(
        () => getTextAreaRefValue(brevtekstRef, meldekortbehandling.tekstTilVedtaksbrev),
        [meldekortbehandling.tekstTilVedtaksbrev],
    );

    return (
        <DispatchContext.Provider value={dispatch}>
            <SkjemaContext.Provider
                value={{
                    ...skjema,
                    erReadonly,
                    textAreas: {
                        begrunnelse: {
                            ref: begrunnelseRef,
                            getValue: getBegrunnelse,
                        },
                        brevtekst: {
                            ref: brevtekstRef,
                            getValue: getBrevtekst,
                        },
                    },
                }}
            >
                <MeldekortbehandlingContext.Provider value={meldekortbehandling}>
                    {children}
                </MeldekortbehandlingContext.Provider>
            </SkjemaContext.Provider>
        </DispatchContext.Provider>
    );
};

export const useMeldekortbehandlingSkjema = () => {
    return useContext(SkjemaContext);
};

export const useMeldekortbehandlingSkjemaDispatch = () => {
    return useContext(DispatchContext);
};

export const useMeldekortbehandling = () => {
    return useContext(MeldekortbehandlingContext);
};
