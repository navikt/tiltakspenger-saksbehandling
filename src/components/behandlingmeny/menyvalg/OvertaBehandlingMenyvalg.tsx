import { ActionMenu } from '@navikt/ds-react';
import { BehandlingForOversiktData, BehandlingStatus } from '~/types/BehandlingTypes';
import {
    eierBehandling,
    erBehandlerEllerBeslutterAvBehandling,
    skalKunneOvertaBehandling,
} from '~/utils/tilganger';
import { Saksbehandler } from '~/types/Saksbehandler';
import { ArrowRightIcon } from '@navikt/aksel-icons';

export const visOvertaBehandlingMenyvalg = (
    behandling: BehandlingForOversiktData,
    innloggetSaksbehandler: Saksbehandler,
) => {
    const erRelevantMenyValgForStatus =
        behandling.status === BehandlingStatus.UNDER_BEHANDLING ||
        behandling.status === BehandlingStatus.UNDER_BESLUTNING;

    return (
        erRelevantMenyValgForStatus &&
        !eierBehandling(behandling, innloggetSaksbehandler) &&
        !erBehandlerEllerBeslutterAvBehandling(behandling, innloggetSaksbehandler) &&
        skalKunneOvertaBehandling(behandling, innloggetSaksbehandler)
    );
};

type Props = {
    setVisOvertaBehandlingModal: (vis: boolean) => void;
};

const OvertaBehandlingMenyvalg = ({ setVisOvertaBehandlingModal }: Props) => {
    return (
        <ActionMenu.Item
            icon={<ArrowRightIcon aria-hidden />}
            onClick={() => {
                setVisOvertaBehandlingModal(true);
            }}
        >
            Overta behandling
        </ActionMenu.Item>
    );
};

export default OvertaBehandlingMenyvalg;
