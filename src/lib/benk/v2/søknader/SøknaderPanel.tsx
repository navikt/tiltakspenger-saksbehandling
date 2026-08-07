import { VStack } from '@navikt/ds-react';
import { BenkV2Oversikt, BenkV2Sortering } from '../typer/felles';
import { BenkSøknaderFilter, BenkSøknaderKolonne, BenkSøknadsbehandling } from '../typer/søknader';
import { SøknaderFilter } from './SøknaderFilter';
import { SøknaderTabell } from './SøknaderTabell';
import { BenkOversiktInfo } from '../felles/BenkOversiktInfo';

type Props = {
    oversikt: BenkV2Oversikt<BenkSøknadsbehandling>;
    aktivtFilter: BenkSøknaderFilter;
    aktivSortering: BenkV2Sortering<BenkSøknaderKolonne>;
};

export const SøknaderPanel = ({ oversikt, aktivtFilter, aktivSortering }: Props) => (
    <VStack gap={'space-16'}>
        <SøknaderFilter behandlinger={oversikt.behandlinger} aktivtFilter={aktivtFilter} />
        <BenkOversiktInfo oversikt={oversikt} />
        <SøknaderTabell behandlinger={oversikt.behandlinger} aktivSortering={aktivSortering} />
    </VStack>
);
