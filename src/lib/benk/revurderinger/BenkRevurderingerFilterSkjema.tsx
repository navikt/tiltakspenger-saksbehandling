import { BenkTab } from '../typer/tabs';
import { benkBehandlingsstatusTekst } from '../utils/benkTekster';
import { revurderingResultatTekst } from '~/lib/rammebehandling/rammebehandlingTekster';
import { useBenkFilterSkjema } from '../felles/filter/useBenkFilterSkjema';
import { BenkFaneFilterSkjemaProps, BenkFilterSkjema } from '../felles/filter/BenkFilterSkjema';
import { BenkFilterSelect } from '../felles/filter/BenkFilterSelect';

export const BenkRevurderingerFilterSkjema = ({
    aktivtFilter,
    ...props
}: BenkFaneFilterSkjemaProps<BenkTab.REVURDERINGER>) => {
    const skjema = useBenkFilterSkjema(BenkTab.REVURDERINGER, aktivtFilter);
    const { valgtFilter, endreFilter } = skjema;

    return (
        <BenkFilterSkjema skjema={skjema} {...props}>
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
        </BenkFilterSkjema>
    );
};
