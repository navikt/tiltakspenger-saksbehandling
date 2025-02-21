import { SaksbehandlerContext } from './SaksbehandlerContext';
import React, { ReactNode } from 'react';
import { Saksbehandler } from '../../types/Saksbehandler';

type Props = {
    children: ReactNode;
    saksbehandler: Saksbehandler;
};

export const SaksbehandlerProvider = ({ saksbehandler, children }: Props) => {
    return (
        <SaksbehandlerContext.Provider value={{ innloggetSaksbehandler: saksbehandler }}>
            {children}
        </SaksbehandlerContext.Provider>
    );
};
