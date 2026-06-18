import { ActionMenu, Button } from '@navikt/ds-react';
import {
    ArrowUndoIcon,
    ArrowsSquarepathIcon,
    ChevronDownIcon,
    PauseIcon,
    PersonIcon,
    PlayIcon,
    TrashIcon,
} from '@navikt/aksel-icons';
import { useState } from 'react';
import { useMeldekortbehandling } from '~/lib/meldekort/v2/meldekortbehandling/context/MeldekortbehandlingV2Context';
import { SaksbehandlerBehandlingKommando as Kommando } from '~/lib/behandling-felles/typer/BehandlingFelles';
import { MeldekortbehandlingTildelMeg } from '~/lib/meldekort/v2/meldekortbehandling/handlinger-meny/handlinger/MeldekortbehandlingTildelMeg';
import { MeldekortbehandlingGjenoppta } from '~/lib/meldekort/v2/meldekortbehandling/handlinger-meny/handlinger/MeldekortbehandlingGjenoppta';
import { MeldekortbehandlingLeggTilbake } from '~/lib/meldekort/v2/meldekortbehandling/handlinger-meny/handlinger/MeldekortbehandlingLeggTilbake';
import { MeldekortbehandlingSettPåVent } from '~/lib/meldekort/v2/meldekortbehandling/handlinger-meny/handlinger/MeldekortbehandlingSettPåVent';
import { MeldekortbehandlingOverta } from '~/lib/meldekort/v2/meldekortbehandling/handlinger-meny/handlinger/MeldekortbehandlingOverta';
import { MeldekortbehandlingAvslutt } from '~/lib/meldekort/v2/meldekortbehandling/handlinger-meny/handlinger/MeldekortbehandlingAvslutt';

type AktivDialog = 'tildelMeg' | 'gjenoppta' | 'leggTilbake' | 'settPåVent' | 'overta' | 'avslutt';

export const MeldekortbehandlingHandlingerMeny = () => {
    const meldekortbehandling = useMeldekortbehandling();

    const [aktivDialog, setAktivDialog] = useState<AktivDialog | null>(null);

    const gyldigeKommandoer = meldekortbehandling.gyldigeKommandoer;

    if (gyldigeKommandoer.length === 0) {
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
                        icon={<ChevronDownIcon aria-hidden />}
                        iconPosition={'right'}
                        size={'small'}
                    >
                        {'Flere handlinger'}
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

                    {kanAvslutte && (
                        <>
                            <ActionMenu.Divider />
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
                    åpen={aktivDialog === 'tildelMeg'}
                    onClose={() => setAktivDialog(null)}
                />
            )}

            {kanGjenoppta && (
                <MeldekortbehandlingGjenoppta
                    åpen={aktivDialog === 'gjenoppta'}
                    onClose={() => setAktivDialog(null)}
                />
            )}

            {kanLeggeTilbake && (
                <MeldekortbehandlingLeggTilbake
                    åpen={aktivDialog === 'leggTilbake'}
                    onClose={() => setAktivDialog(null)}
                />
            )}

            {kanSettePåVent && (
                <MeldekortbehandlingSettPåVent
                    åpen={aktivDialog === 'settPåVent'}
                    onClose={() => setAktivDialog(null)}
                />
            )}

            {kanOverta && (
                <MeldekortbehandlingOverta
                    åpen={aktivDialog === 'overta'}
                    onClose={() => setAktivDialog(null)}
                />
            )}

            {kanAvslutte && (
                <MeldekortbehandlingAvslutt
                    åpen={aktivDialog === 'avslutt'}
                    onClose={() => setAktivDialog(null)}
                />
            )}
        </>
    );
};
