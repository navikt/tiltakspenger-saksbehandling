import { ActionMenu } from '@navikt/ds-react';
import { BehandlingForOversiktData, BehandlingStatus } from '~/types/BehandlingTypes';
import React from 'react';
import Link from 'next/link';
import { eierBehandling } from '~/utils/tilganger';
import { Saksbehandler } from '~/types/Saksbehandler';
import { ArrowRightIcon } from '@navikt/aksel-icons';

export const visFortsettBehandlingMenyvalg = (
    behandling: BehandlingForOversiktData,
    innloggetSaksbehandler: Saksbehandler,
) => {
    const erReleventMenyValgForStatus =
        behandling.status === BehandlingStatus.UNDER_BEHANDLING ||
        behandling.status === BehandlingStatus.UNDER_BESLUTNING;

    return erReleventMenyValgForStatus && eierBehandling(behandling, innloggetSaksbehandler);
};

type Props = {
    behandling: BehandlingForOversiktData;
};

const FortsettBehandlingMenyvalg = ({ behandling }: Props) => {
    const behandlingLenke = `/behandling/${behandling.id}`;
    return (
        <ActionMenu.Item as={Link} href={behandlingLenke} icon={<ArrowRightIcon aria-hidden />}>
            Fortsett
        </ActionMenu.Item>
    );
};

export default FortsettBehandlingMenyvalg;
