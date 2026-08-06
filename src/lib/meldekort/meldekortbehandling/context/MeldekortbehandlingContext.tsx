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
} from '~/lib/meldekort/meldekortbehandling/context/MeldekortbehandlingContextTyper';
import {
    MeldekortbehandlingId,
    MeldekortbehandlingProps,
    MeldekortbehandlingStatus,
} from '~/lib/meldekort/typer/Meldekortbehandling';
import {
    meldekortbehandlingSkjemaInitialState,
    meldekortbehandlingSkjemaReducer,
} from '~/lib/meldekort/meldekortbehandling/context/meldekortbehandlingSkjemaReducer';
import { useSaksbehandler } from '~/lib/saksbehandler/SaksbehandlerContext';
import { kanBehandle } from '~/lib/saksbehandler/tilganger';
import { getTextAreaRefValue } from '~/lib/_felles/fritekst/fritekstUtils';
import { useSak } from '~/lib/sak/SakContext';
import { MeldekortbehandlingLagringProvider } from '~/lib/meldekort/meldekortbehandling/lagre/MeldekortbehandlingLagringProvider';
import { hentMeldekortbehandling } from '~/lib/sak/sakUtils';

const MeldekortbehandlingContext = createContext({} as MeldekortbehandlingProps);

// Separate contexts for å hindre re-renders for komponenter som kun bruker dispatch
const SkjemaContext = createContext({} as MeldekortbehandlingSkjemaContext);
const DispatchContext = createContext((() => ({})) as Dispatch<MeldekortbehandlingSkjemaActions>);

type Props = PropsWithChildren<{
    id: MeldekortbehandlingId;
}>;

export const MeldekortbehandlingProvider = ({ id, children }: Props) => {
    const { sak } = useSak();
    const meldekortbehandling = hentMeldekortbehandling(sak, id);

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
        <MeldekortbehandlingContext.Provider value={meldekortbehandling}>
            <DispatchContext.Provider value={dispatch}>
                <SkjemaContext.Provider
                    value={{
                        ...skjema,
                        erReadonly,
                        begrunnelse: {
                            ref: begrunnelseRef,
                            getValue: getBegrunnelse,
                        },
                        brevtekst: {
                            ref: brevtekstRef,
                            getValue: getBrevtekst,
                        },
                    }}
                >
                    <MeldekortbehandlingLagringProvider>
                        {children}
                    </MeldekortbehandlingLagringProvider>
                </SkjemaContext.Provider>
            </DispatchContext.Provider>
        </MeldekortbehandlingContext.Provider>
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
