import { Select } from '@navikt/ds-react';
import { BenkRevurderingerFilter, BenkRevurdering } from '../typer/revurderinger';
import { BenkV2Behandlingsstatus } from '../typer/felles';
import { BenkV2Tab } from '../typer/tabs';
import { benkV2BehandlingsstatusTekst } from '../benkV2Utils';
import { RevurderingResultat } from '~/lib/rammebehandling/typer/Revurdering';
import { rammebehandlingResultatTekst } from '~/lib/rammebehandling/utils/rammebehandlingTekster';
import { useResettableState } from '~/utils/useResettableState';
import { useBenkFilterNavigasjon } from '../felles/useBenkFilterNavigasjon';
import { BenkFilterSkjema } from '../felles/BenkFilterSkjema';
import { SaksbehandlerSelect } from '../felles/SaksbehandlerSelect';

type Props = {
    behandlinger: BenkRevurdering[];
    aktivtFilter: BenkRevurderingerFilter;
};

export const RevurderingerFilter = ({ behandlinger, aktivtFilter }: Props) => {
    const { oppdaterFilter, nullstillFilter } = useBenkFilterNavigasjon(BenkV2Tab.REVURDERINGER);
    const [valgtFilter, setValgtFilter] = useResettableState<BenkRevurderingerFilter>(aktivtFilter);

    return (
        <BenkFilterSkjema
            onSubmit={() => oppdaterFilter(valgtFilter)}
            onNullstill={() =>
                nullstillFilter({ status: null, resultat: null, saksbehandler: null })
            }
        >
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

            <Select
                label={'Resultat'}
                size={'small'}
                value={valgtFilter.resultat ?? ''}
                onChange={(e) =>
                    setValgtFilter({
                        ...valgtFilter,
                        resultat: (e.target.value as RevurderingResultat) || null,
                    })
                }
            >
                <option value={''}>{'Alle'}</option>
                {Object.values(RevurderingResultat).map((resultat) => (
                    <option key={resultat} value={resultat}>
                        {rammebehandlingResultatTekst[resultat]}
                    </option>
                ))}
            </Select>

            <SaksbehandlerSelect
                behandlinger={behandlinger}
                value={valgtFilter.saksbehandler}
                onChange={(saksbehandler) => setValgtFilter({ ...valgtFilter, saksbehandler })}
            />
        </BenkFilterSkjema>
    );
};
