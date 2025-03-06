import React, { createContext, ReactNode, useContext } from 'react';
import { Saksbehandler } from '../../types/Saksbehandler';

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
