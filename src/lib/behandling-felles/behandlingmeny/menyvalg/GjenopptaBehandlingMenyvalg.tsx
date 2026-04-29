import React from 'react';
import { ActionMenu } from '@navikt/ds-react';
import { ÅpenRammebehandlingForOversikt } from '~/lib/personoversikt/typer/ÅpenBehandlingForOversikt';
import { skalKunneGjenopptaBehandling } from '~/lib/saksbehandler/tilganger';
import { Saksbehandler } from '~/lib/saksbehandler/SaksbehandlerTyper';
import { PlayIcon } from '@navikt/aksel-icons';
import { useGjenopptaBehandling } from '~/lib/behandling-felles/behandlingmeny/useGjenopptaBehandling';
import router from 'next/router';
import { behandlingUrl } from '~/utils/urls';

export const visGjenopptaBehandlingMenyvalg = (
    behandling: ÅpenRammebehandlingForOversikt,
    innloggetSaksbehandler: Saksbehandler,
) => {
    return skalKunneGjenopptaBehandling(behandling, innloggetSaksbehandler);
};

type Props = {
    behandling: ÅpenRammebehandlingForOversikt;
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
