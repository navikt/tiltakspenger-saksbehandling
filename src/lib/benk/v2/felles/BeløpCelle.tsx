import { Table } from '@navikt/ds-react';
import { Nullable } from '~/types/UtilTypes';
import { formatterBeløp } from '~/lib/_felles/utbetaling/beløp/beløpUtils';

export const BeløpCelle = ({ beløp }: { beløp: Nullable<number> }) => (
    <Table.DataCell align={'right'}>{beløp !== null ? formatterBeløp(beløp) : '-'}</Table.DataCell>
);
