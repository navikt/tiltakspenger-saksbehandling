import { ReactNode } from 'react';
import { VStack } from '@navikt/ds-react';
import { BenkV2Oversikt } from '../typer/felles';
import { BenkOversiktInfo } from './BenkOversiktInfo';

type Props = {
    oversikt: BenkV2Oversikt<unknown>;
    filter: ReactNode;
    tabell: ReactNode;
};

/** Oppbygningen alle fanene deler: filter øverst, så tellinger, så tabellen */
export const BenkPanel = ({ oversikt, filter, tabell }: Props) => (
    <VStack gap={'space-16'}>
        {filter}
        <BenkOversiktInfo oversikt={oversikt} />
        {tabell}
    </VStack>
);
