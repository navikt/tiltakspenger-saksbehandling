import {BodyShort, Button, Table} from '@navikt/ds-react';
import {UtfallIcon} from '../utfall-icon/UtfallIcon';
import React from 'react';
import {PencilIcon} from '@navikt/aksel-icons';

interface SaksopplysningProps {
    utfall: string;
    fom: string;
    tom: string;
    // vilkår: string; // Vilkår inneholder lovverk: String, val paragraf: String, val ledd: String?, val beskrivelse:
    kilde: string;
    detaljer: string;
    fakta: string;
    håndterStartRedigering: (value: React.SetStateAction<boolean>) => void;
}

export const SaksopplysningTable = ({ utfall, fom, tom, kilde, detaljer, fakta, håndterStartRedigering }: SaksopplysningProps) => {
    return (
        <Table>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell></Table.HeaderCell>
                    <Table.HeaderCell>Registrering</Table.HeaderCell>
                    <Table.HeaderCell>Periode</Table.HeaderCell>
                    <Table.HeaderCell>Kilde</Table.HeaderCell>
                    <Table.HeaderCell>Detaljer</Table.HeaderCell>
                    <Table.HeaderCell />
                </Table.Row>
            </Table.Header>
            <Table.Body>
                <Table.Row>
                    <Table.DataCell>
                        {
                            <div style={{ display: 'flex' }}>
                                <UtfallIcon utfall={utfall} />
                            </div>
                        }
                    </Table.DataCell>
                    <Table.DataCell>
                        {
                            <div style={{ display: 'flex' }}>
                                <BodyShort>{fakta}</BodyShort>
                            </div>
                        }
                    </Table.DataCell>
                    <Table.DataCell>
                        <BodyShort>{fom && tom ? `${fom} - ${tom}` : '-'}</BodyShort>
                    </Table.DataCell>
                    <Table.DataCell>
                        <BodyShort>{kilde ? kilde : '-'}</BodyShort>
                    </Table.DataCell>
                    <Table.DataCell>
                        <BodyShort>{detaljer ? detaljer : '-'}</BodyShort>
                    </Table.DataCell>
                    <Table.DataCell>
                        <Button
                            onClick={() => håndterStartRedigering(true)}
                            variant="tertiary"
                            iconPosition="left"
                            icon={<PencilIcon />}
                            aria-label="hidden"
                        />
                    </Table.DataCell>
                </Table.Row>
            </Table.Body>
        </Table>
    );
};
