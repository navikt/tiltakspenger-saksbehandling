import { Rammebehandling } from '~/lib/rammebehandling/typer/Rammebehandling';
import { ActionMenu } from '@navikt/ds-react';
import { skalKunneSetteBehandlingPaVent } from '~/lib/saksbehandler/tilganger';
import { Saksbehandler } from '~/lib/saksbehandler/SaksbehandlerTyper';
import { PauseIcon } from '@navikt/aksel-icons';

export const visSettBehandlingPåVentMenyvalg = (
    behandling: Rammebehandling,
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
