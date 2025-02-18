import { useContext } from 'react';
import { BehandlingContext } from './BehandlingContext';

export const useBehandling = () => {
    return useContext(BehandlingContext);
};
