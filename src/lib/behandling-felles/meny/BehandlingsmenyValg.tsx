import { ActionMenu, Button } from '@navikt/ds-react';
import {
    ArrowUndoIcon,
    ArrowsSquarepathIcon,
    MenuElipsisVerticalIcon,
    PauseIcon,
    PersonIcon,
    PlayIcon,
    TrashIcon,
} from '@navikt/aksel-icons';
import { ComponentProps, ReactNode } from 'react';
import { SaksbehandlerBehandlingKommando as Kommando } from '~/lib/behandling-felles/typer/BehandlingFelles';

import style from './BehandlingsmenyValg.module.css';

/**
 * Dialogene menyen kan åpne. Hvilken komponent som hører til hvilken dialog
 * avgjør den som bruker menyen (rammebehandling og meldekortbehandling har hvert sitt sett).
 */
export type BehandlingsmenyDialog =
    | 'tildelMeg'
    | 'gjenoppta'
    | 'leggTilbake'
    | 'settPåVent'
    | 'overta'
    | 'avslutt';

export type BehandlingsmenyKapabiliteter = Record<BehandlingsmenyDialog, boolean>;

/**
 * Hvilke handlinger menyen kan tilby, utledet fra kommandoene backend har
 * regnet ut som gyldige for den innloggede saksbehandleren.
 * Brukes både til å vise menyvalgene og til å avgjøre hvilke dialoger som skal monteres.
 */
export const behandlingsmenyKapabiliteter = (
    gyldigeKommandoer: Kommando[],
): BehandlingsmenyKapabiliteter => {
    const harKommando = (...kommandoer: Kommando[]) =>
        kommandoer.some((kommando) => gyldigeKommandoer.includes(kommando));

    return {
        tildelMeg: harKommando(Kommando.TildelSaksbehandler, Kommando.TildelBeslutter),
        gjenoppta: harKommando(Kommando.Gjenoppta),
        leggTilbake: harKommando(Kommando.LeggTilbakeSaksbehandler, Kommando.LeggTilbakeBeslutter),
        settPåVent: harKommando(Kommando.SettPåVent),
        overta: harKommando(Kommando.OvertaSaksbehandler, Kommando.OvertaBeslutter),
        avslutt: harKommando(Kommando.Avbryt),
    };
};

type Props = {
    gyldigeKommandoer: Kommando[];
    onVelg: (dialog: BehandlingsmenyDialog) => void;
    size?: ComponentProps<typeof Button>['size'];
    /** Ekstra menyvalg mellom handlingene og avslutt (f.eks. ventehistorikk og attesteringer) */
    ekstraValg?: ReactNode;
};

/**
 * Menyvalgene for en behandling, styrt av hvilke kommandoer backend har
 * regnet ut som gyldige for den innloggede saksbehandleren.
 */
export const BehandlingsmenyValg = ({ gyldigeKommandoer, onVelg, size, ekstraValg }: Props) => {
    if (gyldigeKommandoer.length === 0 && !ekstraValg) {
        return null;
    }

    const kapabiliteter = behandlingsmenyKapabiliteter(gyldigeKommandoer);
    const kanTa = kapabiliteter.tildelMeg;
    const kanGjenoppta = kapabiliteter.gjenoppta;
    const kanLeggeTilbake = kapabiliteter.leggTilbake;
    const kanSettePåVent = kapabiliteter.settPåVent;
    const kanOverta = kapabiliteter.overta;
    const kanAvslutte = kapabiliteter.avslutt;

    return (
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
                        onSelect={() => onVelg('tildelMeg')}
                    >
                        {'Tildel meg'}
                    </ActionMenu.Item>
                )}

                {kanGjenoppta && (
                    <ActionMenu.Item
                        icon={<PlayIcon aria-hidden />}
                        onSelect={() => onVelg('gjenoppta')}
                    >
                        {'Gjenoppta'}
                    </ActionMenu.Item>
                )}

                {kanLeggeTilbake && (
                    <ActionMenu.Item
                        icon={<ArrowUndoIcon aria-hidden />}
                        onSelect={() => onVelg('leggTilbake')}
                    >
                        {'Legg tilbake'}
                    </ActionMenu.Item>
                )}

                {kanSettePåVent && (
                    <ActionMenu.Item
                        icon={<PauseIcon aria-hidden />}
                        onSelect={() => onVelg('settPåVent')}
                    >
                        {'Sett på vent'}
                    </ActionMenu.Item>
                )}

                {kanOverta && (
                    <ActionMenu.Item
                        icon={<ArrowsSquarepathIcon aria-hidden />}
                        onSelect={() => onVelg('overta')}
                    >
                        {'Overta behandling'}
                    </ActionMenu.Item>
                )}

                {ekstraValg && (
                    <>
                        <ActionMenu.Divider className={style.divider} />
                        {ekstraValg}
                    </>
                )}

                {kanAvslutte && (
                    <>
                        <ActionMenu.Divider className={style.divider} />
                        <ActionMenu.Item
                            variant={'danger'}
                            icon={<TrashIcon aria-hidden />}
                            onSelect={() => onVelg('avslutt')}
                        >
                            {'Avslutt behandling'}
                        </ActionMenu.Item>
                    </>
                )}
            </ActionMenu.Content>
        </ActionMenu>
    );
};
