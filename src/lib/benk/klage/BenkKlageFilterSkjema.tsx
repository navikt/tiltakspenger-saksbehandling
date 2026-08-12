import { BenkKlagebehandling, BenkKlageFilter } from '../typer/klage';
import { BenkTab } from '../typer/tabs';
import { benkBehandlingsstatusTekst } from '../utils/benkUtils';
import { klagebehandlingResultatTekst } from '~/lib/klage/utils/klageTekster';
import { useResettableState } from '~/utils/useResettableState';
import { useBenkFilterNavigasjon } from '../felles/useBenkFilterNavigasjon';
import { BenkFilterSkjema } from '../felles/BenkFilterSkjema';
import { BenkSaksbehandlerSelect } from '../felles/BenkSaksbehandlerSelect';
import { BenkFilterSelect } from '../felles/BenkFilterSelect';

type Props = {
    behandlinger: BenkKlagebehandling[];
    aktivtFilter: BenkKlageFilter;
};

export const BenkKlageFilterSkjema = ({ behandlinger, aktivtFilter }: Props) => {
    const { oppdaterFilter, nullstillFilter } = useBenkFilterNavigasjon(BenkTab.KLAGE);
    const [valgtFilter, setValgtFilter] = useResettableState<BenkKlageFilter>(aktivtFilter);

    return (
        <BenkFilterSkjema
            onSubmit={() => oppdaterFilter(valgtFilter)}
            onNullstill={() =>
                nullstillFilter({
                    status: null,
                    resultat: null,
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
                alternativer={klagebehandlingResultatTekst}
            />

            <BenkSaksbehandlerSelect
                behandlinger={behandlinger}
                value={valgtFilter.saksbehandler}
                onChange={(saksbehandler) => setValgtFilter({ ...valgtFilter, saksbehandler })}
            />
        </BenkFilterSkjema>
    );
};
