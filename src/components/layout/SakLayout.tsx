import React, { createContext, useContext, useEffect, useState } from 'react';
import { useHentSak } from '../../hooks/useHentSak';
import { Loader } from '@navikt/ds-react';
import { SakId } from '../../types/SakTypes';

// TODO: Refactor sak context

interface SakContextType {
    sakId: SakId;
    saknummer: string;
}

type TynnSak = {
    id: SakId;
    saknummer: string;
};

export const SakContext = createContext<SakContextType>({
    sakId: 'sak_',
    saknummer: '',
});

type Props = React.PropsWithChildren<{
    saksnummer: string;
}>;

export const SakLayout = ({ saksnummer, children }: Props) => {
    const [tynnSak, settTynnSak] = useState<TynnSak | undefined>();

    const { sak, isLoading } = useHentSak(saksnummer);

    useEffect(() => {
        if (sak) {
            settTynnSak({ saknummer: sak.saksnummer, id: sak.sakId });
        }
    }, [sak]);

    if (isLoading || !tynnSak) {
        return <Loader />;
    }

    return (
        <SakContext.Provider value={{ sakId: tynnSak.id, saknummer: tynnSak.saknummer }}>
            <main>{children}</main>
        </SakContext.Provider>
    );
};

export const useSak = () => {
    return useContext(SakContext);
};
