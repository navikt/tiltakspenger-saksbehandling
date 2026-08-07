import { VStack } from '@navikt/ds-react';
import { BenkV2Oversikt, BenkV2Sortering } from '../typer/felles';
import {
    BenkTilbakekreving,
    BenkTilbakekrevingFilter,
    BenkTilbakekrevingKolonne,
} from '../typer/tilbakekreving';
import { TilbakekrevingFilter } from './TilbakekrevingFilter';
import { TilbakekrevingTabell } from './TilbakekrevingTabell';
import { BenkOversiktInfo } from '../felles/BenkOversiktInfo';

type Props = {
    oversikt: BenkV2Oversikt<BenkTilbakekreving>;
    aktivtFilter: BenkTilbakekrevingFilter;
    aktivSortering: BenkV2Sortering<BenkTilbakekrevingKolonne>;
};

export const TilbakekrevingPanel = ({ oversikt, aktivtFilter, aktivSortering }: Props) => (
    <VStack gap={'space-16'}>
        <TilbakekrevingFilter behandlinger={oversikt.behandlinger} aktivtFilter={aktivtFilter} />
        <BenkOversiktInfo oversikt={oversikt} />
        <TilbakekrevingTabell
            behandlinger={oversikt.behandlinger}
            aktivSortering={aktivSortering}
        />
    </VStack>
);
