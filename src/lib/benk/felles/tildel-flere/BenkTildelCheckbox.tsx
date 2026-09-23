import { Checkbox } from '@navikt/ds-react';
import { useBenkVisning } from '../filter/BenkVisningContext';
import { SaksbehandlerBehandlingKommando } from '~/lib/behandling-felles/typer/BehandlingFelles';
import { BenkSøknadsbehandling } from '../../typer/søknader';
import { BenkRevurdering } from '../../typer/revurderinger';

type Props = {
    behandling: BenkSøknadsbehandling | BenkRevurdering;
};

export const BenkTildelCheckbox = ({ behandling }: Props) => {
    const { valgtTildelingType, toggleValgtTildeling } = useBenkVisning();

    const kanTildeleSaksbehandler =
        valgtTildelingType === 'saksbehandler' &&
        behandling.gyldigeKommandoer.includes(SaksbehandlerBehandlingKommando.TildelSaksbehandler);
    const kanTildeleBeslutter =
        valgtTildelingType === 'beslutter' &&
        behandling.gyldigeKommandoer.includes(SaksbehandlerBehandlingKommando.TildelBeslutter);

    return (
        (kanTildeleSaksbehandler || kanTildeleBeslutter) && (
            <Checkbox
                onChange={(event) => toggleValgtTildeling(behandling, event.target.checked)}
                size={'small'}
            >
                Tildel
            </Checkbox>
        )
    );
};
