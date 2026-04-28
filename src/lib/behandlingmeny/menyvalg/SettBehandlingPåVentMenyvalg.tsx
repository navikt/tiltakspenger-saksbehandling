import React from 'react';
import { ActionMenu } from '@navikt/ds-react';
import { ÅpenRammebehandlingForOversikt } from '~/types/ÅpenBehandlingForOversikt';
import { skalKunneSetteBehandlingPaVent } from '~/utils/tilganger';
import { Saksbehandler } from '~/types/Saksbehandler';
import { PauseIcon } from '@navikt/aksel-icons';

export const visSettBehandlingPåVentMenyvalg = (
    behandling: ÅpenRammebehandlingForOversikt,
    innloggetSaksbehandler: Saksbehandler,
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
