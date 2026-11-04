import { ActionMenu, Button } from '@navikt/ds-react';
import { ArrowsSquarepathIcon, BulletListIcon, HourglassTopFilledIcon } from '@navikt/aksel-icons';
import { ComponentProps, useState } from 'react';
import { useRouter } from 'next/router';
import {
    BehandlingsmenyKallesFra,
    SaksbehandlerBehandlingKommando,
} from '~/lib/behandling-felles/typer/BehandlingFelles';
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
import { RammebehandlingGjenåpne } from '~/lib/rammebehandling/felles/meny/handlinger/RammebehandlingGjenåpne';
import { useSak } from '~/lib/sak/SakContext';
import { useFeatureToggles } from '~/lib/_felles/context/FeatureTogglesContext';
import { SakProps } from '~/lib/sak/SakTyper';
import { useNotification } from '~/lib/_felles/notifications/NotificationContext';
import { PersonoversiktTab } from '~/lib/personoversikt/Personoversikt';
import { behandlingUrl, personoversiktUrl } from '~/utils/urls';
import { RammebehandlingAngre } from '~/lib/rammebehandling/felles/meny/handlinger/RammebehandlingAngre';
import { RammebehandlingHentTilbake } from '~/lib/rammebehandling/felles/meny/handlinger/RammebehandlingHentTilbake';
import {
    KonverterRevurderingTil,
    konverteringsalternativer,
    konverterRevurderingTilTekst,
    RammebehandlingKonverter,
} from '~/lib/rammebehandling/felles/meny/handlinger/RammebehandlingKonverter';

type Props = {
    behandling: Rammebehandling;
    /** Siden menyen vises på, som avgjør om handlingene navigerer eller oppdaterer saken */
    kallesFra: BehandlingsmenyKallesFra;
    size?: ComponentProps<typeof Button>['size'];
};

export const RammebehandlingMeny = ({ behandling, kallesFra, size }: Props) => {
    const { gyldigeKommandoer, ventestatus, attesteringer } = behandling;

    const { sak, setSak } = useSak();
    const { konverterRevurderingToggle } = useFeatureToggles();
    const router = useRouter();
    const { setNotification, navigateWithNotification } = useNotification();

    const [aktivDialog, setAktivDialog] = useState<AktivDialog | null>(null);
    const [konverterTil, setKonverterTil] = useState<KonverterRevurderingTil | null>(null);

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

    const konverteringsvalg =
        konverterRevurderingToggle &&
        erRevurdering &&
        gyldigeKommandoer.includes(SaksbehandlerBehandlingKommando.KonverterRevurdering)
            ? konverteringsalternativer(behandling.resultat)
            : [];

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
                egneHandlinger={
                    konverteringsvalg.length > 0 ? (
                        <ActionMenu.Sub>
                            <ActionMenu.SubTrigger icon={<ArrowsSquarepathIcon aria-hidden />}>
                                {'Endre type'}
                            </ActionMenu.SubTrigger>
                            <ActionMenu.SubContent>
                                {konverteringsvalg.map((til) => (
                                    <ActionMenu.Item
                                        key={til}
                                        onSelect={() => {
                                            setKonverterTil(til);
                                            setAktivDialog('konverter');
                                        }}
                                    >
                                        {konverterRevurderingTilTekst[til]}
                                    </ActionMenu.Item>
                                ))}
                            </ActionMenu.SubContent>
                        </ActionMenu.Sub>
                    ) : undefined
                }
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
                    kallesFra={kallesFra}
                    onClose={onClose}
                    onSuccess={onSuccessTilBehandling}
                />
            )}

            {kapabiliteter.angreSendTilBeslutning && (
                <RammebehandlingAngre
                    behandlingId={behandling.id}
                    sakId={sak.sakId}
                    åpen={aktivDialog === 'angreSendTilBeslutning'}
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

            {kapabiliteter.hentTilbake && (
                <RammebehandlingHentTilbake
                    sakId={sak.sakId}
                    saksnummer={sak.saksnummer}
                    behandlingId={behandling.id}
                    åpen={aktivDialog === 'hentTilbake'}
                    onClose={onClose}
                    onSuccess={onSuccessTilBehandling}
                />
            )}

            {konverterTil && (
                <RammebehandlingKonverter
                    sakId={sak.sakId}
                    saksnummer={sak.saksnummer}
                    behandlingId={behandling.id}
                    til={konverterTil}
                    alleRammevedtak={sak.alleRammevedtak}
                    åpen={aktivDialog === 'konverter'}
                    onClose={onClose}
                    onSuccess={onSuccessTilBehandling}
                />
            )}

            {kapabiliteter.settPåVent && (
                <RammebehandlingSettPåVent
                    behandlingId={behandling.id}
                    sakId={sak.sakId}
                    oppdaterSattPåVent={false}
                    åpen={aktivDialog === 'settPåVent'}
                    onClose={onClose}
                    onSuccess={onSuccessTilPersonoversikt(
                        PersonoversiktTab.ÅpneBehandlinger,
                        'Behandlingen er satt på vent',
                    )}
                />
            )}

            {kapabiliteter.oppdatereSettPåVent && (
                <RammebehandlingSettPåVent
                    behandlingId={behandling.id}
                    sakId={sak.sakId}
                    oppdaterSattPåVent={true}
                    åpen={aktivDialog === 'oppdatereSettPåVent'}
                    onClose={onClose}
                    onSuccess={onSuccessTilPersonoversikt(
                        PersonoversiktTab.ÅpneBehandlinger,
                        'Ventestatusen er endret',
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
                        PersonoversiktTab.ÅpneBehandlinger,
                        `${erRevurdering ? 'Revurderingen' : 'Behandlingen'} er avsluttet`,
                    )}
                />
            )}

            {kapabiliteter.gjenåpne && (
                <RammebehandlingGjenåpne
                    behandlingId={behandling.id}
                    sakId={sak.sakId}
                    åpen={aktivDialog === 'gjenåpne'}
                    onClose={onClose}
                    onSuccess={(nyBehandling) => {
                        onClose();
                        navigateWithNotification(
                            behandlingUrl({ saksnummer: sak.saksnummer, id: nyBehandling.id }),
                            'Søknaden er gjenåpnet, og en ny behandling er opprettet',
                        );
                    }}
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

type AktivDialog = BehandlingsmenyDialog | 'konverter' | 'ventehistorikk' | 'attesteringer';
