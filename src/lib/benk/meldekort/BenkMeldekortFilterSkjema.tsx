import { InfoCard, VStack } from '@navikt/ds-react';
import { BenkTab } from '../typer/tabs';
import { benkMeldekortTyper } from '../typer/meldekort';
import { benkMeldekortTypeTekst, benkBehandlingsstatusTekst } from '../utils/benkTekster';
import { useBenkFilterSkjema } from '../felles/filter/useBenkFilterSkjema';
import BenkFilterSkjema from '../felles/filter/BenkFilterSkjema';
import { BenkFilterSelect } from '../felles/filter/BenkFilterSelect';
import { BenkSaksbehandlerSelect } from '../felles/filter/BenkSaksbehandlerSelect';
import { BenkFaneFilterProps } from '../typer/benkside';

export const BenkMeldekortFilterSkjema = ({
    aktivtFilter,
    saksbehandlere,
    besluttere,
}: BenkFaneFilterProps<BenkTab.MELDEKORT>) => {
    const skjema = useBenkFilterSkjema(BenkTab.MELDEKORT, aktivtFilter);
    const { valgtFilter, endreFilter } = skjema;

    return (
        <VStack gap={'space-16'}>
            <BenkFilterSkjema skjema={skjema} visKunTildeltMeg={true}>
                <BenkFilterSelect
                    label={'Type'}
                    value={valgtFilter.type}
                    onChange={(type) => endreFilter({ type })}
                    alternativer={benkMeldekortTypeTekst}
                />

                <BenkFilterSelect
                    label={'Status'}
                    value={valgtFilter.status}
                    onChange={(status) => endreFilter({ status })}
                    alternativer={benkBehandlingsstatusTekst}
                />

                <BenkSaksbehandlerSelect
                    skjema={skjema}
                    saksbehandlere={saksbehandlere}
                    besluttere={besluttere}
                />
            </BenkFilterSkjema>

            {aktivtFilter.type === benkMeldekortTyper.MELDEKORT_TIL_ETTERKONTROLL && (
                <MeldekortTilEtterkontrollInfo />
            )}
        </VStack>
    );
};

/**
 * Forklarer den midlertidige kategorien når den er valgt.
 * TODO: Fjernes sammen med kategorien når alle meldekortene er kontrollert.
 */
const MeldekortTilEtterkontrollInfo = () => (
    <InfoCard data-color={'info'} size={'small'}>
        <InfoCard.Header>
            <InfoCard.Title>{'Meldekort til etterkontroll'}</InfoCard.Title>
        </InfoCard.Header>
        <InfoCard.Content>
            {
                'Dette er korrigerte meldekort som kom inn før en tidligere innsending for samme periode var ferdig behandlet automatisk. '
            }
            {
                'På grunn av en feil ble korrigeringene regnet som behandlet, og de ble derfor aldri vist i benken. '
            }
            {'Kontroller om korrigeringen endrer noe, og behandle meldekortet hvis det trengs. '}
            {'Kategorien er midlertidig, og fjernes når alle meldekortene er kontrollert.'}
        </InfoCard.Content>
    </InfoCard>
);
