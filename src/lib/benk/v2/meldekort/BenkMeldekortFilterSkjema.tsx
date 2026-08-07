import { Select } from '@navikt/ds-react';
import {
    BenkMeldekort,
    BenkMeldekortFilter,
    BenkMeldekortType,
    benkMeldekortTyper,
} from '../typer/meldekort';
import { BenkV2Behandlingsstatus } from '../typer/felles';
import { BenkV2Tab } from '../typer/tabs';
import { benkMeldekortTypeTekst, benkV2BehandlingsstatusTekst } from '../benkV2Utils';
import { useResettableState } from '~/utils/useResettableState';
import { useBenkFilterNavigasjon } from '../felles/useBenkFilterNavigasjon';
import { BenkFilterSkjema } from '../felles/BenkFilterSkjema';
import { BenkSaksbehandlerSelect } from '../felles/BenkSaksbehandlerSelect';

type Props = {
    behandlinger: BenkMeldekort[];
    aktivtFilter: BenkMeldekortFilter;
};

export const BenkMeldekortFilterSkjema = ({ behandlinger, aktivtFilter }: Props) => {
    const { oppdaterFilter, nullstillFilter } = useBenkFilterNavigasjon(BenkV2Tab.MELDEKORT);
    const [valgtFilter, setValgtFilter] = useResettableState<BenkMeldekortFilter>(aktivtFilter);

    return (
        <BenkFilterSkjema
            onSubmit={() => oppdaterFilter(valgtFilter)}
            onNullstill={() =>
                nullstillFilter({
                    status: null,
                    type: null,
                    saksbehandler: null,
                    skjulPåVent: false,
                })
            }
            skjulPåVent={valgtFilter.skjulPåVent}
            onSkjulPåVentChange={(skjulPåVent) => setValgtFilter({ ...valgtFilter, skjulPåVent })}
        >
            <Select
                label={'Type'}
                size={'small'}
                value={valgtFilter.type ?? ''}
                onChange={(e) =>
                    setValgtFilter({
                        ...valgtFilter,
                        type: (e.target.value as BenkMeldekortType) || null,
                    })
                }
            >
                <option value={''}>{'Alle'}</option>
                {Object.values(benkMeldekortTyper).map((type) => (
                    <option key={type} value={type}>
                        {benkMeldekortTypeTekst[type]}
                    </option>
                ))}
            </Select>

            <Select
                label={'Status'}
                size={'small'}
                value={valgtFilter.status ?? ''}
                onChange={(e) =>
                    setValgtFilter({
                        ...valgtFilter,
                        status: (e.target.value as BenkV2Behandlingsstatus) || null,
                    })
                }
            >
                <option value={''}>{'Alle'}</option>
                {Object.values(BenkV2Behandlingsstatus).map((status) => (
                    <option key={status} value={status}>
                        {benkV2BehandlingsstatusTekst[status]}
                    </option>
                ))}
            </Select>

            <BenkSaksbehandlerSelect
                behandlinger={behandlinger}
                value={valgtFilter.saksbehandler}
                onChange={(saksbehandler) => setValgtFilter({ ...valgtFilter, saksbehandler })}
            />
        </BenkFilterSkjema>
    );
};
