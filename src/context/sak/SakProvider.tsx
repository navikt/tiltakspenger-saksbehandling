import React from 'react';
import { SakProps } from '../../types/SakTypes';
import { SakContext } from './SakContext';

type Props = React.PropsWithChildren<{
    sak: SakProps;
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
