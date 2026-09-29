import { useResettableState } from '~/utils/useResettableState';
import { BenkSideTab } from '../../typer/tabs';
import { BenkGlobaltFilter, BenkFilter } from '../../typer/felles';
import { useBenkFilterNavigasjon } from './useBenkFilterNavigasjon';

export type BenkFilterSkjemaTilstand<Filter extends BenkGlobaltFilter> = {
    /** Valgene i de lokale filtrene - tas først i bruk når skjemaet sendes inn */
    valgtFilter: Filter;
    /** Filteret som vises nå - de globale filtrene leses herfra, siden de tas i bruk med en gang */
    aktivtFilter: Filter;
    endreFilter: (endring: Partial<Filter>) => void;
    endreGlobaltFilter: (endring: Partial<BenkGlobaltFilter>) => Promise<unknown>;
    oppdaterFilter: () => Promise<unknown>;
    nullstillFilter: () => Promise<unknown>;
};

/**
 * Tilstanden alle fanenes filterskjema deler: valgene holdes lokalt til skjemaet
 * sendes inn, og tilbakestilles når et nytt aktivt filter kommer fra serveren.
 */
export const useBenkFilterSkjema = <Filter extends BenkFilter & BenkGlobaltFilter>(
    tab: BenkSideTab,
    aktivtFilter: Filter,
): BenkFilterSkjemaTilstand<Filter> => {
    const { oppdaterFilter, nullstillFilter } = useBenkFilterNavigasjon(tab);
    const [valgtFilter, setValgtFilter] = useResettableState(aktivtFilter);

    return {
        valgtFilter,
        aktivtFilter,
        endreFilter: (endring) => setValgtFilter((forrige) => ({ ...forrige, ...endring })),
        endreGlobaltFilter: (endring) => oppdaterFilter({ ...aktivtFilter, ...endring }),
        oppdaterFilter: () => oppdaterFilter(valgtFilter),
        nullstillFilter: () =>
            nullstillFilter({
                kunTildeltMeg: aktivtFilter.kunTildeltMeg,
                skjulPåVent: aktivtFilter.skjulPåVent,
                skjulEgneTilBeslutning: aktivtFilter.skjulEgneTilBeslutning,
            }),
    };
};
