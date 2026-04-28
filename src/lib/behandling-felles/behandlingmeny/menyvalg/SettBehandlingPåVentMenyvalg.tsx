import React from 'react';
import { ActionMenu } from '@navikt/ds-react';
import { ÅpenRammebehandlingForOversikt } from '~/lib/personoversikt/typer/ÅpenBehandlingForOversikt';
import { skalKunneSetteBehandlingPaVent } from '~/lib/saksbehandler/tilganger';
import { SaksbehandlerTyper } from '~/lib/saksbehandler/SaksbehandlerTyper';
import { PauseIcon } from '@navikt/aksel-icons';

export const visSettBehandlingPåVentMenyvalg = (
    behandling: ÅpenRammebehandlingForOversikt,
    innloggetSaksbehandler: SaksbehandlerTyper,
) => {
    return skalKunneSetteBehandlingPaVent(behandling, innloggetSaksbehandler);
};

type Props = {
    setVisSettBehandlingPåVentModal: (vis: boolean) => void;
};

const SettBehandlingPåVentMenyvalg = ({ setVisSettBehandlingPåVentModal }: Props) => {
    return (
        <ActionMenu.Item
            icon={<PauseIcon aria-hidden />}
            onClick={() => {
                setVisSettBehandlingPåVentModal(true);
            }}
        >
            Sett på vent
        </ActionMenu.Item>
    );
};

export default SettBehandlingPåVentMenyvalg;
