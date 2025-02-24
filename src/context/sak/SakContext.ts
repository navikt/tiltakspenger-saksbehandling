import { SakProps } from '../../types/SakTypes';
import { createContext } from 'react';

export type SakContextState = {
    sak: SakProps;
};

export const SakContext = createContext<SakContextState>({} as SakContextState);
