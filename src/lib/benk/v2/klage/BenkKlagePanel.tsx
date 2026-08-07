import { VStack } from '@navikt/ds-react';
import { BenkV2Oversikt, BenkV2Sortering } from '../typer/felles';
import { BenkKlagebehandling, BenkKlageFilter, BenkKlageKolonne } from '../typer/klage';
import { BenkKlageFilterSkjema } from './BenkKlageFilterSkjema';
import { BenkKlageTabell } from './BenkKlageTabell';
import { BenkOversiktInfo } from '../felles/BenkOversiktInfo';

type Props = {
    oversikt: BenkV2Oversikt<BenkKlagebehandling>;
    aktivtFilter: BenkKlageFilter;
    aktivSortering: BenkV2Sortering<BenkKlageKolonne>;
};

export const BenkKlagePanel = ({ oversikt, aktivtFilter, aktivSortering }: Props) => (
    <VStack gap={'space-16'}>
        <BenkKlageFilterSkjema behandlinger={oversikt.behandlinger} aktivtFilter={aktivtFilter} />
        <BenkOversiktInfo oversikt={oversikt} />
        <BenkKlageTabell behandlinger={oversikt.behandlinger} aktivSortering={aktivSortering} />
    </VStack>
);
