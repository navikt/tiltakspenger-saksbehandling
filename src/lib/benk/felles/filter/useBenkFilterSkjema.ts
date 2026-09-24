import { useResettableState } from '~/utils/useResettableState';
import { BenkSideTab } from '../../typer/tabs';
import { BenkFellesFilter, BenkFilter } from '../../typer/felles';
import { useBenkFilterNavigasjon } from './useBenkFilterNavigasjon';

/** Avkrysningene alle fanene har, også mine-fanen */
export type BenkAvkrysningsFilter = Omit<BenkFellesFilter, 'saksbehandler'>;

export type BenkFilterSkjemaTilstand<Filter extends BenkAvkrysningsFilter> = {
    /** Valgene i skjemaet - tas først i bruk når skjemaet sendes inn */
    valgtFilter: Filter;
    endreFilter: (endring: Partial<Filter>) => void;
    oppdaterFilter: () => Promise<unknown>;
    nullstillFilter: () => Promise<unknown>;
};

/**
 * Tilstanden alle fanenes filterskjema deler: valgene holdes lokalt til skjemaet
 * sendes inn, og tilbakestilles når et nytt aktivt filter kommer fra serveren.
 */
export const useBenkFilterSkjema = <Filter extends BenkFilter & BenkAvkrysningsFilter>(
    tab: BenkSideTab,
    aktivtFilter: Filter,
): BenkFilterSkjemaTilstand<Filter> => {
    const { oppdaterFilter, nullstillFilter } = useBenkFilterNavigasjon(tab);
    const [valgtFilter, setValgtFilter] = useResettableState(aktivtFilter);

    return {
        valgtFilter,
        endreFilter: (endring) => setValgtFilter((forrige) => ({ ...forrige, ...endring })),
        oppdaterFilter: () => oppdaterFilter(valgtFilter),
        nullstillFilter,
    };
};
