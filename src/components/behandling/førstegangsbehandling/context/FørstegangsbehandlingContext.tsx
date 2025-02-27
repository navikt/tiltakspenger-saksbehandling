import { FørstegangsbehandlingData } from '../../../../types/BehandlingTypes';
import { createContext, Dispatch, ReactNode, useContext, useReducer } from 'react';
import { BehandlingContextState } from '../../BehandlingContext';
import {
    FørstegangsbehandlingActions,
    førstegangsVedtakReducer,
} from './FørstegangsbehandlingReducer';
import { VedtakData } from '../../../../types/VedtakTyper';
import { hentTiltaksPeriode } from '../../../../utils/tiltak';

export type FørstegangsbehandlingContextState = BehandlingContextState<FørstegangsbehandlingData>;

const BehandlingContext = createContext({} as FørstegangsbehandlingContextState);
const VedtakSkjemaContext = createContext({} as VedtakData);
const VedtakDispatchContext = createContext((() => ({})) as Dispatch<FørstegangsbehandlingActions>);

const initieltVedtakSkjema = (behandling: FørstegangsbehandlingData): VedtakData => ({
    begrunnelseVilkårsvurdering: behandling.begrunnelseVilkårsvurdering ?? '',
    fritekstTilVedtaksbrev: behandling.fritekstTilVedtaksbrev ?? '',
    innvilgelsesPeriode: behandling.virkningsperiode ?? hentTiltaksPeriode(behandling),
    resultat: behandling.virkningsperiode ? 'innvilget' : undefined,
    barnetillegg: {
        begrunnelse: behandling.barnetillegg?.begrunnelse,
        barnetilleggForPeriode: behandling.barnetillegg?.perioder,
    },
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

    return (
        <BehandlingContext.Provider value={behandlingContext}>
            <VedtakDispatchContext.Provider value={dispatch}>
                <VedtakSkjemaContext.Provider value={vedtak}>
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
