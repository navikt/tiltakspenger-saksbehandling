import {BodyShort, Button, Table} from '@navikt/ds-react';
import {UtfallIconTo} from '../utfall-icon/UtfallIcon';
import {Utfall} from '../../types/Utfall';
import React from 'react';
import {PencilIcon} from '@navikt/aksel-icons';

interface SaksopplysningProps {
    utfall: boolean;
    fom: string;
    tom: string;
    // vilkår: string; // Vilkår inneholder lovverk: String, val paragraf: String, val ledd: String?, val beskrivelse:
    kilde: string;
    detaljer: string;
    håndterStartRedigering: (value: React.SetStateAction<boolean>) => void;
}

export const SaksopplysningTable = ({ utfall, fom, tom, kilde, detaljer, håndterStartRedigering }: SaksopplysningProps) => {
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
                                <UtfallIconTo utfall={utfall ? Utfall.Oppfylt :  Utfall.IkkeOppfylt} />
                            </div>
                        }
                    </Table.DataCell>
                    <Table.DataCell>
                        {
                            <div style={{ display: 'flex' }}>
                                <BodyShort>test om vilkår er oppfylt</BodyShort>
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
