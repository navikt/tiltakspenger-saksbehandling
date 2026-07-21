import { ActionMenu } from '@navikt/ds-react';
import { ÅpenRammebehandlingForOversikt } from '~/lib/personoversikt/typer/ÅpenBehandlingForOversikt';
import { useLeggTilbakeBehandling } from '~/lib/behandling-felles/behandlingmeny/useLeggTilbakeBehandling';
import { eierBehandling } from '~/lib/saksbehandler/tilganger';
import { Saksbehandler } from '~/lib/saksbehandler/SaksbehandlerTyper';
import { ArrowLeftIcon } from '@navikt/aksel-icons';
import { Rammebehandlingsstatus } from '~/lib/rammebehandling/typer/Rammebehandling';
import { SakProps } from '~/lib/sak/SakTyper';
import { FetcherError } from '~/utils/fetch/fetch';

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
    onSuccess: (oppdatertSak: SakProps) => void;
    onError: (error: FetcherError) => void;
};

const LeggTilbakeMenyvalg = ({ behandling, onSuccess, onError }: Props) => {
    const { leggTilbakeBehandling } = useLeggTilbakeBehandling(behandling.sakId, behandling.id, {
        onSuccess,
        onError,
    });

    return (
        <ActionMenu.Item
            icon={<ArrowLeftIcon aria-hidden />}
            onClick={(e) => {
                e.preventDefault();
                leggTilbakeBehandling();
            }}
        >
            Legg tilbake
        </ActionMenu.Item>
    );
};

export default LeggTilbakeMenyvalg;
