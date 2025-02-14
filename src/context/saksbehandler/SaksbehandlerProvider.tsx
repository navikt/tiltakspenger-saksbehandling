import { SaksbehandlerContext } from './SaksbehandlerContext';
import React, { ReactNode } from 'react';
import { Saksbehandler } from '../../types/Saksbehandler';
import { Loader } from '@navikt/ds-react';
import useSWRImmutable from 'swr/immutable';
import { fetcher } from '../../utils/http';
import Varsel from '../../components/varsel/Varsel';

type Props = {
    children: ReactNode;
};

export const SaksbehandlerProvider = ({ children }: Props) => {
    const {
        data: saksbehandler,
        isLoading,
        error,
    } = useSWRImmutable<Saksbehandler>('/api/saksbehandler', fetcher);

    if (isLoading) {
        return <Loader />;
    }

    if (error || !saksbehandler) {
        return (
            <Varsel
                variant={'error'}
                melding={`Kunne ikke laste innlogget saksbehandler - ${error}`}
            />
        );
    }

    return (
        <SaksbehandlerContext.Provider value={{ innloggetSaksbehandler: saksbehandler }}>
            {children}
        </SaksbehandlerContext.Provider>
    );
};
