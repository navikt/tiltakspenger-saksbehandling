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
import {
    harSøktBarnetillegg,
    hentTiltaksdeltagelseFraSoknad,
    hentTiltaksperiodeFraSøknad,
} from '../../../../utils/behandling';
import { periodiserBarnetillegg } from '../../../../utils/barnetillegg';

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
    const tiltaksperiode = hentTiltaksperiodeFraSøknad(behandling);
    const tiltakFraSoknad = hentTiltaksdeltagelseFraSoknad(behandling);

    return {
        innvilgelsesPeriode: behandling.virkningsperiode ?? tiltaksperiode,
        resultat: behandling.virkningsperiode ? 'innvilget' : undefined,
        harBarnetillegg: harSøktBarnetillegg(behandling),
        barnetilleggPerioder:
            behandling.barnetillegg?.perioder ||
            periodiserBarnetillegg(
                behandling.søknad.barnetillegg,
                behandling.virkningsperiode ?? tiltaksperiode,
            ),
        valgteTiltaksdeltakelser: behandling.valgteTiltaksdeltakelser || [
            {
                eksternDeltagelseId: tiltakFraSoknad.eksternDeltagelseId,
                periode: behandling.virkningsperiode ?? tiltaksperiode,
            },
        ],
        antallDagerPerMeldeperiode: behandling.antallDagerPerMeldeperiode || 10,
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

export const useFørstegangsVedtakSkjema = () => {
    return useContext(StateContext);
};

export const useFørstegangsVedtakSkjemaDispatch = () => {
    return useContext(DispatchContext);
};
