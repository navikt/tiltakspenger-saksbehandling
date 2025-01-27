import { createContext, Dispatch, SetStateAction } from 'react';
import { Saksbehandler } from '../../types/Saksbehandler';

type SaksbehandlerState = {
    innloggetSaksbehandler: Saksbehandler;
    setInnloggetSaksbehandler: Dispatch<SetStateAction<undefined | Saksbehandler>>;
};

export const SaksbehandlerContext = createContext<Partial<SaksbehandlerState>>({});
