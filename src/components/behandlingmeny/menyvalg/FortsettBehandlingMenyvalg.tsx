import { ActionMenu } from '@navikt/ds-react';
import { BehandlingForOversikt } from '~/types/BehandlingForOversikt';
import React from 'react';
import Link from 'next/link';
import { eierBehandling } from '~/utils/tilganger';
import { Saksbehandler } from '~/types/Saksbehandler';
import { ArrowRightIcon } from '@navikt/aksel-icons';
import { behandlingUrl } from '~/utils/urls';
import { Rammebehandlingsstatus } from '~/types/Behandling';

export const visFortsettBehandlingMenyvalg = (
    behandling: BehandlingForOversikt,
    innloggetSaksbehandler: Saksbehandler,
) => {
    const erReleventMenyValgForStatus =
        behandling.status === Rammebehandlingsstatus.UNDER_BEHANDLING ||
        behandling.status === Rammebehandlingsstatus.UNDER_BESLUTNING;

    return (
        erReleventMenyValgForStatus &&
        !behandling.erSattPåVent &&
        eierBehandling(behandling, innloggetSaksbehandler)
    );
};

type Props = {
    behandling: BehandlingForOversikt;
};

const FortsettBehandlingMenyvalg = ({ behandling }: Props) => {
    return (
        <ActionMenu.Item
            as={Link}
            href={behandlingUrl(behandling)}
            icon={<ArrowRightIcon aria-hidden />}
        >
            Fortsett
        </ActionMenu.Item>
    );
};

export default FortsettBehandlingMenyvalg;
