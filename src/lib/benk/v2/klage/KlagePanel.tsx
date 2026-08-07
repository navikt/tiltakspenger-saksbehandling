import { VStack } from '@navikt/ds-react';
import { BenkV2Oversikt, BenkV2Sortering } from '../typer/felles';
import { BenkKlagebehandling, BenkKlageFilter, BenkKlageKolonne } from '../typer/klage';
import { KlageFilter } from './KlageFilter';
import { KlageTabell } from './KlageTabell';
import { BenkOversiktInfo } from '../felles/BenkOversiktInfo';

type Props = {
    oversikt: BenkV2Oversikt<BenkKlagebehandling>;
    aktivtFilter: BenkKlageFilter;
    aktivSortering: BenkV2Sortering<BenkKlageKolonne>;
};

export const KlagePanel = ({ oversikt, aktivtFilter, aktivSortering }: Props) => (
    <VStack gap={'space-16'}>
        <KlageFilter behandlinger={oversikt.behandlinger} aktivtFilter={aktivtFilter} />
        <BenkOversiktInfo oversikt={oversikt} />
        <KlageTabell behandlinger={oversikt.behandlinger} aktivSortering={aktivSortering} />
    </VStack>
);
