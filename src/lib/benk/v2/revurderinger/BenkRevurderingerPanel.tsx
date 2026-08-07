import { VStack } from '@navikt/ds-react';
import { BenkV2Oversikt, BenkV2Sortering } from '../typer/felles';
import {
    BenkRevurderingerFilter,
    BenkRevurderingerKolonne,
    BenkRevurdering,
} from '../typer/revurderinger';
import { BenkRevurderingerFilterSkjema } from './BenkRevurderingerFilterSkjema';
import { BenkRevurderingerTabell } from './BenkRevurderingerTabell';
import { BenkOversiktInfo } from '../felles/BenkOversiktInfo';

type Props = {
    oversikt: BenkV2Oversikt<BenkRevurdering>;
    aktivtFilter: BenkRevurderingerFilter;
    aktivSortering: BenkV2Sortering<BenkRevurderingerKolonne>;
};

export const BenkRevurderingerPanel = ({ oversikt, aktivtFilter, aktivSortering }: Props) => (
    <VStack gap={'space-16'}>
        <BenkRevurderingerFilterSkjema
            behandlinger={oversikt.behandlinger}
            aktivtFilter={aktivtFilter}
        />
        <BenkOversiktInfo oversikt={oversikt} />
        <BenkRevurderingerTabell
            behandlinger={oversikt.behandlinger}
            aktivSortering={aktivSortering}
        />
    </VStack>
);
