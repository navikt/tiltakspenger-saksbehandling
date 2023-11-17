import { Select, Table } from '@navikt/ds-react';
import {
    CheckmarkCircleFillIcon,
    ExclamationmarkTriangleFillIcon,
    ParasolBeachFillIcon,
    XMarkOctagonFillIcon,
} from '@navikt/aksel-icons';
import { MeldekortDag, MeldekortStatus } from '../../types/MeldekortTypes';

import React, { useState } from 'react';

interface MeldekortUkeProps {
    meldekortUke?: MeldekortDag[];
    ukesnummer: number;
    fom: number;
    tom: number;
}

export const MeldekortUke = ({ ukesnummer, fom, tom, meldekortUke }: MeldekortUkeProps) => {
    const meldekortUker: MeldekortDag[] = [
        { dag: 'Mandag', dato: new Date('2023-11-13'), status: MeldekortStatus.DELTATT },
        { dag: 'Tirsdag', dato: new Date('2023-11-14'), status: MeldekortStatus.IKKE_DELTATT },
        { dag: 'Onsdag', dato: new Date('2023-11-15'), status: MeldekortStatus.FRAVÆR_SYK },
        { dag: 'Torsdag', dato: new Date('2023-11-16'), status: MeldekortStatus.FRAVÆR_SYKT_BARN },
        { dag: 'Fredag', dato: new Date('2023-11-17'), status: MeldekortStatus.DELTATT },
        { dag: 'Lørdag', dato: new Date('2023-11-18'), status: MeldekortStatus.IKKE_DELTATT },
        { dag: 'Søndag', dato: new Date('2023-11-19'), status: MeldekortStatus.IKKE_DELTATT },
    ];

    function velgIkon(deltattEllerFravær: String) {
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
    var ukedagListe = meldekortUker.map((ukedag, index) => {
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
                    >
                        <option value="Deltatt">Deltatt i tiltaket</option>
                        <option value="Ikke_deltatt">Ikke deltatt i tiltaket</option>
                        <option value="Lønn">Lønn for tid i tiltaket</option>
                        <option value="sykefravær">Fravær syk</option>
                        <option value="velferdPermisjon">Fravær velferd</option>
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
