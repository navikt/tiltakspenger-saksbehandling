import { FørstegangsbehandlingData } from '../../../../types/BehandlingTypes';
import { createContext, ReactNode, useContext } from 'react';
import { BehandlingContextState } from '../../BehandlingContext';
import {
    FørstegangsbehandlingDispatch,
    useFørstegangsbehandlingReducer,
} from './FørstegangsbehandlingReducer';
import { VedtakData } from '../../../../types/VedtakTyper';

export type FørstegangsbehandlingContextState = BehandlingContextState<FørstegangsbehandlingData>;

const BehandlingContext = createContext({} as FørstegangsbehandlingContextState);
const VedtakSkjemaContext = createContext({} as VedtakData);
const VedtakDispatchContext = createContext(undefined as unknown as FørstegangsbehandlingDispatch);

type Props = {
    behandlingContext: BehandlingContextState<FørstegangsbehandlingData>;
    children: ReactNode;
};

export const FørstegangsbehandlingProvider = ({ behandlingContext, children }: Props) => {
    const { behandling } = behandlingContext;

    const [vedtak, dispatch] = useFørstegangsbehandlingReducer(behandling);

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
