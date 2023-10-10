import { BodyShort, Button, Table } from '@navikt/ds-react';
import { UtfallIcon } from '../utfall-icon/UtfallIcon';
import React, { useState } from 'react';
import { PencilIcon } from '@navikt/aksel-icons';
import { RedigeringSkjema } from './RedigeringSkjema';

interface SaksopplysningProps {
    vilkår: string;
    utfall: string;
    fom: string;
    tom: string;
    kilde: string;
    detaljer: string;
    fakta: string;
}

export const SaksopplysningTable = ({ vilkår, utfall, fom, tom, kilde, detaljer, fakta }: SaksopplysningProps) => {
    const [åpneRedigering, onÅpneRedigering] = useState<boolean>(false);

    const håndterLukkRedigering = () => {
        onÅpneRedigering(false);
    };
    return (
        <>
            <Table>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell></Table.HeaderCell>
                        <Table.HeaderCell>Fakta</Table.HeaderCell>
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
                                onClick={() => onÅpneRedigering(!åpneRedigering)}
                                variant="tertiary"
                                iconPosition="left"
                                icon={<PencilIcon />}
                                aria-label="hidden"
                            />
                        </Table.DataCell>
                    </Table.Row>
                </Table.Body>
            </Table>
            <>{åpneRedigering && <RedigeringSkjema vilkår={vilkår} håndterLukkRedigering={håndterLukkRedigering} />}</>
        </>
    );
};
