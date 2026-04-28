import React, { createContext, ReactNode, useContext } from 'react';
import { SaksbehandlerTyper } from './SaksbehandlerTyper';
import { hentRolleForBehandling } from '~/lib/saksbehandler/tilganger';
import { Rammebehandling } from '~/lib/rammebehandling/typer/Rammebehandling';

type SaksbehandlerState = {
    innloggetSaksbehandler: SaksbehandlerTyper;
};

const Context = createContext<SaksbehandlerState>({} as SaksbehandlerState);

type Props = {
    children: ReactNode;
    saksbehandler: SaksbehandlerTyper;
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

export const useRolleForBehandling = (behandling: Rammebehandling) => {
    return hentRolleForBehandling(behandling, useSaksbehandler().innloggetSaksbehandler);
};
