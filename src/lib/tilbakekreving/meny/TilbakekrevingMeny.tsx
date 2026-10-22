import { useState } from 'react';
import {
    BehandlingsmenyDialog,
    BehandlingsmenyValg,
} from '~/lib/behandling-felles/meny/BehandlingsmenyValg';
import { useSak } from '~/lib/sak/SakContext';
import { SakProps } from '~/lib/sak/SakTyper';
import { useNotification } from '~/lib/_felles/notifications/NotificationContext';
import {
    TilbakekrevingBehandling,
    TilbakekrevingBehandlingsstatus,
} from '~/lib/tilbakekreving/typer/Tilbakekreving';
import { TilbakekrevingDialoger } from './TilbakekrevingDialoger';

type Props = {
    tilbakekreving: TilbakekrevingBehandling;
};

/**
 * Menyen for en tilbakekreving i personoversikten.
 * Saken i konteksten oppdateres med svaret fra backend, siden vi ikke henter den på nytt fra serveren.
 */
export const TilbakekrevingMeny = ({ tilbakekreving }: Props) => {
    const { id, sakId, status, saksbehandler, beslutter, gyldigeKommandoer } = tilbakekreving;

    const { setSak } = useSak();
    const { setNotification } = useNotification();

    const [aktivDialog, setAktivDialog] = useState<BehandlingsmenyDialog | null>(null);

    const onClose = () => setAktivDialog(null);

    const overtarFra =
        status === TilbakekrevingBehandlingsstatus.UNDER_GODKJENNING
            ? (beslutter ?? 'Ukjent beslutter')
            : (saksbehandler ?? 'Ukjent saksbehandler');

    const onSuccess = (melding: string) => (oppdatertSak: SakProps) => {
        onClose();
        setSak(oppdatertSak);
        setNotification(melding);
    };

    return (
        <>
            <BehandlingsmenyValg
                gyldigeKommandoer={gyldigeKommandoer}
                onVelg={(dialog) => setAktivDialog(dialog)}
                size={'small'}
            />

            <TilbakekrevingDialoger
                tilbakekrevingId={id}
                sakId={sakId}
                gyldigeKommandoer={gyldigeKommandoer}
                overtarFra={overtarFra}
                aktivDialog={aktivDialog}
                onClose={onClose}
                onSuccessTildelt={onSuccess}
                onSuccessLagtTilbake={onSuccess}
            />
        </>
    );
};
