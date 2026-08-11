import { BenkSøknaderFilter, BenkSøknadsbehandling } from '../typer/søknader';
import { BenkTab } from '../typer/tabs';
import { benkBehandlingsstatusTekst } from '../utils/benkUtils';
import { søknadstypeTekst } from '~/lib/søknad/søknadTekster';
import { Søknadstype } from '~/lib/søknad/søknadTyper';
import { useResettableState } from '~/utils/useResettableState';
import { useBenkFilterNavigasjon } from '../felles/useBenkFilterNavigasjon';
import { BenkFilterSkjema } from '../felles/BenkFilterSkjema';
import { BenkSaksbehandlerSelect } from '../felles/BenkSaksbehandlerSelect';
import { BenkFilterSelect } from '../felles/BenkFilterSelect';

type Props = {
    behandlinger: BenkSøknadsbehandling[];
    aktivtFilter: BenkSøknaderFilter;
};

export const BenkSøknaderFilterSkjema = ({ behandlinger, aktivtFilter }: Props) => {
    const { oppdaterFilter, nullstillFilter } = useBenkFilterNavigasjon(BenkTab.SØKNADER);
    const [valgtFilter, setValgtFilter] = useResettableState<BenkSøknaderFilter>(aktivtFilter);

    return (
        <BenkFilterSkjema
            onSubmit={() => oppdaterFilter(valgtFilter)}
            onNullstill={() =>
                nullstillFilter({
                    status: null,
                    søknadstype: null,
                    saksbehandler: null,
                    skjulPåVent: false,
                })
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

            <BenkFilterSelect<Søknadstype>
                label={'Søknadstype'}
                value={valgtFilter.søknadstype}
                onChange={(søknadstype) => setValgtFilter({ ...valgtFilter, søknadstype })}
                alternativer={søknadstypeTekst}
            />

            <BenkSaksbehandlerSelect
                behandlinger={behandlinger}
                value={valgtFilter.saksbehandler}
                onChange={(saksbehandler) => setValgtFilter({ ...valgtFilter, saksbehandler })}
            />
        </BenkFilterSkjema>
    );
};
