import { Tag, TagProps } from '@navikt/ds-react';
import { KlagebehandlingStatus } from '~/lib/klage/typer/Klage';
import { klagebehandlingStatusTekst } from '~/lib/klage/utils/klageTekster';

type Props = {
    status: KlagebehandlingStatus;
    /** Tekst som vises foran statusen, f.eks. "Behandlingsstatus: " */
    prefiks?: string;
    size?: TagProps['size'];
};

export const KlagebehandlingStatusTag = ({ status, prefiks, size }: Props) => (
    <Tag data-color={statusFarge[status]} variant={'outline'} size={size}>
        {prefiks}
        {klagebehandlingStatusTekst[status]}
    </Tag>
);

const statusFarge: Record<KlagebehandlingStatus, TagProps['data-color']> = {
    [KlagebehandlingStatus.KLAR_TIL_BEHANDLING]: 'info',
    [KlagebehandlingStatus.UNDER_BEHANDLING]: 'info',
    [KlagebehandlingStatus.AVBRUTT]: 'neutral',
    [KlagebehandlingStatus.VEDTATT]: 'success',
    [KlagebehandlingStatus.OPPRETTHOLDT]: 'success',
    [KlagebehandlingStatus.OVERSENDT]: 'success',
    [KlagebehandlingStatus.FERDIGSTILT]: 'success',
    [KlagebehandlingStatus.MOTTATT_FRA_KLAGEINSTANS]: 'info',
    [KlagebehandlingStatus.OMGJØRING_ETTER_KLAGEINSTANS]: 'info',
} as const;
