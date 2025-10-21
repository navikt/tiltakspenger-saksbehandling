import React, { createContext, ReactNode, useContext } from 'react';
import { Saksbehandler } from '../../types/Saksbehandler';
import { hentRolleForBehandling } from '~/utils/tilganger';
import { Behandling } from '~/types/Behandling';

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

export const useRolleForBehandling = (behandling: Behandling) => {
    return hentRolleForBehandling(behandling, useSaksbehandler().innloggetSaksbehandler);
};
