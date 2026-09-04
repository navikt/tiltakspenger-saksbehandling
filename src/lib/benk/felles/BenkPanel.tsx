import { ReactNode } from 'react';
import { HStack, VStack } from '@navikt/ds-react';
import { BenkOversikt } from '../typer/felles';
import { BenkOversiktInfo } from './BenkOversiktInfo';
import { BenkPaginering } from './BenkPaginering';

type Props = {
    oversikt: BenkOversikt<unknown>;
    filter: ReactNode;
    tabell: ReactNode;
};

/** Oppbygningen alle fanene deler: filter øverst, så tellinger, så tabellen med paginering over og under */
export const BenkPanel = ({ oversikt, filter, tabell }: Props) => (
    <VStack gap={'space-16'}>
        {filter}
        <BenkOversiktInfo oversikt={oversikt} />
        <HStack justify={'center'}>
            <BenkPaginering oversikt={oversikt} />
        </HStack>
        {tabell}
        <HStack justify={'center'}>
            <BenkPaginering oversikt={oversikt} />
        </HStack>
    </VStack>
);
