import { useResettableState } from '~/utils/useResettableState';
import { BenkTab } from '../../typer/tabs';
import { BenkFaneFilter } from '../../typer/benkside';
import { BenkFellesFilter } from '../../typer/felles';
import { useBenkFilterNavigasjon } from './useBenkFilterNavigasjon';

export type BenkFilterSkjemaTilstand<Filter extends BenkFellesFilter> = {
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
export const useBenkFilterSkjema = <T extends BenkTab>(
    tab: T,
    aktivtFilter: BenkFaneFilter<T>,
): BenkFilterSkjemaTilstand<BenkFaneFilter<T>> => {
    const { oppdaterFilter, nullstillFilter } = useBenkFilterNavigasjon(tab);
    const [valgtFilter, setValgtFilter] = useResettableState(aktivtFilter);

    return {
        valgtFilter,
        endreFilter: (endring) => setValgtFilter((forrige) => ({ ...forrige, ...endring })),
        oppdaterFilter: () => oppdaterFilter(valgtFilter),
        nullstillFilter,
    };
};
