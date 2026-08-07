import { Table } from '@navikt/ds-react';
import { Nullable } from '~/types/UtilTypes';

/** Saksbehandler- og beslutterkolonnene deler denne - tom ident betyr at ingen har tatt behandlingen */
export const TildeltCelle = ({ ident }: { ident: Nullable<string> }) => (
    <Table.DataCell>{ident ?? 'Ikke tildelt'}</Table.DataCell>
);
