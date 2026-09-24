import { BENK_MINE_TAB, BenkTab } from '../typer/tabs';
import { BenkMineFilter } from '../typer/mine';
import { benkFaner } from '../benkFaner';
import { useBenkFilterSkjema } from '../felles/filter/useBenkFilterSkjema';
import { BenkFilterSkjemaRamme } from '../felles/filter/BenkFilterSkjema';
import { BenkFilterSelect } from '../felles/filter/BenkFilterSelect';

const seksjonTekst = Object.fromEntries(
    Object.values(BenkTab).map((tab) => [tab, benkFaner[tab].tekst]),
) as Record<BenkTab, string>;

export const BenkMineFilterSkjema = ({ aktivtFilter }: { aktivtFilter: BenkMineFilter }) => {
    const skjema = useBenkFilterSkjema(BENK_MINE_TAB, aktivtFilter);
    const { valgtFilter, endreFilter } = skjema;

    return (
        <BenkFilterSkjemaRamme skjema={skjema}>
            <BenkFilterSelect
                label={'Behandlingstype'}
                value={valgtFilter.seksjon}
                onChange={(seksjon) => endreFilter({ seksjon })}
                alternativer={seksjonTekst}
            />
        </BenkFilterSkjemaRamme>
    );
};
