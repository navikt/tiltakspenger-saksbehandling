import { useState } from 'react';
import { useRouter } from 'next/router';
import {
    BehandlingsmenyDialog,
    behandlingsmenyKapabiliteter,
    BehandlingsmenyValg,
} from '~/lib/behandling-felles/meny/BehandlingsmenyValg';
import { RammebehandlingTildelMeg } from '~/lib/rammebehandling/felles/meny/handlinger/RammebehandlingTildelMeg';
import { RammebehandlingGjenoppta } from '~/lib/rammebehandling/felles/meny/handlinger/RammebehandlingGjenoppta';
import { RammebehandlingLeggTilbake } from '~/lib/rammebehandling/felles/meny/handlinger/RammebehandlingLeggTilbake';
import { RammebehandlingSettPåVent } from '~/lib/rammebehandling/felles/meny/handlinger/RammebehandlingSettPåVent';
import { RammebehandlingOverta } from '~/lib/rammebehandling/felles/meny/handlinger/RammebehandlingOverta';
import { RammebehandlingAvslutt } from '~/lib/rammebehandling/felles/meny/handlinger/RammebehandlingAvslutt';
import { MeldekortbehandlingTildelMeg } from '~/lib/meldekort/felles/meny/handlinger/MeldekortbehandlingTildelMeg';
import { MeldekortbehandlingGjenoppta } from '~/lib/meldekort/felles/meny/handlinger/MeldekortbehandlingGjenoppta';
import { MeldekortbehandlingLeggTilbake } from '~/lib/meldekort/felles/meny/handlinger/MeldekortbehandlingLeggTilbake';
import { MeldekortbehandlingSettPåVent } from '~/lib/meldekort/felles/meny/handlinger/MeldekortbehandlingSettPåVent';
import { MeldekortbehandlingOverta } from '~/lib/meldekort/felles/meny/handlinger/MeldekortbehandlingOverta';
import { MeldekortbehandlingAvslutt } from '~/lib/meldekort/felles/meny/handlinger/MeldekortbehandlingAvslutt';
import { useNotification } from '~/lib/_felles/notifications/NotificationContext';
import { behandlingUrl, meldekortbehandlingUrl } from '~/utils/urls';
import { BenkV2Behandlingsstatus } from '../typer/felles';
import { BenkSøknadsbehandling } from '../typer/søknader';
import { BenkRevurdering } from '../typer/revurderinger';
import { BenkMeldekort } from '../typer/meldekort';
import { Rammebehandlingstype } from '~/lib/rammebehandling/typer/Rammebehandling';

type RammeProps = {
    behandling: BenkSøknadsbehandling | BenkRevurdering;
    behandlingstype: Rammebehandlingstype;
};

type MeldekortProps = {
    behandling: BenkMeldekort;
    behandlingstype: 'MELDEKORTBEHANDLING';
};

type Props = RammeProps | MeldekortProps;

/**
 * Menyen for en rad i benken - samme valg som menyene i personoversikten,
 * men drevet av radens gyldigeKommandoer i stedet for en full behandling.
 *
 * Handlinger som tar saksbehandler til behandlingen (tildel, overta, gjenoppta)
 * navigerer dit. Resten laster benken på nytt med en bekreftelse.
 */
export const BenkBehandlingMeny = (props: Props) => {
    const { behandling } = props;

    const router = useRouter();
    const { navigateWithNotification } = useNotification();

    const [aktivDialog, setAktivDialog] = useState<BehandlingsmenyDialog | null>(null);

    const kapabiliteter = behandlingsmenyKapabiliteter(behandling.gyldigeKommandoer);

    const onClose = () => setAktivDialog(null);

    const behandlingLenke =
        props.behandlingstype === 'MELDEKORTBEHANDLING'
            ? meldekortbehandlingUrl(props.behandling.saksnummer, props.behandling.id)
            : behandlingUrl({
                  saksnummer: props.behandling.saksnummer,
                  id: props.behandling.id,
              });

    const onSuccessTilBehandling = () => {
        onClose();
        router.push(behandlingLenke);
    };

    const onSuccessTilBenk = (melding: string) => () => {
        onClose();
        navigateWithNotification(router.asPath, melding);
    };

    const overtarFra =
        behandling.status === BenkV2Behandlingsstatus.UNDER_BESLUTNING
            ? (behandling.beslutter ?? 'Ukjent beslutter')
            : (behandling.saksbehandler ?? 'Ukjent saksbehandler');

    const erRevurdering = props.behandlingstype === Rammebehandlingstype.REVURDERING;

    return (
        <>
            <BehandlingsmenyValg
                gyldigeKommandoer={behandling.gyldigeKommandoer}
                onVelg={(dialog) => setAktivDialog(dialog)}
                size={'small'}
            />

            {props.behandlingstype === 'MELDEKORTBEHANDLING' ? (
                <MeldekortDialoger
                    props={props}
                    kapabiliteter={kapabiliteter}
                    aktivDialog={aktivDialog}
                    overtarFra={overtarFra}
                    onClose={onClose}
                    onSuccessTilBehandling={onSuccessTilBehandling}
                    onSuccessTilBenk={onSuccessTilBenk}
                />
            ) : (
                <RammeDialoger
                    props={props}
                    kapabiliteter={kapabiliteter}
                    aktivDialog={aktivDialog}
                    overtarFra={overtarFra}
                    erRevurdering={erRevurdering}
                    onClose={onClose}
                    onSuccessTilBehandling={onSuccessTilBehandling}
                    onSuccessTilBenk={onSuccessTilBenk}
                />
            )}
        </>
    );
};

