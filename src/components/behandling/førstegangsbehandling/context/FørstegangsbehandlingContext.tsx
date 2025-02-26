import { FørstegangsbehandlingData } from '../../../../types/BehandlingTypes';
import { createContext, ReactNode, useContext } from 'react';
import { VedtakData } from '../../../../types/VedtakTyper';
import { BehandlingContextState } from '../../BehandlingContext';
import {
    FørstegangsbehandlingDispatch,
    useFørstegangsbehandlingReducer,
} from './FørstegangsbehandlingReducer';

export type FørstegangsbehandlingContextState = {
    vedtak: VedtakData;
    dispatch: FørstegangsbehandlingDispatch;
} & BehandlingContextState<FørstegangsbehandlingData>;

const Context = createContext({} as FørstegangsbehandlingContextState);

type Props = {
    behandlingContext: BehandlingContextState<FørstegangsbehandlingData>;
    children: ReactNode;
};

export const FørstegangsbehandlingProvider = ({ behandlingContext, children }: Props) => {
    const { behandling } = behandlingContext;

    const [vedtak, dispatch] = useFørstegangsbehandlingReducer(behandling);

    return (
        <Context.Provider
            value={{
                ...behandlingContext,
                vedtak,
                dispatch,
            }}
        >
            {children}
        </Context.Provider>
    );
};

export const useFørstegangsbehandling = () => {
    return useContext(Context);
};
