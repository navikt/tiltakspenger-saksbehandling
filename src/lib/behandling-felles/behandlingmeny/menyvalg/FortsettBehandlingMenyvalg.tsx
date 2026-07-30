import { ActionMenu } from '@navikt/ds-react';
import Link from 'next/link';
import { eierBehandling } from '~/lib/saksbehandler/tilganger';
import { Saksbehandler } from '~/lib/saksbehandler/SaksbehandlerTyper';
import { ArrowRightIcon } from '@navikt/aksel-icons';
import { behandlingUrl } from '~/utils/urls';
import {
    Rammebehandling,
    Rammebehandlingsstatus,
} from '~/lib/rammebehandling/typer/Rammebehandling';
import { erBehandlingSattPåVent } from '~/lib/behandling-felles/utils/behandlingUtils';
import { useSak } from '~/lib/sak/SakContext';

export const visFortsettBehandlingMenyvalg = (
    behandling: Rammebehandling,
    innloggetSaksbehandler: Saksbehandler,
) => {
    const erReleventMenyValgForStatus =
        behandling.status === Rammebehandlingsstatus.UNDER_BEHANDLING ||
        behandling.status === Rammebehandlingsstatus.UNDER_BESLUTNING;

    return (
        erReleventMenyValgForStatus &&
        !erBehandlingSattPåVent(behandling) &&
        eierBehandling(behandling, innloggetSaksbehandler)
    );
};

type Props = {
    behandling: Rammebehandling;
};

const FortsettBehandlingMenyvalg = ({ behandling }: Props) => {
    const { saksnummer } = useSak().sak;

    return (
        <ActionMenu.Item
            as={Link}
            href={behandlingUrl({ saksnummer, id: behandling.id })}
            icon={<ArrowRightIcon aria-hidden />}
        >
            Fortsett
        </ActionMenu.Item>
    );
};

export default FortsettBehandlingMenyvalg;
