import { Table } from '@navikt/ds-react';

/**
 * Kolonneoverskriftene som går igjen på tvers av fanene i benken.
 * Label og sortKey defineres én gang her, slik at fanene ikke kommer ut av sync.
 * sortKey-verdiene er en del av kontrakten med backend - se BenkV2SorteringKolonne der.
 */

export const FnrKolonne = () => (
    <Table.ColumnHeader sortable={true} sortKey={'fnr'}>
        {'Fødselsnr'}
    </Table.ColumnHeader>
);

/** Søknadsfanen kan ikke sorteres på resultat, de andre kan */
export const ResultatKolonne = ({ sortable = false }: { sortable?: boolean }) =>
    sortable ? (
        <Table.ColumnHeader sortable={true} sortKey={'resultat'}>
            {'Resultat'}
        </Table.ColumnHeader>
    ) : (
        <Table.ColumnHeader>{'Resultat'}</Table.ColumnHeader>
    );

export const StatusKolonne = () => (
    <Table.ColumnHeader sortable={true} sortKey={'status'}>
        {'Status'}
    </Table.ColumnHeader>
);

export const VentestatusKolonne = () => <Table.ColumnHeader>{'Ventestatus'}</Table.ColumnHeader>;

export const KravtidspunktKolonne = () => (
    <Table.ColumnHeader sortable={true} sortKey={'kravtidspunkt'}>
        {'Kravtidspunkt'}
    </Table.ColumnHeader>
);

export const StartetKolonne = () => (
    <Table.ColumnHeader sortable={true} sortKey={'startet'}>
        {'Startet'}
    </Table.ColumnHeader>
);

export const SistEndretKolonne = () => (
    <Table.ColumnHeader sortable={true} sortKey={'sist_endret'}>
        {'Sist endret'}
    </Table.ColumnHeader>
);

export const SaksbehandlerKolonne = () => (
    <Table.ColumnHeader sortable={true} sortKey={'saksbehandler'}>
        {'Saksbehandler'}
    </Table.ColumnHeader>
);

export const BeslutterKolonne = () => (
    <Table.ColumnHeader sortable={true} sortKey={'beslutter'}>
        {'Beslutter'}
    </Table.ColumnHeader>
);

export const BeløpKolonne = () => (
    <Table.ColumnHeader sortable={true} sortKey={'beløp'}>
        {'Beløp'}
    </Table.ColumnHeader>
);

/** Den tomme kolonnen til høyre med lenker og meny */
export const HandlingerKolonne = () => <Table.ColumnHeader />;
