import { BehandlingProps } from '../../types/BehandlingTypes';
import { createContext } from 'react';

export type BehandlingContextState = {
    behandling: BehandlingProps;
};

export const BehandlingContext = createContext({} as BehandlingContextState);
