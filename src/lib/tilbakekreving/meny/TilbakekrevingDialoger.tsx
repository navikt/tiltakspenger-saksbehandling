import {
    BehandlingsmenyDialog,
    behandlingsmenyKapabiliteter,
} from '~/lib/behandling-felles/meny/BehandlingsmenyValg';
import { SaksbehandlerBehandlingKommando } from '~/lib/behandling-felles/typer/BehandlingFelles';
import { SakId, SakProps } from '~/lib/sak/SakTyper';
import { TilbakekrevingId } from '~/lib/tilbakekreving/typer/Tilbakekreving';
import { TilbakekrevingTildelMeg } from './handlinger/TilbakekrevingTildelMeg';
import { TilbakekrevingLeggTilbake } from './handlinger/TilbakekrevingLeggTilbake';
import { TilbakekrevingOverta } from './handlinger/TilbakekrevingOverta';

type Props = {
    tilbakekrevingId: TilbakekrevingId;
    sakId: SakId;
    gyldigeKommandoer: SaksbehandlerBehandlingKommando[];
    /** NavIdenten til saksbehandleren/beslutteren som overtas fra */
    overtarFra: string;
    aktivDialog: BehandlingsmenyDialog | null;
    onClose: () => void;
    /** Kalles med en bekreftelse til saksbehandler når tilbakekrevingen er tildelt eller overtatt */
    onSuccessTildelt: (melding: string) => (oppdatertSak: SakProps) => void;
    /** Kalles med en bekreftelse til saksbehandler når tilbakekrevingen er lagt tilbake */
    onSuccessLagtTilbake: (melding: string) => (oppdatertSak: SakProps) => void;
};

/**
 * Dialogene for handlingene i behandlingsmenyen til en tilbakekreving.
 * Tilbakekrevingen behandles i tilbakekrevingsløsningen, så vi støtter kun tildeling, overtakelse og å legge tilbake.
 * Delt mellom personoversikten og benken, som selv bestemmer hva som skjer når handlingen er utført.
 */
export const TilbakekrevingDialoger = ({
    tilbakekrevingId,
    sakId,
    gyldigeKommandoer,
    overtarFra,
    aktivDialog,
    onClose,
    onSuccessTildelt,
    onSuccessLagtTilbake,
}: Props) => {
    const kapabiliteter = behandlingsmenyKapabiliteter(gyldigeKommandoer);

    return (
        <>
            {kapabiliteter.tildelMeg && (
                <TilbakekrevingTildelMeg
                    tilbakekrevingId={tilbakekrevingId}
                    sakId={sakId}
                    åpen={aktivDialog === 'tildelMeg'}
                    onClose={onClose}
                    onSuccess={onSuccessTildelt('Tilbakekrevingen er tildelt deg')}
                />
            )}

            {kapabiliteter.leggTilbake && (
                <TilbakekrevingLeggTilbake
                    tilbakekrevingId={tilbakekrevingId}
                    sakId={sakId}
                    åpen={aktivDialog === 'leggTilbake'}
                    onClose={onClose}
                    onSuccess={onSuccessLagtTilbake('Tilbakekrevingen er lagt tilbake')}
                />
            )}

            {kapabiliteter.overta && (
                <TilbakekrevingOverta
                    tilbakekrevingId={tilbakekrevingId}
                    overtarFra={overtarFra}
                    sakId={sakId}
                    åpen={aktivDialog === 'overta'}
                    onClose={onClose}
                    onSuccess={onSuccessTildelt('Du har overtatt tilbakekrevingen')}
                />
            )}
        </>
    );
};
