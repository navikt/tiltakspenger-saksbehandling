import { FørstegangsbehandlingData } from '../../../../types/BehandlingTypes';
import {
    createContext,
    Dispatch,
    ReactNode,
    RefObject,
    useContext,
    useReducer,
    useRef,
} from 'react';
import { BehandlingContextState } from '../../BehandlingContext';
import {
    FørstegangsbehandlingActions,
    førstegangsVedtakReducer,
} from './FørstegangsbehandlingReducer';
import { VedtakBarnetilleggPeriode, VedtakResultat } from '../../../../types/VedtakTyper';
import { harSøktBarnetillegg, hentTiltaksPeriode } from '../../../../utils/behandling';
import { Periode } from '../../../../types/Periode';

export type FørstegangsbehandlingContextState = BehandlingContextState<FørstegangsbehandlingData>;

export type VedtakData = {
    resultat?: VedtakResultat;
    innvilgelsesPeriode: Periode;
    harBarnetillegg: boolean;
    barnetilleggPerioder?: VedtakBarnetilleggPeriode[];
};

type TextAreaInputs = {
    begrunnelseRef: RefObject<HTMLTextAreaElement>;
    brevtekstRef: RefObject<HTMLTextAreaElement>;
    barnetilleggBegrunnelseRef: RefObject<HTMLTextAreaElement>;
};

export type VedtakContextState = TextAreaInputs & VedtakData;

const BehandlingContext = createContext({} as FørstegangsbehandlingContextState);
const VedtakSkjemaContext = createContext({} as VedtakContextState);
const VedtakDispatchContext = createContext((() => ({})) as Dispatch<FørstegangsbehandlingActions>);

const initieltVedtakSkjema = (behandling: FørstegangsbehandlingData): VedtakData => ({
    innvilgelsesPeriode: behandling.virkningsperiode ?? hentTiltaksPeriode(behandling),
    resultat: behandling.virkningsperiode ? 'innvilget' : undefined,
    harBarnetillegg: harSøktBarnetillegg(behandling),
    barnetilleggPerioder: behandling.barnetillegg?.perioder,
});

type Props = {
    behandlingContext: BehandlingContextState<FørstegangsbehandlingData>;
    children: ReactNode;
};

export const FørstegangsbehandlingProvider = ({ behandlingContext, children }: Props) => {
    const { behandling } = behandlingContext;

    const [vedtak, dispatch] = useReducer(
        førstegangsVedtakReducer,
        behandling,
        initieltVedtakSkjema,
    );

    const begrunnelseRef = useRef<HTMLTextAreaElement>(null);
    const brevtekstRef = useRef<HTMLTextAreaElement>(null);
    const barnetilleggBegrunnelseRef = useRef<HTMLTextAreaElement>(null);

    return (
        <BehandlingContext.Provider value={behandlingContext}>
            <VedtakDispatchContext.Provider value={dispatch}>
                <VedtakSkjemaContext.Provider
                    value={{ ...vedtak, begrunnelseRef, brevtekstRef, barnetilleggBegrunnelseRef }}
                >
                    {children}
                </VedtakSkjemaContext.Provider>
            </VedtakDispatchContext.Provider>
        </BehandlingContext.Provider>
    );
};

export const useFørstegangsbehandling = () => {
    return useContext(BehandlingContext);
};

export const useFørstegangsVedtakSkjema = () => {
    return useContext(VedtakSkjemaContext);
};

export const useFørstegangsVedtakDispatch = () => {
    return useContext(VedtakDispatchContext);
};
