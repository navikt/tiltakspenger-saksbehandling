import { HelpText, HStack, Table, Tag } from '@navikt/ds-react';
import { AkselColor } from '@navikt/ds-react/types/theme';
import { BenkV2Ventestatus } from '../typer/felles';
import { antallKalenderDagerUnnaDagensDato, formaterDatotekst } from '~/utils/date';
import { Nullable } from '~/types/UtilTypes';
import { tilbakekrevingVenterStatusTekst } from '~/lib/tilbakekreving/tilbakekrevingTekster';
import { TilbakekrevingVentegrunn } from '~/lib/tilbakekreving/typer/Tilbakekreving';

type Props = {
    ventestatus: BenkV2Ventestatus;
    /** Tilbakekreving lagrer ventegrunnen som en enumnøkkel, ikke som fritekst */
    erTilbakekreving?: boolean;
};

export const VentestatusCelle = ({ ventestatus, erTilbakekreving = false }: Props) => {
    const { erSattPåVent, begrunnelse, frist } = ventestatus;

    return (
        <Table.DataCell>
            {erSattPåVent ? (
                <HStack gap={'space-4'} align={'center'} wrap={false}>
                    <Tag data-color={finnTagColor(frist)} variant={'moderate'} size={'small'}>
                        {frist ? `Venter til ${formaterDatotekst(frist)}` : 'Venter'}
                    </Tag>
                    {begrunnelse && (
                        <HelpText>{begrunnelseTekst(begrunnelse, erTilbakekreving)}</HelpText>
                    )}
                </HStack>
            ) : (
                '-'
            )}
        </Table.DataCell>
    );
};

const begrunnelseTekst = (begrunnelse: string, erTilbakekreving: boolean): string => {
    if (erTilbakekreving && begrunnelse in tilbakekrevingVenterStatusTekst) {
        return tilbakekrevingVenterStatusTekst[begrunnelse as TilbakekrevingVentegrunn];
    }
    return begrunnelse;
};

const finnTagColor = (fristDato: Nullable<string>): AkselColor => {
    if (!fristDato) {
        return 'danger';
    }

    const antallDager = antallKalenderDagerUnnaDagensDato(fristDato);

    if (antallDager <= 0) {
        return 'danger';
    } else if (antallDager <= 3) {
        return 'warning';
    } else {
        return 'info';
    }
};
