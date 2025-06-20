import React, { createContext, ReactNode, useContext } from 'react';
import { Saksbehandler } from '../../types/Saksbehandler';
import { BehandlingData } from '~/types/BehandlingTypes';
import { hentRolleForBehandling } from '~/utils/tilganger';

type SaksbehandlerState = {
    innloggetSaksbehandler: Saksbehandler;
};

const Context = createContext<SaksbehandlerState>({} as SaksbehandlerState);

type Props = {
    children: ReactNode;
    saksbehandler: Saksbehandler;
};

export const SaksbehandlerProvider = ({ saksbehandler, children }: Props) => {
    return (
        <Context.Provider value={{ innloggetSaksbehandler: saksbehandler }}>
            {children}
        </Context.Provider>
    );
};

export const useSaksbehandler = () => {
    return useContext(Context);
};

export const useRolleForBehandling = (behandling: BehandlingData) => {
    return hentRolleForBehandling(behandling, useSaksbehandler().innloggetSaksbehandler);
};
