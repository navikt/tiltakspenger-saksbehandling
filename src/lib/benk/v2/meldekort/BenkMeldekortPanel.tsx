import { VStack } from '@navikt/ds-react';
import { BenkV2Oversikt, BenkV2Sortering } from '../typer/felles';
import { BenkMeldekort, BenkMeldekortFilter, BenkMeldekortKolonne } from '../typer/meldekort';
import { BenkMeldekortFilterSkjema } from './BenkMeldekortFilterSkjema';
import { BenkMeldekortTabell } from './BenkMeldekortTabell';
import { BenkOversiktInfo } from '../felles/BenkOversiktInfo';

type Props = {
    oversikt: BenkV2Oversikt<BenkMeldekort>;
    aktivtFilter: BenkMeldekortFilter;
    aktivSortering: BenkV2Sortering<BenkMeldekortKolonne>;
};

export const BenkMeldekortPanel = ({ oversikt, aktivtFilter, aktivSortering }: Props) => (
    <VStack gap={'space-16'}>
        <BenkMeldekortFilterSkjema
            behandlinger={oversikt.behandlinger}
            aktivtFilter={aktivtFilter}
        />
        <BenkOversiktInfo oversikt={oversikt} />
        <BenkMeldekortTabell behandlinger={oversikt.behandlinger} aktivSortering={aktivSortering} />
    </VStack>
);
