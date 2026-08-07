import { Table } from '@navikt/ds-react';
import { Periode } from '~/types/Periode';
import { formaterPeriodeKort } from '~/utils/date';

export const PeriodeCelle = ({ periode }: { periode: Periode }) => (
    <Table.DataCell align={'right'}>{formaterPeriodeKort(periode)}</Table.DataCell>
);
