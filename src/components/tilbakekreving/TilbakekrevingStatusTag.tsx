import { TilbakekrevingBehandlingsstatus } from '~/types/Tilbakekreving';
import { Tag } from '@navikt/ds-react';
import { AkselColor } from '@navikt/ds-react/types/theme';

const tilbakekrevingStatusTekst: Record<TilbakekrevingBehandlingsstatus, string> = {
    [TilbakekrevingBehandlingsstatus.OPPRETTET]: 'Opprettet',
    [TilbakekrevingBehandlingsstatus.TIL_BEHANDLING]: 'Under behandling',
    [TilbakekrevingBehandlingsstatus.TIL_GODKJENNING]: 'Under godkjenning',
    [TilbakekrevingBehandlingsstatus.AVSLUTTET]: 'Avsluttet',
} as const;

const tilbakekrevingStatusFarge: Record<TilbakekrevingBehandlingsstatus, AkselColor> = {
    [TilbakekrevingBehandlingsstatus.OPPRETTET]: 'neutral',
    [TilbakekrevingBehandlingsstatus.TIL_BEHANDLING]: 'brand-blue',
    [TilbakekrevingBehandlingsstatus.TIL_GODKJENNING]: 'brand-beige',
    [TilbakekrevingBehandlingsstatus.AVSLUTTET]: 'success',
} as const;

type Props = {
    status: TilbakekrevingBehandlingsstatus;
};

export const TilbakekrevingStatusTag = ({ status }: Props) => {
    return (
        <Tag data-color={tilbakekrevingStatusFarge[status]} variant={'outline'}>
            {tilbakekrevingStatusTekst[status]}
        </Tag>
    );
};
