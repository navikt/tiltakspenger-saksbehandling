import { HStack, Tag } from '@navikt/ds-react';
import { BenkV2Behandlingsstatus } from '../typer/felles';
import { BenkTilbakekrevingStatus } from '../typer/tilbakekreving';
import {
    benkTilbakekrevingStatusColor,
    benkTilbakekrevingStatusTekst,
    benkV2BehandlingsstatusColor,
    benkV2BehandlingsstatusTekst,
} from '../benkV2Utils';

export const BenkStatusTag = ({
    status,
    erUnderkjent,
}: {
    status: BenkV2Behandlingsstatus;
    erUnderkjent?: boolean;
}) => (
    <HStack gap={'space-4'} align={'center'} wrap={false}>
        <Tag data-color={benkV2BehandlingsstatusColor[status]} variant={'outline'} size={'small'}>
            {benkV2BehandlingsstatusTekst[status]}
        </Tag>
        {erUnderkjent && (
            <Tag data-color={'warning'} variant={'outline'} size={'small'}>
                {'Underkjent'}
            </Tag>
        )}
    </HStack>
);

export const TilbakekrevingStatusTag = ({ status }: { status: BenkTilbakekrevingStatus }) => (
    <Tag data-color={benkTilbakekrevingStatusColor[status]} variant={'outline'} size={'small'}>
        {benkTilbakekrevingStatusTekst[status]}
    </Tag>
);
