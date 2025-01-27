import { SaksbehandlerContext } from './SaksbehandlerContext';
import React, { ReactNode, useEffect, useState } from 'react';
import { Saksbehandler } from '../../types/Saksbehandler';
import { Loader } from '@navikt/ds-react';
import useSWRImmutable from 'swr/immutable';
import { fetcher } from '../../utils/http';
import Varsel from '../../components/varsel/Varsel';

type Props = {
    children: ReactNode;
};

export const SaksbehandlerProvider = ({ children }: Props) => {
    const [innloggetSaksbehandler, setInnloggetSaksbehandler] = useState<Saksbehandler>();
    const {
        data: saksbehandler,
        isLoading: isSaksbehandlerLoading,
        error,
    } = useSWRImmutable<Saksbehandler>('/api/saksbehandler', fetcher);

    useEffect(() => {
        if (saksbehandler) {
            setInnloggetSaksbehandler(saksbehandler);
        }
    }, [saksbehandler]);

    if (isSaksbehandlerLoading) {
        return <Loader />;
    }

    if (error) {
        return (
            <Varsel
                variant={'error'}
                melding={`Kunne ikke laste innlogget saksbehandler - ${error}`}
            />
        );
    }

    return (
        <SaksbehandlerContext.Provider
            value={{ innloggetSaksbehandler, setInnloggetSaksbehandler }}
        >
            {children}
        </SaksbehandlerContext.Provider>
    );
};
