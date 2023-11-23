import { Select, Table } from '@navikt/ds-react';
import { CheckmarkCircleFillIcon, ExclamationmarkTriangleFillIcon, XMarkOctagonFillIcon } from '@navikt/aksel-icons';
import { MeldekortDag, MeldekortStatus } from '../../types/MeldekortTypes';

import React, { useState } from 'react';

interface MeldekortUkeProps {
    meldekortUke: MeldekortDag[];
    ukesnummer: number;
    fom: number;
    tom: number;
    handleOppdaterMeldekort: (arg1: number, arg2: string) => void;
}

export const MeldekortUke = ({ ukesnummer, fom, tom, meldekortUke, handleOppdaterMeldekort }: MeldekortUkeProps) => {
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
                        onChange={(e) => handleOppdaterMeldekort(index, e.target.value)}
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
