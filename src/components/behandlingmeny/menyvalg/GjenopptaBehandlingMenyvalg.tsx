import React from 'react';
import { ActionMenu } from '@navikt/ds-react';
import { BehandlingForOversiktData, BehandlingStatus } from '~/types/BehandlingTypes';
import { eierBehandling } from '~/utils/tilganger';
import { Saksbehandler } from '~/types/Saksbehandler';
import { PlayIcon } from '@navikt/aksel-icons';
import { useGjenopptaBehandling } from '~/components/behandlingmeny/useGjenopptaBehandling';
import router from 'next/router';

export const visGjenopptaBehandlingMenyvalg = (
    behandling: BehandlingForOversiktData,
    innloggetSaksbehandler: Saksbehandler,
) => {
    const erRelevantMenyValgForStatus = behandling.status === BehandlingStatus.UNDER_BESLUTNING;

    return (
        erRelevantMenyValgForStatus &&
        behandling.erSattPåVent &&
        eierBehandling(behandling, innloggetSaksbehandler)
    );
};

type Props = {
    behandling: BehandlingForOversiktData;
};

const GjenopptaBehandlingMenyvalg = ({ behandling }: Props) => {
    const { gjenopptaBehandling } = useGjenopptaBehandling(behandling.sakId, behandling.id);
    const behandlingLenke = `/behandling/${behandling.id}`;

    return (
        <ActionMenu.Item
            icon={<PlayIcon aria-hidden />}
            onClick={(e) => {
                e.preventDefault();
                gjenopptaBehandling().then(() => router.push(behandlingLenke));
            }}
        >
            Gjenoppta
        </ActionMenu.Item>
    );
};

export default GjenopptaBehandlingMenyvalg;
