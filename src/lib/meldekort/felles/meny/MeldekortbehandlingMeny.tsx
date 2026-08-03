import { ActionMenu, Button } from '@navikt/ds-react';
import {
    ArrowUndoIcon,
    ArrowsSquarepathIcon,
    PauseIcon,
    PersonIcon,
    PlayIcon,
    TrashIcon,
    MenuElipsisVerticalIcon,
    HourglassTopFilledIcon,
    BulletListIcon,
} from '@navikt/aksel-icons';
import { ComponentProps, useState } from 'react';
import {
    BehandlingsmenyKallesFra,
    SaksbehandlerBehandlingKommando as Kommando,
} from '~/lib/behandling-felles/typer/BehandlingFelles';
import { MeldekortbehandlingTildelMeg } from '~/lib/meldekort/felles/meny/handlinger/MeldekortbehandlingTildelMeg';
import { MeldekortbehandlingGjenoppta } from '~/lib/meldekort/felles/meny/handlinger/MeldekortbehandlingGjenoppta';
import { MeldekortbehandlingLeggTilbake } from '~/lib/meldekort/felles/meny/handlinger/MeldekortbehandlingLeggTilbake';
import { MeldekortbehandlingSettPåVent } from '~/lib/meldekort/felles/meny/handlinger/MeldekortbehandlingSettPåVent';
import { MeldekortbehandlingOverta } from '~/lib/meldekort/felles/meny/handlinger/MeldekortbehandlingOverta';
import { MeldekortbehandlingAvslutt } from '~/lib/meldekort/felles/meny/handlinger/MeldekortbehandlingAvslutt';
import { OppsummeringAvVentestatuserModal } from '~/lib/behandling-felles/oppsummeringer/ventestatus/OppsummeringAvVentestatuser';
import { OppsummeringAvAttesteringerModal } from '~/lib/behandling-felles/attestering/OppsummeringAvAttesteringerModal';
import { MeldekortbehandlingProps } from '~/lib/meldekort/typer/Meldekortbehandling';
import { useSak } from '~/lib/sak/SakContext';
import { SakProps } from '~/lib/sak/SakTyper';
import { useNotification } from '~/lib/_felles/notifications/NotificationContext';
import { PersonoversiktTab } from '~/lib/personoversikt/Personoversikt';
import { meldekortbehandlingUrl, personoversiktUrl } from '~/utils/urls';
import { useRouter } from 'next/router';

import style from './MeldekortbehandlingMeny.module.css';

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
                <MeldekortbehandlingTildelMeg
                    meldekortbehandling={meldekortbehandling}
                    åpen={aktivDialog === 'tildelMeg'}
                    onClose={onClose}
                    onSuccess={onSuccessTilBehandling}
                />
            )}

            {kanGjenoppta && (
                <MeldekortbehandlingGjenoppta
                    meldekortbehandling={meldekortbehandling}
                    åpen={aktivDialog === 'gjenoppta'}
                    onClose={onClose}
                    onSuccess={onSuccessTilBehandling}
                />
            )}

            {kanLeggeTilbake && (
                <MeldekortbehandlingLeggTilbake
                    meldekortbehandling={meldekortbehandling}
                    åpen={aktivDialog === 'leggTilbake'}
                    onClose={onClose}
                    onSuccess={onSuccessTilPersonoversikt('Meldekortbehandlingen er lagt tilbake')}
                />
            )}

            {kanSettePåVent && (
                <MeldekortbehandlingSettPåVent
                    meldekortbehandling={meldekortbehandling}
                    åpen={aktivDialog === 'settPåVent'}
                    onClose={onClose}
                    onSuccess={onSuccessTilPersonoversikt('Meldekortbehandlingen er satt på vent')}
                />
            )}

            {kanOverta && (
                <MeldekortbehandlingOverta
                    meldekortbehandling={meldekortbehandling}
                    åpen={aktivDialog === 'overta'}
                    onClose={onClose}
                    onSuccess={onSuccessTilBehandling}
                />
            )}

            {kanAvslutte && (
                <MeldekortbehandlingAvslutt
                    meldekortbehandling={meldekortbehandling}
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

type AktivDialog =
    | 'tildelMeg'
    | 'gjenoppta'
    | 'leggTilbake'
    | 'settPåVent'
    | 'overta'
    | 'avslutt'
    | 'ventehistorikk'
    | 'attesteringer';
