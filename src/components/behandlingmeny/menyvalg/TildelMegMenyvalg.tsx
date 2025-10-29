import { ActionMenu } from '@navikt/ds-react';
import { BehandlingForOversikt } from '~/types/BehandlingForOversikt';
import React from 'react';
import Link from 'next/link';
import { skalKunneTaBehandling } from '~/utils/tilganger';
import router from 'next/router';
import { useTaBehandling } from '~/components/behandlingmeny/useTaBehandling';
import { Saksbehandler } from '~/types/Saksbehandler';
import { PersonIcon } from '@navikt/aksel-icons';
import { behandlingUrl } from '~/utils/urls';
import { Rammebehandlingsstatus } from '~/types/Behandling';

export const visTildelMegMenyvalg = (
    behandling: BehandlingForOversikt,
    innloggetSaksbehandler: Saksbehandler,
) => {
    const erReleventMenyValgForStatus =
        behandling.status === Rammebehandlingsstatus.KLAR_TIL_BEHANDLING ||
        behandling.status === Rammebehandlingsstatus.KLAR_TIL_BESLUTNING;

    return erReleventMenyValgForStatus && skalKunneTaBehandling(behandling, innloggetSaksbehandler);
};

type Props = {
    behandling: BehandlingForOversikt;
};

const TildelMegMenyvalg = ({ behandling }: Props) => {
    const { taBehandling } = useTaBehandling(behandling.sakId, behandling.id);
    const behandlingLenke = behandlingUrl(behandling);

    return (
        <ActionMenu.Item
            as={Link}
            href={behandlingLenke}
            onClick={(e) => {
                e.preventDefault();
                taBehandling().then(() => {
                    router.push(behandlingLenke);
                });
            }}
            icon={<PersonIcon aria-hidden />}
        >
            {'Tildel meg'}
        </ActionMenu.Item>
    );
};

export default TildelMegMenyvalg;
