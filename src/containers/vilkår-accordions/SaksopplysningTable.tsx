import { BodyShort, Button, Table } from '@navikt/ds-react';
import { UtfallIcon } from '../../components/utfall-icon/UtfallIcon';
import React, { useState } from 'react';
import { RedigeringSkjema } from './RedigeringSkjema';
import { FaktaDTO, SaksopplysningInnDTO } from '../../types/Behandling';
import { PencilIcon } from '@navikt/aksel-icons';

interface SaksopplysningProps {
    saksopplysninger: SaksopplysningInnDTO[];
    behandlingId: string;
}

export const SaksopplysningTable = ({ saksopplysninger, behandlingId }: SaksopplysningProps) => {
    const [åpneRedigering, onÅpneRedigering] = useState<boolean>(false);

    const håndterLukkRedigering = () => {
        onÅpneRedigering(false);
    };

    const velgFaktaTekst = (typeSaksopplysning: string, fakta: FaktaDTO) => {
        if (typeSaksopplysning === 'HAR_YTELSE') return fakta.harYtelse;
        if (typeSaksopplysning === 'HAR_IKKE_YTELSE') return fakta.harIkkeYtelse;
        return 'Ikke innhentet';
    };

    return (
        <>
            <Table>
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeader />
                        <Table.ColumnHeader>Vilkår</Table.ColumnHeader>
                        <Table.ColumnHeader>Fakta</Table.ColumnHeader>
                        <Table.ColumnHeader>Periode</Table.ColumnHeader>
                        <Table.ColumnHeader>Kilde</Table.ColumnHeader>
                        <Table.ColumnHeader>Detaljer</Table.ColumnHeader>
                        <Table.ColumnHeader />
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {saksopplysninger.map((saksopplysning) => (
                        <>
                            <Table.Row key={saksopplysning.vilkårTittel}>
                                <Table.DataCell>
                                    {
                                        <div style={{ display: 'flex' }}>
                                            <UtfallIcon utfall={saksopplysning.utfall} />
                                        </div>
                                    }
                                </Table.DataCell>
                                <Table.HeaderCell>{saksopplysning.vilkårTittel}</Table.HeaderCell>
                                <Table.DataCell>
                                    {
                                        <div style={{ display: 'flex' }}>
                                            <BodyShort>
                                                {velgFaktaTekst(
                                                    saksopplysning.typeSaksopplysning,
                                                    saksopplysning.fakta
                                                )}
                                            </BodyShort>
                                        </div>
                                    }
                                </Table.DataCell>
                                <Table.DataCell>
                                    <BodyShort>
                                        {saksopplysning.fom && saksopplysning.tom
                                            ? `${saksopplysning.fom} - ${saksopplysning.tom}`
                                            : '-'}
                                    </BodyShort>
                                </Table.DataCell>
                                <Table.DataCell>
                                    <BodyShort>{saksopplysning.kilde ? saksopplysning.kilde : '-'}</BodyShort>
                                </Table.DataCell>
                                <Table.DataCell>
                                    <BodyShort>{saksopplysning.detaljer ? saksopplysning.detaljer : '-'}</BodyShort>
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
                            {åpneRedigering && (
                                <div style={{ width: '100%' }}>
                                    <RedigeringSkjema
                                        behandlingId={behandlingId}
                                        vilkår={saksopplysning.vilkårTittel}
                                        håndterLukkRedigering={håndterLukkRedigering}
                                    />
                                </div>
                            )}
                        </>
                    ))}
                </Table.Body>
            </Table>
        </>
    );
};
