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
import { useState } from 'react';
import { SaksbehandlerBehandlingKommando as Kommando } from '~/lib/behandling-felles/typer/BehandlingFelles';
import { MeldekortbehandlingTildelMeg } from '~/lib/meldekort/meldekortbehandling/meny/handlinger/MeldekortbehandlingTildelMeg';
import { MeldekortbehandlingGjenoppta } from '~/lib/meldekort/meldekortbehandling/meny/handlinger/MeldekortbehandlingGjenoppta';
import { MeldekortbehandlingLeggTilbake } from '~/lib/meldekort/meldekortbehandling/meny/handlinger/MeldekortbehandlingLeggTilbake';
import { MeldekortbehandlingSettPåVent } from '~/lib/meldekort/meldekortbehandling/meny/handlinger/MeldekortbehandlingSettPåVent';
import { MeldekortbehandlingOverta } from '~/lib/meldekort/meldekortbehandling/meny/handlinger/MeldekortbehandlingOverta';
import { MeldekortbehandlingAvslutt } from '~/lib/meldekort/meldekortbehandling/meny/handlinger/MeldekortbehandlingAvslutt';
import { OppsummeringAvVentestatuserModal } from '~/lib/behandling-felles/oppsummeringer/ventestatus/OppsummeringAvVentestatuser';
import { OppsummeringAvAttesteringerModal } from '~/lib/behandling-felles/attestering/OppsummeringAvAttesteringerModal';
import { MeldekortbehandlingProps } from '~/lib/meldekort/typer/Meldekortbehandling';

import style from './MeldekortbehandlingMeny.module.css';

type Props = {
    meldekortbehandling: MeldekortbehandlingProps;
};

export const MeldekortbehandlingMeny = ({ meldekortbehandling }: Props) => {
    const { gyldigeKommandoer, ventestatus, attesteringer } = meldekortbehandling;

    const [aktivDialog, setAktivDialog] = useState<AktivDialog | null>(null);

    const onClose = () => setAktivDialog(null);

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

    return (
        <>
            <ActionMenu>
                <ActionMenu.Trigger>
                    <Button
                        variant={'secondary'}
                        icon={<MenuElipsisVerticalIcon aria-hidden />}
                        iconPosition={'right'}
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
                />
            )}

            {kanGjenoppta && (
                <MeldekortbehandlingGjenoppta
                    meldekortbehandling={meldekortbehandling}
                    åpen={aktivDialog === 'gjenoppta'}
                    onClose={onClose}
                />
            )}

            {kanLeggeTilbake && (
                <MeldekortbehandlingLeggTilbake
                    meldekortbehandling={meldekortbehandling}
                    åpen={aktivDialog === 'leggTilbake'}
                    onClose={onClose}
                />
            )}

            {kanSettePåVent && (
                <MeldekortbehandlingSettPåVent
                    meldekortbehandling={meldekortbehandling}
                    åpen={aktivDialog === 'settPåVent'}
                    onClose={onClose}
                />
            )}

            {kanOverta && (
                <MeldekortbehandlingOverta
                    meldekortbehandling={meldekortbehandling}
                    åpen={aktivDialog === 'overta'}
                    onClose={onClose}
                />
            )}

            {kanAvslutte && (
                <MeldekortbehandlingAvslutt
                    meldekortbehandling={meldekortbehandling}
                    åpen={aktivDialog === 'avslutt'}
                    onClose={onClose}
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
