import { Tag, TagProps } from '@navikt/ds-react';
import { RammebehandlingResultat } from '~/lib/rammebehandling/typer/Rammebehandling';
import { SøknadsbehandlingResultat } from '~/lib/rammebehandling/typer/Søknadsbehandling';
import { RevurderingResultat } from '~/lib/rammebehandling/typer/Revurdering';
import { rammebehandlingResultatTekst } from '~/lib/rammebehandling/utils/rammebehandlingTekster';

type Props = {
    resultat: RammebehandlingResultat;
    /** Tekst som vises foran resultatet, f.eks. "Klage - " */
    prefiks?: string;
    size?: TagProps['size'];
};

export const RammebehandlingResultatTag = ({ resultat, prefiks, size }: Props) => (
    <Tag data-color={resultatFarge[resultat]} variant={'outline'} size={size}>
        {prefiks} {rammebehandlingResultatTekst[resultat]}
    </Tag>
);

const resultatFarge: Record<RammebehandlingResultat, TagProps['data-color']> = {
    [SøknadsbehandlingResultat.AVSLAG]: 'danger',
    [SøknadsbehandlingResultat.INNVILGELSE]: 'success',
    [SøknadsbehandlingResultat.IKKE_VALGT]: 'neutral',
    [RevurderingResultat.STANS]: 'warning',
    [RevurderingResultat.OMGJØRING_OPPHØR]: 'warning',
    [RevurderingResultat.INNVILGELSE]: 'info',
    [RevurderingResultat.OMGJØRING]: 'meta-purple',
    [RevurderingResultat.OMGJØRING_IKKE_VALGT]: 'neutral',
} as const;
