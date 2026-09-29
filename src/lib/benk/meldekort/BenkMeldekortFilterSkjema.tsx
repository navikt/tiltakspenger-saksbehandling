import { BenkTab } from '../typer/tabs';
import { benkMeldekortTypeTekst, benkBehandlingsstatusTekst } from '../utils/benkTekster';
import { useBenkFilterSkjema } from '../felles/filter/useBenkFilterSkjema';
import BenkFilterSkjema from '../felles/filter/BenkFilterSkjema';
import { BenkFilterSelect } from '../felles/filter/BenkFilterSelect';
import { BenkSaksbehandlerSelect } from '../felles/filter/BenkSaksbehandlerSelect';
import { BenkFaneFilterProps } from '../typer/benkside';

export const BenkMeldekortFilterSkjema = ({
    aktivtFilter,
    saksbehandlere,
    besluttere,
}: BenkFaneFilterProps<BenkTab.MELDEKORT>) => {
    const skjema = useBenkFilterSkjema(BenkTab.MELDEKORT, aktivtFilter);
    const { valgtFilter, endreFilter } = skjema;

    return (
        <BenkFilterSkjema skjema={skjema} visKunTildeltMeg={true}>
            <BenkFilterSelect
                label={'Type'}
                value={valgtFilter.type}
                onChange={(type) => endreFilter({ type })}
                alternativer={benkMeldekortTypeTekst}
            />

            <BenkFilterSelect
                label={'Status'}
                value={valgtFilter.status}
                onChange={(status) => endreFilter({ status })}
                alternativer={benkBehandlingsstatusTekst}
            />

            <BenkSaksbehandlerSelect
                skjema={skjema}
                saksbehandlere={saksbehandlere}
                besluttere={besluttere}
            />
        </BenkFilterSkjema>
    );
};
