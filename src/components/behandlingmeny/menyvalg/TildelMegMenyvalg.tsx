import { ActionMenu } from '@navikt/ds-react';
import { BehandlingForOversiktData, BehandlingStatus } from '~/types/BehandlingTypes';
import React from 'react';
import Link from 'next/link';
import { skalKunneTaBehandling } from '~/utils/tilganger';
import router from 'next/router';
import { useTaBehandling } from '~/components/behandlingmeny/useTaBehandling';
import { Saksbehandler } from '~/types/Saksbehandler';
import { PersonIcon } from '@navikt/aksel-icons';

export const visTildelMegMenyvalg = (
    behandling: BehandlingForOversiktData,
    innloggetSaksbehandler: Saksbehandler,
) => {
    const erReleventMenyValgForStatus =
        behandling.status === BehandlingStatus.KLAR_TIL_BEHANDLING ||
        behandling.status === BehandlingStatus.KLAR_TIL_BESLUTNING;

    return erReleventMenyValgForStatus && skalKunneTaBehandling(behandling, innloggetSaksbehandler);
};

type Props = {
    behandling: BehandlingForOversiktData;
};

const TildelMegMenyvalg = ({ behandling }: Props) => {
    const { taBehandling } = useTaBehandling(behandling.sakId, behandling.id);
    const behandlingLenke = `/behandling/${behandling.id}`;

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
