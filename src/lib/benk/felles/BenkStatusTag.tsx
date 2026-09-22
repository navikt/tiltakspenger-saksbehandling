import { HStack, Tag } from '@navikt/ds-react';
import { BenkBehandlingsstatus } from '../typer/felles';
import { BenkKlageStatus } from '../typer/klage';
import { BenkTilbakekrevingStatus } from '../typer/tilbakekreving';
import {
    benkTilbakekrevingStatusColor,
    benkTilbakekrevingStatusTekst,
    benkBehandlingsstatusColor,
    benkBehandlingsstatusTekst,
    benkKlageStatusColor,
    benkKlageStatusTekst,
} from '../utils/benkUtils';

export const BenkStatusTag = ({
    status,
    erUnderkjent,
}: {
    status: BenkBehandlingsstatus;
    erUnderkjent?: boolean;
}) => (
    <HStack gap={'space-4'} align={'center'} wrap={false}>
        <Tag data-color={benkBehandlingsstatusColor[status]} variant={'outline'} size={'small'}>
            {benkBehandlingsstatusTekst[status]}
        </Tag>
        {erUnderkjent && (
            <Tag data-color={'warning'} variant={'outline'} size={'small'}>
                {'Underkjent'}
            </Tag>
        )}
    </HStack>
);

export const BenkKlageStatusTag = ({ status }: { status: BenkKlageStatus }) => (
    <Tag data-color={benkKlageStatusColor[status]} variant={'outline'} size={'small'}>
        {benkKlageStatusTekst[status]}
    </Tag>
);

export const BenkTilbakekrevingStatusTag = ({ status }: { status: BenkTilbakekrevingStatus }) => (
    <Tag data-color={benkTilbakekrevingStatusColor[status]} variant={'outline'} size={'small'}>
        {benkTilbakekrevingStatusTekst[status]}
    </Tag>
);
