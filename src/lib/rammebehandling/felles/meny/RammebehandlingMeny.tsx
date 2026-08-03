import { ActionMenu, Button } from '@navikt/ds-react';
import {
    ArrowUndoIcon,
    ArrowsSquarepathIcon,
    BulletListIcon,
    HourglassTopFilledIcon,
    MenuElipsisVerticalIcon,
    PauseIcon,
    PersonIcon,
    PlayIcon,
    TrashIcon,
} from '@navikt/aksel-icons';
import { ComponentProps, useState } from 'react';
import { useRouter } from 'next/router';
import {
    BehandlingsmenyKallesFra,
    SaksbehandlerBehandlingKommando as Kommando,
} from '~/lib/behandling-felles/typer/BehandlingFelles';
import { OppsummeringAvVentestatuserModal } from '~/lib/behandling-felles/oppsummeringer/ventestatus/OppsummeringAvVentestatuser';
import { OppsummeringAvAttesteringerModal } from '~/lib/behandling-felles/attestering/OppsummeringAvAttesteringerModal';
import { Rammebehandling, Rammebehandlingstype } from '~/lib/rammebehandling/typer/Rammebehandling';
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

import style from './RammebehandlingMeny.module.css';

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

    if (gyldigeKommandoer.length === 0 && !harVentestatuser && !harAttesteringer) {
        return null;
    }

    const harKommando = (...kommandoer: Kommando[]) =>
        kommandoer.some((kommando) => gyldigeKommandoer.includes(kommando));

    const kanTa = harKommando(Kommando.TildelSaksbehandler, Kommando.TildelBeslutter);
    const kanGjenoppta = harKommando(Kommando.Gjenoppta);
    const kanLeggeTilbake = harKommando(
        Kommando.LeggTilbakeSaksbehandler,
        Kommando.LeggTilbakeBeslutter,
    );
    const kanSettePåVent = harKommando(Kommando.SettPåVent);
    const kanOverta = harKommando(Kommando.OvertaSaksbehandler, Kommando.OvertaBeslutter);
    const kanAvslutte = harKommando(Kommando.Avbryt);

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

    return (
        <>
            <ActionMenu>
                <ActionMenu.Trigger>
                    <Button
                        variant={'secondary'}
                        icon={<MenuElipsisVerticalIcon aria-hidden />}
                        iconPosition={'right'}
                        size={size}
                    >
                        {'Meny'}
                    </Button>
                </ActionMenu.Trigger>
                <ActionMenu.Content>
                    {kanTa && (
                        <ActionMenu.Item
                            icon={<PersonIcon aria-hidden />}
                            onSelect={() => setAktivDialog('tildelMeg')}
                        >
                            {'Tildel meg'}
                        </ActionMenu.Item>
                    )}

                    {kanGjenoppta && (
                        <ActionMenu.Item
                            icon={<PlayIcon aria-hidden />}
                            onSelect={() => setAktivDialog('gjenoppta')}
                        >
                            {'Gjenoppta'}
                        </ActionMenu.Item>
                    )}

                    {kanLeggeTilbake && (
                        <ActionMenu.Item
                            icon={<ArrowUndoIcon aria-hidden />}
                            onSelect={() => setAktivDialog('leggTilbake')}
                        >
                            {'Legg tilbake'}
                        </ActionMenu.Item>
                    )}

                    {kanSettePåVent && (
                        <ActionMenu.Item
                            icon={<PauseIcon aria-hidden />}
                            onSelect={() => setAktivDialog('settPåVent')}
                        >
                            {'Sett på vent'}
                        </ActionMenu.Item>
                    )}

                    {kanOverta && (
                        <ActionMenu.Item
                            icon={<ArrowsSquarepathIcon aria-hidden />}
                            onSelect={() => setAktivDialog('overta')}
                        >
                            {'Overta behandling'}
                        </ActionMenu.Item>
                    )}

                    {(harVentestatuser || harAttesteringer) && (
                        <ActionMenu.Divider className={style.divider} />
                    )}

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

                    {kanAvslutte && (
                        <>
                            <ActionMenu.Divider className={style.divider} />
                            <ActionMenu.Item
                                variant={'danger'}
                                icon={<TrashIcon aria-hidden />}
                                onSelect={() => setAktivDialog('avslutt')}
                            >
                                {'Avslutt behandling'}
                            </ActionMenu.Item>
                        </>
                    )}
                </ActionMenu.Content>
            </ActionMenu>

            {kanTa && (
                <RammebehandlingTildelMeg
                    behandling={behandling}
                    åpen={aktivDialog === 'tildelMeg'}
                    onClose={onClose}
                    onSuccess={onSuccessTilBehandling}
                />
            )}

            {kanGjenoppta && (
                <RammebehandlingGjenoppta
                    behandling={behandling}
                    åpen={aktivDialog === 'gjenoppta'}
                    onClose={onClose}
                    onSuccess={onSuccessTilBehandling}
                />
            )}

            {kanLeggeTilbake && (
                <RammebehandlingLeggTilbake
                    behandling={behandling}
                    åpen={aktivDialog === 'leggTilbake'}
                    onClose={onClose}
                    onSuccess={onSuccessTilPersonoversikt(
                        PersonoversiktTab.ÅpneBehandlinger,
                        'Behandlingen er lagt tilbake',
                    )}
                />
            )}

            {kanSettePåVent && (
                <RammebehandlingSettPåVent
                    behandling={behandling}
                    åpen={aktivDialog === 'settPåVent'}
                    onClose={onClose}
                    onSuccess={onSuccessTilPersonoversikt(
                        PersonoversiktTab.ÅpneBehandlinger,
                        'Behandlingen er satt på vent',
                    )}
                />
            )}

            {kanOverta && (
                <RammebehandlingOverta
                    behandling={behandling}
                    åpen={aktivDialog === 'overta'}
                    onClose={onClose}
                    onSuccess={onSuccessTilBehandling}
                />
            )}

            {kanAvslutte && (
                <RammebehandlingAvslutt
                    behandling={behandling}
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

type AktivDialog =
    | 'tildelMeg'
    | 'gjenoppta'
    | 'leggTilbake'
    | 'settPåVent'
    | 'overta'
    | 'avslutt'
    | 'ventehistorikk'
    | 'attesteringer';
