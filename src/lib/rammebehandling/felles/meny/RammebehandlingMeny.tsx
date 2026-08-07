import { ActionMenu, Button } from '@navikt/ds-react';
import { BulletListIcon, HourglassTopFilledIcon } from '@navikt/aksel-icons';
import { ComponentProps, useState } from 'react';
import { useRouter } from 'next/router';
import { BehandlingsmenyKallesFra } from '~/lib/behandling-felles/typer/BehandlingFelles';
import {
    BehandlingsmenyDialog,
    behandlingsmenyKapabiliteter,
    BehandlingsmenyValg,
} from '~/lib/behandling-felles/meny/BehandlingsmenyValg';
import { OppsummeringAvVentestatuserModal } from '~/lib/behandling-felles/oppsummeringer/ventestatus/OppsummeringAvVentestatuser';
import { OppsummeringAvAttesteringerModal } from '~/lib/behandling-felles/attestering/OppsummeringAvAttesteringerModal';
import {
    Rammebehandling,
    Rammebehandlingsstatus,
    Rammebehandlingstype,
} from '~/lib/rammebehandling/typer/Rammebehandling';
import { RammebehandlingTildelMeg } from '~/lib/rammebehandling/felles/meny/handlinger/RammebehandlingTildelMeg';
import { RammebehandlingGjenoppta } from '~/lib/rammebehandling/felles/meny/handlinger/RammebehandlingGjenoppta';
import { RammebehandlingLeggTilbake } from '~/lib/rammebehandling/felles/meny/handlinger/RammebehandlingLeggTilbake';
import { RammebehandlingSettPåVent } from '~/lib/rammebehandling/felles/meny/handlinger/RammebehandlingSettPåVent';
import { RammebehandlingOverta } from '~/lib/rammebehandling/felles/meny/handlinger/RammebehandlingOverta';
import { RammebehandlingAvslutt } from '~/lib/rammebehandling/felles/meny/handlinger/RammebehandlingAvslutt';
import { useSak } from '~/lib/sak/SakContext';
import { SakProps } from '~/lib/sak/SakTyper';
import { useNotification } from '~/lib/_felles/notifications/NotificationContext';
import { PersonoversiktTab } from '~/lib/personoversikt/Personoversikt';
import { behandlingUrl, personoversiktUrl } from '~/utils/urls';

type Props = {
    behandling: Rammebehandling;
    /** Siden menyen vises på, som avgjør om handlingene navigerer eller oppdaterer saken */
    kallesFra: BehandlingsmenyKallesFra;
    size?: ComponentProps<typeof Button>['size'];
};

