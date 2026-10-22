import { Checkbox } from '@navikt/ds-react';
import { BehandlingSomKanBatchTildeles, useBenkVisning } from '../filter/BenkVisningContext';
import { SaksbehandlerBehandlingKommando } from '~/lib/behandling-felles/typer/BehandlingFelles';

type Props = {
    behandling: BehandlingSomKanBatchTildeles;
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
