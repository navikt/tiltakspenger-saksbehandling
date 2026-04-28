import { TilbakekrevingBehandlingsstatus } from '~/lib/tilbakekreving/typer/Tilbakekreving';
import { Tag } from '@navikt/ds-react';
import { AkselColor } from '@navikt/ds-react/types/theme';

const tilbakekrevingStatusTekst: Record<TilbakekrevingBehandlingsstatus, string> = {
    [TilbakekrevingBehandlingsstatus.OPPRETTET]: 'Opprettet',
    [TilbakekrevingBehandlingsstatus.TIL_BEHANDLING]: 'Klar til behandling',
    [TilbakekrevingBehandlingsstatus.UNDER_BEHANDLING]: 'Under behandling',
    [TilbakekrevingBehandlingsstatus.TIL_GODKJENNING]: 'Klar til godkjenning',
    [TilbakekrevingBehandlingsstatus.UNDER_GODKJENNING]: 'Under godkjenning',
    [TilbakekrevingBehandlingsstatus.AVSLUTTET]: 'Avsluttet',
} as const;

const tilbakekrevingStatusFarge: Record<TilbakekrevingBehandlingsstatus, AkselColor> = {
    [TilbakekrevingBehandlingsstatus.OPPRETTET]: 'neutral',
    [TilbakekrevingBehandlingsstatus.TIL_BEHANDLING]: 'brand-blue',
    [TilbakekrevingBehandlingsstatus.UNDER_BEHANDLING]: 'info',
    [TilbakekrevingBehandlingsstatus.TIL_GODKJENNING]: 'brand-beige',
    [TilbakekrevingBehandlingsstatus.UNDER_GODKJENNING]: 'info',
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
