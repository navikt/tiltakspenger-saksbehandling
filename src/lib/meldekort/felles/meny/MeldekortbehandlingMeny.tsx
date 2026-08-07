import { ActionMenu, Button } from '@navikt/ds-react';
import { BulletListIcon, HourglassTopFilledIcon } from '@navikt/aksel-icons';
import { ComponentProps, useState } from 'react';
import { BehandlingsmenyKallesFra } from '~/lib/behandling-felles/typer/BehandlingFelles';
import {
    BehandlingsmenyDialog,
    behandlingsmenyKapabiliteter,
    BehandlingsmenyValg,
} from '~/lib/behandling-felles/meny/BehandlingsmenyValg';
import { MeldekortbehandlingTildelMeg } from '~/lib/meldekort/felles/meny/handlinger/MeldekortbehandlingTildelMeg';
import { MeldekortbehandlingGjenoppta } from '~/lib/meldekort/felles/meny/handlinger/MeldekortbehandlingGjenoppta';
import { MeldekortbehandlingLeggTilbake } from '~/lib/meldekort/felles/meny/handlinger/MeldekortbehandlingLeggTilbake';
import { MeldekortbehandlingSettPåVent } from '~/lib/meldekort/felles/meny/handlinger/MeldekortbehandlingSettPåVent';
import { MeldekortbehandlingOverta } from '~/lib/meldekort/felles/meny/handlinger/MeldekortbehandlingOverta';
import { MeldekortbehandlingAvslutt } from '~/lib/meldekort/felles/meny/handlinger/MeldekortbehandlingAvslutt';
import { OppsummeringAvVentestatuserModal } from '~/lib/behandling-felles/oppsummeringer/ventestatus/OppsummeringAvVentestatuser';
import { OppsummeringAvAttesteringerModal } from '~/lib/behandling-felles/attestering/OppsummeringAvAttesteringerModal';
import {
    MeldekortbehandlingProps,
    MeldekortbehandlingStatus,
} from '~/lib/meldekort/typer/Meldekortbehandling';
import { useSak } from '~/lib/sak/SakContext';
import { SakProps } from '~/lib/sak/SakTyper';
import { useNotification } from '~/lib/_felles/notifications/NotificationContext';
import { PersonoversiktTab } from '~/lib/personoversikt/Personoversikt';
import { meldekortbehandlingUrl, personoversiktUrl } from '~/utils/urls';
import { useRouter } from 'next/router';

type Props = {
    meldekortbehandling: MeldekortbehandlingProps;
    /** Siden menyen vises på, som avgjør om handlingene navigerer eller oppdaterer saken */
    kallesFra: BehandlingsmenyKallesFra;
    size?: ComponentProps<typeof Button>['size'];
};

export const MeldekortbehandlingMeny = ({ meldekortbehandling, kallesFra, size }: Props) => {
    const { gyldigeKommandoer, ventestatus, attesteringer } = meldekortbehandling;

    const { sak, setSak } = useSak();
    const router = useRouter();
    const { setNotification, navigateWithNotification } = useNotification();

    const [aktivDialog, setAktivDialog] = useState<AktivDialog | null>(null);

    const harVentestatuser = ventestatus.length > 0;
    const harAttesteringer = attesteringer.length > 0;

    const kapabiliteter = behandlingsmenyKapabiliteter(gyldigeKommandoer);

    const onClose = () => setAktivDialog(null);

    /**
     * Vi navigerer til meldekortbehandlingen, med mindre menyen kalles fra behandlingen - da
     * oppdaterer vi saken i konteksten i stedet, siden vi ikke henter den på nytt fra serveren.
     */
    const onSuccessTilBehandling = (oppdatertSak: SakProps) => {
        onClose();

        if (kallesFra === 'behandling') {
            setSak(oppdatertSak);
        } else {
            router.push(meldekortbehandlingUrl(sak.saksnummer, meldekortbehandling.id));
        }
    };

    /**
     * Vi navigerer til personoversikten, med mindre menyen kalles derfra - da oppdaterer vi saken
     * i konteksten i stedet, siden vi ikke henter den på nytt fra serveren.
     */
    const onSuccessTilPersonoversikt = (melding: string) => (oppdatertSak: SakProps) => {
        onClose();

        if (kallesFra === 'personoversikt') {
            setSak(oppdatertSak);
            setNotification(melding);
        } else {
            navigateWithNotification(
                personoversiktUrl(sak.saksnummer, PersonoversiktTab.Meldekort),
                melding,
            );
        }
    };

    const overtarFra =
        meldekortbehandling.status === MeldekortbehandlingStatus.UNDER_BEHANDLING
            ? (meldekortbehandling.saksbehandler ?? 'Ukjent saksbehandler')
            : meldekortbehandling.status === MeldekortbehandlingStatus.UNDER_BESLUTNING
              ? (meldekortbehandling.beslutter ?? 'Ukjent beslutter')
              : 'Ukjent saksbehandler/beslutter';

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
                <MeldekortbehandlingTildelMeg
                    meldekortId={meldekortbehandling.id}
                    sakId={sak.sakId}
                    åpen={aktivDialog === 'tildelMeg'}
                    onClose={onClose}
                    onSuccess={onSuccessTilBehandling}
                />
            )}

            {kapabiliteter.gjenoppta && (
                <MeldekortbehandlingGjenoppta
                    meldekortId={meldekortbehandling.id}
                    sakId={sak.sakId}
                    åpen={aktivDialog === 'gjenoppta'}
                    onClose={onClose}
                    onSuccess={onSuccessTilBehandling}
                />
            )}

            {kapabiliteter.leggTilbake && (
                <MeldekortbehandlingLeggTilbake
                    meldekortId={meldekortbehandling.id}
                    sakId={sak.sakId}
                    åpen={aktivDialog === 'leggTilbake'}
                    onClose={onClose}
                    onSuccess={onSuccessTilPersonoversikt('Meldekortbehandlingen er lagt tilbake')}
                />
            )}

            {kapabiliteter.settPåVent && (
                <MeldekortbehandlingSettPåVent
                    meldekortId={meldekortbehandling.id}
                    sakId={sak.sakId}
                    åpen={aktivDialog === 'settPåVent'}
                    onClose={onClose}
                    onSuccess={onSuccessTilPersonoversikt('Meldekortbehandlingen er satt på vent')}
                />
            )}

            {kapabiliteter.overta && (
                <MeldekortbehandlingOverta
                    meldekortId={meldekortbehandling.id}
                    overtarFra={overtarFra}
                    sakId={sak.sakId}
                    åpen={aktivDialog === 'overta'}
                    onClose={onClose}
                    onSuccess={onSuccessTilBehandling}
                />
            )}

            {kapabiliteter.avslutt && (
                <MeldekortbehandlingAvslutt
                    meldekortId={meldekortbehandling.id}
                    sakId={sak.sakId}
                    åpen={aktivDialog === 'avslutt'}
                    onClose={onClose}
                    onSuccess={onSuccessTilPersonoversikt('Meldekortbehandlingen er avsluttet')}
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
