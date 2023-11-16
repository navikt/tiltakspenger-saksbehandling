import { BodyShort, Button, Table } from '@navikt/ds-react';
import { UtfallIcon } from '../../components/utfall-icon/UtfallIcon';
import React, { useState } from 'react';
import { RedigeringSkjema } from './RedigeringSkjema';
import { FaktaDTO, SaksopplysningInnDTO } from '../../types/Behandling';
import { PencilIcon } from '@navikt/aksel-icons';
import { Saksopplysning } from './Saksopplysning';

interface SaksopplysningProps {
    saksopplysninger: SaksopplysningInnDTO[];
    behandlingId: string;
}

export const SaksopplysningTable = ({ saksopplysninger, behandlingId }: SaksopplysningProps) => {
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
                        <Saksopplysning
                            key={saksopplysning.vilkårTittel}
                            vilkår={saksopplysning.vilkårTittel}
                            utfall={saksopplysning.utfall}
                            fom={saksopplysning.fom}
                            tom={saksopplysning.tom}
                            kilde={saksopplysning.kilde}
                            behandlingId={behandlingId}
                            detaljer={saksopplysning.detaljer}
                            fakta={velgFaktaTekst(saksopplysning.utfall, saksopplysning.fakta)}
                        />
                    ))}
                </Table.Body>
            </Table>
        </>
    );
};
