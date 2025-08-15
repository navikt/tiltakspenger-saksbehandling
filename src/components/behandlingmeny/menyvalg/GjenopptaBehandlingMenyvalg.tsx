import React from 'react';
import { ActionMenu } from '@navikt/ds-react';
import { BehandlingForOversiktData } from '~/types/BehandlingTypes';
import { skalKunneGjenopptaBehandling } from '~/utils/tilganger';
import { Saksbehandler } from '~/types/Saksbehandler';
import { PlayIcon } from '@navikt/aksel-icons';
import { useGjenopptaBehandling } from '~/components/behandlingmeny/useGjenopptaBehandling';
import router from 'next/router';
import { behandlingUrl } from '~/utils/urls';

export const visGjenopptaBehandlingMenyvalg = (
    behandling: BehandlingForOversiktData,
    innloggetSaksbehandler: Saksbehandler,
) => {
    return skalKunneGjenopptaBehandling(behandling, innloggetSaksbehandler);
};

type Props = {
    behandling: BehandlingForOversiktData;
};

const GjenopptaBehandlingMenyvalg = ({ behandling }: Props) => {
    const { gjenopptaBehandling } = useGjenopptaBehandling(behandling.sakId, behandling.id);

    return (
        <ActionMenu.Item
            icon={<PlayIcon aria-hidden />}
            onClick={(e) => {
                e.preventDefault();
                gjenopptaBehandling().then(() => router.push(behandlingUrl(behandling)));
            }}
        >
            Gjenoppta
        </ActionMenu.Item>
    );
};

export default GjenopptaBehandlingMenyvalg;
