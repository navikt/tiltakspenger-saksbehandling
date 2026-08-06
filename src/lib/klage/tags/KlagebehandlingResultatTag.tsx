import { Tag, TagProps } from '@navikt/ds-react';
import { KlagebehandlingResultat } from '~/lib/klage/typer/Klage';
import { klagebehandlingResultatTekst } from '~/lib/klage/utils/klageTekster';

type Props = {
    resultat: KlagebehandlingResultat;
    /** Tekst som vises foran resultatet, f.eks. "Underinstans: " */
    prefiks?: string;
    size?: TagProps['size'];
};

export const KlagebehandlingResultatTag = ({ resultat, prefiks, size }: Props) => (
    <Tag data-color={resultatFarge[resultat]} variant={'outline'} size={size}>
        {prefiks}
        {klagebehandlingResultatTekst[resultat]}
    </Tag>
);

const resultatFarge: Record<KlagebehandlingResultat, TagProps['data-color']> = {
    [KlagebehandlingResultat.AVVIST]: 'danger',
    [KlagebehandlingResultat.OMGJØR]: 'meta-purple',
    [KlagebehandlingResultat.OPPRETTHOLDT]: 'meta-lime',
} as const;
