import { BenkTab } from '../typer/tabs';
import { benkBehandlingsstatusTekst } from '../utils/benkTekster';
import { søknadsbehandlingResultatTekst } from '~/lib/rammebehandling/rammebehandlingTekster';
import { søknadstypeTekst } from '~/lib/søknad/søknadTekster';
import { Søknadstype } from '~/lib/søknad/søknadTyper';
import { useBenkFilterSkjema } from '../felles/filter/useBenkFilterSkjema';
import BenkFilterSkjema from '../felles/filter/BenkFilterSkjema';
import { BenkFilterSelect } from '../felles/filter/BenkFilterSelect';
import { BenkSaksbehandlerSelect } from '../felles/filter/BenkSaksbehandlerSelect';
import { BenkFaneFilterProps } from '../typer/benkside';

export const BenkSøknaderFilterSkjema = ({
    aktivtFilter,
    saksbehandlere,
    besluttere,
}: BenkFaneFilterProps<BenkTab.SØKNADER>) => {
    const skjema = useBenkFilterSkjema(BenkTab.SØKNADER, aktivtFilter);
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
                alternativer={søknadsbehandlingResultatTekst}
            />

            <BenkFilterSelect<Søknadstype>
                label={'Søknadstype'}
                value={valgtFilter.søknadstype}
                onChange={(søknadstype) => endreFilter({ søknadstype })}
                alternativer={søknadstypeTekst}
            />

            <BenkSaksbehandlerSelect
                skjema={skjema}
                saksbehandlere={saksbehandlere}
                besluttere={besluttere}
            />
        </BenkFilterSkjema>
    );
};