type DialogerProps = {
    kapabiliteter: ReturnType<typeof behandlingsmenyKapabiliteter>;
    aktivDialog: BehandlingsmenyDialog | null;
    overtarFra: string;
    onClose: () => void;
    onSuccessTilBehandling: () => void;
    onSuccessTilBenk: (melding: string) => () => void;
};

const RammeDialoger = ({
    props,
    kapabiliteter,
    aktivDialog,
    overtarFra,
    erRevurdering,
    onClose,
    onSuccessTilBehandling,
    onSuccessTilBenk,
}: DialogerProps & { props: RammeProps; erRevurdering: boolean }) => {
    const { id, sakId, saksnummer } = props.behandling;

    return (
        <>
            {kapabiliteter.tildelMeg && (
                <RammebehandlingTildelMeg
                    behandlingId={id}
                    sakId={sakId}
                    åpen={aktivDialog === 'tildelMeg'}
                    onClose={onClose}
                    onSuccess={onSuccessTilBehandling}
                />
            )}

            {kapabiliteter.gjenoppta && (
                <RammebehandlingGjenoppta
                    behandlingId={id}
                    sakId={sakId}
                    åpen={aktivDialog === 'gjenoppta'}
                    onClose={onClose}
                    onSuccess={onSuccessTilBehandling}
                />
            )}

            {kapabiliteter.leggTilbake && (
                <RammebehandlingLeggTilbake
                    behandlingId={id}
                    sakId={sakId}
                    åpen={aktivDialog === 'leggTilbake'}
                    onClose={onClose}
                    onSuccess={onSuccessTilBenk('Behandlingen er lagt tilbake')}
                />
            )}

            {kapabiliteter.settPåVent && (
                <RammebehandlingSettPåVent
                    behandlingId={id}
                    sakId={sakId}
                    åpen={aktivDialog === 'settPåVent'}
                    onClose={onClose}
                    onSuccess={onSuccessTilBenk('Behandlingen er satt på vent')}
                />
            )}

            {kapabiliteter.overta && (
                <RammebehandlingOverta
                    behandlingId={id}
                    overtarFra={overtarFra}
                    sakId={sakId}
                    åpen={aktivDialog === 'overta'}
                    onClose={onClose}
                    onSuccess={onSuccessTilBehandling}
                />
            )}

            {kapabiliteter.avslutt && (
                <RammebehandlingAvslutt
                    behandlingId={id}
                    erRevurdering={erRevurdering}
                    saksnummer={saksnummer}
                    åpen={aktivDialog === 'avslutt'}
                    onClose={onClose}
                    onSuccess={onSuccessTilBenk(
                        `${erRevurdering ? 'Revurderingen' : 'Behandlingen'} er avsluttet`,
                    )}
                />
            )}
        </>
    );
};

const MeldekortDialoger = ({
    props,
    kapabiliteter,
    aktivDialog,
    overtarFra,
    onClose,
    onSuccessTilBehandling,
    onSuccessTilBenk,
}: DialogerProps & { props: MeldekortProps }) => {
    const { id, sakId } = props.behandling;

    return (
        <>
            {kapabiliteter.tildelMeg && (
                <MeldekortbehandlingTildelMeg
                    meldekortId={id}
                    sakId={sakId}
                    åpen={aktivDialog === 'tildelMeg'}
                    onClose={onClose}
                    onSuccess={onSuccessTilBehandling}
                />
            )}

            {kapabiliteter.gjenoppta && (
                <MeldekortbehandlingGjenoppta
                    meldekortId={id}
                    sakId={sakId}
                    åpen={aktivDialog === 'gjenoppta'}
                    onClose={onClose}
                    onSuccess={onSuccessTilBehandling}
                />
            )}

            {kapabiliteter.leggTilbake && (
                <MeldekortbehandlingLeggTilbake
                    meldekortId={id}
                    sakId={sakId}
                    åpen={aktivDialog === 'leggTilbake'}
                    onClose={onClose}
                    onSuccess={onSuccessTilBenk('Meldekortbehandlingen er lagt tilbake')}
                />
            )}

            {kapabiliteter.settPåVent && (
                <MeldekortbehandlingSettPåVent
                    meldekortId={id}
                    sakId={sakId}
                    åpen={aktivDialog === 'settPåVent'}
                    onClose={onClose}
                    onSuccess={onSuccessTilBenk('Meldekortbehandlingen er satt på vent')}
                />
            )}

            {kapabiliteter.overta && (
                <MeldekortbehandlingOverta
                    meldekortId={id}
                    overtarFra={overtarFra}
                    sakId={sakId}
                    åpen={aktivDialog === 'overta'}
                    onClose={onClose}
                    onSuccess={onSuccessTilBehandling}
                />
            )}

            {kapabiliteter.avslutt && (
                <MeldekortbehandlingAvslutt
                    meldekortId={id}
                    sakId={sakId}
                    åpen={aktivDialog === 'avslutt'}
                    onClose={onClose}
                    onSuccess={onSuccessTilBenk('Meldekortbehandlingen er avsluttet')}
                />
            )}
        </>
    );
};
