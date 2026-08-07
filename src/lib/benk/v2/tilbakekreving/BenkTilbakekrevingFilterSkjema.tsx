import { Checkbox, HelpText, HStack, Select } from '@navikt/ds-react';
import {
    BenkTilbakekreving,
    BenkTilbakekrevingFilter,
    BenkTilbakekrevingKilde,
    BenkTilbakekrevingStatus,
} from '../typer/tilbakekreving';
import { BenkV2Tab } from '../typer/tabs';
import { benkTilbakekrevingKildeTekst, benkTilbakekrevingStatusTekst } from '../benkV2Utils';
import { useResettableState } from '~/utils/useResettableState';
import { useBenkFilterNavigasjon } from '../felles/useBenkFilterNavigasjon';
import { BenkFilterSkjema } from '../felles/BenkFilterSkjema';
import { BenkSaksbehandlerSelect } from '../felles/BenkSaksbehandlerSelect';

type Props = {
    behandlinger: BenkTilbakekreving[];
    aktivtFilter: BenkTilbakekrevingFilter;
};

export const BenkTilbakekrevingFilterSkjema = ({ behandlinger, aktivtFilter }: Props) => {
    const { oppdaterFilter, nullstillFilter } = useBenkFilterNavigasjon(BenkV2Tab.TILBAKEKREVING);
    const [valgtFilter, setValgtFilter] =
        useResettableState<BenkTilbakekrevingFilter>(aktivtFilter);

    return (
        <BenkFilterSkjema
            onSubmit={() => oppdaterFilter(valgtFilter)}
            onNullstill={() =>
                nullstillFilter({
                    status: null,
                    kilde: null,
                    saksbehandler: null,
                    kunOverMinstebeløp: false,
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
                        status: (e.target.value as BenkTilbakekrevingStatus) || null,
                    })
                }
            >
                <option value={''}>{'Alle'}</option>
                {Object.values(BenkTilbakekrevingStatus).map((status) => (
                    <option key={status} value={status}>
                        {benkTilbakekrevingStatusTekst[status]}
                    </option>
                ))}
            </Select>

            <Select
                label={'Kilde'}
                size={'small'}
                value={valgtFilter.kilde ?? ''}
                onChange={(e) =>
                    setValgtFilter({
                        ...valgtFilter,
                        kilde: (e.target.value as BenkTilbakekrevingKilde) || null,
                    })
                }
            >
                <option value={''}>{'Alle'}</option>
                {Object.values(BenkTilbakekrevingKilde).map((kilde) => (
                    <option key={kilde} value={kilde}>
                        {benkTilbakekrevingKildeTekst[kilde]}
                    </option>
                ))}
            </Select>

            <BenkSaksbehandlerSelect
                behandlinger={behandlinger}
                value={valgtFilter.saksbehandler}
                onChange={(saksbehandler) => setValgtFilter({ ...valgtFilter, saksbehandler })}
            />

            <HStack align={'end'}>
                <HStack gap={'space-4'} align={'center'}>
                    <Checkbox
                        size={'small'}
                        checked={valgtFilter.kunOverMinstebeløp}
                        onChange={(e) =>
                            setValgtFilter({ ...valgtFilter, kunOverMinstebeløp: e.target.checked })
                        }
                    >
                        {'Vis kun tilbakekrevinger over minstebeløp'}
                    </Checkbox>
                    <HelpText>
                        {
                            'Minstebeløpet for tilbakekreving er 5 380 kroner (fire ganger rettsgebyr)'
                        }
                    </HelpText>
                </HStack>
            </HStack>
        </BenkFilterSkjema>
    );
};
