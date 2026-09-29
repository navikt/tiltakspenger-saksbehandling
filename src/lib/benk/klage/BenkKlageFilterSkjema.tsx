import { BenkTab } from '../typer/tabs';
import { benkKlageStatusTekst } from '../utils/benkTekster';
import { klagebehandlingResultatTekst } from '~/lib/klage/utils/klageTekster';
import { useBenkFilterSkjema } from '../felles/filter/useBenkFilterSkjema';
import BenkFilterSkjema from '../felles/filter/BenkFilterSkjema';
import { BenkFilterSelect } from '../felles/filter/BenkFilterSelect';
import { BenkSaksbehandlerSelect } from '../felles/filter/BenkSaksbehandlerSelect';
import { BenkFaneFilterProps } from '../typer/benkside';

export const BenkKlageFilterSkjema = ({
    aktivtFilter,
    saksbehandlere,
    besluttere,
}: BenkFaneFilterProps<BenkTab.KLAGE>) => {
    const skjema = useBenkFilterSkjema(BenkTab.KLAGE, aktivtFilter);
    const { valgtFilter, endreFilter } = skjema;

    return (
        <BenkFilterSkjema skjema={skjema} visKunTildeltMeg={true}>
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

            <BenkSaksbehandlerSelect
                skjema={skjema}
                saksbehandlere={saksbehandlere}
                besluttere={besluttere}
            />
        </BenkFilterSkjema>
    );
};
