import { VStack } from '@navikt/ds-react';
import { BenkV2Oversikt, BenkV2Sortering } from '../typer/felles';
import { BenkSøknaderFilter, BenkSøknaderKolonne, BenkSøknadsbehandling } from '../typer/søknader';
import { BenkSøknaderFilterSkjema } from './BenkSøknaderFilterSkjema';
import { BenkSøknaderTabell } from './BenkSøknaderTabell';
import { BenkOversiktInfo } from '../felles/BenkOversiktInfo';

type Props = {
    oversikt: BenkV2Oversikt<BenkSøknadsbehandling>;
    aktivtFilter: BenkSøknaderFilter;
    aktivSortering: BenkV2Sortering<BenkSøknaderKolonne>;
};

export const BenkSøknaderPanel = ({ oversikt, aktivtFilter, aktivSortering }: Props) => (
    <VStack gap={'space-16'}>
        <BenkSøknaderFilterSkjema
            behandlinger={oversikt.behandlinger}
            aktivtFilter={aktivtFilter}
        />
        <BenkOversiktInfo oversikt={oversikt} />
        <BenkSøknaderTabell behandlinger={oversikt.behandlinger} aktivSortering={aktivSortering} />
    </VStack>
);
