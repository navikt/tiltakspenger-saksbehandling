import { BenkSøknadsbehandling } from '~/lib/benk/typer/søknader';
import { ActionMenu, Button } from '@navikt/ds-react';
import { ChevronDownIcon } from '@navikt/aksel-icons';
import { SaksbehandlerBehandlingKommando } from '~/lib/behandling-felles/typer/BehandlingFelles';
import { BenkRevurdering } from '~/lib/benk/typer/revurderinger';
import { useBenkVisning } from '~/lib/benk/felles/filter/BenkVisningContext';

type Props = {
    behandlinger: Array<BenkSøknadsbehandling | BenkRevurdering>;
};

export const BenkTildelFlereMeny = ({ behandlinger }: Props) => {
    const behandlingerSomKanSaksbehandles = behandlinger.filter((behandling) => {
        return behandling.gyldigeKommandoer.includes(
            SaksbehandlerBehandlingKommando.TildelSaksbehandler,
        );
    });
    const behandlingerSomKanBesluttes = behandlinger.filter((behandling) => {
        return behandling.gyldigeKommandoer.includes(
            SaksbehandlerBehandlingKommando.TildelBeslutter,
        );
    });

    const kanSaksbehandle = behandlingerSomKanSaksbehandles.length > 0;

    const kanBeslutte = behandlingerSomKanBesluttes.length > 0;

    const { setValgtTildelingType } = useBenkVisning();

    if (!kanSaksbehandle && !kanBeslutte) return null;

    return (
        <ActionMenu>
            <ActionMenu.Trigger>
                <Button
                    size={'small'}
                    variant="secondary"
                    icon={<ChevronDownIcon aria-hidden />}
                    iconPosition="right"
                >
                    Tildel flere
                </Button>
            </ActionMenu.Trigger>
            <ActionMenu.Content>
                {kanSaksbehandle && (
                    <ActionMenu.Item onSelect={() => setValgtTildelingType('saksbehandler')}>
                        Ta som saksbehandler
                    </ActionMenu.Item>
                )}
                {kanBeslutte && (
                    <ActionMenu.Item onSelect={() => setValgtTildelingType('beslutter')}>
                        Ta som beslutter
                    </ActionMenu.Item>
                )}
            </ActionMenu.Content>
        </ActionMenu>
    );
};
