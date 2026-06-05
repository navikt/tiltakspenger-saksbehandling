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
    MeldekortbehandlingId,
    MeldekortbehandlingStatus,
} from '~/lib/meldekort/typer/Meldekortbehandling';
import {
    meldekortbehandlingSkjemaInitialState,
    meldekortbehandlingSkjemaReducer,
} from '~/lib/meldekort/v2/meldekortbehandling/context/meldekortbehandlingSkjemaReducer';
import { useSaksbehandler } from '~/lib/saksbehandler/SaksbehandlerContext';
import { kanBehandle } from '~/lib/saksbehandler/tilganger';
import { getTextAreaRefValue } from '~/utils/textarea';
import { MeldekortbehandlingPropsV2 } from '~/lib/meldekort/v2/typer';
import { useSak } from '~/lib/sak/SakContext';

const MeldekortbehandlingContext = createContext({} as MeldekortbehandlingPropsV2);

// Separate contexts for å hindre re-renders for komponenter som kun bruker dispatch
const SkjemaContext = createContext({} as MeldekortbehandlingSkjemaContext);
const DispatchContext = createContext((() => ({})) as Dispatch<MeldekortbehandlingSkjemaActions>);

type Props = PropsWithChildren<{
    id: MeldekortbehandlingId;
}>;

export const MeldekortbehandlingV2Provider = ({ id, children }: Props) => {
    const meldekortbehandling = useSak().sak.meldekortbehandlinger[id];

    if (!meldekortbehandling) {
        throw Error(`Fant ikke meldekortbehandlingen med id ${id}`);
    }

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
                        tilDTO: () => {
                            return {
                                meldeperioder: skjema.meldeperioder.map((it) => ({
                                    kjedeId: it.kjedeId,
                                    dager: it.dager,
                                })),
                                begrunnelse: getBegrunnelse(),
                                tekstTilVedtaksbrev: getBrevtekst(),
                                skalSendeVedtaksbrev: true,
                                v2: true,
                            };
                        },
                    }}
                >
                    {children}
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
