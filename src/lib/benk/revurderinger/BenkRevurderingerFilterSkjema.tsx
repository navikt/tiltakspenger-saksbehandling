import { BenkTab } from '../typer/tabs';
import { benkBehandlingsstatusTekst } from '../utils/benkTekster';
import { revurderingResultatTekst } from '~/lib/rammebehandling/rammebehandlingTekster';
import { useBenkFilterSkjema } from '../felles/filter/useBenkFilterSkjema';
import BenkFilterSkjema from '../felles/filter/BenkFilterSkjema';
import { BenkFilterSelect } from '../felles/filter/BenkFilterSelect';
import { BenkSaksbehandlerSelect } from '../felles/filter/BenkSaksbehandlerSelect';
import { BenkFaneFilterProps } from '../typer/benkside';

export const BenkRevurderingerFilterSkjema = ({
    aktivtFilter,
    saksbehandlere,
    besluttere,
}: BenkFaneFilterProps<BenkTab.REVURDERINGER>) => {
    const skjema = useBenkFilterSkjema(BenkTab.REVURDERINGER, aktivtFilter);
    const { valgtFilter, endreFilter } = skjema;

    return (
        <BenkFilterSkjema skjema={skjema} visKunTildeltMeg={true}>
            <BenkFilterSelect
                label={'Status'}
                value={valgtFilter.status}
                onChange={(status) => endreFilter({ status })}
                alternativer={benkBehandlingsstatusTekst}
            />

            <BenkFilterSelect
                label={'Resultat'}
                value={valgtFilter.resultat}
                onChange={(resultat) => endreFilter({ resultat })}
                alternativer={revurderingResultatTekst}
            />

            <BenkSaksbehandlerSelect
                skjema={skjema}
                saksbehandlere={saksbehandlere}
                besluttere={besluttere}
            />
        </BenkFilterSkjema>
    );
};
