import router from 'next/router';
import { useHentBehandlingDeprecated } from '../../hooks/useHentBehandlingDeprecated';
import PersonaliaHeader from '../personaliaheader/PersonaliaHeader';
import { Saksbehandlingstabs } from '../saksbehandlingstabs/SaksbehandlingTabs';
import { Loader, Tag } from '@navikt/ds-react';
import React, { createContext } from 'react';
import { finnBehandlingStatusTekst } from '../../utils/tekstformateringUtils';
import { BehandlingId, Behandlingstype } from '../../types/BehandlingTypes';
import { Periode } from '../../types/Periode';
import { SakId } from '../../types/SakTypes';

type BehandlingContextType = {
    behandlingId: BehandlingId;
    sakId: SakId;
    behandlingstype: Behandlingstype;
    behandlingsperiode: Periode;
};

export const BehandlingContextDeprecated = createContext<BehandlingContextType>(
    {} as BehandlingContextType,
);

export const FørstegangsbehandlingLayout = ({ children }: React.PropsWithChildren) => {
    const behandlingId = router.query.behandlingId as string;
    const { valgtBehandling, isLoading } = useHentBehandlingDeprecated(behandlingId);

    if (isLoading || !valgtBehandling) {
        return <Loader />;
    }

    const { id, sakId, behandlingstype, vurderingsperiode, saksnummer, status } = valgtBehandling;

    return (
        <BehandlingContextDeprecated.Provider
            value={{
                behandlingId: id,
                sakId: sakId,
                behandlingstype: behandlingstype,
                behandlingsperiode: vurderingsperiode,
            }}
        >
            <PersonaliaHeader sakId={sakId} saksnummer={saksnummer}>
                <Tag variant="alt3-filled">{finnBehandlingStatusTekst(status, false)}</Tag>
            </PersonaliaHeader>
            <Saksbehandlingstabs />
            <main>{children}</main>
        </BehandlingContextDeprecated.Provider>
    );
};
