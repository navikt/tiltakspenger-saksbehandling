import { ActionMenu } from '@navikt/ds-react';
import { useLeggTilbakeBehandling } from '~/lib/behandling-felles/behandlingmeny/useLeggTilbakeBehandling';
import { eierBehandling } from '~/lib/saksbehandler/tilganger';
import { Saksbehandler } from '~/lib/saksbehandler/SaksbehandlerTyper';
import { ArrowLeftIcon } from '@navikt/aksel-icons';
import {
    Rammebehandling,
    Rammebehandlingsstatus,
} from '~/lib/rammebehandling/typer/Rammebehandling';
import { SakProps } from '~/lib/sak/SakTyper';
import { FetcherError } from '~/utils/fetch/fetch';
import { useSak } from '~/lib/sak/SakContext';

export const visLeggTilbakeMenyvalg = (
    behandling: Rammebehandling,
    innloggetSaksbehandler: Saksbehandler,
) => {
    const erRelevantMenyValgForStatus =
        behandling.status === Rammebehandlingsstatus.UNDER_BEHANDLING ||
        behandling.status === Rammebehandlingsstatus.UNDER_BESLUTNING;

    return erRelevantMenyValgForStatus && eierBehandling(behandling, innloggetSaksbehandler);
};

type Props = {
    behandling: Rammebehandling;
    onSuccess: (oppdatertSak: SakProps) => void;
    onError: (error: FetcherError) => void;
};

const LeggTilbakeMenyvalg = ({ behandling, onSuccess, onError }: Props) => {
    const { sakId } = useSak().sak;

    const { leggTilbakeBehandling } = useLeggTilbakeBehandling(sakId, behandling.id, {
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
