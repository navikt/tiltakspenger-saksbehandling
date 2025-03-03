import { FørstegangsbehandlingData } from '../../../../types/BehandlingTypes';
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
import { useFørstegangsbehandling } from '../../BehandlingContext';
import {
    FørstegangsVedtakSkjemaActions,
    førstegangsVedtakReducer,
    FørstegangsVedtakSkjemaState,
} from './FørstegangsVedtakReducer';
import { harSøktBarnetillegg, hentTiltaksPeriode } from '../../../../utils/behandling';

type TextAreaInputs = {
    begrunnelseRef: RefObject<HTMLTextAreaElement>;
    brevtekstRef: RefObject<HTMLTextAreaElement>;
    barnetilleggBegrunnelseRef: RefObject<HTMLTextAreaElement>;
    getBegrunnelse: () => string;
    getBrevtekst: () => string;
    getBarnetilleggBegrunnelse: () => string;
};

export type FørstegangsVedtakContext = TextAreaInputs & FørstegangsVedtakSkjemaState;

// Separate contexts for å hindre re-renders for komponenter som kun bruker dispatch
const StateContext = createContext({} as FørstegangsVedtakContext);
const DispatchContext = createContext((() => ({})) as Dispatch<FørstegangsVedtakSkjemaActions>);

const initieltVedtakSkjema = (
    behandling: FørstegangsbehandlingData,
): FørstegangsVedtakSkjemaState => {
    const tiltaksperiode = hentTiltaksPeriode(behandling);

    return {
        innvilgelsesPeriode: behandling.virkningsperiode ?? tiltaksperiode,
        resultat: behandling.virkningsperiode ? 'innvilget' : undefined,
        harBarnetillegg: harSøktBarnetillegg(behandling),
        barnetilleggPerioder: behandling.barnetillegg?.perioder || [
            { periode: tiltaksperiode, antallBarn: behandling.søknad.barnetillegg.length },
        ],
    };
};

export const FørstegangsVedtakProvider = ({ children }: PropsWithChildren) => {
    const { behandling } = useFørstegangsbehandling();

    const [vedtak, dispatch] = useReducer(
        førstegangsVedtakReducer,
        behandling,
        initieltVedtakSkjema,
    );

    const begrunnelseRef = useRef<HTMLTextAreaElement>(null);
    const brevtekstRef = useRef<HTMLTextAreaElement>(null);
    const barnetilleggBegrunnelseRef = useRef<HTMLTextAreaElement>(null);

    const getBegrunnelse = useCallback(() => begrunnelseRef.current!.value, [begrunnelseRef]);
    const getBrevtekst = useCallback(() => brevtekstRef.current!.value, [brevtekstRef]);
    const getBarnetilleggBegrunnelse = useCallback(
        () => barnetilleggBegrunnelseRef.current!.value,
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

export const useFørstegangsVedtakSkjema = () => {
    return useContext(StateContext);
};

export const useFørstegangsVedtakSkjemaDispatch = () => {
    return useContext(DispatchContext);
};
