import { BenkRevurderingerFilter } from '../typer/revurderinger';
import { BenkTab } from '../typer/tabs';
import { benkBehandlingsstatusTekst } from '../utils/benkUtils';
import { revurderingResultatTekst } from '~/lib/rammebehandling/utils/rammebehandlingTekster';
import { useResettableState } from '~/utils/useResettableState';
import { useBenkFilterNavigasjon } from '../felles/useBenkFilterNavigasjon';
import { BenkFilterSkjema } from '../felles/BenkFilterSkjema';
import { BenkSaksbehandlerSelect } from '../felles/BenkSaksbehandlerSelect';
import { BenkFilterSelect } from '../felles/BenkFilterSelect';

type Props = {
    saksbehandlere: string[];
    besluttere: string[];
    aktivtFilter: BenkRevurderingerFilter;
};

export const BenkRevurderingerFilterSkjema = ({
    saksbehandlere,
    besluttere,
    aktivtFilter,
}: Props) => {
    const { oppdaterFilter, nullstillFilter } = useBenkFilterNavigasjon(BenkTab.REVURDERINGER);
    const [valgtFilter, setValgtFilter] = useResettableState<BenkRevurderingerFilter>(aktivtFilter);

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
                alternativer={revurderingResultatTekst}
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
