import React from 'react';
import { Sak } from '../../types/SakTypes';
import { SakContext } from './SakContext';

type Props = React.PropsWithChildren<{
    sak: Sak;
}>;

export const SakProvider = ({ sak, children }: Props) => {
    return (
        <SakContext.Provider
            value={{
                sak,
            }}
        >
            {children}
        </SakContext.Provider>
    );
};
