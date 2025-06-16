import { SøknadsbehandlingData } from '~/types/BehandlingTypes';
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
import { useSøknadsbehandling } from '../../BehandlingContext';
import {
    SøknadsbehandlingSkjemaActions,
    SøknadsbehandlingReducer,
    SøknadsbehandlingSkjemaState,
} from './SøknadsbehandlingReducer';
import {
    harSøktBarnetillegg,
    hentTiltaksdeltagelseFraSoknad,
    hentTiltaksperiodeFraSøknad,
} from '~/utils/behandling';
import { periodiserBarnetillegg } from '~/utils/barnetillegg';

type TextAreaInputs = {
    begrunnelseRef: RefObject<HTMLTextAreaElement>;
    brevtekstRef: RefObject<HTMLTextAreaElement>;
    barnetilleggBegrunnelseRef: RefObject<HTMLTextAreaElement>;
    getBegrunnelse: () => string;
    getBrevtekst: () => string;
    getBarnetilleggBegrunnelse: () => string;
};

export type SøknadsbehandlingVedtakContext = TextAreaInputs & SøknadsbehandlingSkjemaState;

// Separate contexts for å hindre re-renders for komponenter som kun bruker dispatch
const StateContext = createContext({} as SøknadsbehandlingVedtakContext);
const DispatchContext = createContext((() => ({})) as Dispatch<SøknadsbehandlingSkjemaActions>);

const initieltVedtakSkjema = (behandling: SøknadsbehandlingData): SøknadsbehandlingSkjemaState => {
    const tiltaksperiode = hentTiltaksperiodeFraSøknad(behandling);
    const tiltakFraSoknad = hentTiltaksdeltagelseFraSoknad(behandling);

    return {
        behandlingsperiode: behandling.virkningsperiode ?? tiltaksperiode,
        resultat: behandling.resultat,
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
        avslagsgrunner: behandling.avslagsgrunner,
    };
};

export const SøknadsbehandlingVedtakProvider = ({ children }: PropsWithChildren) => {
    const { behandling } = useSøknadsbehandling();

    const [vedtak, dispatch] = useReducer(
        SøknadsbehandlingReducer,
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

export const useSøknadsbehandlingSkjema = () => {
    return useContext(StateContext);
};

export const useSøknadsbehandlingSkjemaDispatch = () => {
    return useContext(DispatchContext);
};
