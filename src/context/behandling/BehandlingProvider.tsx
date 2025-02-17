import { ReactNode } from 'react';
import { BehandlingContext } from './BehandlingContext';
import { BehandlingProps } from '../../types/BehandlingTypes';

type Props = {
    behandling: BehandlingProps;
    children: ReactNode;
};

export const BehandlingProvider = ({ behandling, children }: Props) => {
    return (
        <BehandlingContext.Provider value={{ behandling }}>{children}</BehandlingContext.Provider>
    );
};
