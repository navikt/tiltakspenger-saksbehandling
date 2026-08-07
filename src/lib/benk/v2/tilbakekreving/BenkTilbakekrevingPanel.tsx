import { VStack } from '@navikt/ds-react';
import { BenkV2Oversikt, BenkV2Sortering } from '../typer/felles';
import {
    BenkTilbakekreving,
    BenkTilbakekrevingFilter,
    BenkTilbakekrevingKolonne,
} from '../typer/tilbakekreving';
import { BenkTilbakekrevingFilterSkjema } from './BenkTilbakekrevingFilterSkjema';
import { BenkTilbakekrevingTabell } from './BenkTilbakekrevingTabell';
import { BenkOversiktInfo } from '../felles/BenkOversiktInfo';

type Props = {
    oversikt: BenkV2Oversikt<BenkTilbakekreving>;
    aktivtFilter: BenkTilbakekrevingFilter;
    aktivSortering: BenkV2Sortering<BenkTilbakekrevingKolonne>;
};

export const BenkTilbakekrevingPanel = ({ oversikt, aktivtFilter, aktivSortering }: Props) => (
    <VStack gap={'space-16'}>
        <BenkTilbakekrevingFilterSkjema
            behandlinger={oversikt.behandlinger}
            aktivtFilter={aktivtFilter}
        />
        <BenkOversiktInfo oversikt={oversikt} />
        <BenkTilbakekrevingTabell
            behandlinger={oversikt.behandlinger}
            aktivSortering={aktivSortering}
        />
    </VStack>
);
