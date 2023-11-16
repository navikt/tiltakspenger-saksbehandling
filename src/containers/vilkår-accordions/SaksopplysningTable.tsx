import { Table } from '@navikt/ds-react';
import React from 'react';
import { FaktaDTO, SaksopplysningInnDTO } from '../../types/Behandling';
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
            <Table size="small" style={{ tableLayout: 'fixed', width: '100%' }}>
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeader style={{ width: '5%' }} />
                        <Table.ColumnHeader style={{ width: '25%' }}>Vilkår</Table.ColumnHeader>
                        <Table.ColumnHeader>Fakta</Table.ColumnHeader>
                        <Table.ColumnHeader>Periode</Table.ColumnHeader>
                        <Table.ColumnHeader style={{ width: '10%' }}>Kilde</Table.ColumnHeader>
                        <Table.ColumnHeader>Detaljer</Table.ColumnHeader>
                        <Table.ColumnHeader style={{ width: '5%' }} />
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
                            fakta={velgFaktaTekst(saksopplysning.typeSaksopplysning, saksopplysning.fakta)}
                        />
                    ))}
                </Table.Body>
            </Table>
        </>
    );
};
