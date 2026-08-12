import { Checkbox, HelpText, HStack } from '@navikt/ds-react';
import { BenkTilbakekreving, BenkTilbakekrevingFilter } from '../typer/tilbakekreving';
import { BenkTab } from '../typer/tabs';
import { benkTilbakekrevingKildeTekst, benkTilbakekrevingStatusTekst } from '../utils/benkUtils';
import { useResettableState } from '~/utils/useResettableState';
import { useBenkFilterNavigasjon } from '../felles/useBenkFilterNavigasjon';
import { BenkFilterSkjema } from '../felles/BenkFilterSkjema';
import { BenkSaksbehandlerSelect } from '../felles/BenkSaksbehandlerSelect';
import { BenkFilterSelect } from '../felles/BenkFilterSelect';

type Props = {
    behandlinger: BenkTilbakekreving[];
    aktivtFilter: BenkTilbakekrevingFilter;
};

export const BenkTilbakekrevingFilterSkjema = ({ behandlinger, aktivtFilter }: Props) => {
    const { oppdaterFilter, nullstillFilter } = useBenkFilterNavigasjon(BenkTab.TILBAKEKREVING);
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
                alternativer={benkTilbakekrevingStatusTekst}
            />

            <BenkFilterSelect
                label={'Kilde'}
                value={valgtFilter.kilde}
                onChange={(kilde) => setValgtFilter({ ...valgtFilter, kilde })}
                alternativer={benkTilbakekrevingKildeTekst}
            />

            <BenkSaksbehandlerSelect
                behandlinger={behandlinger}
                value={valgtFilter.saksbehandler}
                onChange={(saksbehandler) => setValgtFilter({ ...valgtFilter, saksbehandler })}
            />

            <HStack align={'end'}>
                <HStack align={'center'} gap={'space-4'}>
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