export const RammebehandlingMeny = ({ behandling, kallesFra, size }: Props) => {
    const { gyldigeKommandoer, ventestatus, attesteringer } = behandling;

    const { sak, setSak } = useSak();
    const router = useRouter();
    const { setNotification, navigateWithNotification } = useNotification();

    const [aktivDialog, setAktivDialog] = useState<AktivDialog | null>(null);

    const harVentestatuser = ventestatus.length > 0;
    const harAttesteringer = attesteringer.length > 0;

    const kapabiliteter = behandlingsmenyKapabiliteter(gyldigeKommandoer);

    const onClose = () => setAktivDialog(null);

    /**
     * Vi navigerer til behandlingen, med mindre menyen kalles fra behandlingen - da oppdaterer vi
     * saken i konteksten i stedet, siden vi ikke henter den på nytt fra serveren.
     */
    const onSuccessTilBehandling = (oppdatertSak: SakProps) => {
        onClose();

        if (kallesFra === 'behandling') {
            setSak(oppdatertSak);
        } else {
            router.push(behandlingUrl(behandling));
        }
    };

    /**
     * Vi navigerer til personoversikten, med mindre menyen kalles derfra - da oppdaterer vi saken
     * i konteksten i stedet, siden vi ikke henter den på nytt fra serveren.
     */
    const onSuccessTilPersonoversikt =
        (tab: PersonoversiktTab, melding: string) => (oppdatertSak: SakProps) => {
            onClose();

            if (kallesFra === 'personoversikt') {
                setSak(oppdatertSak);
                setNotification(melding);
            } else {
                navigateWithNotification(personoversiktUrl(sak.saksnummer, tab), melding);
            }
        };

    const erRevurdering = behandling.type === Rammebehandlingstype.REVURDERING;

    const overtarFra =
        behandling.status === Rammebehandlingsstatus.UNDER_BESLUTNING
            ? (behandling.beslutter ?? 'Ukjent beslutter')
            : (behandling.saksbehandler ?? 'Ukjent saksbehandler');

    return (
        <>
            <BehandlingsmenyValg
                gyldigeKommandoer={gyldigeKommandoer}
                onVelg={(dialog) => setAktivDialog(dialog)}
                size={size}
                ekstraValg={
                    harVentestatuser || harAttesteringer ? (
                        <>
                            {harVentestatuser && (
                                <ActionMenu.Item
                                    icon={<HourglassTopFilledIcon aria-hidden />}
                                    onSelect={() => setAktivDialog('ventehistorikk')}
                                >
                                    {'Se ventestatus-historikk'}
                                </ActionMenu.Item>
                            )}
                            {harAttesteringer && (
                                <ActionMenu.Item
                                    icon={<BulletListIcon aria-hidden />}
                                    onSelect={() => setAktivDialog('attesteringer')}
                                >
                                    {'Se attesteringer'}
                                </ActionMenu.Item>
                            )}
                        </>
                    ) : undefined
                }
            />

            {kapabiliteter.tildelMeg && (
                <RammebehandlingTildelMeg
                    behandlingId={behandling.id}
                    sakId={sak.sakId}
                    åpen={aktivDialog === 'tildelMeg'}
                    onClose={onClose}
                    onSuccess={onSuccessTilBehandling}
                />
            )}

            {kapabiliteter.gjenoppta && (
                <RammebehandlingGjenoppta
                    behandlingId={behandling.id}
                    sakId={sak.sakId}
                    åpen={aktivDialog === 'gjenoppta'}
                    onClose={onClose}
                    onSuccess={onSuccessTilBehandling}
                />
            )}

            {kapabiliteter.leggTilbake && (
                <RammebehandlingLeggTilbake
                    behandlingId={behandling.id}
                    sakId={sak.sakId}
                    åpen={aktivDialog === 'leggTilbake'}
                    onClose={onClose}
                    onSuccess={onSuccessTilPersonoversikt(
                        PersonoversiktTab.ÅpneBehandlinger,
                        'Behandlingen er lagt tilbake',
                    )}
                />
            )}

            {kapabiliteter.settPåVent && (
                <RammebehandlingSettPåVent
                    behandlingId={behandling.id}
                    sakId={sak.sakId}
                    åpen={aktivDialog === 'settPåVent'}
                    onClose={onClose}
                    onSuccess={onSuccessTilPersonoversikt(
                        PersonoversiktTab.ÅpneBehandlinger,
                        'Behandlingen er satt på vent',
                    )}
                />
            )}

            {kapabiliteter.overta && (
                <RammebehandlingOverta
                    behandlingId={behandling.id}
                    overtarFra={overtarFra}
                    sakId={sak.sakId}
                    åpen={aktivDialog === 'overta'}
                    onClose={onClose}
                    onSuccess={onSuccessTilBehandling}
                />
            )}

            {kapabiliteter.avslutt && (
                <RammebehandlingAvslutt
                    behandlingId={behandling.id}
                    erRevurdering={erRevurdering}
                    saksnummer={sak.saksnummer}
                    åpen={aktivDialog === 'avslutt'}
                    onClose={onClose}
                    onSuccess={onSuccessTilPersonoversikt(
                        PersonoversiktTab.AvsluttedeBehandlinger,
                        `${erRevurdering ? 'Revurderingen' : 'Behandlingen'} er avsluttet`,
                    )}
                />
            )}

            {harVentestatuser && (
                <OppsummeringAvVentestatuserModal
                    ventestatuser={ventestatus}
                    åpen={aktivDialog === 'ventehistorikk'}
                    onClose={onClose}
                />
            )}

            {harAttesteringer && (
                <OppsummeringAvAttesteringerModal
                    attesteringer={attesteringer}
                    åpen={aktivDialog === 'attesteringer'}
                    onClose={onClose}
                />
            )}
        </>
    );
};

type AktivDialog = BehandlingsmenyDialog | 'ventehistorikk' | 'attesteringer';
