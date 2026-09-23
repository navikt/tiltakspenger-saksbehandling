import { BenkTab } from '../typer/tabs';
import { benkKlageStatusTekst } from '../utils/benkTekster';
import { klagebehandlingResultatTekst } from '~/lib/klage/utils/klageTekster';
import { useBenkFilterSkjema } from '../felles/filter/useBenkFilterSkjema';
import { BenkFaneFilterSkjemaProps, BenkFilterSkjema } from '../felles/filter/BenkFilterSkjema';
import { BenkFilterSelect } from '../felles/filter/BenkFilterSelect';

export const BenkKlageFilterSkjema = ({
    aktivtFilter,
    ...props
}: BenkFaneFilterSkjemaProps<BenkTab.KLAGE>) => {
    const skjema = useBenkFilterSkjema(BenkTab.KLAGE, aktivtFilter);
    const { valgtFilter, endreFilter } = skjema;

    return (
        <BenkFilterSkjema skjema={skjema} {...props}>
            <BenkFilterSelect
                label={'Status'}
                value={valgtFilter.status}
                onChange={(status) => endreFilter({ status })}
                alternativer={benkKlageStatusTekst}
            />

            <BenkFilterSelect
                label={'Resultat'}
                value={valgtFilter.resultat}
                onChange={(resultat) => endreFilter({ resultat })}
                alternativer={klagebehandlingResultatTekst}
            />
        </BenkFilterSkjema>
    );
};
