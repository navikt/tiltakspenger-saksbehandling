import { Select } from '@navikt/ds-react';
import { BenkSøknaderFilter, BenkSøknadsbehandling } from '../typer/søknader';
import { BenkV2Behandlingsstatus } from '../typer/felles';
import { BenkV2Tab } from '../typer/tabs';
import { benkV2BehandlingsstatusTekst } from '../benkV2Utils';
import { søknadstypeTekst } from '~/lib/søknad/søknadTekster';
import { Søknadstype } from '~/lib/søknad/søknadTyper';
import { useResettableState } from '~/utils/useResettableState';
import { useBenkFilterNavigasjon } from '../felles/useBenkFilterNavigasjon';
import { BenkFilterSkjema } from '../felles/BenkFilterSkjema';
import { SaksbehandlerSelect } from '../felles/SaksbehandlerSelect';
import { SkjulPåVentCheckbox } from '../felles/SkjulPåVentCheckbox';

type Props = {
    behandlinger: BenkSøknadsbehandling[];
    aktivtFilter: BenkSøknaderFilter;
};

const SØKNADSTYPER: Søknadstype[] = ['DIGITAL', 'PAPIR_SKJEMA', 'PAPIR_FRIHAND', 'MODIA', 'ANNET'];

export const SøknaderFilter = ({ behandlinger, aktivtFilter }: Props) => {
    const { oppdaterFilter, nullstillFilter } = useBenkFilterNavigasjon(BenkV2Tab.SØKNADER);
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
                label={'Søknadstype'}
                size={'small'}
                value={valgtFilter.søknadstype ?? ''}
                onChange={(e) =>
                    setValgtFilter({
                        ...valgtFilter,
                        søknadstype: (e.target.value as Søknadstype) || null,
                    })
                }
            >
                <option value={''}>{'Alle'}</option>
                {SØKNADSTYPER.map((søknadstype) => (
                    <option key={søknadstype} value={søknadstype}>
                        {søknadstypeTekst[søknadstype]}
                    </option>
                ))}
            </Select>

            <SaksbehandlerSelect
                behandlinger={behandlinger}
                value={valgtFilter.saksbehandler}
                onChange={(saksbehandler) => setValgtFilter({ ...valgtFilter, saksbehandler })}
            />

            <SkjulPåVentCheckbox
                checked={valgtFilter.skjulPåVent}
                onChange={(skjulPåVent) => setValgtFilter({ ...valgtFilter, skjulPåVent })}
            />
        </BenkFilterSkjema>
    );
};
