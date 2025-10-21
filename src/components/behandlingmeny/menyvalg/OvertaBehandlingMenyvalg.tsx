import { ActionMenu } from '@navikt/ds-react';
import { BehandlingForOversikt } from '~/types/BehandlingForOversikt';
import { skalKunneOvertaBehandling } from '~/utils/tilganger';
import { Saksbehandler } from '~/types/Saksbehandler';
import { ArrowRightIcon } from '@navikt/aksel-icons';
import { Behandlingsstatus } from '~/types/Behandling';

export const visOvertaBehandlingMenyvalg = (
    behandling: BehandlingForOversikt,
    innloggetSaksbehandler: Saksbehandler,
) => {
    const erRelevantMenyValgForStatus =
        behandling.status === Behandlingsstatus.UNDER_BEHANDLING ||
        behandling.status === Behandlingsstatus.UNDER_BESLUTNING;

    return (
        erRelevantMenyValgForStatus && skalKunneOvertaBehandling(behandling, innloggetSaksbehandler)
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
