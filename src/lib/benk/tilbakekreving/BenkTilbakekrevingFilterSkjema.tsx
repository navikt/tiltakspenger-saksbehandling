import { HelpText, HStack } from '@navikt/ds-react';
import { BenkTab } from '../typer/tabs';
import { BenkFaneFilterProps } from '../typer/benkside';
import { benkTilbakekrevingKildeTekst, benkTilbakekrevingStatusTekst } from '../utils/benkTekster';
import { useBenkFilterSkjema } from '../felles/filter/useBenkFilterSkjema';
import BenkFilterSkjema from '../felles/filter/BenkFilterSkjema';
import { BenkFilterSelect } from '../felles/filter/BenkFilterSelect';
import { BenkFilterCheckbox } from '../felles/filter/BenkFilterCheckbox';
import { BenkSaksbehandlerSelect } from '../felles/filter/BenkSaksbehandlerSelect';

export const BenkTilbakekrevingFilterSkjema = ({
    aktivtFilter,
    saksbehandlere,
    besluttere,
}: BenkFaneFilterProps<BenkTab.TILBAKEKREVING>) => {
    const skjema = useBenkFilterSkjema(BenkTab.TILBAKEKREVING, aktivtFilter);
    const { valgtFilter, endreFilter } = skjema;

    return (
        <BenkFilterSkjema skjema={skjema} visKunTildeltMeg={true}>
            <BenkFilterSelect
                label={'Status'}
                value={valgtFilter.status}
                onChange={(status) => endreFilter({ status })}
                alternativer={benkTilbakekrevingStatusTekst}
            />

            <BenkFilterSelect
                label={'Kilde'}
                value={valgtFilter.kilde}
                onChange={(kilde) => endreFilter({ kilde })}
                alternativer={benkTilbakekrevingKildeTekst}
            />

            <BenkSaksbehandlerSelect
                skjema={skjema}
                saksbehandlere={saksbehandlere}
                besluttere={besluttere}
            />

            <HStack align={'end'}>
                <HStack align={'center'} gap={'space-4'}>
                    <BenkFilterCheckbox
                        checked={valgtFilter.kunOverMinstebeløp}
                        onChange={(kunOverMinstebeløp) => endreFilter({ kunOverMinstebeløp })}
                    >
                        {'Vis kun tilbakekrevinger over minstebeløp'}
                    </BenkFilterCheckbox>
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
