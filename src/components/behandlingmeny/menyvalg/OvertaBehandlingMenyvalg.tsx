import { ActionMenu } from '@navikt/ds-react';
import { ÅpenRammebehandlingForOversikt } from '~/types/ÅpenBehandlingForOversikt';
import { skalKunneOvertaBehandling } from '~/utils/tilganger';
import { Saksbehandler } from '~/types/Saksbehandler';
import { ArrowRightIcon } from '@navikt/aksel-icons';
import { Rammebehandlingsstatus } from '~/types/Rammebehandling';

export const visOvertaBehandlingMenyvalg = (
    behandling: ÅpenRammebehandlingForOversikt,
    innloggetSaksbehandler: Saksbehandler,
) => {
    const erRelevantMenyValgForStatus =
        behandling.status === Rammebehandlingsstatus.UNDER_BEHANDLING ||
        behandling.status === Rammebehandlingsstatus.UNDER_BESLUTNING;

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
