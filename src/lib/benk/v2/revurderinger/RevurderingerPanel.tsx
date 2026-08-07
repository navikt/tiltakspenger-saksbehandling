import { VStack } from '@navikt/ds-react';
import { BenkV2Oversikt, BenkV2Sortering } from '../typer/felles';
import {
    BenkRevurderingerFilter,
    BenkRevurderingerKolonne,
    BenkRevurdering,
} from '../typer/revurderinger';
import { RevurderingerFilter } from './RevurderingerFilter';
import { RevurderingerTabell } from './RevurderingerTabell';
import { BenkOversiktInfo } from '../felles/BenkOversiktInfo';

type Props = {
    oversikt: BenkV2Oversikt<BenkRevurdering>;
    aktivtFilter: BenkRevurderingerFilter;
    aktivSortering: BenkV2Sortering<BenkRevurderingerKolonne>;
};

export const RevurderingerPanel = ({ oversikt, aktivtFilter, aktivSortering }: Props) => (
    <VStack gap={'space-16'}>
        <RevurderingerFilter behandlinger={oversikt.behandlinger} aktivtFilter={aktivtFilter} />
        <BenkOversiktInfo oversikt={oversikt} />
        <RevurderingerTabell behandlinger={oversikt.behandlinger} aktivSortering={aktivSortering} />
    </VStack>
);
