import {Select, Table} from "@navikt/ds-react";
import {
    CheckmarkCircleFillIcon,
    ExclamationmarkTriangleFillIcon,
    ParasolBeachFillIcon,
    XMarkOctagonFillIcon
} from "@navikt/aksel-icons";
import React, {useState} from "react";

interface MeldekortUkeProps {
    ukesnummer: number;
    fom: number;
    tom: number;
}

export const MeldekortUke = ({ukesnummer, fom, tom} : MeldekortUkeProps) => {

    const ukedager = ['Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag', 'Søndag'];

    const [ikon, setIkon] = useState<React.ReactElement>();
    function velgIkon(deltattEllerFravær: String){
        switch(deltattEllerFravær) {
            case 'Deltatt' :  return <CheckmarkCircleFillIcon />;
            case 'Ikke_deltatt' : return <XMarkOctagonFillIcon />;
            case 'Lønn' : return <XMarkOctagonFillIcon />;
            case 'sykefravær': return <ExclamationmarkTriangleFillIcon />;
            case 'velferdPermisjon': return <ExclamationmarkTriangleFillIcon />;
            case 'helg': return <ParasolBeachFillIcon/>;
            default : return <CheckmarkCircleFillIcon />;
        }
    }

    var ukedagListe = ukedager.map((ukedag, index) => {
            return (
                <Table.Row key={index}>
                    <Table.DataCell>{ikon}</Table.DataCell>
                    <Table.DataCell>{ukedag} {fom++}</Table.DataCell>
                    <Table.DataCell>
                        <Select
                            label="Deltatt Eller Fravær"
                            id="deltattEllerFravær"
                            size="small"
                            onChange={e=> velgIkon(e.target.value)}
                            hideLabel
                        >
                            <option value="Deltatt">Deltatt i tiltaket</option>
                            <option value="Ikke_deltatt">Ikke deltatt i tiltaket</option>
                            <option value="Lønn">Lønn for tid i tiltaket</option>
                            <option value="sykefravær">Fravær syk</option>
                            <option value="velferdPermisjon">Fravær velferd</option>
                            <option value="helg">Helg</option>
                        </Select>
                    </Table.DataCell>
                </Table.Row>
            )
        })



    return(
        <Table size="small">
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Uke {ukesnummer}</Table.HeaderCell>
                    <Table.HeaderCell></Table.HeaderCell>
                    <Table.HeaderCell></Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>{ukedagListe}</Table.Body>
        </Table>
    )
}
