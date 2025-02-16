import router from 'next/router';
import { useHentBehandling } from '../../hooks/useHentBehandling';
import PersonaliaHeader from '../personaliaheader/PersonaliaHeader';
import { Saksbehandlingstabs } from '../saksbehandlingstabs/SaksbehandlingTabs';
import { Loader, Tag } from '@navikt/ds-react';
import React, { createContext } from 'react';
import { finnStatusTekst } from '../../utils/tekstformateringUtils';
import { BehandlingId, TypeBehandling } from '../../types/BehandlingTypes';
import { Periode } from '../../types/Periode';
import { SakId } from '../../types/SakTypes';

type BehandlingContextType = {
    behandlingId: BehandlingId;
    sakId: SakId;
    behandlingstype: TypeBehandling;
    behandlingsperiode: Periode;
};

export const BehandlingContext = createContext<BehandlingContextType>({} as BehandlingContextType);

export const FørstegangsbehandlingLayout = ({ children }: React.PropsWithChildren) => {
    const behandlingId = router.query.behandlingId as string;
    const { valgtBehandling, isLoading } = useHentBehandling(behandlingId);

    if (isLoading || !valgtBehandling) {
        return <Loader />;
    }

    const { id, sakId, behandlingstype, vurderingsperiode, saksnummer, status } = valgtBehandling;

    return (
        <BehandlingContext.Provider
            value={{
                behandlingId: id,
                sakId: sakId,
                behandlingstype: behandlingstype,
                behandlingsperiode: vurderingsperiode,
            }}
        >
            <PersonaliaHeader sakId={sakId} saksnummer={saksnummer}>
                <Tag variant="alt3-filled">{finnStatusTekst(status, false)}</Tag>
            </PersonaliaHeader>
            <Saksbehandlingstabs />
            <main>{children}</main>
        </BehandlingContext.Provider>
    );
};
