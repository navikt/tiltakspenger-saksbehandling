import { Table } from '@navikt/ds-react';
import { useBenkVisning } from './BenkVisningContext';

/**
 * Kolonneoverskriftene som går igjen på tvers av fanene i benken.
 * Label og sortKey defineres én gang her, slik at fanene ikke kommer ut av sync.
 * sortKey-verdiene er en del av kontrakten med backend - se BenkV2SorteringKolonne der.
 */

const Fnr = () => (
    <Table.ColumnHeader sortable={true} sortKey={'fnr'}>
        {'Fødselsnr'}
    </Table.ColumnHeader>
);

const Resultat = () => (
    <Table.ColumnHeader sortable={true} sortKey={'resultat'}>
        {'Resultat'}
    </Table.ColumnHeader>
);

const Status = () => (
    <Table.ColumnHeader sortable={true} sortKey={'status'}>
        {'Status'}
    </Table.ColumnHeader>
);

/** Skjult når filteret skjuler behandlinger på vent - da har alle radene uansett samme verdi */
const Ventestatus = () => {
    const { skjulVentestatus } = useBenkVisning();

    return skjulVentestatus ? null : (
        <Table.ColumnHeader sortable={true} sortKey={'ventestatus_frist'}>
            {'Ventestatus'}
        </Table.ColumnHeader>
    );
};

const Kravtidspunkt = () => (
    <Table.ColumnHeader sortable={true} sortKey={'kravtidspunkt'} align={'right'}>
        {'Kravtidspunkt'}
    </Table.ColumnHeader>
);

const Startet = () => (
    <Table.ColumnHeader sortable={true} sortKey={'startet'} align={'right'}>
        {'Startet'}
    </Table.ColumnHeader>
);

const SistEndret = () => (
    <Table.ColumnHeader sortable={true} sortKey={'sist_endret'} align={'right'}>
        {'Sist endret'}
    </Table.ColumnHeader>
);

const Saksbehandler = () => (
    <Table.ColumnHeader sortable={true} sortKey={'saksbehandler'}>
        {'Saksbehandler'}
    </Table.ColumnHeader>
);

const Beslutter = () => (
    <Table.ColumnHeader sortable={true} sortKey={'beslutter'}>
        {'Beslutter'}
    </Table.ColumnHeader>
);

const Beløp = () => (
    <Table.ColumnHeader sortable={true} sortKey={'beløp'} align={'right'}>
        {'Beløp'}
    </Table.ColumnHeader>
);

/** Den tomme kolonnen til høyre med lenker og meny */
const Handlinger = () => <Table.ColumnHeader />;

export const BenkTabellKolonneHeader = {
    Fnr,
    Resultat,
    Status,
    Ventestatus,
    Kravtidspunkt,
    Startet,
    SistEndret,
    Saksbehandler,
    Beslutter,
    Beløp,
    Handlinger,
};
