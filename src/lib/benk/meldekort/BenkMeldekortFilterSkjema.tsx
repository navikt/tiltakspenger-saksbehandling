import { BenkTab } from '../typer/tabs';
import { benkMeldekortTypeTekst, benkBehandlingsstatusTekst } from '../utils/benkTekster';
import { useBenkFilterSkjema } from '../felles/filter/useBenkFilterSkjema';
import { BenkFaneFilterSkjemaProps, BenkFilterSkjema } from '../felles/filter/BenkFilterSkjema';
import { BenkFilterSelect } from '../felles/filter/BenkFilterSelect';

export const BenkMeldekortFilterSkjema = ({
    aktivtFilter,
    ...props
}: BenkFaneFilterSkjemaProps<BenkTab.MELDEKORT>) => {
    const skjema = useBenkFilterSkjema(BenkTab.MELDEKORT, aktivtFilter);
    const { valgtFilter, endreFilter } = skjema;

    return (
        <BenkFilterSkjema skjema={skjema} {...props}>
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
        </BenkFilterSkjema>
    );
};
