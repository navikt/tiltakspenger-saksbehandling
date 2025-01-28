import { createContext } from 'react';
import { Saksbehandler } from '../../types/Saksbehandler';

type SaksbehandlerState = {
    innloggetSaksbehandler: Saksbehandler;
};

export const SaksbehandlerContext = createContext<Partial<SaksbehandlerState>>({});
