import {
    TilbakekrevingBehandling,
    TilbakekrevingBehandlingsstatus,
} from '~/lib/tilbakekreving/typer/Tilbakekreving';
import { BodyShort, HelpText, Tag, TagProps } from '@navikt/ds-react';
import { AkselColor } from '@navikt/ds-react/types/theme';
import { formaterDatotekst } from '~/utils/date';
import { tilbakekrevingVenterStatusTekst } from '~/lib/tilbakekreving/tilbakekrevingTekster';

import style from './TilbakekrevingStatusTags.module.css';

type Props = Pick<TilbakekrevingBehandling, 'status' | 'venter'> & { size?: TagProps['size'] };

export const TilbakekrevingStatusTags = ({ status, venter, size }: Props) => {
    return (
        <div className={style.tags}>
            <Tag data-color={tilbakekrevingStatusFarge[status]} variant={'outline'} size={size}>
                {tilbakekrevingStatusTekst[status]}
            </Tag>
            {venter && (
                <Tag
                    data-color={'neutral'}
                    variant={'moderate'}
                    className={style.venter}
                    size={size}
                >
                    <BodyShort size={'small'}>{'Venter'}</BodyShort>
                    <HelpText>{`${tilbakekrevingVenterStatusTekst[venter.grunn]} - Gjenopptas ${formaterDatotekst(venter.gjenopptas)}`}</HelpText>
                </Tag>
            )}
        </div>
    );
};

const tilbakekrevingStatusTekst: Record<TilbakekrevingBehandlingsstatus, string> = {
    [TilbakekrevingBehandlingsstatus.OPPRETTET]: 'Opprettet',
    [TilbakekrevingBehandlingsstatus.TIL_FORHÅNDSVARSEL]: 'Klar til behandling (forhåndsvarsling)',
    [TilbakekrevingBehandlingsstatus.UNDER_FORHÅNDSVARSLING]: 'Under behandling (forhåndsvarsling)',
    [TilbakekrevingBehandlingsstatus.TIL_BEHANDLING]: 'Klar til behandling',
    [TilbakekrevingBehandlingsstatus.UNDER_BEHANDLING]: 'Under behandling',
    [TilbakekrevingBehandlingsstatus.TIL_GODKJENNING]: 'Klar til godkjenning',
    [TilbakekrevingBehandlingsstatus.UNDER_GODKJENNING]: 'Under godkjenning',
    [TilbakekrevingBehandlingsstatus.AVSLUTTET]: 'Avsluttet',
} as const;

const tilbakekrevingStatusFarge: Record<TilbakekrevingBehandlingsstatus, AkselColor> = {
    [TilbakekrevingBehandlingsstatus.OPPRETTET]: 'neutral',
    [TilbakekrevingBehandlingsstatus.TIL_FORHÅNDSVARSEL]: 'brand-blue',
    [TilbakekrevingBehandlingsstatus.UNDER_FORHÅNDSVARSLING]: 'info',
    [TilbakekrevingBehandlingsstatus.TIL_BEHANDLING]: 'brand-blue',
    [TilbakekrevingBehandlingsstatus.UNDER_BEHANDLING]: 'info',
    [TilbakekrevingBehandlingsstatus.TIL_GODKJENNING]: 'brand-beige',
    [TilbakekrevingBehandlingsstatus.UNDER_GODKJENNING]: 'info',
    [TilbakekrevingBehandlingsstatus.AVSLUTTET]: 'success',
} as const;
