import { Sak } from '../../types/SakTypes';
import { createContext } from 'react';

export type SakContextState = {
    sak: Sak;
};

export const SakContext = createContext<SakContextState>({} as SakContextState);
