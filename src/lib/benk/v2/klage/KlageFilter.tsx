import { Select } from '@navikt/ds-react';
import { BenkKlagebehandling, BenkKlageFilter } from '../typer/klage';
import { BenkV2Behandlingsstatus } from '../typer/felles';
import { BenkV2Tab } from '../typer/tabs';
import { benkV2BehandlingsstatusTekst } from '../benkV2Utils';
import { KlagebehandlingResultat } from '~/lib/klage/typer/Klage';
import { klagebehandlingResultatTekst } from '~/lib/klage/utils/klageTekster';
import { useResettableState } from '~/utils/useResettableState';
import { useBenkFilterNavigasjon } from '../felles/useBenkFilterNavigasjon';
import { BenkFilterSkjema } from '../felles/BenkFilterSkjema';
import { SaksbehandlerSelect } from '../felles/SaksbehandlerSelect';

type Props = {
    behandlinger: BenkKlagebehandling[];
    aktivtFilter: BenkKlageFilter;
};

export const KlageFilter = ({ behandlinger, aktivtFilter }: Props) => {
    const { oppdaterFilter, nullstillFilter } = useBenkFilterNavigasjon(BenkV2Tab.KLAGE);
    const [valgtFilter, setValgtFilter] = useResettableState<BenkKlageFilter>(aktivtFilter);

    return (
        <BenkFilterSkjema
            onSubmit={() => oppdaterFilter(valgtFilter)}
            onNullstill={() =>
                nullstillFilter({
                    status: null,
                    resultat: null,
                    saksbehandler: null,
                    skjulPåVent: false,
                })
            }
            skjulPåVent={valgtFilter.skjulPåVent}
            onSkjulPåVentChange={(skjulPåVent) => setValgtFilter({ ...valgtFilter, skjulPåVent })}
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
                        resultat: (e.target.value as KlagebehandlingResultat) || null,
                    })
                }
            >
                <option value={''}>{'Alle'}</option>
                {Object.values(KlagebehandlingResultat).map((resultat) => (
                    <option key={resultat} value={resultat}>
                        {klagebehandlingResultatTekst[resultat]}
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
