import {BodyShort, Table} from "@navikt/ds-react";
import {UtfallIconTo} from "../utfall-icon/UtfallIcon";
import {Utfall} from "../../types/Utfall";
import React from "react";

interface SaksopplysningProps {
    vilkårsVurdering: boolean;
    fom: string;
    tom: string;
    // vilkår: string; // Vilkår inneholder lovverk: String, val paragraf: String, val ledd: String?, val beskrivelse:
    kilde: string;
    detaljer: string;
}

export const SaksopplysningTable = ({fom, tom, kilde, detaljer}: SaksopplysningProps) => {

    return (
        <Table>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Vilkår</Table.HeaderCell>
                    <Table.HeaderCell>Fra dato</Table.HeaderCell>
                    <Table.HeaderCell>Til dato</Table.HeaderCell>
                    <Table.HeaderCell>Kilde</Table.HeaderCell>
                    <Table.HeaderCell>Detaljer</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                <Table.Row>
                    <Table.DataCell>{<div style={{display: "flex"}}>
                        <UtfallIconTo utfall={Utfall.IkkeOppfylt}/>
                        <BodyShort>Yay/nay</BodyShort>
                    </div>}</Table.DataCell>
                    <Table.DataCell><BodyShort>{fom ? fom : '-'}</BodyShort></Table.DataCell>
                    <Table.DataCell><BodyShort>{tom ? tom : '-'}</BodyShort></Table.DataCell>
                    <Table.DataCell><BodyShort>{kilde ? kilde : '-'}</BodyShort></Table.DataCell>
                    <Table.DataCell><BodyShort>{detaljer ? detaljer : '-'}</BodyShort></Table.DataCell>
                </Table.Row>
            </Table.Body>
        </Table>
    )
};


