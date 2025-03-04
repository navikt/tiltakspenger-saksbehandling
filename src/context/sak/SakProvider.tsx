import React from 'react';
import { SakProps } from '../../types/SakTypes';
import { SakContext } from './SakContext';

type Props = React.PropsWithChildren<{
    sak: SakProps;
}>;

export const SakProvider = ({ sak: initialSak, children }: Props) => {
    const [sak, setSak] = React.useState<SakProps>(initialSak);

    return (
        <SakContext.Provider
            value={{
                sak: sak,
                setSak,
            }}
        >
            {children}
        </SakContext.Provider>
    );
};
