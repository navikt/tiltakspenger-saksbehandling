import { Table } from '@navikt/ds-react';
import { Nullable } from '~/types/UtilTypes';
import { formaterTidspunkt, formaterTidspunktKort } from '~/utils/date';

type Props = {
    tidspunkt: Nullable<string>;
    /** Kortere datoformat for tabeller med mange kolonner */
    kort?: boolean;
};

export const TidspunktCelle = ({ tidspunkt, kort = false }: Props) => (
    <Table.DataCell align={'right'}>
        {tidspunkt ? (kort ? formaterTidspunktKort(tidspunkt) : formaterTidspunkt(tidspunkt)) : '-'}
    </Table.DataCell>
);
