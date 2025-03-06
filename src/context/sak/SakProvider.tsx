import React, { useEffect, useState } from 'react';
import { SakProps } from '../../types/SakTypes';
import { SakContext } from './SakContext';

type Props = React.PropsWithChildren<{
    sak: SakProps;
}>;

export const SakProvider = ({ sak: initialSak, children }: Props) => {
    const [sak, setSak] = useState<SakProps>(initialSak);

    useEffect(() => {
        setSak(initialSak);
    }, [initialSak]);

    return (
        <SakContext.Provider
            value={{
                sak,
                setSak,
            }}
        >
            {children}
        </SakContext.Provider>
    );
};
