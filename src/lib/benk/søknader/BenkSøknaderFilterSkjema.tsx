import { BenkSøknaderFilter } from '../typer/søknader';
import { BenkTab } from '../typer/tabs';
import { benkBehandlingsstatusTekst } from '../utils/benkUtils';
import { søknadsbehandlingResultatTekst } from '../../rammebehandling/rammebehandlingTekster';
import { søknadstypeTekst } from '~/lib/søknad/søknadTekster';
import { Søknadstype } from '~/lib/søknad/søknadTyper';
import { useResettableState } from '~/utils/useResettableState';
import { useBenkFilterNavigasjon } from '../felles/filter/useBenkFilterNavigasjon';
import { BenkFilterSkjema } from '../felles/filter/BenkFilterSkjema';
import { BenkSaksbehandlerSelect } from '../felles/filter/BenkSaksbehandlerSelect';
import { BenkFilterSelect } from '../felles/filter/BenkFilterSelect';

type Props = {
    saksbehandlere: string[];
    besluttere: string[];
    aktivtFilter: BenkSøknaderFilter;
};

export const BenkSøknaderFilterSkjema = ({ saksbehandlere, besluttere, aktivtFilter }: Props) => {
    const { oppdaterFilter, nullstillFilter } = useBenkFilterNavigasjon(BenkTab.SØKNADER);
    const [valgtFilter, setValgtFilter] = useResettableState<BenkSøknaderFilter>(aktivtFilter);

    return (
        <BenkFilterSkjema
            onSubmit={() => oppdaterFilter(valgtFilter)}
            onNullstill={() =>
                nullstillFilter({
                    status: null,
                    resultat: null,
                    søknadstype: null,
                    saksbehandler: null,
                    skjulEgneTilBeslutning: false,
                    skjulPåVent: false,
                })
            }
            skjulEgneTilBeslutning={valgtFilter.skjulEgneTilBeslutning}
            onSkjulEgneTilBeslutningChange={(skjulEgneTilBeslutning) =>
                setValgtFilter({ ...valgtFilter, skjulEgneTilBeslutning })
            }
            skjulPåVent={valgtFilter.skjulPåVent}
            onSkjulPåVentChange={(skjulPåVent) => setValgtFilter({ ...valgtFilter, skjulPåVent })}
        >
            <BenkFilterSelect
                label={'Status'}
                value={valgtFilter.status}
                onChange={(status) => setValgtFilter({ ...valgtFilter, status })}
                alternativer={benkBehandlingsstatusTekst}
            />

            <BenkFilterSelect
                label={'Resultat'}
                value={valgtFilter.resultat}
                onChange={(resultat) => setValgtFilter({ ...valgtFilter, resultat })}
                alternativer={søknadsbehandlingResultatTekst}
            />

            <BenkFilterSelect<Søknadstype>
                label={'Søknadstype'}
                value={valgtFilter.søknadstype}
                onChange={(søknadstype) => setValgtFilter({ ...valgtFilter, søknadstype })}
                alternativer={søknadstypeTekst}
            />

            <BenkSaksbehandlerSelect
                saksbehandlere={saksbehandlere}
                besluttere={besluttere}
                valgtSaksbehandler={valgtFilter.saksbehandler}
                onChange={(saksbehandler) => setValgtFilter({ ...valgtFilter, saksbehandler })}
            />
        </BenkFilterSkjema>
    );
};
