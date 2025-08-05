import React from 'react';
import { ActionMenu } from '@navikt/ds-react';
import { BehandlingForOversiktData, BehandlingStatus } from '~/types/BehandlingTypes';
import { eierBehandling } from '~/utils/tilganger';
import { Saksbehandler } from '~/types/Saksbehandler';
import { PauseIcon } from '@navikt/aksel-icons';

export const visSettBehandlingPåVentMenyvalg = (
    behandling: BehandlingForOversiktData,
    innloggetSaksbehandler: Saksbehandler,
) => {
    const erRelevantMenyValgForStatus =
        behandling.status == BehandlingStatus.UNDER_BEHANDLING ||
        behandling.status === BehandlingStatus.UNDER_BESLUTNING;
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
