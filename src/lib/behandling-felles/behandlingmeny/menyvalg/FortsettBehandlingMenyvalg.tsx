import { ActionMenu } from '@navikt/ds-react';
import { ÅpenRammebehandlingForOversikt } from '~/lib/personoversikt/typer/ÅpenBehandlingForOversikt';
import React from 'react';
import Link from 'next/link';
import { eierBehandling, erSattPaVent } from '~/lib/saksbehandler/tilganger';
import { Saksbehandler } from '~/lib/saksbehandler/SaksbehandlerTyper';
import { ArrowRightIcon } from '@navikt/aksel-icons';
import { behandlingUrl } from '~/utils/urls';
import { Rammebehandlingsstatus } from '~/lib/rammebehandling/typer/Rammebehandling';

export const visFortsettBehandlingMenyvalg = (
    behandling: ÅpenRammebehandlingForOversikt,
    innloggetSaksbehandler: Saksbehandler,
) => {
    const erReleventMenyValgForStatus =
        behandling.status === Rammebehandlingsstatus.UNDER_BEHANDLING ||
        behandling.status === Rammebehandlingsstatus.UNDER_BESLUTNING;

    return (
        erReleventMenyValgForStatus &&
        !erSattPaVent(behandling) &&
        eierBehandling(behandling, innloggetSaksbehandler)
    );
};

type Props = {
    behandling: ÅpenRammebehandlingForOversikt;
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
