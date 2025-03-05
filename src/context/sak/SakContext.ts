import { SakProps } from '../../types/SakTypes';
import { createContext } from 'react';

export type SakContextState = {
    sak: SakProps;
    setSak: (sak: SakProps) => void;
};

export const SakContext = createContext<SakContextState>({} as SakContextState);
