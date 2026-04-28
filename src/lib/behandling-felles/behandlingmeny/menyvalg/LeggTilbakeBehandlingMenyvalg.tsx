import React from 'react';
import router from 'next/router';
import { ActionMenu } from '@navikt/ds-react';
import { ÅpenRammebehandlingForOversikt } from '~/lib/personoversikt/typer/ÅpenBehandlingForOversikt';
import { useLeggTilbakeBehandling } from '~/lib/behandling-felles/behandlingmeny/useLeggTilbakeBehandling';
import { eierBehandling } from '~/lib/saksbehandler/tilganger';
import { SaksbehandlerTyper } from '~/lib/saksbehandler/SaksbehandlerTyper';
import { ArrowLeftIcon } from '@navikt/aksel-icons';
import { Rammebehandlingsstatus } from '~/lib/rammebehandling/typer/Rammebehandling';
import { personoversiktUrl } from '~/utils/urls';

export const visLeggTilbakeMenyvalg = (
    behandling: ÅpenRammebehandlingForOversikt,
    innloggetSaksbehandler: SaksbehandlerTyper,
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
                    router.push(personoversiktUrl(behandling));
                });
            }}
        >
            Legg tilbake
        </ActionMenu.Item>
    );
};

export default LeggTilbakeMenyvalg;
