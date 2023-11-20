import { PencilIcon } from '@navikt/aksel-icons';
import { Table, BodyShort, Button } from '@navikt/ds-react';
import { UtfallIcon } from '../../components/utfall-icon/UtfallIcon';
import { RedigeringSkjema } from './RedigeringSkjema';
import { useState } from 'react';
import { formatDate } from '../../utils/date';

interface SaksopplysningProps {
    vilkår: string;
    vilkårTittel: string;
    utfall: string;
    fom: string;
    tom: string;
    kilde: string;
    detaljer: string;
    fakta: string;
    behandlingId: string;
    behandlingsPeriodeFom: string;
    behandlingsPeriodeTom: string;
}

export const Saksopplysning = ({
    vilkår,
    vilkårTittel,
    utfall,
    fom,
    tom,
    kilde,
    detaljer,
    fakta,
    behandlingId,
    behandlingsPeriodeFom,
    behandlingsPeriodeTom,
}: SaksopplysningProps) => {
    const [åpneRedigering, onÅpneRedigering] = useState<boolean>(false);

    const håndterLukkRedigering = () => {
        onÅpneRedigering(false);
    };

    return (
        <>
            <Table.Row key={vilkår}>
                <Table.DataCell>
                    <UtfallIcon utfall={utfall} />
                </Table.DataCell>
                <Table.DataCell>
                    <BodyShort>{vilkårTittel}</BodyShort>
                </Table.DataCell>
                <Table.DataCell>
                    <BodyShort>{fakta}</BodyShort>
                </Table.DataCell>
                <Table.DataCell>
                    <BodyShort>{fom && tom ? `${formatDate(fom)} - ${formatDate(tom)}` : '-'}</BodyShort>
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

            {åpneRedigering && (
                <Table.DataCell colSpan={7} style={{ padding: '0' }}>
                    <RedigeringSkjema
                        behandlingId={behandlingId}
                        vilkår={vilkår}
                        behandlingPeriodeFom={new Date(behandlingsPeriodeFom)}
                        behandlingPeriodeTom={new Date(behandlingsPeriodeTom)}
                        håndterLukkRedigering={håndterLukkRedigering}
                    />
                </Table.DataCell>
            )}
        </>
    );
};
