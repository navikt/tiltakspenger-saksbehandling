import React from 'react';
import router from 'next/router';
import { ActionMenu } from '@navikt/ds-react';
import { ÅpenRammebehandlingForOversikt } from '~/types/ÅpenBehandlingForOversikt';
import { useLeggTilbakeBehandling } from '~/components/behandlingmeny/useLeggTilbakeBehandling';
import { eierBehandling } from '~/utils/tilganger';
import { Saksbehandler } from '~/types/Saksbehandler';
import { ArrowLeftIcon } from '@navikt/aksel-icons';
import { Rammebehandlingsstatus } from '~/types/Rammebehandling';

export const visLeggTilbakeMenyvalg = (
    behandling: ÅpenRammebehandlingForOversikt,
    innloggetSaksbehandler: Saksbehandler,
) => {
    const erRelevantMenyValgForStatus =
        behandling.status === Rammebehandlingsstatus.UNDER_BEHANDLING ||
        behandling.status === Rammebehandlingsstatus.UNDER_BESLUTNING;

    return erRelevantMenyValgForStatus && eierBehandling(behandling, innloggetSaksbehandler);
};

type Props = {
    behandling: ÅpenRammebehandlingForOversikt;
};

const LeggTilbakeMenyvalg = ({ behandling }: Props) => {
    const { leggTilbakeBehandling } = useLeggTilbakeBehandling(behandling.sakId, behandling.id);

    return (
        <ActionMenu.Item
            icon={<ArrowLeftIcon aria-hidden />}
            onClick={(e) => {
                e.preventDefault();
                leggTilbakeBehandling().then(() => {
                    router.push(`/sak/${behandling.saksnummer}`);
                });
            }}
        >
            Legg tilbake
        </ActionMenu.Item>
    );
};

export default LeggTilbakeMenyvalg;
