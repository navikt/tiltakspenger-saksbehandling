import { Select, Table } from '@navikt/ds-react';
import { CheckmarkCircleFillIcon, ExclamationmarkTriangleFillIcon, XMarkOctagonFillIcon } from '@navikt/aksel-icons';
import { MeldekortDag, MeldekortStatus } from '../../types/MeldekortTypes';

interface MeldekortUkeProps {
    meldekortUke: MeldekortDag[];
    ukesnummer: number;
    fom: number;
    tom: number;
    handleOppdaterMeldekort: (index: number, status: MeldekortStatus) => void;
}

export const MeldekortUke = ({ ukesnummer, meldekortUke, handleOppdaterMeldekort }: MeldekortUkeProps) => {
    function velgIkon(deltattEllerFravær: MeldekortStatus) {
        switch (deltattEllerFravær) {
            case MeldekortStatus.DELTATT:
                return <CheckmarkCircleFillIcon style={{ color: 'green' }} />;

            case MeldekortStatus.IKKE_DELTATT:
            case MeldekortStatus.LØNN_FOR_TID_I_ARBEID:
                return <XMarkOctagonFillIcon style={{ color: 'red' }} />;

            case MeldekortStatus.FRAVÆR_SYK:
            case MeldekortStatus.FRAVÆR_SYKT_BARN:
            case MeldekortStatus.FRAVÆR_VELFERD:
                return <ExclamationmarkTriangleFillIcon style={{ color: 'orange' }} />;
        }
    }

    function velgStatus(status: string) {
        switch (status) {
            case 'Deltatt':
                return MeldekortStatus.DELTATT;
            case 'Ikke deltatt':
                return MeldekortStatus.IKKE_DELTATT;
            case 'Lønn for tid i arbeid':
                return MeldekortStatus.LØNN_FOR_TID_I_ARBEID;
            case 'Fravær syk':
                return MeldekortStatus.FRAVÆR_SYK;
            case 'Fravær sykt barn':
                return MeldekortStatus.FRAVÆR_SYKT_BARN;
            case 'Fravær velferd':
                return MeldekortStatus.FRAVÆR_VELFERD;
            default:
                return MeldekortStatus.IKKE_DELTATT;
        }
    }

    function oppdaterMeldekort(index: number, status: string) {
        const meldekortStatus = velgStatus(status);
        handleOppdaterMeldekort(index, meldekortStatus);
    }

    var ukedagListe = meldekortUke.map((ukedag, index) => {
        return (
            <Table.Row key={index}>
                <Table.DataCell>{velgIkon(ukedag.status)}</Table.DataCell>
                <Table.DataCell>
                    {ukedag.dag} {ukedag.dato.getDate()}
                </Table.DataCell>
                <Table.DataCell>
                    <Select
                        label="Deltatt Eller Fravær"
                        id="deltattEllerFravær"
                        size="small"
                        hideLabel
                        defaultValue={ukedag.status}
                        onChange={(e) => oppdaterMeldekort(index, e.target.value)}
                    >
                        <option value={MeldekortStatus.DELTATT}>Deltatt i tiltaket</option>
                        <option value={MeldekortStatus.IKKE_DELTATT}>Ikke deltatt i tiltaket</option>
                        <option value={MeldekortStatus.LØNN_FOR_TID_I_ARBEID}>Lønn for tid i arbeid</option>
                        <option value={MeldekortStatus.FRAVÆR_SYK}>Fravær syk</option>
                        <option value={MeldekortStatus.FRAVÆR_SYKT_BARN}>Fravær sykt barn</option>
                        <option value={MeldekortStatus.FRAVÆR_VELFERD}>Fravær velferd</option>
                    </Select>
                </Table.DataCell>
            </Table.Row>
        );
    });

    return (
        <Table size="small" aria-disabled="true">
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Uke {ukesnummer}</Table.HeaderCell>
                    <Table.HeaderCell></Table.HeaderCell>
                    <Table.HeaderCell></Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>{ukedagListe}</Table.Body>
        </Table>
    );
};
