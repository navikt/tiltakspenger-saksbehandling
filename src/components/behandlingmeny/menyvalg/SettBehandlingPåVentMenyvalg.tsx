import React from 'react';
import { ActionMenu } from '@navikt/ds-react';
import { BehandlingForOversikt } from '~/types/BehandlingForOversikt';
import { eierBehandling } from '~/utils/tilganger';
import { Saksbehandler } from '~/types/Saksbehandler';
import { PauseIcon } from '@navikt/aksel-icons';
import { Rammebehandlingsstatus } from '~/types/Rammebehandling';

export const visSettBehandlingPåVentMenyvalg = (
    behandling: BehandlingForOversikt,
    innloggetSaksbehandler: Saksbehandler,
) => {
    const erRelevantMenyValgForStatus =
        behandling.status == Rammebehandlingsstatus.UNDER_BEHANDLING ||
        behandling.status === Rammebehandlingsstatus.UNDER_BESLUTNING;
    return (
        erRelevantMenyValgForStatus &&
        !behandling.erSattPåVent &&
        eierBehandling(behandling, innloggetSaksbehandler)
    );
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
