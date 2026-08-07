import { Tag } from '@navikt/ds-react';
import { BenkV2Ventestatus } from '../typer/felles';
import { formaterDatotekst } from '~/utils/date';

export const VentestatusCelle = ({ ventestatus }: { ventestatus: BenkV2Ventestatus }) => {
    if (!ventestatus.erSattPåVent) {
        return '-';
    }

    return (
        <Tag data-color={'warning'} variant={'outline'} size={'small'}>
            {ventestatus.frist
                ? `På vent til ${formaterDatotekst(ventestatus.frist)}`
                : 'Satt på vent'}
        </Tag>
    );
};
